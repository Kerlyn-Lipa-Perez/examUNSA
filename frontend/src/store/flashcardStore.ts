// frontend/src/store/flashcardStore.ts
import { create } from 'zustand';
import { Flashcard, CalificacionSM2 } from '@/types/flashcard';

interface FlashcardState {
  // Cards data
  cards: Flashcard[];
  currentIndex: number;
  totalCards: number;

  // UI state
  isFlipped: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Review state
  reviewedCount: number;

  // Actions
  setCards: (cards: Flashcard[], total: number) => void;
  flipCard: () => void;
  nextCard: () => void;
  prevCard: () => void;
  rateCard: (calificacion: CalificacionSM2) => void;
  incrementReviewed: () => void;
  reset: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed
  getCurrentCard: () => Flashcard | null;
  getRemainingCards: () => number;
  getProgress: () => number;
}

export const useFlashcardStore = create<FlashcardState>()((set, get) => ({
  cards: [],
  currentIndex: 0,
  totalCards: 0,
  isFlipped: false,
  isLoading: false,
  error: null,
  reviewedCount: 0,

  setCards: (cards: Flashcard[], total: number) => {
    set({
      cards,
      totalCards: total,
      currentIndex: 0,
      isFlipped: false,
      reviewedCount: 0,
      error: null,
    });
  },

  flipCard: () => {
    set((state) => ({ isFlipped: !state.isFlipped }));
  },

  nextCard: () => {
    const { currentIndex, cards } = get();
    if (currentIndex < cards.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        isFlipped: false,
      });
    }
  },

  prevCard: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({
        currentIndex: currentIndex - 1,
        isFlipped: false,
      });
    }
  },

  rateCard: (_calificacion: CalificacionSM2) => {
    // La lógica real de guardado se maneja en el hook de React Query
    // Aquí solo actualizamos el UI
    get().nextCard();
  },

  incrementReviewed: () => {
    set((state) => ({ reviewedCount: state.reviewedCount + 1 }));
  },

  reset: () => {
    set({
      cards: [],
      currentIndex: 0,
      totalCards: 0,
      isFlipped: false,
      isLoading: false,
      error: null,
      reviewedCount: 0,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  getCurrentCard: () => {
    const { cards, currentIndex } = get();
    return cards[currentIndex] || null;
  },

  getRemainingCards: () => {
    const { cards, currentIndex } = get();
    return cards.length - currentIndex - 1;
  },

  getProgress: () => {
    const { currentIndex, cards } = get();
    if (cards.length === 0) return 0;
    return Math.round((currentIndex / cards.length) * 100);
  },
}));