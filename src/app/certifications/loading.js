export default function CertificationsLoading() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-12 w-72 bg-muted rounded-xl mx-auto mb-4 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
              <div className="h-32 bg-muted rounded-lg mb-4" />
              <div className="h-5 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
