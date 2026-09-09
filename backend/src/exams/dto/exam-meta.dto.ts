// backend/src/exams/dto/exam-meta.dto.ts

// Áreas válidas del banco de preguntas UNSA (coincide con el valor normalizado
// guardado en `exam_questions.area` por el script de import).
export type ExamArea = 'biomedicas' | 'ingenierias' | 'sociales';

export type University = 'UNSA' | 'UCSM';

// Mirrors `ExamMeta` en frontend/src/types/simulacro.ts
export class ExamMetaDto {
  id: string;
  name: string;
  area: ExamArea;
  university: University;
  totalPreguntas: number;
  tiempoMinutos: number;
  description?: string;
  year: number;
  fase?: string;
}
