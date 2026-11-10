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
      <div className="relative pt-6">
        {/* Spine */}
        <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 top-4 bottom-8 w-px bg-white/10" />

        {/* Year Pill Skeleton */}
        <div className="flex items-center md:justify-center mb-10 pl-1 md:pl-0">
          <div className="ml-9 md:ml-0 h-8 w-24 rounded-full bg-white/5 border border-white/10 animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div className="space-y-12">
          {[1, 2, 3].map((i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} className="relative flex items-center w-full">
                {/* Node */}
                <div className="absolute left-[14px] md:left-1/2 md:-translate-x-1/2 top-7 md:top-8 w-3.5 h-3.5 rounded-full bg-white/20 ring-4 ring-[#05070B]" />

                <div className="w-full pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12">
                  <div className={`w-full ${isEven ? 'md:col-start-1' : 'md:col-start-2'}`}>
                    <div className="rounded-2xl bg-[#090D16] border border-white/10 animate-pulse overflow-hidden space-y-4 p-6 sm:p-7">
                      <div className="aspect-[16/9] w-full bg-white/5 rounded-xl" />
                      <div className="flex gap-2">
                        <div className="h-4 w-20 bg-white/10 rounded-full" />
                        <div className="h-4 w-28 bg-white/10 rounded-full" />
                      </div>
                      <div className="h-6 w-3/4 bg-white/10 rounded" />
                      <div className="h-4 w-1/2 bg-white/5 rounded" />
                      <div className="h-12 w-full bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
