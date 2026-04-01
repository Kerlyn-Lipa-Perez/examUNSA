// backend/src/estadisticas/estadisticas.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.provider';
import * as schema from '../database/schema';
import { AiService } from '../ai/ai.service';

const DIAS_SEMANA = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'] as const;

// Configuración del cache de IA
const AI_CACHE_DIAS = 7;
const AI_CACHE_SIMULACROS_NUEVOS = 5;

@Injectable()
export class EstadisticasService {
  private readonly logger = new Logger(EstadisticasService.name);

  constructor(
    @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    private aiService: AiService,
  ) {}

  // ─── EVOLUCIÓN DE PUNTAJE ─────────────────────────────────────────────────
  async getEvolucion(userId: string, dias = 30) {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - dias);

    const resultados = await this.db
      .select({
        materia:        schema.simulacroResults.materia,
        puntaje:        schema.simulacroResults.puntaje,
        totalPreguntas: schema.simulacroResults.totalPreguntas,
        createdAt:      schema.simulacroResults.createdAt,
      })
      .from(schema.simulacroResults)
      .where(
        and(
          eq(schema.simulacroResults.userId, userId),
          gte(schema.simulacroResults.createdAt, fechaInicio),
        ),
      )
      .orderBy(schema.simulacroResults.createdAt);

    // Puntos para el gráfico
    const puntos = resultados.map((r) => ({
      fecha: r.createdAt.toISOString().split('T')[0],
      materia: r.materia,
      porcentaje: Math.round((r.puntaje / r.totalPreguntas) * 100),
      puntaje: r.puntaje,
      total: r.totalPreguntas,
    }));

    // Promedio móvil de 5
    const promedioMovil: number[] = [];
    for (let i = 0; i < puntos.length; i++) {
      const ventana = puntos.slice(Math.max(0, i - 4), i + 1);
      const avg = Math.round(
        ventana.reduce((s, p) => s + p.porcentaje, 0) / ventana.length,
      );
      promedioMovil.push(avg);
    }

    // Promedio por materia para líneas separadas
    const materiasUnicas = [...new Set(puntos.map((p) => p.materia))];

