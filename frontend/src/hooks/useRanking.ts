// frontend/src/hooks/useRanking.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

// ─── TIPOS ──────────────────────────────────────────────────────────────────

export interface RankingEntry {
  posicion: number;
  userId: string;
  nombre: string;
  totalRp: number;
  simulacrosCompletados?: number;
  rachaActual?: number;
  porcentajeAcierto: number;
  esUsuario?: boolean;
  nivel: {
    nombre: string;
    color: string;
    nivel: number;
  };
}

export interface UserPosition {
  posicion: number;
  totalUsuarios: number;
  totalRp: number;
  simulacrosCompletados: number;
  rachaActual: number;
  rachaMaxima: number;
  respuestasCorrectas: number;
  respuestasTotales: number;
  porcentajeAcierto: number;
  flashcardsRevisadas: number;
  nivel: {
    nombre: string;
    color: string;
    nivel: number;
  };
  vecinos: RankingEntry[];
}

export interface WeeklyRankingEntry {
  posicion: number;
  userId: string;
  nombre: string;
  rpSemanales: number;
  nivel: {
    nombre: string;
    color: string;
    nivel: number;
  };
}

// ─── HOOKS ──────────────────────────────────────────────────────────────────

/**
 * GET /ranking/global — Top 100 usuarios
 */
export function useGlobalRanking() {
  return useQuery<RankingEntry[]>({
    queryKey: ['ranking', 'global'],
    queryFn: async () => {
      const { data } = await api.get<RankingEntry[]>('/ranking/global');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * GET /ranking/posicion — Posición del usuario + vecinos
 */
export function useUserRankingPosition() {
  return useQuery<UserPosition>({
    queryKey: ['ranking', 'posicion'],
    queryFn: async () => {
      const { data } = await api.get<UserPosition>('/ranking/posicion');
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * GET /ranking/semanal — Ranking de los últimos 7 días
 */
export function useWeeklyRanking() {
  return useQuery<WeeklyRankingEntry[]>({
    queryKey: ['ranking', 'semanal'],
    queryFn: async () => {
      const { data } = await api.get<WeeklyRankingEntry[]>('/ranking/semanal');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
