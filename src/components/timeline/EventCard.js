'use client';

/**
 * EventCard — pure presentational component
 * ------------------------------------------
 * No animation state. No observers. No side effects.
 * Receives fully-typed event + config from TimelineEvent.
 *
 * Responsibilities:
 * - Render type badge, dates, title, description
 * - Format dates using utils/formatDate
 * - Render "Ongoing" badge if end_date is null
 */

import { formatDate } from '@/utils/formatDate';

export default function EventCard({ event, config }) {
  const isOngoing = !event.end_date;

  return (
    <article
      className={`
        rounded-xl border p-5 md:p-6
        bg-card text-card-foreground
        ${config.border}
        hover:shadow-md transition-shadow duration-200
      `}
    >
      {/* Type badge + Ongoing indicator */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`
            inline-flex items-center gap-1.5
            text-xs font-medium px-2.5 py-1 rounded-full
            bg-muted text-muted-foreground
          `}
        >
          <span
            aria-hidden="true"
            className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
          />
          {config.label}
        </span>

        {isOngoing && (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Ongoing
          </span>
        )}
      </div>

      {/* Date range */}
      <p className="text-xs text-muted-foreground mb-2">
        <time dateTime={event.start_date}>
          {formatDate(event.start_date)}
        </time>
        {!isOngoing && event.end_date && (
          <>
            {' – '}
            <time dateTime={event.end_date}>
              {formatDate(event.end_date)}
            </time>
          </>
        )}
        {isOngoing && ' – Present'}
      </p>

      {/* Title */}
      <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug mb-2">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {event.description}
      </p>
    </article>
  );
}
