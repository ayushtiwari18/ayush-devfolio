export default function HackathonsLoading() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-12 w-56 bg-muted rounded-xl mx-auto mb-4 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
