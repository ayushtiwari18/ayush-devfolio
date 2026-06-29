import { CheckCircle2 } from 'lucide-react';

export default function BlogTakeaways({ items }) {
  if (!items?.length) return null;
  return (
    <div className="relative mt-12 mb-8 rounded-xl border border-green-500/30 bg-green-500/5 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-xl" />
      <div className="px-6 py-5">
        <div className="flex items-center gap-2.5 mb-4">
          <CheckCircle2 size={20} className="text-green-400" />
          <h3 className="font-bold text-foreground text-lg">Key Takeaways</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                <span className="text-green-400 text-xs font-bold">{i + 1}</span>
              </span>
              <span className="text-foreground/80 leading-relaxed text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
