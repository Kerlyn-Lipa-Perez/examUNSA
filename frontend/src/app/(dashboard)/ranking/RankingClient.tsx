// frontend/src/app/(dashboard)/ranking/RankingClient.tsx
'use client';

import { useState } from 'react';
import { useGlobalRanking, useUserRankingPosition, useWeeklyRanking, RankingEntry } from '@/hooks/useRanking';

type TabType = 'global' | 'semanal';

export function RankingClient() {
  const [tab, setTab] = useState<TabType>('global');

  const { data: userPosition, isLoading: loadingPosition } = useUserRankingPosition();
  const { data: globalRanking, isLoading: loadingGlobal } = useGlobalRanking();
  const { data: weeklyRanking, isLoading: loadingWeekly } = useWeeklyRanking();

  const isLoading = loadingPosition || loadingGlobal || loadingWeekly;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Ranking</h1>
        <p className="text-gray-400 mt-1">Compite con otros postulantes UNSA</p>
      </div>

      {/* Tu Posición */}
      <UserPositionCard position={userPosition} loading={loadingPosition} />

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('global')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'global'
              ? 'bg-primary text-neutral-900'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setTab('semanal')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'semanal'
              ? 'bg-primary text-neutral-900'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Esta Semana
        </button>
      </div>

      {/* Tabla de Ranking */}
      {tab === 'global' ? (
        <RankingTable
          entries={globalRanking ?? []}
          loading={loadingGlobal}
          currentUserId={userPosition?.vecinos?.find(v => v.esUsuario)?.userId}
          showSimulacros
        />
      ) : (
        <WeeklyRankingTable
          entries={weeklyRanking ?? []}
          loading={loadingWeekly}
          currentUserId={userPosition?.vecinos?.find(v => v.esUsuario)?.userId}
        />
      )}
    </div>
  );
}

// ─── Card de posición del usuario ────────────────────────────────────────────

function UserPositionCard({ position, loading }: {
  position: ReturnType<typeof useUserRankingPosition>['data'];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border animate-pulse">
        <div className="h-4 w-32 bg-neutral-700 rounded mb-4" />
        <div className="h-10 w-20 bg-neutral-700 rounded mb-2" />
        <div className="h-3 w-48 bg-neutral-700 rounded" />
      </div>
    );
  }

  if (!position) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border text-center">
        <p className="text-gray-400 text-sm">Aún no tienes puntos de ranking. ¡Completa un simulacro para comenzar!</p>
      </div>
    );
  }

  const nivelColorClass = getNivelColorClass(position.nivel.color);

  return (
    <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Posición grande */}
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">Posición</p>
            <p className="font-mono text-5xl font-bold text-white">#{position.posicion}</p>
          </div>

          {/* Separador */}
          <div className="hidden md:block w-px h-16 bg-neutral-border" />

          {/* Stats */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${nivelColorClass}`}>{position.nivel.nombre}</span>
              <span className="text-xs text-gray-500">Nivel {position.nivel.nivel}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="font-mono text-primary font-bold">{position.totalRp.toLocaleString()} RP</span>
              <span>·</span>
              <span>{position.simulacrosCompletados} simulacros</span>
              <span>·</span>
              <span>🔥 {position.rachaActual} días</span>
            </div>
          </div>
        </div>

        {/* Stats secundarios */}
        <div className="flex gap-6 text-center">
          <div>
            <p className="font-mono text-lg font-bold text-white">{position.porcentajeAcierto}%</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Acierto</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold text-white">{position.rachaMaxima}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Mejor Racha</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold text-white">{position.flashcardsRevisadas}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Flashcards</p>
          </div>
        </div>
      </div>

      {/* Barra de progreso al siguiente nivel */}
      <ProgressBarToNextLevel totalRp={position.totalRp} />
    </div>
  );
}

// ─── Barra de progreso al siguiente nivel ────────────────────────────────────

function ProgressBarToNextLevel({ totalRp }: { totalRp: number }) {
  const niveles = [
    { nombre: 'Postulante',      min: 0,    max: 100 },
    { nombre: 'Preuniversitario', min: 100,  max: 300 },
    { nombre: 'Académico',       min: 300,  max: 700 },
    { nombre: 'Ingresante',      min: 700,  max: 1500 },
    { nombre: 'Cachimbo',        min: 1500, max: 3000 },
    { nombre: 'Maestro',         min: 3000, max: 3000 },
  ];

  const nivelActual = niveles.find(n => totalRp >= n.min && totalRp < n.max) ?? niveles[5];
  const esMaximo = nivelActual.nombre === 'Maestro';

  if (esMaximo) {
    return (
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Nivel máximo alcanzado</span>
          <span className="text-purple-400 font-bold">👑 Maestro</span>
        </div>
        <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 rounded-full w-full" />
        </div>
      </div>
    );
  }

  const progreso = ((totalRp - nivelActual.min) / (nivelActual.max - nivelActual.min)) * 100;
  const siguienteNivel = niveles.find(n => n.min === nivelActual.max);

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{nivelActual.nombre}</span>
        <span>{totalRp} / {nivelActual.max} RP → {siguienteNivel?.nombre}</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, progreso)}%` }}
        />
      </div>
    </div>
  );
}

// ─── Tabla de Ranking Global ─────────────────────────────────────────────────

