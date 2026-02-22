/**
 * StrategyGrid — SERVER COMPONENT
 * --------------------------------
 * Maps strategies JSONB array → styled card grid.
 * Each item: { title: string, description: string }
 * Renders nothing if strategies is null or empty.
 */
export default function StrategyGrid({ strategies }) {
  if (!strategies || strategies.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <span aria-hidden="true">⚡</span>
        Key Strategies
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {strategies.map((item, i) => (
          <div
            key={i}
            className="p-5 bg-card border border-border rounded-xl hover:border-primary/40 transition-colors"
          >
            <h3 className="text-base font-semibold text-foreground mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
