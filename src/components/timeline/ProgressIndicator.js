'use client';

/**
 * ProgressIndicator — scroll progress pill
 * ------------------------------------------
 * Tracks scroll progress within the timeline container (not the full window).
 * Renders a fixed pill on the right viewport edge.
 *
 * PERFORMANCE DECISIONS:
 * - useScroll from Framer Motion uses rAF internally — no main-thread scroll
 * - useTransform maps scrollYProgress (0–1) to height percentage string
 * - scaleY on a fixed-height container avoids layout recalculation
 * - aria-hidden: this is purely decorative, not conveyed to screen readers
 *
 * HYDRATION SAFETY:
 * - suppressHydrationWarning on the fill div (its height differs server/client)
 */

import { useScroll, useTransform, motion } from 'framer-motion';

export default function ProgressIndicator({ containerRef }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0–1) to a CSS height percentage
  const heightPercent = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      aria-hidden="true"
      className="
        fixed right-4 top-1/2 -translate-y-1/2
        z-40
        hidden md:flex
        flex-col items-center
      "
    >
      {/* Track */}
      <div className="w-1 h-24 rounded-full bg-border overflow-hidden">
        {/* Fill */}
        <motion.div
          suppressHydrationWarning
          className="w-full bg-primary rounded-full origin-top"
          style={{ height: heightPercent }}
        />
      </div>
    </div>
  );
}
