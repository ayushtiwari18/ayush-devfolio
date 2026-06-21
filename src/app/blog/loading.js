export default function BlogLoading() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-12 w-48 bg-muted rounded-xl mx-auto mb-4 animate-pulse" />
          <div className="h-5 w-80 bg-muted rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-32 h-24 bg-muted rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
