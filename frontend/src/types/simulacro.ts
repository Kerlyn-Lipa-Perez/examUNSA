// frontend/src/types/simulacro.ts

export type ExamArea = 'biomedicas' | 'ingenierias' | 'sociales';

export type University = 'UNSA' | 'UCSM';

export interface ExamMeta {
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

export interface Question {
  id: number;
  materia: string;
  texto: string;
  imagen?: string; // Path relativo a /public/exams/images/
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

export interface ExamData {
  meta: ExamMeta;
  preguntas: Question[];
}

export interface UserAnswer {
  preguntaId: number;
  respuesta: 'A' | 'B' | 'C' | 'D' | 'E' | null;
}

export interface ExamResult {
  examId: string;
  materia: string;
  puntaje: number;
  totalPreguntas: number;
  tiempoSegundos: number;
  respuestas: {
    preguntaId: number;
    elegida: string | null;
    correcta: string;
  }[];
}

export const AREA_CONFIG: Record<ExamArea, {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  materias: string[];
}> = {
  biomedicas: {
    name: 'Biomédicas',
    description: 'Medicina, Enfermería, Odontología, Biología y afines',
    color: '#10B981',
    bgColor: 'bg-success/10',
    icon: '🧬',
    materias: ['Biología', 'Química', 'Física', 'Matemática', 'Lenguaje', 'Aptitud Académica'],
  },
  ingenierias: {
    name: 'Ingenierías',
    description: 'Ing. de Sistemas, Civil, Industrial, Electrónica y afines',
    color: '#3B82F6',
    bgColor: 'bg-info/10',
    icon: '⚙️',
    materias: ['Matemática', 'Física', 'Química', 'Lenguaje', 'Aptitud Académica'],
  },
  sociales: {
    name: 'Sociales',
    description: 'Derecho, Economía, Administración, Educación y afines',
    color: '#D4A017',
    bgColor: 'bg-primary/10',
    icon: '📚',
    materias: ['Lenguaje', 'Historia', 'Geografía', 'Economía', 'Cívica', 'Aptitud Académica'],
  },
};
