import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function BlogTakeaways({ items, position = 'bottom' }) {
  if (!items?.length) return null;

  const isTop = position === 'top';

  return (
    <div
      className={`relative my-10 rounded-2xl border overflow-hidden bg-[#090D16] shadow-xl shadow-black/30 backdrop-blur-md transition-all ${
        isTop
          ? 'border-primary/30 shadow-primary/5'
          : 'border-emerald-500/30 shadow-emerald-500/5'
      }`}
    >
      {/* Subtle top indicator bar */}
      <div
        className={`h-0.5 w-full bg-gradient-to-r ${
          isTop
            ? 'from-primary via-primary/60 to-transparent'
            : 'from-emerald-400 via-emerald-500/60 to-transparent'
        }`}
      />

      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-sm ${
                isTop
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isTop ? <Sparkles size={16} /> : <CheckCircle2 size={16} />}
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase text-white font-mono flex items-center gap-2">
                {isTop ? 'Architectural TL;DR' : 'Key Takeaways & Summary'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {isTop ? 'Core mental models covered in this deep dive' : 'Synthesis of actionable engineering takeaways'}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/[0.04] text-gray-400 border border-white/10 uppercase tracking-widest">
            {items.length} Points
          </span>
        </div>

        {/* Takeaway Items List */}
        <ul className="space-y-3.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3.5 group">
              <span
                className={`shrink-0 w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center mt-0.5 transition-colors ${
                  isTop
                    ? 'bg-primary/10 border border-primary/30 text-primary group-hover:bg-primary/20'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-gray-200/90 text-sm sm:text-[0.9375rem] leading-[1.7] font-sans">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
