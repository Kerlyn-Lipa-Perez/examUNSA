import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc, sql, and } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';
import { AiService } from '../ai/ai.service';
import { RankingService } from '../ranking/ranking.service';
import { GenerarSimulacroDto } from './dto/generar-simulacro.dto';
import { GuardarResultadoDto } from './dto/guardar-resultado.dto';

@Injectable()
export class SimulacrosService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    private aiService: AiService,
    private rankingService: RankingService,
  ) {}

  async generar(userId: string, dto: GenerarSimulacroDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) throw new ForbiddenException('Usuario no encontrado');

    if (user.plan === 'free' && user.simulacrosHoy >= 3) {
      throw new ForbiddenException('Has alcanzado el límite diario de 3 simulacros del plan Free. ¡Mejora a Pro para simulacros ilimitados!');
    }

    const preguntas = await this.aiService.generarPreguntas(dto.materia, 20);

    // Incrementar simulacrosHoy atómicamente si es plan free (o general para estadísticas)
    await this.db
      .update(schema.users)
      .set({ simulacrosHoy: sql`${schema.users.simulacrosHoy} + 1` })
      .where(eq(schema.users.id, userId));

    return {
      materia: dto.materia,
      preguntas,
      tiempoMinutos: 30, // Tiempo sugerido
    };
  }

  async guardarResultado(userId: string, dto: GuardarResultadoDto) {
    const [resultado] = await this.db
      .insert(schema.simulacroResults)
      .values({
        userId,
        examId: dto.examId,
        materia: dto.materia,
        puntaje: dto.puntaje,
        totalPreguntas: dto.respuestas.length,
        tiempoSegundos: dto.tiempoSegundos,
        respuestas: dto.respuestas,
      })
      .returning();

    // Calcular y registrar puntos de ranking
    const puntosRanking = await this.rankingService.registrarPuntosSimulacro(userId, {
      puntaje: dto.puntaje,
      totalPreguntas: dto.respuestas.length,
      simulacrosHoy: dto.simulacrosHoy ?? 0,
    });

    return {
      guardado: true,
      puntaje: resultado.puntaje,
      ranking: {
        rpGanados: puntosRanking.total,
        desglose: puntosRanking.desglose,
      },
    };
  }

  async historial(userId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [items, [{ total }]] = await Promise.all([
      this.db
        .select({
          id: schema.simulacroResults.id,
          examId: schema.simulacroResults.examId,
          materia: schema.simulacroResults.materia,
          puntaje: schema.simulacroResults.puntaje,
          totalPreguntas: schema.simulacroResults.totalPreguntas,
          createdAt: schema.simulacroResults.createdAt,
        })
        .from(schema.simulacroResults)
        .where(eq(schema.simulacroResults.userId, userId))
        .orderBy(desc(schema.simulacroResults.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)::int` })
        .from(schema.simulacroResults)
        .where(eq(schema.simulacroResults.userId, userId)),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async historialPorExamen(userId: string, examId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [items, [{ total }]] = await Promise.all([
      this.db
        .select({
          id: schema.simulacroResults.id,
          examId: schema.simulacroResults.examId,
          materia: schema.simulacroResults.materia,
          puntaje: schema.simulacroResults.puntaje,
          totalPreguntas: schema.simulacroResults.totalPreguntas,
          tiempoSegundos: schema.simulacroResults.tiempoSegundos,
          createdAt: schema.simulacroResults.createdAt,
        })
        .from(schema.simulacroResults)
        .where(
          and(
            eq(schema.simulacroResults.userId, userId),
            eq(schema.simulacroResults.examId, examId),
          ),
        )
        .orderBy(desc(schema.simulacroResults.createdAt))
        .limit(limit)
        .offset(offset),
      this.db
        .select({ total: sql<number>`count(*)::int` })
        .from(schema.simulacroResults)
        .where(
          and(
            eq(schema.simulacroResults.userId, userId),
            eq(schema.simulacroResults.examId, examId),
          ),
        ),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getResultado(userId: string, resultId: string) {
    const resultado = await this.db.query.simulacroResults.findFirst({
      where: and(
        eq(schema.simulacroResults.id, resultId),
        eq(schema.simulacroResults.userId, userId),
      ),
    });

    return resultado ?? null;
  }
}