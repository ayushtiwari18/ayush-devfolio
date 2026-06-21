/**
 * M4 FIX: Loading skeleton for the /projects page.
 * Shown instantly while the Server Component fetches data from Supabase.
 */
export default function ProjectsLoading() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-12 w-64 bg-muted rounded-xl mx-auto mb-4 animate-pulse" />
          <div className="h-5 w-96 bg-muted rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="flex gap-2 mt-4">
                  <div className="h-6 w-16 bg-muted rounded-full" />
                  <div className="h-6 w-20 bg-muted rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
