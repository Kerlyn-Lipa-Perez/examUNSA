'use client';

import { UserStats } from '@/types/perfil';
import { Target, TrendingUp, Flame, Clock, BookOpen, Award } from 'lucide-react';

interface StatsGridProps {
  stats: UserStats | undefined;
  isLoading: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-neutral-800 rounded-xl p-4 border border-neutral-border animate-pulse">
            <div className="h-4 w-16 bg-neutral-700 rounded mb-2" />
            <div className="h-8 w-12 bg-neutral-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      icon: Target,
      label: 'Simulacros Totales',
      value: stats.simulacrosTotales,
      color: 'text-tertiary',
    },
    {
      icon: TrendingUp,
      label: 'Promedio',
      value: stats.promedioPuntaje,
      suffix: 'pts',
      color: 'text-primary',
    },
    {
      icon: Flame,
      label: 'Racha Actual',
      value: stats.diasRacha,
      suffix: 'días',
      color: 'text-warning',
    },
    {
      icon: Clock,
      label: 'Horas Estudio',
      value: '128',
      suffix: 'hrs',
      color: 'text-info',
    },
    {
      icon: Award,
      label: 'Mejor Puntaje',
      value: stats.mejorPuntaje,
      suffix: 'pts',
      color: 'text-success',
    },
    {
      icon: BookOpen,
      label: 'Flashcards Creadas',
      value: stats.flashcardsCreadas || 0,
      color: 'text-secondary',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map(({ icon: Icon, label, value, suffix, color }) => (
        <div
          key={label}
          className="bg-neutral-800 rounded-xl p-4 border border-neutral-border flex flex-col items-center text-center"
        >
          <Icon className={`w-5 h-5 mb-2 ${color}`} />
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-white">{value}</span>
            {suffix && <span className="text-xs text-gray-400">{suffix}</span>}
          </div>
          <span className="text-xs text-gray-500 mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}