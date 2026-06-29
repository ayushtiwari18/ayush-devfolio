import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

/**
 * PerformanceMetrics — SERVER COMPONENT
 * Renders performance_metrics jsonb array as metric cards.
 * Each item: { label: string, value: string, unit: string, good: boolean }
 */
export default function PerformanceMetrics({ metrics }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section id="performance" className="mb-12 scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
          <Zap size={17} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Performance</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{m.label}</p>
            <div className="flex items-end gap-1.5 mb-1">
              <span className="text-2xl font-bold text-foreground">{m.value}</span>
              {m.unit && <span className="text-sm text-muted-foreground mb-0.5">{m.unit}</span>}
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              m.good ? 'text-green-400' : 'text-red-400'
            }`}>
              {m.good
                ? <TrendingUp size={12} />
                : <TrendingDown size={12} />
              }
              <span>{m.good ? 'Good' : 'Needs work'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
