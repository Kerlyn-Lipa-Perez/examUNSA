export default function UNSALoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 bg-neutral-800 rounded" />
        <div className="h-4 w-4 bg-neutral-800 rounded" />
        <div className="h-4 w-12 bg-neutral-700 rounded" />
      </div>

      {/* Header Skeleton */}
      <div>
        <div className="h-9 w-24 bg-neutral-800 rounded-lg" />
        <div className="h-4 w-56 bg-neutral-800 rounded mt-3" />
      </div>

      {/* Area Cards Skeleton — 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border flex flex-col">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-neutral-700 mb-4" />
            {/* Title */}
            <div className="h-5 w-28 bg-neutral-700 rounded mb-2" />
            {/* Description lines */}
            <div className="space-y-2 flex-1 mb-4">
              <div className="h-3 w-full bg-neutral-700/60 rounded" />
              <div className="h-3 w-4/5 bg-neutral-700/60 rounded" />
            </div>
            {/* Footer row */}
            <div className="pt-4 border-t border-neutral-border/50 flex items-center justify-between">
              <div className="h-3 w-20 bg-neutral-700 rounded" />
              <div className="h-3 w-8 bg-neutral-700 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Materias por área Skeleton */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <div className="h-5 w-36 bg-neutral-700 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, col) => (
            <div key={col} className="space-y-3">
              <div className="h-4 w-24 bg-neutral-700 rounded" />
              {[...Array(5)].map((_, row) => (
                <div key={row} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700 flex-shrink-0" />
                  <div className="h-3 bg-neutral-700/60 rounded" style={{ width: `${[60, 75, 50, 80, 65][row]}%` }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
