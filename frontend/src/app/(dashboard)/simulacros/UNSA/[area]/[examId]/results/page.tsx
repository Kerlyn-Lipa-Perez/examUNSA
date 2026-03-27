'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useExamStore } from '@/store/examStore';
import { AREA_CONFIG, ExamArea, ExamData } from '@/types/simulacro';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { loadExam } from '@/data/exams/loader';

// Types for backend resultado
interface BackendRespuesta {
  preguntaId: number;
  elegida: string | null;
  correcta: string;
}

interface BackendResultado {
  id: string;
  examId: string;
  materia: string;
  puntaje: number;
  totalPreguntas: number;
  tiempoSegundos: number;
  respuestas: BackendRespuesta[];
  createdAt: string;
}

// Reconstructed data shape used by both render paths
interface ResolvedResults {
  examName: string;
  areaName: string;
  totalPreguntas: number;
  tiempoUsado: number;
  score: { correctas: number; incorrectas: number; sinResponder: number };
  resultsByMateria: Record<string, { correctas: number; total: number }>;
  questions: {
    id: number;
    texto: string;
    materia: string;
    respuestaCorrecta: string;
    userAnswer: string | null;
  }[];
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const area = params.area as ExamArea;
  const examId = params.examId as string;
  const resultId = searchParams.get('rid'); // DB result ID from dashboard link
  const config = AREA_CONFIG[area];

  // Zustand store (populated after finishing an exam)
  const { examData, userAnswers, tiempoRestanteSegundos, getScore, resetExam } = useExamStore();

  // State for backend-fetched data
  const [backendResults, setBackendResults] = useState<ResolvedResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasStoreData = !!examData;

  // If no store data and we have a resultId, fetch from backend
  useEffect(() => {
    if (hasStoreData || !resultId) return;

    setLoading(true);
    Promise.all([
      api.get<BackendResultado>(`/simulacros/resultado/${resultId}`),
      loadExam('UNSA', area, examId),
    ])
      .then(([res, examDataLocal]) => {
        const resultado = res.data;

        if (!examDataLocal) {
          // Fallback: render without question text
          const correctas = resultado.puntaje;
          const incorrectas = resultado.totalPreguntas - correctas;

          setBackendResults({
            examName: examId,
            areaName: config?.name || area,
            totalPreguntas: resultado.totalPreguntas,
            tiempoUsado: resultado.tiempoSegundos || 0,
            score: { correctas, incorrectas, sinResponder: 0 },
            resultsByMateria: {},
            questions: resultado.respuestas.map((r) => ({
              id: r.preguntaId,
              texto: `Pregunta ${r.preguntaId}`,
              materia: resultado.materia,
              respuestaCorrecta: r.correcta,
              userAnswer: r.elegida,
            })),
          });
          return;
        }

        // Merge backend respuestas with local exam question data
        const questions = resultado.respuestas.map((r) => {
          const localQ = examDataLocal.preguntas.find((p) => p.id === r.preguntaId);
          return {
            id: r.preguntaId,
            texto: localQ?.texto || `Pregunta ${r.preguntaId}`,
            materia: localQ?.materia || resultado.materia,
            respuestaCorrecta: r.correcta,
            userAnswer: r.elegida,
          };
        });

        let correctas = 0;
        let incorrectas = 0;
        let sinResponder = 0;
        const rByMateria: Record<string, { correctas: number; total: number }> = {};

        questions.forEach((q) => {
          if (!rByMateria[q.materia]) rByMateria[q.materia] = { correctas: 0, total: 0 };
          rByMateria[q.materia].total++;
          if (q.userAnswer === null) {
            sinResponder++;
          } else if (q.userAnswer === q.respuestaCorrecta) {
            correctas++;
            rByMateria[q.materia].correctas++;
          } else {
            incorrectas++;
          }
        });

        setBackendResults({
          examName: examDataLocal.meta.name,
          areaName: config?.name || area,
          totalPreguntas: resultado.totalPreguntas,
          tiempoUsado: resultado.tiempoSegundos || 0,
          score: { correctas, incorrectas, sinResponder },
          resultsByMateria: rByMateria,
          questions,
        });
      })
      .catch((err) => {
        console.error('Error fetching resultado:', err);
        setError('No se pudo cargar el resultado.');
      })
      .finally(() => setLoading(false));
  }, [hasStoreData, resultId, area, examId, config?.name]);

  // If no store data and no resultId, redirect
  useEffect(() => {
    if (!hasStoreData && !resultId) {
      router.push(`/simulacros/UNSA/${area}`);
    }
  }, [hasStoreData, resultId, router, area]);

