'use client';

/**
 * TimelineClient — CLIENT COMPONENT
 * -----------------------------------
 * Changes:
 * 1. Type filter tabs — All / Hackathon / Project / Work / Education / Freelance / Life
 * 2. Year group separators — injected between events when start_date year changes
 * 3. ProgressIndicator no longer receives containerRef (fixed to window scroll)
 */

import { useState, useMemo } from 'react';
import TimelineTrack from './TimelineTrack';
import TimelineEvent from './TimelineEvent';
import ProgressIndicator from './ProgressIndicator';

const FILTERS = [
  { key: 'all',         label: 'All'        },
  { key: 'hackathon',   label: 'Hackathons' },
  { key: 'project',     label: 'Projects'   },
  { key: 'work',        label: 'Work'       },
  { key: 'college',     label: 'Education'  },
  { key: 'freelancing', label: 'Freelance'  },
  { key: 'enjoyment',   label: 'Life'       },
];

export default function TimelineClient({ events }) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter events by active type
  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? events
        : events.filter(e => e.type === activeFilter),
    [events, activeFilter]
  );

  // Build a list of { type: 'event' | 'year', value } for rendering year separators
  const rows = useMemo(() => {
    const result = [];
    let lastYear = null;
    filtered.forEach(event => {
      const year = new Date(event.start_date).getFullYear();
      if (year !== lastYear) {
        result.push({ type: 'year', value: year });
        lastYear = year;
      }
      result.push({ type: 'event', value: event });
    });
    return result;
  }, [filtered]);

  // Compute per-event index (skip year rows for stagger)
  let eventIndex = 0;

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2 justify-center mb-12 px-4">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`
              px-4 py-1.5 rounded-full text-xs font-semibold
              border transition-all duration-200
              ${
                activeFilter === f.key
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }
            `}
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="ml-1.5 opacity-60">
                {events.filter(e => e.type === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Timeline ── */}
      <div className="relative">
        <TimelineTrack eventCount={filtered.length} />
        <ProgressIndicator />

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-12">
            No events for this filter.
          </p>
        ) : (
          <ol
            className="relative"
            aria-label="Timeline events, newest first"
          >
            {rows.map((row, i) => {
              if (row.type === 'year') {
                return (
                  <li key={`year-${row.value}`} aria-hidden="true" className="relative flex items-center justify-center mb-10">
                    {/* Horizontal fade line */}
                    <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    {/* Year pill */}
                    <span className="relative z-10 px-4 py-1 rounded-full bg-background border border-border text-xs font-bold text-muted-foreground tracking-widest">
                      {row.value}
                    </span>
                  </li>
                );
              }

              const idx = eventIndex++;
              return (
                <TimelineEvent
                  key={row.value.id}
                  event={row.value}
                  index={idx}
                />
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
