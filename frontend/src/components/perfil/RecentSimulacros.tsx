'use client';

import { UserStats, MATERIA_LABELS, MATERIA_COLORS } from '@/types/perfil';
import { FileText } from 'lucide-react';

interface RecentSimulacrosProps {
  stats: UserStats | undefined;
  isLoading: boolean;
}

export function RecentSimulacros({ stats, isLoading }: RecentSimulacrosProps) {
  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
        <div className="h-6 w-40 bg-neutral-700 rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-border">
            <div className="h-4 w-32 bg-neutral-700 rounded" />
            <div className="h-4 w-16 bg-neutral-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats?.ultimosSimulacros || stats.ultimosSimulacros.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Últimos Simulacros
        </h3>
        <p className="text-gray-500 text-sm text-center py-8">
          No tienes simulacros completados aún
        </p>
      </div>
    );
  }

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Últimos Simulacros
      </h3>

      <div className="space-y-0">
        {stats.ultimosSimulacros.map((simulacro, index) => {
          const colorClass = MATERIA_COLORS[simulacro.materia.toLowerCase()] || 'text-gray-400';
          const label = MATERIA_LABELS[simulacro.materia.toLowerCase()] || simulacro.materia;
          const percentage = Math.round((simulacro.puntaje / simulacro.totalPreguntas) * 100);

          return (
            <div
              key={simulacro.id}
              className={`flex items-center justify-between py-3 ${
                index < stats.ultimosSimulacros.length - 1 ? 'border-b border-neutral-border' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${getDotColor(percentage)}`} />
                <div>
                  <span className="text-sm font-medium text-white">{label}</span>
                  <span className="text-xs text-gray-500 ml-2">{formatFecha(simulacro.createdAt)}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm text-white">{simulacro.puntaje}</span>
                <span className="text-xs text-gray-500">/{simulacro.totalPreguntas}</span>
                <span className={`text-xs ml-2 ${colorClass}`}>({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <a href="/simulacros" className="text-sm text-gray-400 hover:text-white transition-colors">
          Ver todos los simulacros →
        </a>
      </div>
    </div>
  );
}

function getDotColor(percentage: number): string {
  if (percentage >= 80) return 'bg-success';
  if (percentage >= 60) return 'bg-info';
  if (percentage >= 40) return 'bg-warning';
  return 'bg-error';
}