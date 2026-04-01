import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, lte, isNull, or, sql, notExists, count } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';
import { AiService } from '../ai/ai.service';
import { Sm2Service, Sm2State } from './sm2.service';
import { RankingService } from '../ranking/ranking.service';
import { GenerarCardsDto } from './dto/generar-cards.dto';
import { RevisarCardDto } from './dto/revisar-card.dto';

@Injectable()
export class FlashcardsService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    private aiService: AiService,
    private sm2Service: Sm2Service,
    private rankingService: RankingService,
  ) {}

  async getCardsHoy(userId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) throw new ForbiddenException('Usuario no encontrado');

    const limit = user.plan === 'free' ? 20 : 1000;
    const today = new Date().toISOString().split('T')[0];

    // 1. Tarjetas pendientes (SM-2: proxima_revision <= hoy)
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
          lte(schema.flashcardProgress.proximaRevision, today),
        ),
      )
      .limit(limit);

    if (pendientes.length >= limit) {
      return { cards: pendientes, total: pendientes.length };
    }

    // 2. Nuevas: flashcards que el usuario NO tiene en progreso (SQL, no JS)
    const remaining = limit - pendientes.length;

    const pendientesIds = pendientes.map(p => p.id);

    const nuevas = await this.db
      .select({
        id: schema.flashcards.id,
        pregunta: schema.flashcards.pregunta,
        respuesta: schema.flashcards.respuesta,
        materia: schema.flashcards.materia,
      })
      .from(schema.flashcards)
      .where(
        and(
          // Del sistema (null) o propias del usuario
          or(isNull(schema.flashcards.userId), eq(schema.flashcards.userId, userId)),
          // Excluir las que ya están pendientes en esta carga
          pendientesIds.length > 0
            ? sql`${schema.flashcards.id} NOT IN (${sql.join(pendientesIds, sql.raw(', '))})`
            : sql`TRUE`,
          // Excluir las que ya tienen progreso (subquery SQL)
          notExists(
            this.db
              .select({ id: schema.flashcardProgress.id })
              .from(schema.flashcardProgress)
              .where(
                and(
                  eq(schema.flashcardProgress.userId, userId),
                  eq(schema.flashcardProgress.flashcardId, schema.flashcards.id),
                ),
              ),
          ),
        ),
      )
      .limit(remaining);

    return {
      cards: [...pendientes, ...nuevas],
      total: pendientes.length + nuevas.length,
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

    // Contar cuántas flashcards ha revisado hoy (proxima_revision <= hoy)
    const today = new Date().toISOString().split('T')[0];
    const [hoyResult] = await this.db
      .select({ total: count() })
      .from(schema.flashcardProgress)
      .where(
        and(
          eq(schema.flashcardProgress.userId, userId),
          lte(schema.flashcardProgress.proximaRevision, today),
        ),
      );
    const revisadasHoy = Number(hoyResult.total);

    // Registrar puntos de ranking si aplica hito (10 o 50)
    await this.rankingService.registrarPuntosFlashcards(userId, revisadasHoy);

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
    const today = new Date().toISOString().split('T')[0];

    // Total de tarjetas en progreso del usuario (1 query con COUNT)
    const [totalResult] = await this.db
      .select({ total: count() })
      .from(schema.flashcardProgress)
      .where(eq(schema.flashcardProgress.userId, userId));

    // Estudiadas hoy (proxima_revision <= hoy = fue revisada hoy o antes)
    const [hoyResult] = await this.db
      .select({ total: count() })
      .from(schema.flashcardProgress)
      .where(
        and(
          eq(schema.flashcardProgress.userId, userId),
          lte(schema.flashcardProgress.proximaRevision, today),
        ),
      );

    // Contar por materia: JOIN flashcard_progress con flashcards y GROUP BY materia
    const porMateriaRows = await this.db
      .select({
        materia: schema.flashcards.materia,
        total: count(),
      })
      .from(schema.flashcardProgress)
      .innerJoin(
        schema.flashcards,
        eq(schema.flashcardProgress.flashcardId, schema.flashcards.id),
      )
      .where(eq(schema.flashcardProgress.userId, userId))
      .groupBy(schema.flashcards.materia);

    const porMateria: Record<string, number> = {};
    for (const row of porMateriaRows) {
      porMateria[row.materia] = Number(row.total);
    }

    return {
      totalCards: Number(totalResult.total),
      estudiadasHoy: Number(hoyResult.total),
      streak: 0,
      porMateria,
    };
  }
}