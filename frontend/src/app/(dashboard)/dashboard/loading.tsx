export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-9 w-64 bg-neutral-800 rounded-lg" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-neutral-800 p-6 rounded-2xl border border-neutral-border">
            <div className="h-3 w-28 bg-neutral-700 rounded mb-4" />
            <div className="h-10 w-20 bg-neutral-700 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Flashcards Skeleton */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-52 bg-neutral-800 rounded" />
              <div className="h-4 w-16 bg-neutral-800 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-neutral-800 rounded-xl p-5 border-l-4 border-l-neutral-700 border-y border-r border-neutral-border h-40 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-4 w-16 bg-neutral-700 rounded" />
                    <div className="h-3 w-12 bg-neutral-700 rounded" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-full bg-neutral-700 rounded" />
                    <div className="h-3 w-4/5 bg-neutral-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Último simulacro Skeleton */}
          <div>
            <div className="h-6 w-40 bg-neutral-800 rounded mb-4" />
            <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-full bg-neutral-700 flex-shrink-0" />
              <div className="flex-1 space-y-4 w-full">
                <div className="h-7 w-48 bg-neutral-700 rounded" />
                <div className="h-4 w-72 bg-neutral-700 rounded" />
                <div className="flex gap-4">
                  <div className="h-8 w-28 bg-neutral-900 rounded border border-neutral-border" />
                  <div className="h-8 w-28 bg-neutral-900 rounded border border-neutral-border" />
                </div>
              </div>
              <div className="h-10 w-32 bg-neutral-700 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Próximo Simulacro Skeleton */}
          <div className="bg-[#1a1608] rounded-2xl p-6 border border-neutral-700/30">
            <div className="flex justify-between items-start mb-6">
              <div className="h-5 w-32 bg-neutral-700 rounded" />
              <div className="w-5 h-5 bg-neutral-700 rounded" />
            </div>
            <div className="mb-6 space-y-2">
              <div className="h-5 w-44 bg-neutral-700 rounded" />
              <div className="h-4 w-28 bg-neutral-700 rounded" />
            </div>
            <div className="bg-neutral-900/50 rounded-lg p-3 flex items-center gap-3 mb-6">
              <div className="w-5 h-5 bg-neutral-700 rounded" />
              <div className="h-4 w-28 bg-neutral-700 rounded" />
            </div>
            <div className="h-10 w-full bg-neutral-700 rounded-lg" />
          </div>

          {/* Progreso por materia Skeleton */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
            <div className="h-5 w-40 bg-neutral-700 rounded mb-6" />
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-3 w-20 bg-neutral-700 rounded" />
                    <div className="h-3 w-8 bg-neutral-700 rounded" />
                  </div>
                  <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-700 rounded-full" style={{ width: `${[78, 62, 45, 92][i]}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <div className="h-4 w-36 bg-neutral-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
