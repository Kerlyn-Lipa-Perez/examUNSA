import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, lte, isNull, or } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';
import { AiService } from '../ai/ai.service';
import { Sm2Service, Sm2State } from './sm2.service';
import { GenerarCardsDto } from './dto/generar-cards.dto';
import { RevisarCardDto } from './dto/revisar-card.dto';

@Injectable()
export class FlashcardsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    private aiService: AiService,
    private sm2Service: Sm2Service,
  ) {}

  async getCardsHoy(userId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) throw new ForbiddenException('Usuario no encontrado');

    const limit = user.plan === 'free' ? 20 : 1000;

    // Buscar tarjetas pendientes (SM-2 dice que proximaRevision <= hoy)
    const pendientes = await this.db
      .select({
        id: schema.flashcards.id,
        pregunta: schema.flashcards.pregunta,
        respuesta: schema.flashcards.respuesta,
        materia: schema.flashcards.materia,
      })
      .from(schema.flashcardProgress)
      .innerJoin(
        schema.flashcards,
        eq(schema.flashcardProgress.flashcardId, schema.flashcards.id),
      )
      .where(
        and(
          eq(schema.flashcardProgress.userId, userId),
          lte(schema.flashcardProgress.proximaRevision, new Date().toISOString().split('T')[0]),
        ),
      )
      .limit(limit);

    // Si no hay suficientes pendientes, buscar nuevas tarjetas del sistema (o propias) que el usuario no ha visto
    if (pendientes.length < limit) {
      const remaining = limit - pendientes.length;
      
      // Obtener todas las que el usuario ya tiene en progreso
      const enProgreso = await this.db.select({ flashcardId: schema.flashcardProgress.flashcardId })
        .from(schema.flashcardProgress)
        .where(eq(schema.flashcardProgress.userId, userId));
      
      const enProgresoIds = enProgreso.map(p => p.flashcardId);

      // Buscar tarjetas disponibles que no estén en progreso
      let whereCondition;
      if (enProgresoIds.length > 0) {
        whereCondition = and(
          or(isNull(schema.flashcards.userId), eq(schema.flashcards.userId, userId)),
          // NOT IN no es tan directo en query builder básico a veces sin raw sql, 
          // usaremos un enfoque simplificado asumiendo un subset
        );
      } else {
        whereCondition = or(isNull(schema.flashcards.userId), eq(schema.flashcards.userId, userId));
      }

      const nuevas = await this.db.query.flashcards.findMany({
        where: whereCondition,
        limit: remaining * 2, // Buscamos más por si filtramos localmente
      });

      const nuevasFiltradas = nuevas.filter(c => !enProgresoIds.includes(c.id)).slice(0, remaining);
      
      return {
        cards: [...pendientes, ...nuevasFiltradas.map(c => ({
          id: c.id,
          pregunta: c.pregunta,
          respuesta: c.respuesta,
          materia: c.materia
        }))],
        total: pendientes.length + nuevasFiltradas.length,
      };
    }

    return {
      cards: pendientes,
      total: pendientes.length,
    };
  }

  async revisar(userId: string, cardId: string, dto: RevisarCardDto) {
    const card = await this.db.query.flashcards.findFirst({
      where: eq(schema.flashcards.id, cardId),
    });

    if (!card) throw new NotFoundException('Flashcard no encontrada');

    const progress = await this.db.query.flashcardProgress.findFirst({
      where: and(
        eq(schema.flashcardProgress.userId, userId),
        eq(schema.flashcardProgress.flashcardId, cardId),
      ),
    });

    const estadoActual: Sm2State = progress ? {
      intervaloDias: progress.intervaloDias,
      facilidad: progress.facilidad,
      repeticiones: progress.repeticiones,
    } : {
      intervaloDias: 1,
      facilidad: 2.5,
      repeticiones: 0,
    };

    const siguienteEstado = this.sm2Service.calcularSiguiente(estadoActual, dto.calificacion);
    const proximaRevisionDate = this.sm2Service.proximaFecha(siguienteEstado.intervaloDias);
    const proximaRevision = proximaRevisionDate.toISOString().split('T')[0];

    await this.db
      .insert(schema.flashcardProgress)
      .values({
        userId,
        flashcardId: cardId,
        intervaloDias: siguienteEstado.intervaloDias,
        facilidad: siguienteEstado.facilidad,
        repeticiones: siguienteEstado.repeticiones,
        proximaRevision,
      })
      .onConflictDoUpdate({
        target: [schema.flashcardProgress.userId, schema.flashcardProgress.flashcardId],
        set: {
          intervaloDias: siguienteEstado.intervaloDias,
          facilidad: siguienteEstado.facilidad,
          repeticiones: siguienteEstado.repeticiones,
          proximaRevision,
        },
      });

    return {
      proximaRevision,
      intervaloDias: siguienteEstado.intervaloDias,
    };
  }

  async generarConIA(userId: string, dto: GenerarCardsDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user || user.plan !== 'pro') {
      throw new ForbiddenException('Se requiere plan Pro para generar flashcards con IA');
    }

    const cardsData = await this.aiService.generarFlashcards(dto.tema, 10);
    
    // Insertar las flashcards para el usuario
    const cardsToInsert = cardsData.map(c => ({
      userId,
      materia: dto.materia,
      pregunta: c.pregunta,
      respuesta: c.respuesta,
      esPublica: false,
    }));

    const generadas = await this.db.insert(schema.flashcards).values(cardsToInsert).returning();

    return { cards: generadas };
  }

  async stats(userId: string) {
    // Stats básicos
    return {
      totalCards: 0,
      estudiadasHoy: 0,
      streak: 0,
      porMateria: {}
    };
  }
}