function RankingTable({ entries, loading, currentUserId, showSimulacros }: {
  entries: RankingEntry[];
  loading: boolean;
  currentUserId?: string;
  showSimulacros?: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-neutral-800 rounded-2xl border border-neutral-border overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="px-6 py-4 border-b border-neutral-border animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-8 h-6 bg-neutral-700 rounded" />
              <div className="w-8 h-8 bg-neutral-700 rounded-full" />
              <div className="h-4 w-32 bg-neutral-700 rounded" />
              <div className="ml-auto h-4 w-16 bg-neutral-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border text-center">
        <p className="text-gray-400 text-sm">Aún no hay datos de ranking. ¡Sé el primero!</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-2xl border border-neutral-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 border-b border-neutral-border grid grid-cols-12 gap-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-1">#</div>
        <div className="col-span-5">Postulante</div>
        <div className="col-span-2 text-right">Simulacros</div>
        <div className="col-span-2 text-right">Acierto</div>
        <div className="col-span-2 text-right">RP</div>
      </div>

      {/* Rows */}
      {entries.map((entry) => {
        const esUsuario = entry.userId === currentUserId;
        const nivelColor = getNivelColorClass(entry.nivel.color);

        return (
          <div
            key={entry.userId}
            className={`px-6 py-3.5 border-b border-neutral-border/50 grid grid-cols-12 gap-4 items-center transition-colors ${
              esUsuario ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-neutral-700/30'
            }`}
          >
            {/* Posición */}
            <div className="col-span-1">
              <span className={`font-mono text-sm font-bold ${getPosicionColor(entry.posicion)}`}>
                {entry.posicion}
              </span>
            </div>

            {/* Nombre + Nivel */}
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-gray-300">
                {entry.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className={`text-sm font-medium ${esUsuario ? 'text-primary' : 'text-white'}`}>
                  {entry.nombre} {esUsuario && <span className="text-xs text-primary/70">(Tú)</span>}
                </p>
                <span className={`text-[10px] font-bold ${nivelColor}`}>
                  {entry.nivel.nombre}
                </span>
              </div>
            </div>

            {/* Simulacros */}
            {showSimulacros && (
              <div className="col-span-2 text-right">
                <span className="font-mono text-sm text-gray-300">
                  {entry.simulacrosCompletados ?? 0}
                </span>
              </div>
            )}

            {/* Acierto */}
            <div className="col-span-2 text-right">
              <span className="font-mono text-sm text-gray-300">
                {entry.porcentajeAcierto}%
              </span>
            </div>

            {/* RP */}
            <div className="col-span-2 text-right">
              <span className="font-mono text-sm font-bold text-primary">
                {entry.totalRp.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tabla de Ranking Semanal ────────────────────────────────────────────────

function WeeklyRankingTable({ entries, loading, currentUserId }: {
  entries: ReturnType<typeof useWeeklyRanking>['data'];
  loading: boolean;
  currentUserId?: string;
}) {
  if (loading) {
    return (
      <div className="bg-neutral-800 rounded-2xl border border-neutral-border overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="px-6 py-4 border-b border-neutral-border animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-8 h-6 bg-neutral-700 rounded" />
              <div className="w-8 h-8 bg-neutral-700 rounded-full" />
              <div className="h-4 w-32 bg-neutral-700 rounded" />
              <div className="ml-auto h-4 w-16 bg-neutral-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border text-center">
        <p className="text-gray-400 text-sm">No hay actividad esta semana. ¡Completa un simulacro!</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-2xl border border-neutral-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 border-b border-neutral-border grid grid-cols-12 gap-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-1">#</div>
        <div className="col-span-7">Postulante</div>
        <div className="col-span-4 text-right">RP esta semana</div>
      </div>

      {/* Rows */}
      {entries.map((entry) => {
        const esUsuario = entry.userId === currentUserId;

        return (
          <div
            key={entry.userId}
            className={`px-6 py-3.5 border-b border-neutral-border/50 grid grid-cols-12 gap-4 items-center transition-colors ${
              esUsuario ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-neutral-700/30'
            }`}
          >
            {/* Posición */}
            <div className="col-span-1">
              <span className={`font-mono text-sm font-bold ${getPosicionColor(entry.posicion)}`}>
                {entry.posicion}
              </span>
            </div>

            {/* Nombre */}
            <div className="col-span-7 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-gray-300">
                {entry.nombre.charAt(0).toUpperCase()}
              </div>
              <p className={`text-sm font-medium ${esUsuario ? 'text-primary' : 'text-white'}`}>
                {entry.nombre} {esUsuario && <span className="text-xs text-primary/70">(Tú)</span>}
              </p>
            </div>

            {/* RP Semanal */}
            <div className="col-span-4 text-right">
              <span className="font-mono text-sm font-bold text-primary">
                +{entry.rpSemanales.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

function getNivelColorClass(color: string): string {
  const map: Record<string, string> = {
    purple:  'text-purple-400',
    warning: 'text-warning',
    primary: 'text-primary',
    success: 'text-success',
    info:    'text-info',
    muted:   'text-gray-500',
  };
  return map[color] || 'text-gray-400';
}

function getPosicionColor(posicion: number): string {
  if (posicion === 1) return 'text-yellow-400';
  if (posicion === 2) return 'text-gray-300';
  if (posicion === 3) return 'text-amber-600';
  return 'text-gray-500';
}
