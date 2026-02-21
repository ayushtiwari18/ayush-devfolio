'use client';

/**
 * EventCard — presentational card for a single timeline event
 * -------------------------------------------------------------
 * Changes:
 * - Description clamped to 3 lines with Read more / less toggle
 * - Achievement badge shown for featured events (pulls first sentence
 *   of description as the highlight — no extra DB column needed)
 * - Left accent bar + hover glow unchanged
 */

import { useState } from 'react';
import { formatDate } from '@/utils/formatDate';
import { Trophy } from 'lucide-react';

export default function EventCard({ event, config, featuredRank }) {
  const [hovered,   setHovered]   = useState(false);
  const [expanded,  setExpanded]  = useState(false);

  const isOngoing  = !event.end_date;
  const isFeatured = event.featured;

  // Extract a short achievement callout from description:
  // use the content after the last em-dash or pipe if present,
  // otherwise fall back to the first 80 chars of description.
  const rawDesc    = event.description || '';
  const pipeIdx    = rawDesc.lastIndexOf(' — ');
  const achievement =
    pipeIdx > 0
      ? rawDesc.slice(pipeIdx + 3).split('.')[0].trim()
      : rawDesc.split('.')[0].trim().slice(0, 90);

  const hoverStyle = hovered
    ? {
        boxShadow: `0 0 0 1px rgba(${config.glow}, 0.35), 0 8px 32px rgba(${config.glow}, 0.12)`,
      }
    : {
        boxShadow: `0 0 0 1px rgba(${config.glow}, 0.15)`,
      };

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={hoverStyle}
      className={`
        relative overflow-hidden
        rounded-xl
        p-5 md:p-6
        bg-card/80 backdrop-blur-sm
        text-card-foreground
        border ${config.border}
        transition-all duration-300
      `}
    >
      {/* Left accent bar */}
      <div
        aria-hidden="true"
        style={{ background: `rgba(${config.glow}, ${hovered ? 0.9 : 0.5})` }}
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full transition-all duration-300"
      />

      {/* Type badge + Ongoing pill */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
          <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>

        {isOngoing && (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            Ongoing
          </span>
        )}
      </div>

      {/* Date range */}
      <p className="text-sm font-medium text-primary/70 mb-2.5">
        <time dateTime={event.start_date}>{formatDate(event.start_date)}</time>
        {!isOngoing && event.end_date && (
          <span className="text-muted-foreground font-normal">
            {' – '}
            <time dateTime={event.end_date}>{formatDate(event.end_date)}</time>
          </span>
        )}
        {isOngoing && (
          <span className="text-muted-foreground font-normal"> – Present</span>
        )}
      </p>

      {/* Title */}
      <h3 className="text-lg md:text-xl font-semibold text-foreground leading-tight mb-3">
        {event.title}
      </h3>

      {/* Achievement badge — featured events only */}
      {isFeatured && achievement && (
        <div
          style={{ background: `rgba(${config.glow}, 0.08)`, borderColor: `rgba(${config.glow}, 0.25)` }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-3"
        >
          <Trophy size={12} style={{ color: `rgba(${config.glow}, 0.9)` }} />
          <span
            style={{ color: `rgba(${config.glow}, 0.9)` }}
            className="text-xs font-semibold leading-snug"
          >
            {achievement}
          </span>
        </div>
      )}

      {/* Description — clamped with expand toggle */}
      <div>
        <p
          className={`text-sm text-muted-foreground leading-relaxed transition-all duration-200 ${
            expanded ? '' : 'line-clamp-3'
          }`}
        >
          {rawDesc}
        </p>
        {rawDesc.length > 160 && (
          <button
            onClick={() => setExpanded(v => !v)}
            style={{ color: `rgba(${config.glow}, 0.85)` }}
            className="mt-1.5 text-xs font-medium hover:underline focus:outline-none"
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        )}
      </div>
    </article>
  );
}
