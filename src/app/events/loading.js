export default function EventsLoading() {
  return (
    <>
      {/* Hero Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-card border border-border rounded-2xl animate-pulse flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-8 bg-muted/60 rounded" />
            <div className="w-20 h-3 bg-muted/40 rounded" />
          </div>
        ))}
      </div>

      {/* Timeline Skeleton */}
      <div className="relative">
        <div className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-border/50" />
        
        <div className="space-y-16">
          {[1, 2].map((year) => (
            <div key={year} className="relative z-10">
              
              {/* Year Badge Skeleton */}
              <div className="flex items-center md:justify-center gap-4 mb-10 ml-0 md:ml-0">
                <div className="hidden md:flex flex-1 h-px bg-border" />
                <div className="w-20 h-8 bg-muted/50 rounded-full animate-pulse border border-border" />
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Alternating Cards Skeleton */}
              <div className="space-y-12">
                {[0, 1].map((idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <div key={idx} className="relative flex flex-col md:flex-row items-center w-full">
                      <div className="absolute left-[9px] md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-muted/50 z-20 animate-pulse" />
                      
                      <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12' : 'hidden md:block'}`}>
                        {isEven && <div className="h-72 bg-card border border-border rounded-2xl animate-pulse" />}
                      </div>
                      <div className={`w-full md:w-1/2 pl-12 ${!isEven ? 'md:pl-12' : 'hidden md:block'}`}>
                        {!isEven && <div className="h-72 bg-card border border-border rounded-2xl animate-pulse" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
