'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AREA_CONFIG, ExamArea, ExamMeta } from '@/types/simulacro';
import { getExamsByArea } from '@/data/exams';

const areas: ExamArea[] = ['biomedicas', 'ingenierias', 'sociales'];

export default function UNSAPage() {
  const [examsByArea, setExamsByArea] = useState<Record<string, ExamMeta[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      const entries = await Promise.all(
        areas.map(async (area) => [area, await getExamsByArea('UNSA', area)] as const),
      );
      if (!cancelled) {
        setExamsByArea(Object.fromEntries(entries));
        setLoading(false);
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neutral-700 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 font-mono text-sm">Cargando áreas...</p>
        </div>
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
        <span className="text-primary font-medium">UNSA</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">UNSA</h1>
        <p className="text-gray-400 mt-2">Selecciona tu área de postulación</p>
      </div>

      {/* Area Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {areas.map((area) => {
          const config = AREA_CONFIG[area];
          const exams = examsByArea[area] || [];

          return (
            <Link href={`/simulacros/UNSA/${area}`} key={area}>
              <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border hover:border-opacity-60 transition-all duration-300 cursor-pointer group h-full"
                   style={{ ['--area-color' as string]: config.color }}>
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${config.color}15` }}
                >
                  {config.icon}
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors duration-200">
                  {config.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{config.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-border/50">
                  <span className="font-mono text-xs text-gray-400">
                    {exams.length} {exams.length === 1 ? 'examen' : 'exámenes'}
                  </span>
                  <div
                    className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: config.color }}
                  >
                    Ver
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Materias info */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <h3 className="text-white font-bold mb-4">Materias por área</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {areas.map((area) => {
            const config = AREA_CONFIG[area];
            return (
              <div key={area}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: config.color }}>
                  {config.name}
                </h4>
                <ul className="space-y-1">
                  {config.materias.map((materia) => (
                    <li key={materia} className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
                      {materia}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
