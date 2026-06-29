import { BookOpen } from 'lucide-react';

export default function SeriesBanner({ seriesName, seriesOrder }) {
  if (!seriesName) return null;
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 mb-8 bg-blue-500/5 border border-blue-500/20 rounded-xl">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
        <BookOpen size={15} className="text-blue-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Part of a Series</p>
        <p className="text-sm text-foreground font-medium">
          {seriesOrder && <span className="text-muted-foreground mr-1">#{seriesOrder} —</span>}
          {seriesName}
        </p>
      </div>
    </div>
  );
}