  // --- Loading state ---
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Cargando resultados…</h1>
        </div>
        <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border animate-pulse">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-40 h-40 rounded-full bg-neutral-700 flex-shrink-0" />
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
      <div className="max-w-3xl mx-auto space-y-8 py-4 text-center">
        <h1 className="text-3xl font-bold text-white">Error</h1>
        <p className="text-gray-400">{error}</p>
        <Link href="/simulacros" className="inline-block bg-primary hover:bg-yellow-500 text-neutral-900 font-bold py-2 px-6 rounded-lg">
          Volver a simulacros
        </Link>
      </div>
    );
  }

  // ─── Resolve data from either source ───────────────────────────────────────
  let resolved: ResolvedResults;

  if (hasStoreData) {
    // From zustand store (just finished an exam)
    const score = getScore();
    const totalPreguntas = examData.preguntas.length;
    const tiempoUsado = examData.meta.tiempoMinutos * 60 - tiempoRestanteSegundos;

    const resultsByMateria: Record<string, { correctas: number; total: number }> = {};
    userAnswers.forEach((answer) => {
      const question = examData.preguntas.find((p) => p.id === answer.preguntaId);
      if (!question) return;
      if (!resultsByMateria[question.materia]) resultsByMateria[question.materia] = { correctas: 0, total: 0 };
      resultsByMateria[question.materia].total++;
      if (answer.respuesta === question.respuestaCorrecta) resultsByMateria[question.materia].correctas++;
    });

    const questions = examData.preguntas.map((q) => {
      const a = userAnswers.find((ua) => ua.preguntaId === q.id);
      return {
        id: q.id,
        texto: q.texto,
        materia: q.materia,
        respuestaCorrecta: q.respuestaCorrecta,
        userAnswer: a?.respuesta ?? null,
      };
    });

    resolved = {
      examName: examData.meta.name,
      areaName: config?.name || area,
      totalPreguntas,
      tiempoUsado,
      score,
      resultsByMateria,
      questions,
    };
  } else if (backendResults) {
    resolved = backendResults;
  } else {
    return null; // Redirecting in useEffect
  }

  // ─── Computed values ───────────────────────────────────────────────────────
  const porcentaje = Math.round((resolved.score.correctas / resolved.totalPreguntas) * 100);
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (porcentaje / 100) * circumference;

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${String(secs).padStart(2, '0')}s`;
  }

  const handleNewExam = () => {
    resetExam();
    router.push(`/simulacros/UNSA/${area}`);
  };

  const handleRetry = () => {
    resetExam();
    router.push(`/simulacros/UNSA/${area}/${examId}`);
  };

// ─── Render ────────────────────────────────────────────────────────────────
return (
  <div className="max-w-3xl mx-auto space-y-8 py-4">
    {/* Header */}
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold text-white">Resultados del examen</h1>
      <p className="text-gray-400">{resolved.examName} — {resolved.areaName}</p>
    </div>

    {/* Score Card */}
    <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Circular Progress */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1E2532" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={porcentaje >= 70 ? '#10B981' : porcentaje >= 50 ? '#D4A017' : '#EF4444'}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="font-mono text-3xl font-bold text-white">{resolved.score.correctas}</span>
            <span className="font-mono text-sm text-gray-500">/{resolved.totalPreguntas}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {porcentaje >= 70 ? '¡Excelente!' : porcentaje >= 50 ? 'Buen intento' : 'Sigue practicando'}
            </h2>
            <p className="text-gray-400 text-sm">
              Obtuviste <span className="font-mono text-white font-bold">{porcentaje}%</span> de aciertos en{' '}
              <span className="font-mono text-white">{formatTime(resolved.tiempoUsado)}</span>
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <span className="font-mono inline-flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 border border-neutral-border">
              <span className="text-success">✓</span> {resolved.score.correctas} Correctas
            </span>
            <span className="font-mono inline-flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 border border-neutral-border">
              <span className="text-error">×</span> {resolved.score.incorrectas} Incorrectas
            </span>
            <span className="font-mono inline-flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 border border-neutral-border">
              <span className="text-gray-500">—</span> {resolved.score.sinResponder} Sin responder
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Desglose por materia */}
    {Object.keys(resolved.resultsByMateria).length > 0 && (
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <h3 className="text-white font-bold mb-6">Desglose por materia</h3>
        <div className="space-y-5">
          {Object.entries(resolved.resultsByMateria).map(([materia, data]) => {
            const percent = Math.round((data.correctas / data.total) * 100);
            const barColor = percent >= 70 ? 'bg-success' : percent >= 50 ? 'bg-primary' : 'bg-error';
            const textColor = percent >= 70 ? '#10B981' : percent >= 50 ? '#D4A017' : '#EF4444';

            return (
              <div key={materia}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300 font-medium">{materia}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: textColor }}>
                    {data.correctas}/{data.total} ({percent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Review questions */}
    <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
      <h3 className="text-white font-bold mb-4">Revisión de preguntas</h3>
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {resolved.questions.map((question, idx) => {
          const isCorrect = question.userAnswer === question.respuestaCorrecta;
          const wasAnswered = question.userAnswer !== null;

          return (
            <div key={question.id} className="p-4 bg-neutral-900 rounded-xl border border-neutral-border/50">
              <div className="flex items-start gap-3">
                <span
                  className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 ${wasAnswered
                      ? isCorrect
                        ? 'bg-success/20 text-success'
                        : 'bg-error/20 text-error'
                      : 'bg-neutral-800 text-gray-500'
                    }`}
                >
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm text-gray-300 mb-2">{question.texto}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {wasAnswered && !isCorrect && (
                      <span className="font-mono px-2 py-1 bg-error/10 text-error rounded border border-error/20">
                        Tu respuesta: {question.userAnswer}
                      </span>
                    )}
                    <span className="font-mono px-2 py-1 bg-success/10 text-success rounded border border-success/20">
                      Correcta: {question.respuestaCorrecta}
                    </span>
                    {!wasAnswered && (
                      <span className="font-mono px-2 py-1 bg-neutral-800 text-gray-500 rounded border border-neutral-border">
                        Sin responder
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Actions */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={handleRetry}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-white font-bold rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reintentar examen
      </button>
      <button
        onClick={handleNewExam}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-yellow-600 text-neutral-900 font-bold rounded-lg transition-colors"
      >
        Elegir otro examen
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
);
}
