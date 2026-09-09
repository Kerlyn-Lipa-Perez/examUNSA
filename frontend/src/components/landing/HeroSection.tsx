'use client';

import type { ComponentType } from 'react';
import { BarChart3, BookOpen, Clock, Flame, GraduationCap, Target } from 'lucide-react';

interface StatCard {
  icon: ComponentType<{ className?: string }>;
  value: string;
  label: string;
  delta: string;
  color: string;
  position: string;
}

const statCards: StatCard[] = [
  {
    icon: Target,
    value: '98.4%',
    label: 'Precisión IA',
    delta: '+12% esta semana',
    color: 'text-primary',
    position: 'top-8 right-full mr-4 xl:mr-6',
  },
  {
    icon: BookOpen,
    value: '10K+',
    label: 'Preguntas',
    delta: 'Curadas para tu ingreso',
    color: 'text-info',
    position: 'top-8 left-full ml-4 xl:ml-6',
  },
  {
    icon: BarChart3,
    value: '+42%',
    label: 'Tu Progreso',
    delta: 'Mejora de puntaje',
    color: 'text-success',
    position: 'bottom-8 right-full mr-4 xl:mr-6',
  },
  {
    icon: Flame,
    value: '21 días',
    label: 'Racha de Estudio',
    delta: '¡Sigue así!',
    color: 'text-warning',
    position: 'bottom-8 left-full ml-4 xl:ml-6',
  },
];

const examOptions = [
  { label: 'A', text: 'Aparato de Golgi', active: false },
  { label: 'B', text: 'Mitocondria', active: true },
  { label: 'C', text: 'Ribosoma', active: false },
  { label: 'D', text: 'Lisosoma', active: false },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-start pt-16 lg:pt-24 lg:pb-32 overflow-hidden">
      {/* Static ambient gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(212,160,23,0.06),transparent)] pointer-events-none" />
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      {/* Decorative curves + dot-nodes */}
      <svg
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        <path d="M0,120 Q360,40 720,140 T1440,100" fill="none" stroke="rgba(212,160,23,0.15)" strokeWidth="1" />
        <path d="M0,680 Q400,760 800,660 T1440,700" fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth="1" />
        <path d="M100,0 Q200,400 120,800" fill="none" stroke="rgba(212,160,23,0.1)" strokeWidth="1" />
        <path d="M1340,0 Q1240,400 1320,800" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="1" />
        <circle cx="360" cy="60" r="3" fill="rgba(212,160,23,0.4)" />
        <circle cx="1080" cy="120" r="3" fill="rgba(59,130,246,0.4)" />
        <circle cx="200" cy="700" r="2.5" fill="rgba(212,160,23,0.35)" />
        <circle cx="1240" cy="650" r="2.5" fill="rgba(59,130,246,0.35)" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Badge + Headline + Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="animate-fade-in-up flex items-center justify-center mb-8" aria-hidden="true">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center shadow-lg shadow-primary/30">
              <GraduationCap className="w-8 h-8 text-neutral-900" />
            </div>
          </div>

          <h1 className="animate-fade-in-up delay-100 text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="block text-white">Mejores Puntajes,</span>
            <span className="block bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
              Un Futuro Más Brillante
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 text-lg text-[#9CA3AF] max-w-lg mx-auto mb-10 leading-relaxed">
            Práctica inteligente. Progreso real. Tu camino a la UNSA empieza aquí.
          </p>
        </div>

        {/* Exam card + desktop stat cards */}
        <div className="animate-fade-in-up delay-300 relative max-w-md sm:max-w-lg lg:max-w-lg xl:max-w-2xl mx-auto mt-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`hidden lg:block absolute ${stat.position} w-48 xl:w-56 z-20 rounded-2xl bg-neutral-800/90 border border-white/5 backdrop-blur-sm p-4`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-xl xl:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs font-semibold text-gray-200 mt-0.5">{stat.label}</div>
              <div className="text-[11px] text-[#8B949E] mt-1">{stat.delta}</div>
            </div>
          ))}

          {/* Main card — exam preview */}
          <div className="w-full bg-neutral-800/90 rounded-2xl border border-white/5 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-sm">
            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-semibold text-white">Simulacro en progreso</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-error/10 border border-error/20">
                <Clock className="w-3.5 h-3.5 text-error" />
                <span className="font-mono text-sm font-bold text-error">24:37</span>
              </div>
            </div>

            {/* Question area */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-md bg-success/10 text-success text-xs font-bold">
                  BIOLOGÍA
                </span>
                <span className="font-mono text-xs text-[#8B949E]">Pregunta 14 de 20</span>
              </div>

              <p className="font-mono text-sm text-gray-100 leading-relaxed mb-6">
                ¿Cuál de los siguientes orgánulos es responsable de la producción de ATP mediante fosforilación
                oxidativa?
              </p>

              <div className="space-y-2.5">
                {examOptions.map((opt) => (
                  <div
                    key={opt.label}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                      opt.active
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-white/5 bg-neutral-700/50 hover:border-white/10'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                        opt.active ? 'bg-primary text-neutral-900' : 'bg-neutral-800 text-[#8B949E]'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-sm text-gray-100">{opt.text}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-gradient-to-r from-primary to-yellow-400 rounded-full" />
                </div>
                <span className="font-mono text-xs font-bold text-primary">70%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/tablet stat cards */}
        <div className="animate-fade-in-up delay-400 grid grid-cols-2 gap-4 mt-8 lg:hidden max-w-md sm:max-w-lg mx-auto">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-neutral-800/90 border border-white/5 backdrop-blur-sm p-4"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs font-semibold text-gray-200 mt-0.5">{stat.label}</div>
              <div className="text-[11px] text-[#8B949E] mt-1">{stat.delta}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative corner taglines — positioned against the full section height so they land near the true viewport corners, not the (shorter) content column */}
      <div className="hidden lg:block absolute top-28 right-6 xl:right-12 z-10 text-right" aria-hidden="true">
        <p className="text-[10px] font-medium text-[#8B949E] uppercase tracking-[0.2em] leading-relaxed">
          La Disciplina
          <br />
          Crea Oportunidades
        </p>
        <span className="inline-block w-6 h-px bg-primary/40 mt-2" />
      </div>

      <div className="hidden lg:block absolute bottom-16 left-6 xl:left-12 z-10" aria-hidden="true">
        <span className="block w-6 h-px bg-primary/40 mb-2" />
        <p className="text-[10px] font-medium text-[#8B949E] uppercase tracking-[0.2em] leading-relaxed">
          Mejores Hábitos de Estudio
          <br />
          Mejor Futuro
        </p>
      </div>

      <div className="hidden lg:block absolute bottom-16 right-6 xl:right-12 z-10 text-right" aria-hidden="true">
        <span className="inline-block w-6 h-px bg-primary/40 mb-2" />
        <p className="text-[10px] font-medium text-[#8B949E] uppercase tracking-[0.2em] leading-relaxed">
          Mismo Esfuerzo
          <br />
          Mejor Versión
        </p>
      </div>

      {/* Bottom strip */}
      <div
        className="hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[10px] font-bold text-[#8B949E] uppercase tracking-[0.3em] whitespace-nowrap"
        aria-hidden="true"
      >
        Practica · Analiza · Mejora · Ingresa
      </div>
    </section>
  );
}
