export default function SimulacrosLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-9 w-40 bg-neutral-800 rounded-lg" />
        <div className="h-4 w-72 bg-neutral-800 rounded mt-3" />
      </div>

      {/* University Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border">
            {/* Icon + badge row */}
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-xl bg-neutral-700" />
              <div className="h-6 w-24 bg-neutral-700 rounded-full" />
            </div>
            {/* Title */}
            <div className="h-6 w-20 bg-neutral-700 rounded mb-2" />
            {/* Subtitle */}
            <div className="h-4 w-52 bg-neutral-700 rounded mb-4" />
            {/* Description */}
            <div className="h-4 w-64 bg-neutral-700/60 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
