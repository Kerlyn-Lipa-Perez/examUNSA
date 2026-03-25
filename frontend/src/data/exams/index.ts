// frontend/src/data/exams/index.ts
import { ExamMeta } from '@/types/simulacro';

export const UNSA_EXAMS: Record<string, ExamMeta[]> = {
  biomedicas: [
    {
      id: 'ordinario-i-2026',
      name: 'Ordinario I Fase 2026',
      area: 'biomedicas',
      university: 'UNSA',
      totalPreguntas: 80,
      tiempoMinutos: 150,
      description: 'Examen de admisión ordinario primera fase 2026 - Área Biomédicas',
      year: 2026,
      fase: 'I Fase',
    },
  ],
  ingenierias: [
    {
      id: 'ordinario-i-2026',
      name: 'Ordinario I Fase 2026',
      area: 'ingenierias',
      university: 'UNSA',
      totalPreguntas: 80,
      tiempoMinutos: 150,
      description: 'Examen de admisión ordinario primera fase 2026 - Área Ingenierías',
      year: 2026,
      fase: 'I Fase',
    },
  ],
  sociales: [
    {
      id: 'ordinario-i-2026',
      name: 'Ordinario I Fase 2026',
      area: 'sociales',
      university: 'UNSA',
      totalPreguntas: 80,
      tiempoMinutos: 150,
      description: 'Examen de admisión ordinario primera fase 2026 - Área Sociales',
      year: 2026,
      fase: 'I Fase',
    },
  ],
};

export function getExamsByArea(university: string, area: string): ExamMeta[] {
  if (university === 'UNSA') {
    return UNSA_EXAMS[area] || [];
  }
  return [];
}

export function getExamMeta(university: string, area: string, examId: string): ExamMeta | undefined {
  const exams = getExamsByArea(university, area);
  return exams.find((e) => e.id === examId);
}
