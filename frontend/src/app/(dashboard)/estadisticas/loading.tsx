// frontend/src/app/(dashboard)/estadisticas/loading.tsx
export default function EstadisticasLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-44 bg-neutral-800 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-neutral-800 rounded" />
      </div>

      {/* Evolución Skeleton */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 w-48 bg-neutral-700 rounded mb-2" />
            <div className="h-3 w-56 bg-neutral-700 rounded" />
          </div>
          <div className="flex gap-1 bg-neutral-900 rounded-lg p-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-10 bg-neutral-700 rounded-md" />
            ))}
          </div>
        </div>
        <div className="h-64 bg-neutral-900 rounded-xl" />
      </div>

      {/* Two columns skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fortalezas */}
        <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
          <div className="h-5 w-44 bg-neutral-700 rounded mb-2" />
          <div className="h-3 w-52 bg-neutral-700 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <div className="h-3 w-20 bg-neutral-700 rounded" />
                  <div className="h-3 w-10 bg-neutral-700 rounded" />
                </div>
                <div className="h-2 w-full bg-neutral-900 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Por día */}
        <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
          <div className="h-5 w-44 bg-neutral-700 rounded mb-2" />
          <div className="h-3 w-48 bg-neutral-700 rounded mb-6" />
          <div className="h-48 bg-neutral-900 rounded-xl" />
        </div>
      </div>

      {/* Actividad skeleton */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <div className="h-5 w-44 bg-neutral-700 rounded mb-4" />
        <div className="flex gap-1">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              {[...Array(7)].map((_, j) => (
                <div key={j} className="w-4 h-4 bg-neutral-700 rounded-sm" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Errores skeleton */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <div className="h-5 w-44 bg-neutral-700 rounded mb-6" />
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-neutral-900 rounded-xl" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-20 bg-neutral-700 rounded" />
              <div className="flex-1 h-2 bg-neutral-900 rounded-full" />
              <div className="h-3 w-16 bg-neutral-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Comparativo skeleton */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <div className="h-5 w-44 bg-neutral-700 rounded mb-6" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-neutral-700 rounded mb-2" />
              <div className="h-3 w-full bg-neutral-900 rounded-full mb-1.5" />
              <div className="h-3 w-full bg-neutral-900 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
