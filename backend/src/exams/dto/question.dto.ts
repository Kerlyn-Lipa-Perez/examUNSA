// backend/src/exams/dto/question.dto.ts

// Mirrors `Question` en frontend/src/types/simulacro.ts
export class QuestionDto {
  id: number; // índice sintético secuencial 1..N (la PK real en DB es un slug string)
  materia: string;
  texto: string;
  imagen?: string; // pass-through de `figura_path`, sin validar que el asset exista
  opciones: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  respuestaCorrecta: 'A' | 'B' | 'C' | 'D' | 'E';
  imagenOpcion?: {
    A?: string;
    B?: string;
    C?: string;
    D?: string;
    E?: string;
  };
}
