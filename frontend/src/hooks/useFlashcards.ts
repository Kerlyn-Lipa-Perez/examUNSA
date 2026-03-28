// frontend/src/hooks/useFlashcards.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import {
  FlashcardsResponse,
  Flashcard,
  FlashcardStats,
  RevisarCardDto,
  RevisarCardResponse,
  GenerarCardsDto,
  GenerarCardsResponse,
} from '@/types/flashcard';

// ============ GET /flashcards/hoy ============
export function useGetCardsHoy() {
  return useQuery<FlashcardsResponse>({
    queryKey: ['flashcards', 'hoy'],
    queryFn: async () => {
      const { data } = await api.get<FlashcardsResponse>('/flashcards/hoy');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// ============ GET /flashcards/stats ============
export function useFlashcardStats() {
  return useQuery<FlashcardStats>({
    queryKey: ['flashcards', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<FlashcardStats>('/flashcards/stats');
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ============ POST /flashcards/:id/revisar ============
export function useRevisarCard() {
  const queryClient = useQueryClient();

  return useMutation<RevisarCardResponse, Error, { cardId: string; calificacion: number }>({
    mutationFn: async ({ cardId, calificacion }) => {
      const { data } = await api.post<RevisarCardResponse>(
        `/flashcards/${cardId}/revisar`,
        { calificacion } as RevisarCardDto
      );
      return data;
    },
    onSuccess: () => {
      // Invalidar queries para actualizar stats
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
}

// ============ POST /flashcards/generar-ia ============
export function useGenerarIA() {
  const queryClient = useQueryClient();

  return useMutation<GenerarCardsResponse, Error, GenerarCardsDto>({
    mutationFn: async (dto: GenerarCardsDto) => {
      const { data } = await api.post<GenerarCardsResponse>('/flashcards/generar-ia', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
}

// ============ Utilidades ============
export function getMateriaColor(materia: string): string {
  const colors: Record<string, string> = {
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
  return colors[materia.toLowerCase()] || 'border-l-primary';
}

export function getMateriaLabel(materia: string): string {
  const labels: Record<string, string> = {
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
  return labels[materia.toLowerCase()] || materia;
}