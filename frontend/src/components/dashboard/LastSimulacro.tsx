'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

interface HistorialItem {
  id: string;
  examId: string | null;
  materia: string;
  puntaje: number;
  totalPreguntas: number;
  createdAt: string;
}

interface HistorialResponse {
  items: HistorialItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Hace un momento';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}

export function LastSimulacro() {
  const [data, setData] = useState<HistorialItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get<HistorialResponse>('/simulacros/historial?limit=1')
      .then((res) => {
        if (res.data.items.length > 0) setData(res.data.items[0]);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Último simulacro</h2>
        <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border animate-pulse">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 rounded-full bg-neutral-700 flex-shrink-0" />
            <div className="flex-1 space-y-4 w-full">
              <div className="h-6 bg-neutral-700 rounded w-3/4" />
              <div className="h-4 bg-neutral-700 rounded w-full" />
              <div className="flex gap-4">
                <div className="h-8 bg-neutral-700 rounded w-28" />
                <div className="h-8 bg-neutral-700 rounded w-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Último simulacro</h2>
        <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border text-center">
          <p className="text-gray-400 text-sm">No se pudo cargar el historial.</p>
        </div>
      </div>
    );
  }

  // --- Empty state ---
  if (!data) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Último simulacro</h2>
        <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border text-center space-y-4">
          <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Aún no has realizado ningún simulacro.</p>
          <Link
            href="/simulacros"
            className="inline-block bg-primary hover:bg-yellow-500 text-neutral-900 font-bold py-2 px-6 rounded-lg transition-colors text-sm"
          >
            Aun no has realiza algun simulacro
          </Link>
        </div>
      </div>
    );
  }

  // --- Data state ---
  const porcentaje = Math.round((data.puntaje / data.totalPreguntas) * 100);
  const incorrectas = data.totalPreguntas - data.puntaje;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (porcentaje / 100) * circumference;
  const scoreColor = porcentaje >= 70 ? '#10B981' : porcentaje >= 50 ? '#D4A017' : '#EF4444';


  const reviewHref = `/simulacros/UNSA/${data.materia}/${data.examId}/results?rid=${data.id}`;

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Último simulacro</h2>
      <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border flex flex-col md:flex-row gap-8 items-center">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1E2532" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="font-mono text-2xl font-bold text-white">
              {data.puntaje}
              <span className="font-mono text-sm text-gray-500 font-normal">/{data.totalPreguntas}</span>
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1 capitalize">{data.materia}</h3>
            <p className="text-gray-400 text-sm">
              {timeAgo(data.createdAt)}. Obtuviste{' '}
              <span className="font-mono text-white font-semibold">{porcentaje}%</span> de aciertos.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="font-mono inline-flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded text-xs font-semibold text-gray-300 border border-neutral-border">
              <span className="text-success text-sm">✓</span> {data.puntaje} Correctas
            </span>
            <span className="font-mono inline-flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded text-xs font-semibold text-gray-300 border border-neutral-border">
              <span className="text-error text-sm">×</span> {incorrectas} Incorrectas
            </span>
          </div>
        </div>

        <div>
          <Link
            href={reviewHref}
            className="bg-secondary hover:bg-opacity-80 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block"
          >
            Revisar errores
          </Link>
        </div>
      </div>
    </div>
  );
}
