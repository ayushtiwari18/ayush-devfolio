export default function EventsLoading() {
  return (
    <div className="space-y-12">
      {/* Metrics Ribbon Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-[#090D16] border border-white/5 rounded-2xl animate-pulse p-5 space-y-2">
            <div className="w-12 h-7 bg-white/10 rounded" />
            <div className="w-28 h-3 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="h-14 bg-[#090D16] border border-white/5 rounded-2xl animate-pulse" />

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-96 bg-[#090D16] border border-white/5 rounded-2xl animate-pulse overflow-hidden flex flex-col">
            <div className="aspect-[16/10] bg-white/5" />
            <div className="p-6 space-y-4 flex-1">
              <div className="w-24 h-3 bg-white/10 rounded" />
              <div className="w-48 h-5 bg-white/10 rounded" />
              <div className="w-full h-8 bg-white/5 rounded" />
              <div className="w-32 h-4 bg-white/5 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
