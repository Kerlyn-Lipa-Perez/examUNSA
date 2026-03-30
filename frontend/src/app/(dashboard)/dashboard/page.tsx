'use client';

import { UserGreeting } from '@/components/dashboard/UserGreeting';
import { LastSimulacro } from '@/components/dashboard/LastSimulacro';
import { useUserStats } from '@/hooks/useUserProfile';
import { useGetCardsHoy } from '@/hooks/useFlashcards';
import { MATERIA_LABELS } from '@/types/flashcard';
import { MATERIA_BG_COLORS } from '@/types/perfil';
import Link from 'next/link';

const MAX_SIMULACROS_LIBRES = 5;

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const { data: flashcardsData, isLoading: cardsLoading } = useGetCardsHoy();

  const isLoading = statsLoading || cardsLoading;

  // Flashcards pendientes (máximo 3 para preview)
  const flashcardsPreview = flashcardsData?.cards?.slice(0, 3) ?? [];

  // Progreso por materia desde stats del API
  const progresoMaterias = stats?.progresoPorMateria
    ? Object.entries(stats.progresoPorMateria).map(([materia, data]) => ({
        materia,
        label: MATERIA_LABELS[materia as keyof typeof MATERIA_LABELS] || materia,
        promedio: data.promedio,
        simulacros: data.simulacros,
      }))
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <UserGreeting />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="SIMULACROS HOY"
          value={isLoading ? '...' : String(stats?.simulacrosHoy ?? 0).padStart(2, '0')}
          highlight={`/${MAX_SIMULACROS_LIBRES}`}
          loading={isLoading}
        />
        <StatCard
          title="PUNTAJE PROMEDIO"
          value={isLoading ? '...' : String(stats?.promedioPuntaje ?? 0)}
          highlight="pts"
          textHighlight="text-primary"
          loading={isLoading}
        />
        <StatCard
          title="FLASHCARDS PENDIENTES"
          value={isLoading ? '...' : String(flashcardsData?.total ?? 0)}
          loading={isLoading}
        />
        <StatCard
          title="RACHA"
          value={isLoading ? '...' : String(stats?.diasRacha ?? 0)}
          highlight="🔥"
          textHighlight="text-primary"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Takes 2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Flashcards pendientes */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Flashcards pendientes hoy</h2>
              <Link href="/flashcards/hoy" className="text-sm text-tertiary hover:text-blue-400 font-medium">Ver más</Link>
            </div>
            {cardsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-neutral-800 rounded-xl p-5 border-l-4 border-neutral-700 border-y border-r border-neutral-border h-40 animate-pulse">
                    <div className="h-3 w-16 bg-neutral-700 rounded mb-4" />
                    <div className="h-3 w-full bg-neutral-700 rounded mb-2" />
                    <div className="h-3 w-3/4 bg-neutral-700 rounded" />
                  </div>
                ))}
              </div>
            ) : flashcardsPreview.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {flashcardsPreview.map((card) => (
                  <Flashcard
                    key={card.id}
                    subject={MATERIA_LABELS[card.materia as keyof typeof MATERIA_LABELS] || card.materia}
                    borderClass={getMateriaBorderClass(card.materia)}
                    text={card.pregunta}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-neutral-800 rounded-xl p-8 border border-neutral-border text-center">
                <p className="text-gray-400 text-sm mb-3">No tienes flashcards pendientes</p>
                <Link href="/flashcards/generar" className="text-tertiary hover:text-blue-400 text-sm font-medium">
                  Generar flashcards con IA →
                </Link>
              </div>
            )}
          </div>

          {/* Último simulacro */}
          <LastSimulacro />
        </div>

        {/* Right Column (Takes 1/3 width) */}
        <div className="space-y-8">
          {/* Próximo Simulacro */}
          <div className="bg-[#1a1f2e] rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-white text-xl font-bold leading-snug">Pon a prueba tu nivel</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Inicia el simulacro de tu preferencia y mide tu progreso real frente a otros postulantes.
              </p>
            </div>

            <Link
              href="/simulacros"
              className="w-full bg-primary hover:bg-yellow-500 active:scale-95 text-neutral-900 font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <span>🚀</span>
              Iniciar Simulacro
            </Link>

            <p className="font-mono text-[11px] text-gray-600 tracking-widest uppercase">
              {stats?.simulacrosHoy ?? 0}/{MAX_SIMULACROS_LIBRES} simulacros hoy
            </p>
          </div>

          {/* Progreso por materia */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
            <h3 className="text-white font-bold mb-6">Progreso por materia</h3>
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex justify-between mb-2">
                      <div className="h-3 w-20 bg-neutral-700 rounded" />
                      <div className="h-3 w-8 bg-neutral-700 rounded" />
                    </div>
                    <div className="h-1.5 w-full bg-neutral-900 rounded-full" />
                  </div>
                ))}
              </div>
            ) : progresoMaterias.length > 0 ? (
              <div className="space-y-6">
                {progresoMaterias.map(({ materia, label, promedio }) => (
                  <ProgressBar
                    key={materia}
                    subject={label.toUpperCase()}
                    percent={promedio}
                    colorClass={getMateriaProgressColor(materia)}
                    colorHex={getMateriaProgressHex(materia)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                Aún no hay datos de progreso. ¡Realiza tu primer simulacro!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper Components ──────────────────────────────────────────────────────────

function StatCard({ title, value, highlight, textHighlight = "text-gray-500", loading }: {
  title: string;
  value: string;
  highlight?: string;
  textHighlight?: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-border">
      <h3 className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-4">{title}</h3>
      <div className="flex items-baseline gap-1 font-mono">
        <span className={`text-4xl font-bold ${loading ? 'text-gray-600' : 'text-white'} ${!loading && textHighlight && textHighlight !== 'text-gray-500' ? textHighlight : ''}`}>
          {value}
        </span>
        {highlight && <span className={`text-sm ${textHighlight}`}>{highlight}</span>}
      </div>
    </div>
  );
}

function Flashcard({ subject, borderClass, text }: { subject: string; borderClass: string; text: string }) {
  return (
    <div className={`bg-neutral-800 rounded-xl p-5 border-l-4 ${borderClass} border-y border-r border-neutral-border h-40 flex flex-col`}>
      <div className="flex justify-between items-center mb-4">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getMateriaSubjectColor(subject)}`}>
          {subject}
        </span>
      </div>
      <p className="font-mono text-gray-200 text-sm leading-relaxed line-clamp-3">
        {text}
      </p>
    </div>
  );
}

function ProgressBar({ subject, percent, colorClass, colorHex }: {
  subject: string;
  percent: number;
  colorClass: string;
  colorHex: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-300 tracking-wider">{subject}</span>
        <span className="font-mono text-xs font-medium" style={{ color: colorHex }}>{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

// ─── Utility Functions ───────────────────────────────────────────────────────────

function getMateriaBorderClass(materia: string): string {
  const map: Record<string, string> = {
    biologia: 'border-l-success',
    fisica: 'border-l-info',
    matematicas: 'border-l-info',
    historia: 'border-l-error',
    civica: 'border-l-warning',
    geografia: 'border-l-info',
    economia: 'border-l-warning',
  };
  return map[materia.toLowerCase()] || 'border-l-primary';
}

function getMateriaSubjectColor(materia: string): string {
  const map: Record<string, string> = {
    biologia: 'bg-success/10 text-success',
    fisica: 'bg-info/10 text-info',
    matematicas: 'bg-info/10 text-info',
    historia: 'bg-error/10 text-error',
    civica: 'bg-warning/10 text-warning',
    geografia: 'bg-info/10 text-info',
    economia: 'bg-warning/10 text-warning',
  };
  return map[materia.toLowerCase()] || 'bg-primary/10 text-primary';
}

function getMateriaProgressColor(materia: string): string {
  const map: Record<string, string> = {
    biologia: 'bg-success',
    fisica: 'bg-info',
    matematicas: 'bg-info',
    historia: 'bg-error',
    civica: 'bg-warning',
    geografia: 'bg-info',
    economia: 'bg-warning',
  };
  return map[materia.toLowerCase()] || 'bg-primary';
}

function getMateriaProgressHex(materia: string): string {
  const map: Record<string, string> = {
    biologia: '#10B981',
    fisica: '#3B82F6',
    matematicas: '#3B82F6',
    historia: '#EF4444',
    civica: '#D4A017',
    geografia: '#3B82F6',
    economia: '#D4A017',
  };
  return map[materia.toLowerCase()] || '#D4A017';
}
