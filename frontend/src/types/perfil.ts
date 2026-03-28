// frontend/src/types/perfil.ts
export interface UserProfile {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  plan: 'free' | 'pro';
  simulacrosHoy: number;
  streakDias: number;
  ultimoAcceso?: string;
  createdAt: string;
}

export interface UserStats {
  simulacrosTotales: number;
  simulacrosHoy: number;
  mejorPuntaje: number;
  promedioPuntaje: number;
  diasRacha: number;
  flashcardsTotales: number;
  flashcardsCreadas: number;
  flashcardsEnProgreso: number;
  progresoPorMateria: Record<string, { promedio: number; simulacros: number }>;
  ultimosSimulacros: SimulacroReciente[];
}

export interface SimulacroReciente {
  id: string;
  materia: string;
  puntaje: number;
  totalPreguntas: number;
  createdAt: string;
}

// Helper para formatear fecha
export function formatFecha(fechaStr: string | undefined): string {
  if (!fechaStr) return 'N/A';
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Materia colors para el perfil
export const MATERIA_COLORS: Record<string, string> = {
  biologia: 'text-success',
  fisica: 'text-info',
  matematiographics: 'text-info',
  historia: 'text-error',
  geografia: 'text-info',
  economia: 'text-warning',
  civica: 'text-warning',
  literatura: 'text-tertiary',
  razonamiento: 'text-tertiary',
};

export const MATERIA_BG_COLORS: Record<string, string> = {
  biologia: 'bg-success',
  fisica: 'bg-info',
  matematicas: 'bg-info',
  historia: 'bg-error',
  geografia: 'bg-info',
  economia: 'bg-warning',
  civica: 'bg-warning',
  literatura: 'bg-tertiary',
  razonamiento: 'bg-tertiary',
};

export const MATERIA_LABELS: Record<string, string> = {
  biologia: 'Biología',
  fisica: 'Física',
  matematicas: 'Matemáticas',
  historia: 'Historia',
  geografia: 'Geografía',
  economia: 'Economía',
  civica: 'Cívica',
  literatura: 'Literatura',
  razonamiento: 'Razonamiento',
};