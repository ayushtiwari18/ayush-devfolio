'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, RotateCcw } from 'lucide-react';

export default function PeelCard({
  front,
  back,
  className = '',
}) {
  const [isPeeled, setIsPeeled] = useState(false);

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsPeeled(true)}
      onMouseLeave={() => setIsPeeled(false)}
      onClick={() => setIsPeeled((prev) => !prev)}
      role="button"
      tabIndex={0}
      aria-label="Interactive Peel Card"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsPeeled((prev) => !prev);
        }
      }}
    >
      {/* UNDERNEATH LAYER (REVEALED BACK) */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-primary/10 border border-primary/30 p-6 flex flex-col justify-between z-0 shadow-inner rounded-2xl">
        <div className="flex items-center justify-between text-xs font-semibold text-primary/90 border-b border-primary/20 pb-2 mb-2">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary animate-pulse" />
            BEHIND THE TECH
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {isPeeled ? 'Tap to Flip' : 'Revealed'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto my-1">
          {back}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-primary/20 text-xs text-muted-foreground mt-auto">
          <span className="flex items-center gap-1 text-primary hover:underline">
            <RotateCcw size={12} /> Flip Card
          </span>
          <span className="text-[10px] text-muted-foreground/70">Proof of Work</span>
        </div>
      </div>

      {/* TOP LAYER (FRONT) WITH PEEL ANIMATION */}
      <motion.div
        className="relative z-10 w-full h-full bg-card border border-border rounded-2xl overflow-hidden shadow-md flex flex-col"
        initial={false}
        animate={
          isPeeled
            ? {
                rotateY: -12,
                rotateX: 8,
                scale: 0.95,
                y: -10,
                opacity: 0.12,
                filter: 'brightness(0.7)',
              }
            : {
                rotateY: 0,
                rotateX: 0,
                scale: 1,
                y: 0,
                opacity: 1,
                filter: 'brightness(1)',
              }
        }
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* PEEL FLAP / STICKER CORNER HINT */}
        <div className="absolute top-0 right-0 z-20 pointer-events-none">
          <div className="relative w-12 h-12 overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/50 via-accent/40 to-transparent shadow-md border-b border-l border-primary/30 rounded-bl-xl flex items-start justify-end p-1.5"
              animate={isPeeled ? { scale: 1.2, rotate: -15 } : { scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <Eye size={12} className="text-white" />
            </motion.div>
          </div>
        </div>

        {/* FRONT CONTENT */}
        <div className="w-full h-full flex flex-col">
          {front}
        </div>
      </motion.div>
    </div>
  );
}
