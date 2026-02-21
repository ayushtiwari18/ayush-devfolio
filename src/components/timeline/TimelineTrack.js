'use client';

/**
 * TimelineTrack — vertical connector line
 * -----------------------------------------
 * Renders a single vertical line that scales in from top to bottom
 * as the page loads. The line is purely decorative and hidden from
 * assistive technologies (aria-hidden).
 *
 * PERFORMANCE: Single Framer Motion element. No scroll listener.
 * Uses CSS transform (scaleY) — compositor-only, zero layout cost.
 */

import { motion } from 'framer-motion';

export default function TimelineTrack({ eventCount }) {
  // Line only renders if there are events to connect
  if (!eventCount || eventCount < 2) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
    >
      {/* Static background line — no animation, provides structure */}
      <div className="absolute inset-0 bg-border opacity-30" />

      {/* Animated fill line — scales in on mount */}
      <motion.div
        className="absolute inset-0 bg-primary origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{
          duration: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.3,
        }}
      />
    </div>
  );
}
