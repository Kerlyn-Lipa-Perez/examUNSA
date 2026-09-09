// frontend/src/data/exams/index.ts
import { ExamMeta } from '@/types/simulacro';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function getExamsByArea(university: string, area: string): Promise<ExamMeta[]> {
  try {
    const response = await fetch(`${API_URL}/exams/${university}/${area}`);

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as ExamMeta[];
  } catch (error) {
    console.error(`Error loading exams: ${university}/${area}`, error);
    return [];
  }
}

export async function getExamMeta(
  university: string,
  area: string,
  examId: string,
): Promise<ExamMeta | undefined> {
  const exams = await getExamsByArea(university, area);
  return exams.find((e) => e.id === examId);
}
