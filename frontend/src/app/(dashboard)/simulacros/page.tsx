'use client';

import Link from 'next/link';

const universities = [
  {
    id: 'UNSA',
    name: 'UNSA',
    fullName: 'Universidad Nacional de San Agustín',
    description: 'Simulacros de admisión para la UNSA',
    examsCount: 3,
    color: '#D4A017',
  },
  {
    id: 'UCSM',
    name: 'UCSM',
    fullName: 'Universidad Católica de Santa María',
    description: 'Simulacros de admisión para la UCSM',
    examsCount: 0,
    color: '#3B82F6',
    comingSoon: true,
  },
];

export default function SimulacrosPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Simulacros</h1>
        <p className="text-gray-400 mt-2">Elige tu universidad para comenzar un simulacro de examen</p>
      </div>

      {/* University Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {universities.map((uni) => (
          <div key={uni.id} className="relative group">
            {uni.comingSoon ? (
              <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border opacity-60 cursor-not-allowed">
                <div className="flex items-start justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: `${uni.color}15`, color: uni.color }}
                  >
                    {uni.name.charAt(0)}
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-neutral-700 text-gray-400 border border-neutral-border">
                    Próximamente
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{uni.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{uni.fullName}</p>
                <p className="text-gray-600 text-sm">{uni.description}</p>
              </div>
            ) : (
              <Link href={`/simulacros/${uni.id}`}>
                <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border hover:border-primary/30 transition-all duration-300 group-hover:bg-neutral-700/50 cursor-pointer">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${uni.color}15`, color: uni.color }}
                    >
                      {uni.name.charAt(0)}
                    </div>
                    <span className="font-mono text-xs px-3 py-1 rounded-full border border-primary/20 text-primary bg-primary/5">
                      {uni.examsCount} exámenes
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{uni.name}</h2>
                  <p className="text-gray-500 text-sm mb-4">{uni.fullName}</p>
                  <p className="text-gray-400 text-sm">{uni.description}</p>

                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Ver simulacros
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
