// frontend/src/app/(dashboard)/estadisticas/EstadisticasClient.tsx
'use client';

import { useState } from 'react';
import {
  useEvolucion, useFortalezas, useActividad,
  usePorDia, useErrores, useComparativo,
  EvolucionPunto, FortalezaMateria, ActividadDia,
} from '@/hooks/useEstadisticas';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend,
} from 'recharts';

// Colores del design system para materias
const MATERIA_COLORS: Record<string, string> = {
  aptitud: '#3B82F6',
  matematica: '#3B82F6',
  'ciencias-sociales': '#EF4444',
  'ciencia-tecnologia': '#10B981',
  'persona-familia': '#D4A017',
  comunicacion: '#D4A017',
  ingles: '#8B5CF6',
};

const MATERIA_LABELS: Record<string, string> = {
  aptitud: 'Aptitud',
  matematica: 'Matemática',
  'ciencias-sociales': 'Sociales',
  'ciencia-tecnologia': 'CyT',
  'persona-familia': 'Persona',
  comunicacion: 'Comunicación',
  ingles: 'Inglés',
};

export function EstadisticasClient() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Estadísticas</h1>
        <p className="text-gray-400 mt-1">Análisis detallado de tu rendimiento</p>
      </div>

      {/* Sección 1: Evolución */}
      <SeccionEvolucion />

      {/* Sección 2 + 3: Fortalezas y Actividad lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeccionFortalezas />
        <SeccionPorDia />
      </div>

      {/* Sección 4: Mapa de actividad */}
      <SeccionActividad />

      {/* Sección 5: Análisis de errores */}
      <SeccionErrores />

      {/* Sección 6: Comparativo */}
      <SeccionComparativo />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECCIÓN 1: EVOLUCIÓN DE PUNTAJE
// ═══════════════════════════════════════════════════════════════════════════

function SeccionEvolucion() {
  const [dias, setDias] = useState(30);
  const { data, isLoading } = useEvolucion(dias);

  return (
    <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">📈 Evolución de Puntaje</h2>
          <p className="text-sm text-gray-400 mt-1">Tu progreso porcentaje a lo largo del tiempo</p>
        </div>
        <div className="flex gap-1 bg-neutral-900 rounded-lg p-1">
          {[14, 30, 60, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDias(d)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dias === d ? 'bg-primary text-neutral-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 bg-neutral-900 rounded-xl animate-pulse" />
      ) : !data || data.puntos.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
          Completa simulacros para ver tu evolución
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.puntos} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis
                dataKey="fecha"
                tick={{ fill: '#8B949E', fontSize: 11 }}
                tickFormatter={(v) => v.slice(5)}
                stroke="#30363D"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#8B949E', fontSize: 11 }}
                stroke="#30363D"
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161B22',
                  border: '1px solid #30363D',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: any, name: any) => {
                  if (name === 'promedioMovil') return [`${value}%`, 'Promedio móvil'];
                  return [`${value}%`, 'Puntaje'];
                }}
              />
              <Line
                type="monotone"
                dataKey="porcentaje"
                stroke="#D4A017"
                strokeWidth={2}
                dot={{ fill: '#D4A017', r: 3 }}
                activeDot={{ r: 5, fill: '#D4A017' }}
                name="Puntaje"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECCIÓN 2: FORTALEZAS POR MATERIA
// ═══════════════════════════════════════════════════════════════════════════

