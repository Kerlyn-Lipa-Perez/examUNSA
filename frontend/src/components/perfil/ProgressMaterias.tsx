'use client';

import { UserStats, MATERIA_BG_COLORS, MATERIA_LABELS } from '@/types/perfil';
import { TrendingUp } from 'lucide-react';

interface ProgressMateriasProps {
  stats: UserStats | undefined;
  isLoading: boolean;
}

export function ProgressMaterias({ stats, isLoading }: ProgressMateriasProps) {
  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
        <div className="h-6 w-48 bg-neutral-700 rounded mb-4" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2 mb-4">
            <div className="h-4 w-32 bg-neutral-700 rounded" />
            <div className="h-2 w-full bg-neutral-700 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats?.progresoPorMateria) return null;

  const materias = Object.entries(stats.progresoPorMateria);
  
  if (materias.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Progreso por Materia
        </h3>
        <p className="text-gray-500 text-sm text-center py-8">
          Completa simulacros para ver tu progreso por materia
        </p>
      </div>
    );
  }

  // Ordenar por promedio descendente
  const sortedMaterias = materias.sort((a, b) => b[1].promedio - a[1].promedio);

  const getBarColor = (promedio: number): string => {
    if (promedio >= 80) return 'bg-success';
    if (promedio >= 60) return 'bg-info';
    if (promedio >= 40) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Progreso por Materia
      </h3>
      
      <div className="space-y-4">
        {sortedMaterias.map(([materia, data]) => {
          const colorClass = MATERIA_BG_COLORS[materia] || 'bg-primary';
          const label = MATERIA_LABELS[materia] || materia;
          
          return (
            <div key={materia}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm" style={{ color: getColorHex(promedio(data.promedio)) }}>
                    {data.promedio}%
                  </span>
                  <span className="text-xs text-gray-500">({data.simulacros} simul.)</span>
                </div>
              </div>
              <div className="h-2 w-full bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                  style={{ width: `${data.promedio}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <a href="/estadisticas" className="text-sm text-gray-400 hover:text-white transition-colors">
          Ver reporte completo →
        </a>
      </div>
    </div>
  );
}

function getColorHex(promedio: number): string {
  if (promedio >= 80) return '#10B981';
  if (promedio >= 60) return '#3B82F6';
  if (promedio >= 40) return '#D4A017';
  return '#EF4444';
}