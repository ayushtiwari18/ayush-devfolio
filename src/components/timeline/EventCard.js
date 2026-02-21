'use client';

/**
 * EventCard — pure presentational component
 * ------------------------------------------
 * POLISH CHANGES:
 * - Left accent bar using type color (inset box-shadow on left edge)
 * - Hover: type-color glow via inline box-shadow (can't do dynamic Tailwind)
 * - Date: sm + medium weight + primary color
 * - Title: lg/xl, tighter leading
 * - Description: relaxed line-height, slightly higher contrast
 * - Card bg: bg-card/80 + backdrop-blur for depth on dark bg
 * - Border opacity raised to /40
 */

import { useState } from 'react';
import { formatDate } from '@/utils/formatDate';

export default function EventCard({ event, config }) {
  const [hovered, setHovered] = useState(false);
  const isOngoing = !event.end_date;

  // Dynamic glow on hover — must be inline (Tailwind can't do runtime RGB values)
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
      {/* Left accent bar — type color, inset */}
      <div
        aria-hidden="true"
        style={{ background: `rgba(${config.glow}, ${hovered ? 0.9 : 0.5})` }}
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full transition-all duration-300"
      />

      {/* Type badge + Ongoing indicator */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="
          inline-flex items-center gap-1.5
          text-xs font-medium px-2.5 py-1 rounded-full
          bg-muted text-muted-foreground
        ">
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
          />
          {config.label}
        </span>

        {isOngoing && (
          <span className="
            inline-flex items-center gap-1
            text-xs font-medium px-2.5 py-1 rounded-full
            bg-emerald-500/10 text-emerald-500
          ">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            Ongoing
          </span>
        )}
      </div>

      {/* Date range — more prominent */}
      <p className="text-sm font-medium text-primary/70 mb-2.5">
        <time dateTime={event.start_date}>
          {formatDate(event.start_date)}
        </time>
        {!isOngoing && event.end_date && (
          <span className="text-muted-foreground font-normal">
            {' – '}
            <time dateTime={event.end_date}>
              {formatDate(event.end_date)}
            </time>
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

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {event.description}
      </p>
    </article>
  );
}
