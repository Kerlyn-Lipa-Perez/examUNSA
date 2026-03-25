'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AREA_CONFIG, ExamArea } from '@/types/simulacro';
import { UNSA_EXAMS } from '@/data/exams';

export default function AreaExamsPage() {
  const params = useParams();
  const area = params.area as ExamArea;
  const config = AREA_CONFIG[area];
  const exams = UNSA_EXAMS[area] || [];

  if (!config) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Área no encontrada</h1>
        <Link href="/simulacros/UNSA" className="text-primary hover:text-yellow-400 transition-colors">
          ← Volver a áreas
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/simulacros" className="text-gray-500 hover:text-gray-300 transition-colors">
          Simulacros
        </Link>
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/simulacros/UNSA" className="text-gray-500 hover:text-gray-300 transition-colors">
          UNSA
        </Link>
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium" style={{ color: config.color }}>{config.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${config.color}15` }}
        >
          {config.icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{config.name}</h1>
          <p className="text-gray-400 mt-1">{config.description}</p>
        </div>
      </div>

      {/* Exams list */}
      {exams.length === 0 ? (
        <div className="bg-neutral-800 rounded-2xl p-12 border border-neutral-border text-center">
          <p className="text-gray-400 text-lg mb-2">No hay exámenes disponibles aún</p>
          <p className="text-gray-600 text-sm">Los exámenes se añadirán próximamente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {exams.map((exam) => (
            <Link key={exam.id} href={`/simulacros/UNSA/${area}/${exam.id}`}>
              <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors duration-200">
                        {exam.name}
                      </h3>
                      {exam.fase && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{ backgroundColor: `${config.color}15`, color: config.color }}
                        >
                          {exam.fase}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{exam.description}</p>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    {/* Questions count */}
                    <div className="text-center">
                      <p className="font-mono text-lg font-bold text-white">{exam.totalPreguntas}</p>
                      <p className="text-gray-500 text-xs">preguntas</p>
                    </div>

                    {/* Divider */}
                    <div className="h-10 w-px bg-neutral-border" />

                    {/* Time */}
                    <div className="text-center">
                      <p className="font-mono text-lg font-bold text-white">{exam.tiempoMinutos}</p>
                      <p className="text-gray-500 text-xs">minutos</p>
                    </div>

                    {/* Start button */}
                    <button
                      className="bg-primary hover:bg-yellow-600 text-neutral-900 font-bold px-6 py-2.5 rounded-lg transition-all duration-200 transform group-hover:scale-[1.02] text-sm"
                    >
                      Iniciar
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Materias included */}
      <div className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-border/50">
        <h4 className="text-sm font-semibold text-gray-400 mb-3">Materias incluidas en esta área</h4>
        <div className="flex flex-wrap gap-2">
          {config.materias.map((materia) => (
            <span
              key={materia}
              className="text-xs font-mono px-3 py-1.5 rounded-lg border border-neutral-border bg-neutral-800 text-gray-300"
            >
              {materia}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
