'use client';

import { CalificacionSM2, CALIFICACION_LABELS, CALIFICACION_COLORS } from '@/types/flashcard';

interface RatingButtonsProps {
  onRate: (calificacion: CalificacionSM2) => void;
  disabled?: boolean;
}

export function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  const buttons = [
    { calificacion: CalificacionSM2.Again, label: CALIFICACION_LABELS[CalificacionSM2.Again], color: CALIFICACION_COLORS[CalificacionSM2.Again] },
    { calificacion: CalificacionSM2.Hard, label: CALIFICACION_LABELS[CalificacionSM2.Hard], color: CALIFICACION_COLORS[CalificacionSM2.Hard] },
    { calificacion: CalificacionSM2.Difficult, label: CALIFICACION_LABELS[CalificacionSM2.Difficult], color: CALIFICACION_COLORS[CalificacionSM2.Difficult] },
    { calificacion: CalificacionSM2.Good, label: CALIFICACION_LABELS[CalificacionSM2.Good], color: CALIFICACION_COLORS[CalificacionSM2.Good] },
    { calificacion: CalificacionSM2.Easy, label: CALIFICACION_LABELS[CalificacionSM2.Easy], color: CALIFICACION_COLORS[CalificacionSM2.Easy] },
    { calificacion: CalificacionSM2.Perfect, label: CALIFICACION_LABELS[CalificacionSM2.Perfect], color: CALIFICACION_COLORS[CalificacionSM2.Perfect] },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-center text-gray-400 text-sm mb-4">
        ¿Cómo de bien recordaste la respuesta?
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {buttons.map(({ calificacion, label, color }) => (
          <button
            key={calificacion}
            onClick={() => onRate(calificacion)}
            disabled={disabled}
            className={`
              ${color} text-white font-medium py-3 px-2 rounded-lg
              transition-all duration-200 transform hover:scale-105
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
              text-xs sm:text-sm
            `}
          >
            {label}
          </button>
        ))}
      </div>
      
      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-error"></span>
          Olvidé
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-warning"></span>
          Difícil
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          Bien
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          Perfecto
        </span>
      </div>
    </div>
  );
}