function SeccionFortalezas() {
  const { data, isLoading } = useFortalezas();

  return (
    <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
      <h2 className="text-lg font-bold text-white mb-1">🎯 Fortalezas por Materia</h2>
      <p className="text-xs text-gray-400 mb-4">Promedio de acierto en cada área</p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between mb-1">
                <div className="h-3 w-20 bg-neutral-700 rounded" />
                <div className="h-3 w-10 bg-neutral-700 rounded" />
              </div>
              <div className="h-2 w-full bg-neutral-900 rounded-full" />
            </div>
          ))}
        </div>
      ) : !data || data.materias.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">Sin datos suficientes</p>
      ) : (
        <div className="space-y-3">
          {data.materias.map((m) => (
            <div key={m.materia}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-300">
                    {MATERIA_LABELS[m.materia] || m.materia}
                  </span>
                  {m.tendencia === 'subiendo' && <span className="text-[10px] text-success">↑</span>}
                  {m.tendencia === 'bajando' && <span className="text-[10px] text-error">↓</span>}
                </div>
                <span className="font-mono text-xs font-bold" style={{ color: getBarColor(m.promedio) }}>
                  {m.promedio}%
                </span>
              </div>
              <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${m.promedio}%`,
                    backgroundColor: getBarColor(m.promedio),
                  }}
                />
              </div>
              <span className="text-[10px] text-gray-600">{m.totalSimulacros} simulacros</span>
            </div>
          ))}

          {data.recomendacion && (
            <div className="mt-4 p-3 bg-neutral-900 rounded-lg border border-neutral-border">
              <p className="text-xs text-gray-300">💡 {data.recomendacion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECCIÓN 3: RENDIMIENTO POR DÍA DE SEMANA
// ═══════════════════════════════════════════════════════════════════════════

function SeccionPorDia() {
  const { data, isLoading } = usePorDia();

  const DIAS_LABELS: Record<string, string> = {
    lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue',
    vie: 'Vie', sab: 'Sáb', dom: 'Dom',
  };

  return (
    <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
      <h2 className="text-lg font-bold text-white mb-1">📅 Rendimiento por Día</h2>
      <p className="text-xs text-gray-400 mb-4">En qué días rindes mejor</p>

      {isLoading ? (
        <div className="h-48 bg-neutral-900 rounded-xl animate-pulse" />
      ) : !data || data.dias.every((d) => d.cantidad === 0) ? (
        <p className="text-gray-500 text-sm text-center py-8">Sin datos suficientes</p>
      ) : (
        <>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dias} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
                <XAxis
                  dataKey="dia"
                  tick={{ fill: '#8B949E', fontSize: 11 }}
                  stroke="#30363D"
                  tickFormatter={(v) => DIAS_LABELS[v] || v}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#8B949E', fontSize: 11 }}
                  stroke="#30363D"
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161B22',
                    border: '1px solid #30363D',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, _name: any, props: any) => [
                    `${value}% (${props.payload.cantidad} simulacros)`,
                    'Promedio',
                  ]}
                />
                <Bar dataKey="promedio" radius={[4, 4, 0, 0]}>
                  {data.dias.map((entry, index) => (
                    <Cell key={index} fill={getBarColor(entry.promedio)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {(data.mejorDia || data.peorDia) && (
            <div className="flex justify-between mt-3 text-xs text-gray-400">
              {data.mejorDia && <span>🏆 Mejor: <span className="text-success font-medium">{DIAS_LABELS[data.mejorDia]}</span></span>}
              {data.peorDia && <span>⚠️ Peor: <span className="text-error font-medium">{DIAS_LABELS[data.peorDia]}</span></span>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECCIÓN 4: MAPA DE ACTIVIDAD (HEATMAP)
// ═══════════════════════════════════════════════════════════════════════════

function SeccionActividad() {
  const { data, isLoading } = useActividad(12);

  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <h2 className="text-lg font-bold text-white mb-4">📅 Mapa de Actividad</h2>
        <div className="h-32 bg-neutral-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data || data.dias.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <h2 className="text-lg font-bold text-white mb-4">📅 Mapa de Actividad</h2>
        <p className="text-gray-500 text-sm text-center py-4">Sin actividad registrada</p>
      </div>
    );
  }

  // Organizar en semanas para el heatmap
  const semanas: ActividadDia[][] = [];
  let semanaActual: ActividadDia[] = [];

  // Rellenar días faltantes al inicio para alinear con lunes
  const primerDia = new Date(data.dias[0].fecha);
  const diaSemanaPrimer = primerDia.getDay();
  const offsetInicio = diaSemanaPrimer === 0 ? 6 : diaSemanaPrimer - 1; // Lunes = 0

  for (let i = 0; i < offsetInicio; i++) {
    semanaActual.push({ fecha: '', simulacros: -1, flashcards: -1 });
  }

  for (const dia of data.dias) {
    semanaActual.push(dia);
    if (semanaActual.length === 7) {
      semanas.push(semanaActual);
      semanaActual = [];
    }
  }
  if (semanaActual.length > 0) semanas.push(semanaActual);

  const DIAS_CORTOS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">📅 Mapa de Actividad</h2>
          <p className="text-xs text-gray-400 mt-1">Últimas 12 semanas</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span>{data.diasActivos} días activos de {data.diasTotales}</span>
          <span className="font-bold text-primary">{data.porcentajeConsistencia}%</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {/* Labels de días */}
          <div className="flex flex-col gap-1 mr-1">
            {DIAS_CORTOS.map((d) => (
              <div key={d} className="w-4 h-4 flex items-center justify-center">
                <span className="text-[9px] text-gray-600">{d}</span>
              </div>
            ))}
          </div>

          {/* Grid de semanas */}
          {semanas.map((semana, si) => (
            <div key={si} className="flex flex-col gap-1">
              {semana.map((dia, di) => (
                <div
                  key={di}
                  className={`w-4 h-4 rounded-sm ${getHeatmapColor(dia.simulacros)}`}
                  title={dia.fecha !== '' ? `${dia.fecha}: ${dia.simulacros} simulacros` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-gray-500">
        <span>Menos</span>
        <div className="w-3 h-3 rounded-sm bg-neutral-700" />
        <div className="w-3 h-3 rounded-sm bg-success/20" />
        <div className="w-3 h-3 rounded-sm bg-success/40" />
        <div className="w-3 h-3 rounded-sm bg-success/70" />
        <div className="w-3 h-3 rounded-sm bg-success" />
        <span>Más</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECCIÓN 5: ANÁLISIS DE ERRORES (con IA para Pro)
// ═══════════════════════════════════════════════════════════════════════════

function SeccionErrores() {
  const { data, isLoading } = useErrores();

  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <h2 className="text-lg font-bold text-white mb-4">🔍 Análisis de Errores</h2>
        <div className="h-48 bg-neutral-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data) return null;

  const total = data.totalCorrectas + data.totalIncorrectas + data.totalSinResponder;
  if (total === 0) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <h2 className="text-lg font-bold text-white mb-4">🔍 Análisis de Errores</h2>
        <p className="text-gray-500 text-sm text-center py-4">Completa simulacros para ver tu análisis</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
      <h2 className="text-lg font-bold text-white mb-6">🔍 Análisis de Errores</h2>

      {/* Resumen numérico */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-neutral-900 rounded-xl">
          <p className="font-mono text-2xl font-bold text-success">{data.totalCorrectas}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Correctas</p>
        </div>
        <div className="text-center p-4 bg-neutral-900 rounded-xl">
          <p className="font-mono text-2xl font-bold text-error">{data.totalIncorrectas}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Incorrectas</p>
        </div>
        <div className="text-center p-4 bg-neutral-900 rounded-xl">
          <p className="font-mono text-2xl font-bold text-gray-400">{data.totalSinResponder}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Sin responder</p>
        </div>
      </div>

      {/* Errores por materia */}
      {data.erroresPorMateria.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Errores por materia</h3>
          <div className="space-y-2">
            {data.erroresPorMateria.map((e) => (
              <div key={e.materia} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-24 truncate">
                  {MATERIA_LABELS[e.materia] || e.materia}
                </span>
                <div className="flex-1 h-2 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-error/60 rounded-full"
                    style={{ width: `${e.porcentaje}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-gray-400 w-16 text-right">
                  {e.errores} ({e.porcentaje}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Análisis IA (solo Pro) */}
      {data.esPro ? (
        data.analisisIA ? (
          <div className="border-t border-neutral-border pt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm">🤖</span>
              <h3 className="text-sm font-bold text-white">Análisis Inteligente</h3>
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">PRO</span>
            </div>

            <p className="text-sm text-gray-300 mb-4">{data.analisisIA.resumen}</p>

            {data.analisisIA.problemas?.length > 0 && (
              <div className="space-y-3 mb-4">
                {data.analisisIA.problemas.map((p, i) => (
                  <div key={i} className="p-3 bg-neutral-900 rounded-lg border border-neutral-border">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-white">
                        {MATERIA_LABELS[p.materia] || p.materia}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        p.impacto === 'alto' ? 'bg-error/10 text-error' :
                        p.impacto === 'medio' ? 'bg-warning/10 text-warning' :
                        'bg-info/10 text-info'
                      }`}>
                        {p.impacto}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{p.descripcion}</p>
                    <p className="text-xs text-primary">→ {p.recomendacion}</p>
                  </div>
                ))}
              </div>
            )}

            {data.analisisIA.planAccion && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-primary font-medium">
                  🎯 Plan de acción: {data.analisisIA.planAccion}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="border-t border-neutral-border pt-6 text-center">
            <p className="text-sm text-gray-400">Generando análisis...</p>
          </div>
        )
      ) : (
        <div className="border-t border-neutral-border pt-6">
          <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-border text-center">
            <p className="text-sm text-gray-400 mb-2">
              🔒 Desbloquea el análisis inteligente de errores con IA
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Identifica tus patrones de error y recibe recomendaciones personalizadas
            </p>
            <a
              href="/checkout"
              className="inline-block px-4 py-2 bg-primary text-neutral-900 text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Mejorar a Pro
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECCIÓN 6: COMPARATIVO GLOBAL
// ═══════════════════════════════════════════════════════════════════════════

function SeccionComparativo() {
  const { data, isLoading } = useComparativo();

  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <h2 className="text-lg font-bold text-white mb-4">📊 Comparativo Global</h2>
        <div className="h-32 bg-neutral-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!data || data.global.totalUsuarios < 2) {
    return (
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <h2 className="text-lg font-bold text-white mb-4">📊 Comparativo Global</h2>
        <p className="text-gray-500 text-sm text-center py-4">Necesitamos más postulantes para comparar</p>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Acierto',
      usuario: `${data.usuario.porcentajeAcierto}%`,
      global: `${data.global.promedioAcierto}%`,
      usuarioVal: data.usuario.porcentajeAcierto,
      globalVal: data.global.promedioAcierto,
    },
    {
      label: 'Racha',
      usuario: `${data.usuario.racha} días`,
      global: `${data.global.promedioRacha} días`,
      usuarioVal: data.usuario.racha,
      globalVal: data.global.promedioRacha,
    },
    {
      label: 'Simulacros',
      usuario: String(data.usuario.simulacrosCompletados),
      global: String(data.global.promedioSimulacros),
      usuarioVal: data.usuario.simulacrosCompletados,
      globalVal: data.global.promedioSimulacros,
    },
  ];

  return (
    <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
      <h2 className="text-lg font-bold text-white mb-1">📊 Comparativo Global</h2>
      <p className="text-xs text-gray-400 mb-6">Tú vs. el promedio de {data.global.totalUsuarios} postulantes</p>

      <div className="space-y-6">
        {metrics.map((m) => {
          const maxVal = Math.max(m.usuarioVal, m.globalVal, 1);
          return (
            <div key={m.label}>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>{m.label}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-500 w-12">Tú</span>
                  <div className="flex-1 h-3 bg-neutral-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(m.usuarioVal / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-primary w-16 text-right">{m.usuario}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-500 w-12">Prom.</span>
                  <div className="flex-1 h-3 bg-neutral-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-600 rounded-full"
                      style={{ width: `${(m.globalVal / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-gray-400 w-16 text-right">{m.global}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Posición en ranking */}
      <div className="mt-6 p-4 bg-neutral-900 rounded-xl text-center">
        <span className="text-xs text-gray-500">Tu posición: </span>
        <span className="font-mono text-lg font-bold text-primary">
          #{Math.max(1, data.global.totalUsuarios - Math.floor(data.usuario.totalRp / 50))}
        </span>
        <span className="text-xs text-gray-500"> de {data.global.totalUsuarios} postulantes</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════

function getBarColor(value: number): string {
  if (value >= 70) return '#10B981'; // success
  if (value >= 50) return '#D4A017'; // warning
  return '#EF4444'; // error
}

function getHeatmapColor(simulacros: number): string {
  if (simulacros < 0) return 'bg-transparent'; // padding
  if (simulacros === 0) return 'bg-neutral-700/50';
  if (simulacros === 1) return 'bg-success/20';
  if (simulacros === 2) return 'bg-success/40';
  if (simulacros <= 4) return 'bg-success/70';
  return 'bg-success';
}
