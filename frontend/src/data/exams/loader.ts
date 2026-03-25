// frontend/src/data/exams/loader.ts
// Carga dinámica de exámenes para evitar bundlear todos los datos en el chunk principal

import { ExamData, ExamArea } from '@/types/simulacro';

type ExamLoader = () => Promise<{ default: ExamData }>;

const EXAM_REGISTRY: Record<string, Record<string, Record<string, ExamLoader>>> = {
  UNSA: {
    biomedicas: {
      'ordinario-i-2026': () => import('./unsa/ordinario-i-2026-biomedicas'),
    },
    ingenierias: {
      'ordinario-i-2026': () => import('./unsa/ordinario-i-2026-ingenierias'),
    },
    sociales: {
      'ordinario-i-2026': () => import('./unsa/ordinario-i-2026-sociales'),
    },
  },
};

export async function loadExam(
  university: string,
  area: string,
  examId: string,
): Promise<ExamData | null> {
  const loader = EXAM_REGISTRY[university]?.[area]?.[examId];
  if (!loader) return null;

  try {
    const module = await loader();
    return module.default;
  } catch (error) {
    console.error(`Error loading exam: ${university}/${area}/${examId}`, error);
    return null;
  }
}
