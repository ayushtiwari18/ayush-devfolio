'use client';

/**
 * ProgressIndicator — scroll progress pill
 * ------------------------------------------
 * Fix: use useScroll() with no target (tracks window scroll)
 * instead of tracking the inner containerRef div which never
 * actually scrolls on a full-page layout.
 */

import { useScroll, useTransform, motion } from 'framer-motion';

export default function ProgressIndicator() {
  // Track window scroll — not a child div
  const { scrollYProgress } = useScroll();
  const heightPercent = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      aria-hidden="true"
      className="
        fixed right-5 top-1/2 -translate-y-1/2
        z-40
        hidden md:flex
        flex-col items-center gap-1.5
      "
    >
      {/* Top marker dot */}
      <div className="w-1 h-1 rounded-full bg-primary/40" />

      {/* Track */}
      <div className="w-1 h-28 rounded-full bg-border/50 overflow-hidden">
        {/* Gradient fill — now actually animates as user scrolls */}
        <motion.div
          suppressHydrationWarning
          className="w-full rounded-full origin-top"
          style={{
            height: heightPercent,
            background:
              'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--accent)))',
          }}
        />
      </div>

      {/* Bottom marker dot */}
      <div className="w-1 h-1 rounded-full bg-primary/20" />
    </div>
  );
}