    return { puntos, promedioMovil, materias: materiasUnicas };
  }

  // ─── FORTALEZAS POR MATERIA ───────────────────────────────────────────────
  async getFortalezas(userId: string) {
    // Todos los simulacros del usuario
    const todos = await this.db
      .select({
        materia:        schema.simulacroResults.materia,
        puntaje:        schema.simulacroResults.puntaje,
        totalPreguntas: schema.simulacroResults.totalPreguntas,
        createdAt:      schema.simulacroResults.createdAt,
      })
      .from(schema.simulacroResults)
      .where(eq(schema.simulacroResults.userId, userId))
      .orderBy(desc(schema.simulacroResults.createdAt));

    if (todos.length === 0) {
      return { materias: [], materiaMasFuerte: null, materiaMasDebil: null, recomendacion: null };
    }

    // Agrupar por materia
    const porMateria: Record<string, { puntajes: number[]; fechas: Date[] }> = {};
    for (const r of todos) {
      if (!porMateria[r.materia]) porMateria[r.materia] = { puntajes: [], fechas: [] };
      porMateria[r.materia].puntajes.push(Math.round((r.puntaje / r.totalPreguntas) * 100));
      porMateria[r.materia].fechas.push(r.createdAt);
    }

    const materias = Object.entries(porMateria).map(([materia, data]) => {
      const promedio = Math.round(data.puntajes.reduce((s, p) => s + p, 0) / data.puntajes.length);
      const totalSimulacros = data.puntajes.length;

      // Tendencia: comparar últimos 3 vs anteriores
      let tendencia: 'subiendo' | 'estable' | 'bajando' = 'estable';
      if (data.puntajes.length >= 6) {
        const ultimos3 = data.puntajes.slice(0, 3);
        const anteriores3 = data.puntajes.slice(3, 6);
        const avgUltimos = ultimos3.reduce((s, p) => s + p, 0) / 3;
        const avgAnteriores = anteriores3.reduce((s, p) => s + p, 0) / 3;
        if (avgUltimos - avgAnteriores > 5) tendencia = 'subiendo';
        else if (avgAnteriores - avgUltimos > 5) tendencia = 'bajando';
      }

      return { materia, promedio, totalSimulacros, tendencia };
    });

    // Ordenar por promedio descendente
    materias.sort((a, b) => b.promedio - a.promedio);

    const materiaMasFuerte = materias[0]?.materia ?? null;
    const materiaMasDebil = materias[materias.length - 1]?.materia ?? null;

    // Recomendación simple
    let recomendacion: string | null = null;
    if (materiaMasDebil) {
      const debil = materias[materias.length - 1];
      if (debil.tendencia === 'bajando') {
        recomendacion = `${this.labelMateria(materiaMasDebil)} es tu punto más débil (${debil.promedio}%) y está bajando. Enfócate aquí.`;
      } else if (debil.promedio < 50) {
        recomendacion = `${this.labelMateria(materiaMasDebil)} está en ${debil.promedio}%. Necesitas reforzar los conceptos base.`;
      } else {
        recomendacion = `Tu materia más débil es ${this.labelMateria(materiaMasDebil)} (${debil.promedio}%). ¡Todavía hay margen de mejora!`;
      }
    }

    return { materias, materiaMasFuerte, materiaMasDebil, recomendacion };
  }

  // ─── MAPA DE ACTIVIDAD ────────────────────────────────────────────────────
  async getActividad(userId: string, semanas = 12) {
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - semanas * 7);
    fechaInicio.setHours(0, 0, 0, 0);

    // Contar simulacros por día
    const resultados = await this.db
      .select({
        fecha: sql<string>`DATE(${schema.simulacroResults.createdAt})`.as('fecha'),
        cantidad: sql<number>`COUNT(*)::int`.as('cantidad'),
      })
      .from(schema.simulacroResults)
      .where(
        and(
          eq(schema.simulacroResults.userId, userId),
          gte(schema.simulacroResults.createdAt, fechaInicio),
        ),
      )
      .groupBy(sql`DATE(${schema.simulacroResults.createdAt})`);

    // Contar flashcards revisadas por día (las que tienen proxima_revision = hoy = fueron revisadas)
    const flashcardResultados = await this.db
      .select({
        fecha: sql<string>`DATE(${schema.flashcardProgress.proximaRevision})`.as('fecha'),
        cantidad: sql<number>`COUNT(*)::int`.as('cantidad'),
      })
      .from(schema.flashcardProgress)
      .where(
        and(
          eq(schema.flashcardProgress.userId, userId),
          gte(schema.flashcardProgress.proximaRevision, fechaInicio.toISOString().split('T')[0]),
        ),
      )
      .groupBy(sql`DATE(${schema.flashcardProgress.proximaRevision})`);

    // Mapear resultados
    const simulacrosPorDia: Record<string, number> = {};
    for (const r of resultados) {
      simulacrosPorDia[r.fecha] = Number(r.cantidad);
    }

    const flashcardsPorDia: Record<string, number> = {};
    for (const r of flashcardResultados) {
      flashcardsPorDia[r.fecha] = Number(r.cantidad);
    }

    // Generar array de todos los días
    const dias: { fecha: string; simulacros: number; flashcards: number }[] = [];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const cursor = new Date(fechaInicio);
    while (cursor <= hoy) {
      const fechaStr = cursor.toISOString().split('T')[0];
      dias.push({
        fecha: fechaStr,
        simulacros: simulacrosPorDia[fechaStr] || 0,
        flashcards: flashcardsPorDia[fechaStr] || 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    const diasActivos = dias.filter((d) => d.simulacros > 0).length;
    const diasTotales = dias.length;

    return {
      dias,
      diasActivos,
      diasTotales,
      porcentajeConsistencia: diasTotales > 0 ? Math.round((diasActivos / diasTotales) * 100) : 0,
    };
  }

  // ─── RENDIMIENTO POR DÍA DE SEMANA ────────────────────────────────────────
  async getPorDia(userId: string) {
    const resultados = await this.db
      .select({
        materia:        schema.simulacroResults.materia,
        puntaje:        schema.simulacroResults.puntaje,
        totalPreguntas: schema.simulacroResults.totalPreguntas,
        createdAt:      schema.simulacroResults.createdAt,
      })
      .from(schema.simulacroResults)
      .where(eq(schema.simulacroResults.userId, userId));

    // Agrupar por día de la semana
    const porDia: Record<number, { porcentajes: number[] }> = {};
    for (let i = 0; i < 7; i++) porDia[i] = { porcentajes: [] };

    for (const r of resultados) {
      const diaSemana = r.createdAt.getDay(); // 0=domingo
      porDia[diaSemana].porcentajes.push(Math.round((r.puntaje / r.totalPreguntas) * 100));
    }

    const dias = Object.entries(porDia).map(([diaNum, data]) => {
      const promedio = data.porcentajes.length > 0
        ? Math.round(data.porcentajes.reduce((s, p) => s + p, 0) / data.porcentajes.length)
        : 0;
      return {
        dia: DIAS_SEMANA[Number(diaNum)],
        promedio,
        cantidad: data.porcentajes.length,
      };
    });

    // Mejor y peor día (solo con datos)
    const conDatos = dias.filter((d) => d.cantidad > 0);
    conDatos.sort((a, b) => b.promedio - a.promedio);
    const mejorDia = conDatos[0]?.dia ?? null;
    const peorDia = conDatos[conDatos.length - 1]?.dia ?? null;

    return { dias, mejorDia, peorDia };
  }

  // ─── ANÁLISIS DE ERRORES (con cache IA para Pro) ──────────────────────────
  async getErrores(userId: string, plan: string) {
    // Datos básicos SIEMPRE disponibles
    const todos = await this.db
      .select({
        materia:        schema.simulacroResults.materia,
        puntaje:        schema.simulacroResults.puntaje,
        totalPreguntas: schema.simulacroResults.totalPreguntas,
        respuestas:     schema.simulacroResults.respuestas,
        createdAt:      schema.simulacroResults.createdAt,
      })
      .from(schema.simulacroResults)
      .where(eq(schema.simulacroResults.userId, userId))
      .orderBy(desc(schema.simulacroResults.createdAt));

    // Estadísticas básicas
    let totalCorrectas = 0;
    let totalIncorrectas = 0;
    let totalSinResponder = 0;
    const erroresPorMateria: Record<string, number> = {};

    for (const simulacro of todos) {
      const respuestas = simulacro.respuestas as any[];
      for (const r of respuestas) {
        if (!r.elegida) {
          totalSinResponder++;
        } else if (r.elegida === r.correcta) {
          totalCorrectas++;
        } else {
          totalIncorrectas++;
          erroresPorMateria[r.materia || simulacro.materia] =
            (erroresPorMateria[r.materia || simulacro.materia] || 0) + 1;
        }
      }
    }

    const totalRespuestas = totalCorrectas + totalIncorrectas + totalSinResponder;
    const porcentajeAcierto = totalRespuestas > 0
      ? Math.round((totalCorrectas / totalRespuestas) * 100)
      : 0;

    const erroresPorMateriaArray = Object.entries(erroresPorMateria)
      .map(([materia, errores]) => ({
        materia,
        errores,
        porcentaje: totalIncorrectas > 0 ? Math.round((errores / totalIncorrectas) * 100) : 0,
      }))
      .sort((a, b) => b.errores - a.errores);

    const resultado: any = {
      totalCorrectas,
      totalIncorrectas,
      totalSinResponder,
      porcentajeAcierto,
      erroresPorMateria: erroresPorMateriaArray,
      esPro: plan === 'pro',
      analisisIA: null,
    };

    // Análisis IA solo para Pro
    if (plan === 'pro') {
      resultado.analisisIA = await this.getAnalisisIA(userId, todos);
    }

    return resultado;
  }

  // ─── LÓGICA DE CACHE IA ───────────────────────────────────────────────────
  private async getAnalisisIA(userId: string, simulacros: any[]) {
    // 1. Buscar cache
    const cache = await this.db.query.aiAnalysisCache.findFirst({
      where: and(
        eq(schema.aiAnalysisCache.userId, userId),
        eq(schema.aiAnalysisCache.tipo, 'errores_patron'),
      ),
    });

    const ahora = new Date();
    const totalSimulacros = simulacros.length;

    // 2. ¿Cache válido?
    if (cache) {
      const noExpirado = cache.expiresAt > ahora;
      const pocosNuevos = totalSimulacros - cache.simulacrosCountAlMomento < AI_CACHE_SIMULACROS_NUEVOS;

      if (noExpirado && pocosNuevos) {
        this.logger.debug(`Cache IA hit para usuario ${userId}`);
        return cache.resultado;
      }
      this.logger.debug(`Cache IA stale para usuario ${userId} (expirado=${!noExpirado}, nuevos=${totalSimulacros - cache.simulacrosCountAlMomento})`);
    }

    // 3. Generar análisis
    if (simulacros.length < 3) {
      return { resumen: 'Necesitas al menos 3 simulacros para generar un análisis de patrones.', problemas: [], fortalezas: [], planAccion: null };
    }

    try {
      const analisis = await this.generarAnalisisIA(simulacros);

      // 4. Guardar en cache
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + AI_CACHE_DIAS);

      await this.db
        .insert(schema.aiAnalysisCache)
        .values({
          userId,
          tipo: 'errores_patron',
          resultado: analisis,
          simulacrosCountAlMomento: totalSimulacros,
          expiresAt,
        })
        .onConflictDoUpdate({
          target: [schema.aiAnalysisCache.userId, schema.aiAnalysisCache.tipo],
          set: {
            resultado: analisis,
            simulacrosCountAlMomento: totalSimulacros,
            expiresAt,
          },
        });

      return analisis;
    } catch (error) {
      this.logger.error(`Error generando análisis IA para ${userId}:`, error);
      return { resumen: 'No se pudo generar el análisis en este momento.', problemas: [], fortalezas: [], planAccion: null };
    }
  }

  private async generarAnalisisIA(simulacros: any[]) {
    // Preparar datos para el prompt (últimos 20, solo errores)
    const datosSimulacros = simulacros.slice(0, 20).map((s) => {
      const respuestas = s.respuestas as any[];
      const incorrectas = respuestas.filter((r: any) => r.elegida && r.elegida !== r.correcta);
      const sinResponder = respuestas.filter((r: any) => !r.elegida);
      return {
        materia: s.materia,
        puntaje: s.puntaje,
        total: s.totalPreguntas,
        porcentaje: Math.round((s.puntaje / s.totalPreguntas) * 100),
        incorrectas: incorrectas.length,
        sinResponder: sinResponder.length,
      };
    });

    const prompt = `Eres un tutor académico para el examen de admisión UNSA (Universidad Nacional de San Agustín, Arequipa, Perú).
Analiza estos resultados de simulacros y genera un reporte conciso.

Datos de los últimos ${datosSimulacros.length} simulacros:
${JSON.stringify(datosSimulacros, null, 2)}

Responde SOLO con JSON válido (sin markdown, sin texto adicional):
{
  "resumen": "2-3 oraciones sobre el patrón general del estudiante",
  "problemas": [
    {
      "materia": "nombre_materia",
      "tipo": "concepto_debil | error_calculo | falta_comprension | prisa",
      "descripcion": "Descripción específica del problema",
      "impacto": "alto | medio | bajo",
      "recomendacion": "Qué hacer para mejorar (concreto y accionable)"
    }
  ],
  "fortalezas": ["Lista breve de materias donde rinde bien"],
  "planAccion": "El paso más importante que debe dar ahora (1-2 oraciones)"
}

Reglas:
- Máximo 3 problemas, enfócate en los más impactantes
- Sé específico con las recomendaciones (ej: "practica álgebra" no solo "estudia más")
- Tono motivacional pero honesto`;

    const resp = await this.aiService['client'].chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return JSON.parse(resp.choices[0].message.content!);
  }

  // ─── COMPARATIVO GLOBAL ───────────────────────────────────────────────────
  async getComparativo(userId: string) {
    // Stats del usuario
    const ranking = await this.db.query.userRanking.findFirst({
      where: eq(schema.userRanking.userId, userId),
    });

    // Promedio global
    const [globalStats] = await this.db
      .select({
        totalUsuarios:         sql<number>`COUNT(*)::int`,
        promedioAcierto:       sql<number>`AVG(CASE WHEN respuestas_totales > 0 THEN (respuestas_correctas::float / respuestas_totales * 100) ELSE 0 END)::int`,
        promedioRacha:         sql<number>`AVG(racha_actual)::int`,
        promedioSimulacros:    sql<number>`AVG(simulacros_completados)::int`,
      })
      .from(schema.userRanking);

    return {
      usuario: {
        porcentajeAcierto: ranking && ranking.respuestasTotales > 0
          ? Math.round((ranking.respuestasCorrectas / ranking.respuestasTotales) * 100)
          : 0,
        racha: ranking?.rachaActual ?? 0,
        totalRp: ranking?.totalRp ?? 0,
        simulacrosCompletados: ranking?.simulacrosCompletados ?? 0,
      },
      global: {
        totalUsuarios: Number(globalStats?.totalUsuarios) || 0,
        promedioAcierto: Number(globalStats?.promedioAcierto) || 0,
        promedioRacha: Number(globalStats?.promedioRacha) || 0,
        promedioSimulacros: Math.round(Number(globalStats?.promedioSimulacros) || 0),
      },
    };
  }

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  private labelMateria(materia: string): string {
    const labels: Record<string, string> = {
      aptitud: 'Aptitud Académica',
      matematica: 'Matemática',
      'ciencias-sociales': 'Ciencias Sociales',
      'ciencia-tecnologia': 'Ciencia y Tecnología',
      'persona-familia': 'Persona y Familia',
      comunicacion: 'Comunicación',
      ingles: 'Inglés',
    };
    return labels[materia] || materia;
  }
}
