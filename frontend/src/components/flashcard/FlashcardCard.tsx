'use client';

import { Flashcard } from '@/types/flashcard';
import { getMateriaColor, getMateriaLabel } from '@/hooks/useFlashcards';
import { RotateCcw, BookOpen } from 'lucide-react';

interface FlashcardCardProps {
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardCard({ flashcard, isFlipped, onFlip }: FlashcardCardProps) {
  const materiaColor = getMateriaColor(flashcard.materia);
  const materiaLabel = getMateriaLabel(flashcard.materia);

  return (
    <div className="w-full max-w-2xl mx-auto" style={{ perspective: '1000px' }}>
      <div
        className={`relative w-full min-h-[400px] cursor-pointer transition-transform duration-500`}
        onClick={onFlip}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
        {/* Frente de la tarjeta - Pregunta */}
        <div
          className={`absolute inset-0 rounded-2xl border-l-4 ${materiaColor} bg-neutral-800 border border-neutral-border p-8 flex flex-col`}
          style={{ backfaceVisibility: 'hidden' }}>
          {/* Header con materia */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
              Pregunta
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-neutral-700 text-white`}>
              {materiaLabel}
            </span>
          </div>

          {/* Pregunta */}
          <div className="flex-1 flex items-center justify-center">
            <p className="font-mono text-lg sm:text-xl text-gray-100 text-center leading-relaxed whitespace-pre-wrap">
              {flashcard.pregunta}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Toca para ver la respuesta</span>
          </div>
        </div>

        {/* Reverso de la tarjeta - Respuesta */}
        <div
          className={`absolute inset-0 rounded-2xl bg-neutral-700 border border-neutral-border p-8 flex flex-col`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
              Respuesta
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-neutral-600 text-white`}>
              {materiaLabel}
            </span>
          </div>

          {/* Respuesta */}
          <div className="flex-1 flex items-center justify-center">
            <p className="font-mono text-lg sm:text-xl text-primary text-center leading-relaxed whitespace-pre-wrap">
              {flashcard.respuesta}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Califica tu respuesta abajo</span>
          </div>
        </div>
      </div>
    </div>
  );
}