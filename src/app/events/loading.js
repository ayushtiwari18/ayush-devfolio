export default function EventsLoading() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="h-4 w-24 bg-muted rounded-full mb-4 animate-pulse" />
          <div className="h-12 w-72 bg-muted rounded-xl mb-3 animate-pulse" />
          <div className="h-5 w-96 bg-muted rounded animate-pulse" />
        </div>
        {/* Timeline skeleton */}
        <div className="space-y-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-6 animate-pulse">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-muted mt-1 shrink-0" />
                <div className="w-px flex-1 bg-muted/40 mt-2" />
              </div>
              <div className="flex-1 bg-card border border-border rounded-2xl overflow-hidden mb-4">
                <div className="h-44 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
