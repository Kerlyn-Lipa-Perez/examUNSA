import { Injectable } from '@nestjs/common';

export interface Sm2State {
  intervaloDias: number;   // días hasta la próxima revisión
  facilidad: number;       // factor de facilidad, mínimo 1.3
  repeticiones: number;    // racha de respuestas correctas seguidas
}

@Injectable()
export class Sm2Service {
  /**
   * Calificaciones del alumno (0-5):
   * 0 = No sabía nada      3 = Dudé pero respondí bien
   * 1 = Muy difícil        4 = Fácil
   * 2 = Difícil            5 = Muy fácil, respuesta inmediata
   */
  calcularSiguiente(estado: Sm2State, calificacion: number): Sm2State {
    const q = calificacion;
    let { intervaloDias, facilidad, repeticiones } = estado;

    if (q < 3) {
      // Respuesta incorrecta: reinicia la secuencia
      repeticiones = 0;
      intervaloDias = 1;
    } else {
      // Respuesta correcta: avanza el intervalo según SM-2
      if (repeticiones === 0)      intervaloDias = 1;
      else if (repeticiones === 1) intervaloDias = 6;
      else                         intervaloDias = Math.round(intervaloDias * facilidad);
      repeticiones += 1;
    }

    // Actualiza el factor de facilidad (nunca baja de 1.3)
    facilidad = Math.max(
      1.3,
      facilidad + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02),
    );

    return { intervaloDias, facilidad, repeticiones };
  }

  proximaFecha(intervaloDias: number): Date {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + intervaloDias);
    return fecha;
  }
}