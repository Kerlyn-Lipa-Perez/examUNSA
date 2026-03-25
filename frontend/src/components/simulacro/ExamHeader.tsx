'use client';

import { useExamStore } from '@/store/examStore';
import { useEffect, useState } from 'react';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function ExamHeader() {
  const {
    examData,
    currentQuestionIndex,
    tiempoRestanteSegundos,
    tick,
    timerActive,
  } = useExamStore();

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [timerActive, tick]);

  if (!examData) return null;

  const currentQuestion = examData.preguntas[currentQuestionIndex];
  const totalPreguntas = examData.preguntas.length;
  const progress = ((currentQuestionIndex + 1) / totalPreguntas) * 100;

  // Determine time urgency for color
  const isUrgent = tiempoRestanteSegundos < 60;
  const isWarning = tiempoRestanteSegundos < 300 && !isUrgent;

  return (
    <header className="w-full bg-neutral-900 border-b border-neutral-border px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Left: Subject + question counter */}
        <div className="flex items-center gap-4 min-w-0">
          <span className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase truncate">
            {currentQuestion?.materia}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm">·</span>
          <span className="font-mono text-xs sm:text-sm text-gray-400">
            Pregunta <span className="text-white font-bold">{currentQuestionIndex + 1}</span> de{' '}
            <span className="text-white">{totalPreguntas}</span>
          </span>
        </div>

        {/* Right: Timer + streak */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`flex items-center gap-2 font-mono text-sm px-3 py-1.5 rounded-lg border ${
              isUrgent
                ? 'text-error border-error/30 bg-error/10'
                : isWarning
                ? 'text-primary border-primary/30 bg-primary/10'
                : 'text-gray-300 border-neutral-border bg-neutral-800'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(tiempoRestanteSegundos)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 max-w-5xl mx-auto">
        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-tertiary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}
