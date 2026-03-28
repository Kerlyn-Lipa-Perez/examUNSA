'use client';

import { FlashcardStats as FlashcardStatsType } from '@/types/flashcard';
import { Flame, BookOpen, Target, TrendingUp } from 'lucide-react';

interface FlashcardStatsProps {
  stats: FlashcardStatsType | undefined;
  isLoading: boolean;
}

export function FlashcardStats({ stats, isLoading }: FlashcardStatsProps) {
  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border animate-pulse">
        <div className="h-20 bg-neutral-700 rounded-lg"></div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      icon: BookOpen,
      label: 'Total de Tarjetas',
      value: stats.totalCards,
      color: 'text-tertiary',
    },
    {
      icon: Target,
      label: 'Estudiadas Hoy',
      value: stats.estudiadasHoy,
      color: 'text-success',
    },
    {
      icon: Flame,
      label: 'Racha de Días',
      value: stats.streak,
      color: 'text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {statCards.map(({ icon: Icon, label, value, color }) => (
        <div
          key={label}
          className="bg-neutral-800 rounded-xl p-4 border border-neutral-border flex flex-col items-center text-center"
        >
          <Icon className={`w-6 h-6 mb-2 ${color}`} />
          <span className="font-mono text-2xl font-bold text-white">{value}</span>
          <span className="text-xs text-gray-400 mt-1">{label}</span>
        </div>
      ))}

      {/* Stats por materia */}
      {Object.keys(stats.porMateria).length > 0 && (
        <div className="col-span-3 bg-neutral-800 rounded-xl p-4 border border-neutral-border">
          <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Por Materia
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(stats.porMateria).map(([materia, count]) => (
              <div key={materia} className="flex justify-between items-center bg-neutral-700 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-300 capitalize">{materia}</span>
                <span className="font-mono text-sm text-primary">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}