'use client';

interface FlashcardProgressProps {
  currentIndex: number;
  totalCards: number;
}

export function FlashcardProgress({ currentIndex, totalCards }: FlashcardProgressProps) {
  const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Barra de progreso */}
      <div className="relative w-full h-2 bg-neutral-700 rounded-full overflow-hidden mb-2">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Texto de progreso */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">
          Tarjeta <span className="font-mono text-white">{currentIndex + 1}</span> de{' '}
          <span className="font-mono text-white">{totalCards}</span>
        </span>
        <span className="font-mono text-primary">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Tarjetas restantes */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500">
          {totalCards - currentIndex - 1 > 0
            ? `${totalCards - currentIndex - 1} tarjetas restantes`
            : '¡Última tarjeta!'}
        </span>
      </div>
    </div>
  );
}