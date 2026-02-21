'use client';

/**
 * TimelineTrack — vertical connector line
 * -----------------------------------------
 * w-0.5 (2px) — more visible than 1px on retina displays.
 * Gradient: solid at top, fades out at bottom (more natural than hard stop).
 * Uses CSS transform (scaleY) — compositor-only, zero layout cost.
 */

import { motion } from 'framer-motion';

export default function TimelineTrack({ eventCount }) {
  if (!eventCount || eventCount < 2) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
    >
      {/* Static underlay — gives line structure before animation */}
      <div className="absolute inset-0 bg-border/20" />

      {/* Animated gradient fill — scales in from top on mount */}
      <motion.div
        className="absolute inset-0 origin-top"
        style={{
          background:
            'linear-gradient(to bottom, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.6) 60%, transparent 100%)',
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{
          duration: 1.4,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.2,
        }}
      />
    </div>
  );
}
