import { BookOpen, Layers } from 'lucide-react';

export default function SeriesBanner({ seriesName, seriesOrder }) {
  if (!seriesName) return null;
  return (
    <div className="relative flex items-center justify-between gap-4 px-5 py-4 rounded-2xl border border-primary/30 bg-[#090D16] shadow-xl shadow-black/30 overflow-hidden group">
      {/* Background ambient glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
          <BookOpen size={17} className="text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] text-primary font-mono font-bold uppercase tracking-widest">
              Curated Publication Series
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-white leading-tight">
            {seriesName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="px-3 py-1 rounded-lg bg-primary/20 text-primary border border-primary/40 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
          <Layers size={13} />
          <span>Part {seriesOrder}</span>
        </span>
      </div>
    </div>
  );
}
