export default function EventsLoading() {
  return (
    <div className="space-y-12">
      {/* Masthead Skeleton */}
      <div className="mb-14 text-center max-w-3xl mx-auto space-y-4">
        <div className="h-6 w-56 mx-auto bg-white/5 rounded-full animate-pulse" />
        <div className="h-12 w-80 sm:w-96 mx-auto bg-white/10 rounded-2xl animate-pulse" />
        <div className="h-5 w-72 sm:w-80 mx-auto bg-white/5 rounded-lg animate-pulse" />
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="h-14 bg-[#090D16] border border-white/10 rounded-2xl animate-pulse" />

      {/* Timeline Skeleton */}
      <div className="relative pt-4">
        {/* Spine */}
        <div className="absolute left-4 sm:left-6 top-3 bottom-6 w-px bg-white/10" />

        {/* Year Pill Skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 sm:w-12 flex justify-center">
            <div className="w-3 h-3 rounded-full bg-white/20 ring-4 ring-[#05070B]" />
          </div>
          <div className="h-8 w-24 rounded-full bg-white/5 border border-white/10 animate-pulse" />
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Cards Skeleton */}
        <div className="space-y-8 pl-8 sm:pl-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[24px] sm:-left-[36px] top-6 w-2.5 h-2.5 rounded-full bg-white/20 ring-4 ring-[#05070B]" />
              <div className="rounded-2xl bg-[#090D16] border border-white/10 overflow-hidden animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-5 min-h-[220px] lg:min-h-full bg-white/5" />
                  <div className="lg:col-span-7 p-6 sm:p-7 space-y-4">
                    <div className="flex gap-2">
                      <div className="h-4 w-20 bg-white/10 rounded-full" />
                      <div className="h-4 w-24 bg-white/10 rounded-full" />
                    </div>
                    <div className="h-6 w-3/4 bg-white/10 rounded" />
                    <div className="h-4 w-1/2 bg-white/5 rounded" />
                    <div className="h-12 w-full bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
