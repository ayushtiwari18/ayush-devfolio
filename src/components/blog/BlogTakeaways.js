export default function BlogTakeaways({ items, position = 'bottom' }) {
  if (!items?.length) return null;

  const isTop = position === 'top';

  return (
    <div className={`relative my-8 rounded-2xl border overflow-hidden ${
      isTop
        ? 'border-primary/30 bg-gradient-to-br from-primary/8 to-primary/3'
        : 'border-green-500/25 bg-gradient-to-br from-green-950/40 to-zinc-900/60'
    }`}>
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        isTop ? 'bg-primary' : 'bg-green-500'
      }`} />

      <div className="pl-6 pr-5 py-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
            isTop ? 'bg-primary/20 text-primary' : 'bg-green-500/20 text-green-400'
          }`}>
            {isTop ? '✦' : '✓'}
          </div>
          <h3 className={`font-bold text-sm tracking-wide uppercase ${
            isTop ? 'text-primary' : 'text-green-400'
          }`}>
            {isTop ? 'What you\'ll learn' : 'Key Takeaways'}
          </h3>
        </div>

        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={`shrink-0 mt-0.5 text-sm font-bold ${
                isTop ? 'text-primary/70' : 'text-green-400'
              }`}>
                {isTop ? `0${i + 1}` : '✓'}
              </span>
              <span className="text-foreground/80 text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
