// frontend/src/data/exams/loader.ts
// Carga de exámenes desde el backend (banco de preguntas en base de datos).

import { ExamData } from '@/types/simulacro';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function loadExam(
  university: string,
  area: string,
  examId: string,
): Promise<ExamData | null> {
  try {
    const response = await fetch(`${API_URL}/exams/${university}/${area}/${examId}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Unexpected status ${response.status}`);
    }

    return (await response.json()) as ExamData;
  } catch (error) {
    console.error(`Error loading exam: ${university}/${area}/${examId}`, error);
    return null;
  }
}
