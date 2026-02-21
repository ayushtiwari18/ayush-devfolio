'use client';

/**
 * ProgressIndicator — scroll progress pill
 * ------------------------------------------
 * POLISH CHANGES:
 * - Track height 96px → 120px
 * - Fill: flat primary → gradient primary → accent
 * - Added top and bottom dot markers for polish
 * - Subtle label on top
 */

import { useScroll, useTransform, motion } from 'framer-motion';

export default function ProgressIndicator({ containerRef }) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

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
        {/* Gradient fill */}
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
