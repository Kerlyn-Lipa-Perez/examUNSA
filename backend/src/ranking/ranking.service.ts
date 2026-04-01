// backend/src/ranking/ranking.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc, sql, and, gte } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';
import {
  RankingCalculationService,
  SimulacroResultInput,
  PuntosCalculados,
} from './ranking-calculation.service';

@Injectable()
export class RankingService {
  private readonly logger = new Logger(RankingService.name);

  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    private calculationService: RankingCalculationService,
  ) {}

  // ─── RANKING GLOBAL (Top 100) ─────────────────────────────────────────────
  async getGlobalRanking(limit = 100) {
    const rows = await this.db
      .select({
        userId:               schema.userRanking.userId,
        totalRp:              schema.userRanking.totalRp,
        simulacrosCompletados: schema.userRanking.simulacrosCompletados,
        rachaActual:          schema.userRanking.rachaActual,
        respuestasCorrectas:  schema.userRanking.respuestasCorrectas,
        respuestasTotales:    schema.userRanking.respuestasTotales,
        nombre:               schema.users.nombre,
      })
      .from(schema.userRanking)
      .innerJoin(schema.users, eq(schema.userRanking.userId, schema.users.id))
      .orderBy(desc(schema.userRanking.totalRp))
      .limit(limit);

    return rows.map((row, index) => ({
      posicion: index + 1,
      userId: row.userId,
      nombre: row.nombre,
      totalRp: row.totalRp,
      simulacrosCompletados: row.simulacrosCompletados,
      rachaActual: row.rachaActual,
      porcentajeAcierto: row.respuestasTotales > 0
        ? Math.round((row.respuestasCorrectas / row.respuestasTotales) * 100)
        : 0,
      nivel: RankingCalculationService.obtenerNivel(row.totalRp),
    }));
  }

  // ─── POSICIÓN DEL USUARIO + VECINOS (±5) ──────────────────────────────────
  async getUserPosition(userId: string) {
    // Primero obtener el ranking del usuario
    const ranking = await this.db.query.userRanking.findFirst({
      where: eq(schema.userRanking.userId, userId),
    });

    if (!ranking) {
      return null;
    }

    // Calcular posición
    const posicionResult = await this.db.execute<{ posicion: number }>(sql`
      SELECT COUNT(*) + 1 as posicion
      FROM user_ranking
      WHERE total_rp > ${ranking.totalRp}
    `);

    const posicion = Number(posicionResult.rows[0]?.posicion) || 1;
    const nivel = RankingCalculationService.obtenerNivel(ranking.totalRp);

    // Vecinos: 5 arriba y 5 abajo
    const totalResult = await this.db.execute<{ total: number }>(sql`
      SELECT COUNT(*) as total FROM user_ranking
    `);
    const totalUsuarios = Number(totalResult.rows[0]?.total) || 0;

    // Obtener todos los usuarios ordenados por RP y limitar alrededor de la posición
    const todosRankings = await this.db
      .select({
        userId:  schema.userRanking.userId,
        totalRp: schema.userRanking.totalRp,
        nombre:  schema.users.nombre,
      })
      .from(schema.userRanking)
      .innerJoin(schema.users, eq(schema.userRanking.userId, schema.users.id))
      .orderBy(desc(schema.userRanking.totalRp))
      .limit(11)
      .offset(Math.max(0, posicion - 6));

    const vecinos = todosRankings.map((row, index) => ({
      posicion: Math.max(1, posicion - 5) + index,
      userId: row.userId,
      nombre: row.nombre,
      totalRp: row.totalRp,
      esUsuario: row.userId === userId,
      nivel: RankingCalculationService.obtenerNivel(row.totalRp),
    }));

    return {
      posicion,
      totalUsuarios,
      totalRp: ranking.totalRp,
      simulacrosCompletados: ranking.simulacrosCompletados,
      rachaActual: ranking.rachaActual,
      rachaMaxima: ranking.rachaMaxima,
      respuestasCorrectas: ranking.respuestasCorrectas,
      respuestasTotales: ranking.respuestasTotales,
      porcentajeAcierto: ranking.respuestasTotales > 0
        ? Math.round((ranking.respuestasCorrectas / ranking.respuestasTotales) * 100)
        : 0,
      flashcardsRevisadas: ranking.flashcardsRevisadas,
      nivel,
      vecinos,
    };
  }

  // ─── RANKING SEMANAL (desde ranking_log) ──────────────────────────────────
  async getWeeklyRanking(limit = 50) {
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    const rows = await this.db
      .select({
        userId:   schema.rankingLog.userId,
        totalRp:  sql<number>`SUM(${schema.rankingLog.rpGanados})::int`,
        nombre:   schema.users.nombre,
      })
      .from(schema.rankingLog)
      .innerJoin(schema.users, eq(schema.rankingLog.userId, schema.users.id))
      .where(gte(schema.rankingLog.createdAt, hace7Dias))
      .groupBy(schema.rankingLog.userId, schema.users.nombre)
      .orderBy(desc(sql`SUM(${schema.rankingLog.rpGanados})`))
      .limit(limit);

    return rows.map((row, index) => ({
      posicion: index + 1,
      userId: row.userId,
      nombre: row.nombre,
      rpSemanales: Number(row.totalRp),
      nivel: RankingCalculationService.obtenerNivel(0), // Solo para obtener el tier visual
    }));
  }

  // ─── REGISTRAR PUNTOS (simulacro) ─────────────────────────────────────────
  async registrarPuntosSimulacro(
    userId: string,
    input: SimulacroResultInput,
  ): Promise<PuntosCalculados> {
    // Obtener o crear registro de ranking del usuario
    let ranking = await this.db.query.userRanking.findFirst({
      where: eq(schema.userRanking.userId, userId),
    });

    if (!ranking) {
      [ranking] = await this.db
        .insert(schema.userRanking)
        .values({ userId })
        .returning();
    }

    // Verificar si es el primer simulacro del día
    const hoy = new Date().toISOString().split('T')[0];
    const esPrimerSimulacroDelDia = !ranking.ultimoSimulacroAt
      || ranking.ultimoSimulacroAt.toISOString().split('T')[0] !== hoy;

    // Calcular racha
    let rachaActual = ranking.rachaActual;
    if (esPrimerSimulacroDelDia) {
      const racha = await this.calcularRacha(userId, ranking);
      rachaActual = racha;
    }

    // Calcular puntos
    const puntos = this.calculationService.calcularPuntosSimulacro(
      input,
      rachaActual,
      esPrimerSimulacroDelDia,
    );

    if (puntos.total > 0) {
      // Actualizar ranking del usuario
      const nuevaRachaMaxima = Math.max(ranking.rachaMaxima, rachaActual);

      await this.db
        .update(schema.userRanking)
        .set({
          totalRp:               sql`${schema.userRanking.totalRp} + ${puntos.total}`,
          simulacrosCompletados: sql`${schema.userRanking.simulacrosCompletados} + 1`,
          rachaActual:           rachaActual,
          rachaMaxima:           nuevaRachaMaxima,
          respuestasCorrectas:   sql`${schema.userRanking.respuestasCorrectas} + ${input.puntaje}`,
          respuestasTotales:     sql`${schema.userRanking.respuestasTotales} + ${input.totalPreguntas}`,
          ultimoSimulacroAt:     new Date(),
          ultimaActividadAt:     new Date(),
          updatedAt:             new Date(),
        })
        .where(eq(schema.userRanking.userId, userId));

      // Registrar cada desglose en el log
      for (const item of puntos.desglose) {
        await this.db.insert(schema.rankingLog).values({
          userId,
          accion: item.accion,
          rpGanados: item.rp,
          metadata: {
            simulacrosHoy: input.simulacrosHoy,
            puntaje: input.puntaje,
            totalPreguntas: input.totalPreguntas,
            rachaDias: rachaActual,
          },
        });
      }

      // Actualizar streak_dias en la tabla users
      await this.db
        .update(schema.users)
        .set({
          streakDias: rachaActual,
          ultimoAcceso: hoy,
        })
        .where(eq(schema.users.id, userId));
    }

    return puntos;
  }

  // ─── REGISTRAR PUNTOS (flashcards) ────────────────────────────────────────
  async registrarPuntosFlashcards(userId: string, revisadasHoy: number): Promise<PuntosCalculados> {
    const puntos = this.calculationService.calcularPuntosFlashcards(revisadasHoy);

    if (puntos.total > 0) {
      // Actualizar ranking
      await this.db
        .update(schema.userRanking)
        .set({
          totalRp:              sql`${schema.userRanking.totalRp} + ${puntos.total}`,
          flashcardsRevisadas:  sql`${schema.userRanking.flashcardsRevisadas} + 1`,
          ultimaActividadAt:    new Date(),
          updatedAt:            new Date(),
        })
        .where(eq(schema.userRanking.userId, userId));

      // Log
      for (const item of puntos.desglose) {
        await this.db.insert(schema.rankingLog).values({
          userId,
          accion: item.accion,
          rpGanados: item.rp,
          metadata: { revisadasHoy },
        });
      }
    }

    return puntos;
  }

  // ─── CÁLCULO DE RACHA ─────────────────────────────────────────────────────
  private async calcularRacha(userId: string, ranking: schema.UserRanking): Promise<number> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    const ultimoSimulacro = ranking.ultimoSimulacroAt;

    if (!ultimoSimulacro) {
      // Primer simulacro del usuario
      return 1;
    }

    const ultimoFecha = new Date(ultimoSimulacro);
    ultimoFecha.setHours(0, 0, 0, 0);

    const diferenciaDias = Math.floor(
      (hoy.getTime() - ultimoFecha.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diferenciaDias === 0) {
      // Ya hizo simulacro hoy, mantener racha
      return ranking.rachaActual;
    } else if (diferenciaDias === 1) {
      // Hizo simulacro ayer, incrementar racha
      return ranking.rachaActual + 1;
    } else {
      // Racha rota, reiniciar a 1
      return 1;
    }
  }
}
