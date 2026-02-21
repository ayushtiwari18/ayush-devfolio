'use client';

/**
 * TimelineClient — CLIENT COMPONENT (scroll context boundary)
 * ------------------------------------------------------------
 * Responsibilities:
 * 1. Own the IntersectionObserver registry (ref-based, not state-based)
 * 2. Render TimelineTrack + ordered TimelineEvent list
 * 3. Render ProgressIndicator
 *
 * DECISION: This is the ONLY place scroll logic should be initialized.
 * Child components receive observer registration via props, not context,
 * to avoid unnecessary re-renders.
 *
 * PERFORMANCE: events array is never mutated or re-sorted here.
 * It arrives pre-sorted from TimelineContainer (Server Component).
 */

import { useRef } from 'react';
import TimelineTrack from './TimelineTrack';
import TimelineEvent from './TimelineEvent';
import ProgressIndicator from './ProgressIndicator';

export default function TimelineClient({ events }) {
  // Ref to the scrollable container — used by ProgressIndicator
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="relative max-w-4xl mx-auto"
    >
      {/* Vertical connector line — animates in from top as user scrolls */}
      <TimelineTrack eventCount={events.length} />

      {/* Scroll progress pill — fixed to viewport right edge */}
      <ProgressIndicator containerRef={containerRef} />

      {/* Event list — pre-sorted, render in array order (newest first) */}
      <ol
        className="relative"
        aria-label="Timeline events, newest first"
      >
        {events.map((event, index) => (
          <TimelineEvent
            key={event.id}
            event={event}
            index={index}
          />
        ))}
      </ol>
    </div>
  );
}
