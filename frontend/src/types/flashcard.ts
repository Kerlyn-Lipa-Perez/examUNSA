// frontend/src/types/flashcard.ts

export interface Flashcard {
  id: string;
  pregunta: string;
  respuesta: string;
  materia: string;
}

export interface FlashcardWithProgress extends Flashcard {
  intervaloDias?: number;
  facilidad?: number;
  repeticiones?: number;
  proximaRevision?: string;
}

export interface FlashcardsResponse {
  cards: Flashcard[];
  total: number;
}

export interface RevisarCardDto {
  calificacion: number; // 0-5 según algoritmo SM-2
}

export interface RevisarCardResponse {
  proximaRevision: string;
  intervaloDias: number;
}

export interface GenerarCardsDto {
  tema: string;
  materia: string;
}

export interface GenerarCardsResponse {
  cards: Flashcard[];
}

export interface FlashcardStats {
  totalCards: number;
  estudiadasHoy: number;
  streak: number;
  porMateria: Record<string, number>;
}

// Calificación SM-2
export enum CalificacionSM2 {
 Again = 0,  // Completamente olvidé
  Hard = 1,   // Recordé con mucha dificultad
  Difficult = 2, // Recordé con dificultad
  Good = 3,   // Recordé correctamente
  Easy = 4,   // Fue fácil recordar
  Perfect = 5 // Lo recordé instantáneamente
}

export const CALIFICACION_LABELS: Record<CalificacionSM2, string> = {
  [CalificacionSM2.Again]: 'Otra vez',
  [CalificacionSM2.Hard]: 'Difícil',
  [CalificacionSM2.Difficult]: 'Regular',
  [CalificacionSM2.Good]: 'Bien',
  [CalificacionSM2.Easy]: 'Fácil',
  [CalificacionSM2.Perfect]: 'Perfecto',
};

export const CALIFICACION_COLORS: Record<CalificacionSM2, string> = {
  [CalificacionSM2.Again]: 'bg-error hover:bg-red-600',
  [CalificacionSM2.Hard]: 'bg-error hover:bg-red-600',
  [CalificacionSM2.Difficult]: 'bg-warning hover:bg-yellow-600',
  [CalificacionSM2.Good]: 'bg-tertiary hover:bg-blue-600',
  [CalificacionSM2.Easy]: 'bg-secondary hover:bg-blue-800',
  [CalificacionSM2.Perfect]: 'bg-success hover:bg-green-600',
};

// Materias válidas
export const MATERIAS = [
  'biologia',
  'fisica', 
  'matematicas',
  'historia',
  'geografia',
  'economia',
  'civica',
  'literatura',
  'razonamiento',
] as const;

export type Materia = typeof MATERIAS[number];

export const MATERIA_LABELS: Record<Materia, string> = {
  biologia: 'Biología',
  fisica: 'Física',
  matematicas: 'Matemáticas',
  historia: 'Historia',
  economia: 'Economía',
  geografia: 'Geografía',
  civica: 'Cívica',
  literatura: 'Literatura',
  razonamiento: 'Razonamiento',
};

export const MATERIA_COLORS: Record<Materia, string> = {
  biologia: 'border-l-success',
  fisica: 'border-l-info',
  matematicas: 'border-l-info',
  historia: 'border-l-error',
  geografia: 'border-l-info',
  economia: 'border-l-warning',
  civica: 'border-l-warning',
  literatura: 'border-l-tertiary',
  razonamiento: 'border-l-tertiary',
};