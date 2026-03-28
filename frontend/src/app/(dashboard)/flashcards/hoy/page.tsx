'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFlashcardStore } from '@/store/flashcardStore';
import { useGetCardsHoy, useRevisarCard, useFlashcardStats } from '@/hooks/useFlashcards';
import { useAuthStore } from '@/store/authStore';
import {
  FlashcardCard,
  RatingButtons,
  FlashcardProgress,
  FlashcardStats,
  EmptyFlashcards,
} from '@/components/flashcard';
import { CalificacionSM2 } from '@/types/flashcard';
import { Loader2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export default function FlashcardsHoyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const hasProAccess = user?.plan === 'pro';

  // State from Zustand
  const {
    cards,
    currentIndex,
    totalCards,
    isFlipped,
    isLoading,
    error,
    setCards,
    flipCard,
    nextCard,
    prevCard,
    incrementReviewed,
  } = useFlashcardStore();

  // React Query
  const { data: cardsData, isLoading: isLoadingCards, error: cardsError } = useGetCardsHoy();
  const { data: stats, isLoading: isLoadingStats } = useFlashcardStats();
  const revisarMutate = useRevisarCard();

  // Load cards when data is available
  useEffect(() => {
    if (cardsData?.cards) {
      setCards(cardsData.cards, cardsData.total);
    }
  }, [cardsData, setCards]);

  // Handle card rating
  const handleRate = useCallback(async (calificacion: CalificacionSM2) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      await revisarMutate.mutateAsync({
        cardId: currentCard.id,
        calificacion,
      });
      incrementReviewed();
      // nextCard() is called automatically in the mutation callback
    } catch (err) {
      console.error('Error al guardar revisión:', err);
      // Still advance to next card even if API fails
      nextCard();
    }
  }, [cards, currentIndex, revisarMutate, incrementReviewed, nextCard]);

  // Loading state
  if (isLoadingCards) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Error state
  if (cardsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-error text-lg mb-4">Error al cargar las flashcards</p>
        <p className="text-gray-500">{cardsError.message}</p>
      </div>
    );
  }

  // No cards state
  if (!cardsData?.cards || cardsData.cards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Flashcards de Hoy
        </h1>
        <EmptyFlashcards hasProAccess={hasProAccess} />
      </div>
    );
  }

  // Get current card
  const currentCard = cards[currentIndex];
  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">No hay tarjetas disponibles</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Flashcards de Hoy
        </h1>
        <p className="text-gray-400">
          Repasa tus tarjetas usando el algoritmo SM-2
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <FlashcardProgress currentIndex={currentIndex} totalCards={totalCards} />
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <FlashcardCard
          flashcard={currentCard}
          isFlipped={isFlipped}
          onFlip={flipCard}
        />
      </div>

      {/* Navigation and Rating */}
      <div className="space-y-6">
        {/* Navigation buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className={`
              p-3 rounded-lg border border-neutral-border text-gray-400
              hover:text-white hover:bg-neutral-800 transition-colors
              ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}
            `}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={flipCard}
            className="p-3 rounded-lg border border-neutral-border text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button
            onClick={nextCard}
            disabled={currentIndex >= cards.length - 1}
            className={`
              p-3 rounded-lg border border-neutral-border text-gray-400
              hover:text-white hover:bg-neutral-800 transition-colors
              ${currentIndex >= cards.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}
            `}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Rating buttons - show when flipped */}
        {isFlipped && (
          <div className="animate-fade-in">
            <RatingButtons onRate={handleRate} disabled={revisarMutate.isPending} />
          </div>
        )}

        {!isFlipped && (
          <p className="text-center text-gray-500 text-sm">
            Dale la vuelta a la tarjeta para calificar tu respuesta
          </p>
        )}
      </div>

      {/* Stats section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4">Tu Progreso</h2>
        <FlashcardStats stats={stats} isLoading={isLoadingStats} />
      </div>
    </div>
  );
}