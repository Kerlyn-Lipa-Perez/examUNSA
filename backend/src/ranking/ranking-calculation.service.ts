// backend/src/ranking/ranking-calculation.service.ts
import { Injectable } from '@nestjs/common';

/**
 * Constantes de puntuación del sistema de ranking.
 * Todos los valores están ajustados para que la brecha entre usuarios
 * refleje CONSTANCIA, no solo talento natural.
 */
const RP = {
  // Simulacro
  COMPLETAR_SIMULACRO:    10,  // Base por terminar un simulacro
  POR_RESPUESTA_CORRECTA: 2,   // Cada respuesta correcta
  BONUS_EXCELENCIA_80:    5,   // ≥80% de acierto
  BONUS_PERFECCION_100:   10,  // 100% de acierto (reducido según pedido del usuario)
  PRIMER_SIMULACRO_DIA:   2,   // Primer simulacro del día

  // Racha (días consecutivos de actividad)
  RACHA_3_DIAS:   10,
  RACHA_7_DIAS:   25,
  RACHA_14_DIAS:  50,
  RACHA_30_DIAS:  100,

  // Flashcards
  FLASHCARD_10_DIA:  3,   // Revisar 10 flashcards en un día
  FLASHCARD_50_DIA:  10,  // Revisar 50 flashcards en un día
} as const;

// Límites anti-explotación
const SIMULACROS_CON_PUNTOS_POR_DIA = 10;
const MINIMO_PREGUNTAS_PARA_PUNTOS = 10;

export interface SimulacroResultInput {
  puntaje: number;
  totalPreguntas: number;
  simulacrosHoy: number;       // cuántos simulacros ha hecho hoy (antes de este)
}

export interface PuntosCalculados {
  total: number;
  desglose: { accion: string; rp: number }[];
}

@Injectable()
export class RankingCalculationService {

  /**
   * Calcula los puntos de ranking por completar un simulacro.
   */
  calcularPuntosSimulacro(
    input: SimulacroResultInput,
    rachaActual: number,
    esPrimerSimulacroDelDia: boolean,
  ): PuntosCalculados {
    const desglose: { accion: string; rp: number }[] = [];

    // Anti-explotación: mínimo de preguntas
    if (input.totalPreguntas < MINIMO_PREGUNTAS_PARA_PUNTOS) {
      return { total: 0, desglose: [{ accion: 'demasiado_pocas_preguntas', rp: 0 }] };
    }

    // Anti-explotación: cap diario
    if (input.simulacrosHoy >= SIMULACROS_CON_PUNTOS_POR_DIA) {
      return { total: 0, desglose: [{ accion: 'cap_diario_alcanzado', rp: 0 }] };
    }

    // 1. Base por completar simulacro
    desglose.push({ accion: 'simulacro_completado', rp: RP.COMPLETAR_SIMULACRO });

    // 2. Puntos por respuestas correctas
    const puntosCorrectas = input.puntaje * RP.POR_RESPUESTA_CORRECTA;
    if (puntosCorrectas > 0) {
      desglose.push({ accion: 'respuestas_correctas', rp: puntosCorrectas });
    }

    // 3. Bonus por porcentaje de acierto
    const porcentaje = (input.puntaje / input.totalPreguntas) * 100;
    if (porcentaje === 100) {
      desglose.push({ accion: 'bonus_perfeccion', rp: RP.BONUS_PERFECCION_100 });
    } else if (porcentaje >= 80) {
      desglose.push({ accion: 'bonus_excelencia', rp: RP.BONUS_EXCELENCIA_80 });
    }

    // 4. Primer simulacro del día
    if (esPrimerSimulacroDelDia) {
      desglose.push({ accion: 'primer_simulacro_dia', rp: RP.PRIMER_SIMULACRO_DIA });
    }

    // 5. Bonus por racha
    const rachaBonus = this.calcularBonusRacha(rachaActual);
    if (rachaBonus > 0) {
      desglose.push({ accion: `racha_${rachaActual}_dias`, rp: rachaBonus });
    }

    const total = desglose.reduce((sum, d) => sum + d.rp, 0);
    return { total, desglose };
  }

  /**
   * Calcula los puntos de ranking por revisar flashcards.
   * Solo da bonus si alcanza los hitos de 10 o 50 en el día.
   */
  calcularPuntosFlashcards(revisadasHoy: number): PuntosCalculados {
    const desglose: { accion: string; rp: number }[] = [];

    // Solo otorgar en el momento exacto del hito (no repetir)
    if (revisadasHoy === 50) {
      desglose.push({ accion: 'flashcard_50_dia', rp: RP.FLASHCARD_50_DIA });
    } else if (revisadasHoy === 10) {
      desglose.push({ accion: 'flashcard_10_dia', rp: RP.FLASHCARD_10_DIA });
    }

    const total = desglose.reduce((sum, d) => sum + d.rp, 0);
    return { total, desglose };
  }

  /**
   * Calcula el bonus por racha de días consecutivos.
   */
  private calcularBonusRacha(racha: number): number {
    if (racha >= 30) return RP.RACHA_30_DIAS;
    if (racha >= 14) return RP.RACHA_14_DIAS;
    if (racha >= 7)  return RP.RACHA_7_DIAS;
    if (racha >= 3)  return RP.RACHA_3_DIAS;
    return 0;
  }

  /**
   * Determina el nivel (tier) del usuario según sus RP acumulados.
   */
  static obtenerNivel(totalRp: number): { nombre: string; color: string; nivel: number } {
    if (totalRp >= 3000) return { nombre: 'Maestro',        color: 'purple',  nivel: 6 };
    if (totalRp >= 1500) return { nombre: 'Cachimbo',       color: 'warning',  nivel: 5 };
    if (totalRp >= 700)  return { nombre: 'Ingresante',     color: 'primary',  nivel: 4 };
    if (totalRp >= 300)  return { nombre: 'Académico',      color: 'success',  nivel: 3 };
    if (totalRp >= 100)  return { nombre: 'Preuniversitario', color: 'info',   nivel: 2 };
    return                       { nombre: 'Postulante',    color: 'muted',    nivel: 1 };
  }
}
