export default function AreaExamsLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 bg-neutral-800 rounded" />
        <div className="h-4 w-4 bg-neutral-800 rounded" />
        <div className="h-4 w-12 bg-neutral-800 rounded" />
        <div className="h-4 w-4 bg-neutral-800 rounded" />
        <div className="h-4 w-24 bg-neutral-700 rounded" />
      </div>

      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-neutral-800 flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-8 w-40 bg-neutral-800 rounded-lg" />
          <div className="h-4 w-64 bg-neutral-800 rounded" />
        </div>
      </div>

      {/* Exam Cards Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left: title + description */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-56 bg-neutral-700 rounded" />
                  <div className="h-4 w-16 bg-neutral-700/60 rounded-full" />
                </div>
                <div className="h-3 w-72 bg-neutral-700/50 rounded" />
              </div>

              {/* Right: stats + button */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center space-y-1">
                  <div className="h-5 w-8 bg-neutral-700 rounded mx-auto" />
                  <div className="h-3 w-14 bg-neutral-700/60 rounded" />
                </div>
                <div className="h-10 w-px bg-neutral-border" />
                <div className="text-center space-y-1">
                  <div className="h-5 w-8 bg-neutral-700 rounded mx-auto" />
                  <div className="h-3 w-12 bg-neutral-700/60 rounded" />
                </div>
                <div className="h-9 w-20 bg-neutral-700 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Materias incluidas Skeleton */}
      <div className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-border/50">
        <div className="h-4 w-48 bg-neutral-700 rounded mb-4" />
        <div className="flex flex-wrap gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-7 bg-neutral-700/60 rounded-lg" style={{ width: `${[80, 100, 90, 110, 70, 95, 85][i]}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
