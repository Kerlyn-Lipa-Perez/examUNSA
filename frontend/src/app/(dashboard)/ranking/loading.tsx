// frontend/src/app/(dashboard)/ranking/loading.tsx
export default function RankingLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-40 bg-neutral-800 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-neutral-800 rounded" />
      </div>

      {/* Tu Posición Skeleton */}
      <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="h-3 w-16 bg-neutral-700 rounded mb-2 mx-auto" />
              <div className="h-12 w-16 bg-neutral-700 rounded" />
            </div>
            <div className="hidden md:block w-px h-16 bg-neutral-700" />
            <div className="space-y-2">
              <div className="h-4 w-28 bg-neutral-700 rounded" />
              <div className="h-3 w-48 bg-neutral-700 rounded" />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="h-6 w-10 bg-neutral-700 rounded mb-1 mx-auto" />
              <div className="h-2 w-12 bg-neutral-700 rounded mx-auto" />
            </div>
            <div className="text-center">
              <div className="h-6 w-6 bg-neutral-700 rounded mb-1 mx-auto" />
              <div className="h-2 w-16 bg-neutral-700 rounded mx-auto" />
            </div>
            <div className="text-center">
              <div className="h-6 w-10 bg-neutral-700 rounded mb-1 mx-auto" />
              <div className="h-2 w-14 bg-neutral-700 rounded mx-auto" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <div className="h-2 w-20 bg-neutral-700 rounded" />
            <div className="h-2 w-32 bg-neutral-700 rounded" />
          </div>
          <div className="h-1.5 w-full bg-neutral-900 rounded-full" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-1 bg-neutral-800 rounded-xl p-1 w-fit">
        <div className="h-8 w-20 bg-neutral-700 rounded-lg" />
        <div className="h-8 w-28 bg-neutral-700 rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-neutral-800 rounded-2xl border border-neutral-border overflow-hidden">
        {/* Header */}
        <div className="px-6 py-3 border-b border-neutral-border grid grid-cols-12 gap-4">
          <div className="col-span-1 h-3 bg-neutral-700 rounded" />
          <div className="col-span-5 h-3 bg-neutral-700 rounded" />
          <div className="col-span-2 h-3 bg-neutral-700 rounded ml-auto" />
          <div className="col-span-2 h-3 bg-neutral-700 rounded ml-auto" />
          <div className="col-span-2 h-3 bg-neutral-700 rounded ml-auto" />
        </div>
        {/* Rows */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="px-6 py-3.5 border-b border-neutral-border/50 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1">
              <div className="h-4 w-6 bg-neutral-700 rounded" />
            </div>
            <div className="col-span-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-700" />
              <div className="space-y-1">
                <div className="h-3 w-28 bg-neutral-700 rounded" />
                <div className="h-2 w-16 bg-neutral-700 rounded" />
              </div>
            </div>
            <div className="col-span-2">
              <div className="h-3 w-8 bg-neutral-700 rounded ml-auto" />
            </div>
            <div className="col-span-2">
              <div className="h-3 w-10 bg-neutral-700 rounded ml-auto" />
            </div>
            <div className="col-span-2">
              <div className="h-4 w-14 bg-neutral-700 rounded ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
