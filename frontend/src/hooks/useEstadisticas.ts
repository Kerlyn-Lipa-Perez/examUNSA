// frontend/src/hooks/useEstadisticas.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

// ─── TIPOS ──────────────────────────────────────────────────────────────────

export interface EvolucionPunto {
  fecha: string;
  materia: string;
  porcentaje: number;
  puntaje: number;
  total: number;
}

export interface EvolucionData {
  puntos: EvolucionPunto[];
  promedioMovil: number[];
  materias: string[];
}

export interface FortalezaMateria {
  materia: string;
  promedio: number;
  totalSimulacros: number;
  tendencia: 'subiendo' | 'estable' | 'bajando';
}

export interface FortalezasData {
  materias: FortalezaMateria[];
  materiaMasFuerte: string | null;
  materiaMasDebil: string | null;
  recomendacion: string | null;
}

export interface ActividadDia {
  fecha: string;
  simulacros: number;
  flashcards: number;
}

export interface ActividadData {
  dias: ActividadDia[];
  diasActivos: number;
  diasTotales: number;
  porcentajeConsistencia: number;
}

export interface DiaSemana {
  dia: string;
  promedio: number;
  cantidad: number;
}

export interface PorDiaData {
  dias: DiaSemana[];
  mejorDia: string | null;
  peorDia: string | null;
}

export interface ErrorPorMateria {
  materia: string;
  errores: number;
  porcentaje: number;
}

export interface AnalisisIA {
  resumen: string;
  problemas: {
    materia: string;
    tipo: string;
    descripcion: string;
    impacto: 'alto' | 'medio' | 'bajo';
    recomendacion: string;
  }[];
  fortalezas: string[];
  planAccion: string | null;
}

export interface ErroresData {
  totalCorrectas: number;
  totalIncorrectas: number;
  totalSinResponder: number;
  porcentajeAcierto: number;
  erroresPorMateria: ErrorPorMateria[];
  esPro: boolean;
  analisisIA: AnalisisIA | null;
}

export interface ComparativoData {
  usuario: {
    porcentajeAcierto: number;
    racha: number;
    totalRp: number;
    simulacrosCompletados: number;
  };
  global: {
    totalUsuarios: number;
    promedioAcierto: number;
    promedioRacha: number;
    promedioSimulacros: number;
  };
}

// ─── HOOKS ──────────────────────────────────────────────────────────────────

export function useEvolucion(dias = 30) {
  return useQuery<EvolucionData>({
    queryKey: ['estadisticas', 'evolucion', dias],
    queryFn: async () => {
      const { data } = await api.get<EvolucionData>(`/estadisticas/evolucion?dias=${dias}`);
      return data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function useFortalezas() {
  return useQuery<FortalezasData>({
    queryKey: ['estadisticas', 'fortalezas'],
    queryFn: async () => {
      const { data } = await api.get<FortalezasData>('/estadisticas/fortalezas');
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useActividad(semanas = 12) {
  return useQuery<ActividadData>({
    queryKey: ['estadisticas', 'actividad', semanas],
    queryFn: async () => {
      const { data } = await api.get<ActividadData>(`/estadisticas/actividad?semanas=${semanas}`);
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function usePorDia() {
  return useQuery<PorDiaData>({
    queryKey: ['estadisticas', 'por-dia'],
    queryFn: async () => {
      const { data } = await api.get<PorDiaData>('/estadisticas/por-dia');
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useErrores() {
  return useQuery<ErroresData>({
    queryKey: ['estadisticas', 'errores'],
    queryFn: async () => {
      const { data } = await api.get<ErroresData>('/estadisticas/errores');
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useComparativo() {
  return useQuery<ComparativoData>({
    queryKey: ['estadisticas', 'comparativo'],
    queryFn: async () => {
      const { data } = await api.get<ComparativoData>('/estadisticas/comparativo');
      return data;
    },
    staleTime: 1000 * 60 * 10,
  });
}
