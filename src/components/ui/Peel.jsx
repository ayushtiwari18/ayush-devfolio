'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles } from 'lucide-react';

export default function Peel({
  children,
  under,
  side = 'left',
  mode = 'cursor',
  reveal = 450,
  zone = 220,
  curl = 300,
  shine = 1,
  shade = 0.3,
  className = '',
  style = {},
  onPeelComplete,
}) {
  const containerRef = useRef(null);
  const [peelProgress, setPeelProgress] = useState(0); // 0 to 1
  const [isFullyPeeled, setIsFullyPeeled] = useState(false);

  // Cross-browser Pointer Hover & Edge Distance Detection
  const handlePointerMove = (e) => {
    if (isFullyPeeled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let dist = x;
    let span = rect.width;

    if (side === 'right') {
      dist = rect.width - x;
    } else if (side === 'top') {
      dist = y;
      span = rect.height;
    } else if (side === 'bottom') {
      dist = rect.height - y;
      span = rect.height;
    }

    const activeZone = Math.max(zone, 180);

    if (dist <= activeZone) {
      // Progressively peel as cursor gets closer to the edge
      const p = Math.min(1, Math.max(0.15, 1 - dist / activeZone));
      setPeelProgress(p);
    } else if (peelProgress > 0 && !isFullyPeeled) {
      setPeelProgress(0);
    }
  };

  const handlePointerLeave = () => {
    if (!isFullyPeeled) {
      setPeelProgress(0);
    }
  };

  const handleClick = () => {
    setIsFullyPeeled(true);
    setPeelProgress(1);
    if (onPeelComplete) {
      setTimeout(() => {
        onPeelComplete();
        setIsFullyPeeled(false);
        setPeelProgress(0);
      }, 400);
    }
  };

  const isLeft = side === 'left';
  const isRight = side === 'right';

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', ...style }}
      className={`group select-none rounded-3xl ${className}`}
      role="button"
      tabIndex={0}
      aria-label="Interactive Peel Deck Card"
    >
      {/* UNDERNEATH LAYER (REVEALED UNDER SHEET) */}
      <div className="absolute inset-0 z-0 w-full h-full rounded-3xl overflow-hidden shadow-inner">
        {under}
      </div>

      {/* TOP LAYER (PEELING FRONT SHEET) */}
      <motion.div
        className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-card border border-border"
        initial={false}
        animate={
          isFullyPeeled
            ? {
                x: isLeft ? -700 : 700,
                rotateY: isLeft ? -45 : 45,
                rotateZ: isLeft ? -15 : 15,
                opacity: 0,
                scale: 0.9,
              }
            : peelProgress > 0
            ? {
                x: isLeft ? peelProgress * -120 : peelProgress * 120,
                rotateY: isLeft ? peelProgress * -25 : peelProgress * 25,
                rotateZ: isLeft ? peelProgress * -6 : peelProgress * 6,
                scale: 1 - peelProgress * 0.04,
                opacity: 1 - peelProgress * 0.15,
                boxShadow: `-15px 20px 30px rgba(0,0,0,${0.2 * peelProgress})`,
              }
            : {
                x: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                opacity: 1,
                boxShadow: '0px 10px 25px rgba(0,0,0,0.1)',
              }
        }
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* PEEL EDGE STICKER PROMPT FLAP */}
        <div
          className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} z-20 pointer-events-none p-2`}
        >
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-br-2xl bg-gradient-to-r from-primary via-accent to-primary text-white text-[11px] font-bold shadow-lg border-b border-r border-white/20"
            animate={peelProgress > 0 ? { scale: 1.1, x: isLeft ? 8 : -8 } : { scale: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Sparkles size={13} className="animate-spin" />
            <span>{peelProgress > 0 ? 'PEELING...' : 'PEEL EDGE'}</span>
          </motion.div>
        </div>

        {/* FRONT SHEET CONTENT */}
        <div className="w-full h-full">{children}</div>
      </motion.div>
    </div>
  );
}
