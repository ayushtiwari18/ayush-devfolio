import { BookOpen, ChevronRight } from 'lucide-react';

export default function SeriesBanner({ seriesName, seriesOrder }) {
  if (!seriesName) return null;
  return (
    <div className="relative flex items-center justify-between gap-4 px-5 py-4 mb-8 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent overflow-hidden group">
      {/* bg glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
          <BookOpen size={16} className="text-primary" />
        </div>
        <div>
          <p className="text-xs text-primary/70 font-semibold uppercase tracking-widest mb-0.5">Series</p>
          <p className="text-sm font-bold text-foreground leading-tight">{seriesName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
          Part {seriesOrder}
        </span>
        <ChevronRight size={16} className="text-primary/60" />
      </div>
    </div>
  );
}
