'use client';

import { useRef } from 'react';
import { Plus, X, GripVertical, Image as ImageIcon } from 'lucide-react';

const MAX = 10;

/**
 * ImageUrlList — reusable dynamic URL list for admin forms.
 *
 * Props:
 *   value    : string[]   — array of URL strings
 *   onChange : (string[]) => void
 *   max      : number     — default 10
 */
export default function ImageUrlList({ value = [], onChange, max = MAX }) {
  const inputRefs = useRef([]);

  const update = (idx, val) => {
    const next = [...value];
    next[idx] = val;
    onChange(next);
  };

  const add = () => {
    if (value.length >= max) return;
    onChange([...value, '']);
    // focus new input next tick
    setTimeout(() => inputRefs.current[value.length]?.focus(), 50);
  };

  const remove = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      {value.map((url, idx) => (
        <div key={idx} className="flex items-center gap-2 group">
          {/* Drag handle (visual only) */}
          <GripVertical size={14} className="text-muted-foreground/40 shrink-0 cursor-grab" />

          {/* Preview thumbnail */}
          <div className="w-10 h-8 rounded border border-border bg-muted flex-shrink-0 overflow-hidden">
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={12} className="text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* URL input */}
          <input
            ref={el => inputRefs.current[idx] = el}
            type="url"
            value={url}
            onChange={e => update(idx, e.target.value)}
            placeholder={`https://image-url-${idx + 1}.jpg`}
            className="flex-1 px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Remove */}
          <button
            type="button"
            onClick={() => remove(idx)}
            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      {/* Add row */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={add}
          disabled={value.length >= max}
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={14} />
          Add Image
        </button>
        <span className={`text-xs font-medium ${
          value.length >= max ? 'text-orange-400' : 'text-muted-foreground'
        }`}>
          {value.length} / {max}
        </span>
      </div>
    </div>
  );
}
