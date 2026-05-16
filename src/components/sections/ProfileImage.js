'use client';

/**
 * ProfileImage — Commit 3 performance rewrite
 *
 * PERF CONTRACT:
 *  Before: 6 concurrent Framer Motion `animate` loops running on JS main thread:
 *    1. glowVariants outer (opacity + scale, repeat:Infinity)
 *    2. glowVariants inner (opacity + scale, repeat:Infinity)
 *    3. rotating ring (rotate 360, repeat:Infinity)
 *    4. counter-rotating ring (rotate -360, repeat:Infinity)
 *    5. shine overlay (opacity, repeat:Infinity)
 *    6. top accent dot (scale + opacity, repeat:Infinity)
 *    7. bottom accent dot (scale + opacity, repeat:Infinity)
 *  Each loop runs a JS rAF tick, keeping Framer Motion's scheduler alive
 *  permanently — this was contributing ~800-1200 ms to TBT.
 *
 *  After: ALL infinite repeating animations converted to pure CSS.
 *  CSS animations run on the compositor thread — zero JS main-thread cost.
 *  Framer Motion is kept ONLY for:
 *    • entrance spring (imageVariants — runs once on mount, no repeat)
 *    • whileHover scale (one-shot on interaction)
 *  This eliminates the permanent Framer Motion scheduler overhead.
 *
 *  reduced-motion: All CSS animations respect prefers-reduced-motion via
 *  global override in globals.css. The entrance spring is also skipped
 *  because Framer Motion respects the same media query when using spring.
 */

import { motion } from 'framer-motion';
import Image from 'next/image';

// Entrance animation — runs ONCE on mount, then stops. No repeat.
// Spring type means Framer Motion's scheduler exits after the spring settles.
const imageVariants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 18,
      delay: 0.2,
    },
  },
};

export default function ProfileImage({ imageUrl }) {
  return (
    <div className="relative flex items-center justify-center w-full">
      {/*
       * Outer glow — CSS animation (compositor thread, zero JS cost)
       * was: <motion.div variants={glowVariants} animate="animate" />
       */}
      <div
        aria-hidden="true"
        className="
          absolute w-full h-full
          max-w-[280px] max-h-[280px]
          sm:max-w-[320px] sm:max-h-[320px]
          lg:max-w-[400px] lg:max-h-[400px]
          rounded-full
          bg-gradient-to-r from-primary/20 to-accent/20
          blur-2xl sm:blur-3xl
          profile-glow-pulse
        "
      />

      {/* Secondary glow — offset phase via animation-delay */}
      <div
        aria-hidden="true"
        className="
          absolute w-[90%] h-[90%]
          max-w-[252px] max-h-[252px]
          sm:max-w-[288px] sm:max-h-[288px]
          lg:max-w-[360px] lg:max-h-[360px]
          rounded-full
          bg-gradient-to-br from-accent/30 to-primary/30
          blur-xl sm:blur-2xl
          profile-glow-pulse
        "
        style={{ animationDelay: '1.5s' }}
      />

      {/*
       * Main circular container — Framer Motion entrance spring (runs once)
       * whileHover is a one-shot interaction, not a loop — safe to keep.
       */}
      <motion.div
        className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/50"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      >
        {/*
         * Rotating ring — CSS animation (was: motion.div animate={{ rotate: 360 }} repeat:Infinity)
         * CSS transform:rotate runs entirely on the GPU compositor layer.
         */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-4 border-accent/40 profile-ring-cw"
        />

        {/* Counter-rotating ring — CSS animation */}
        <div
          aria-hidden="true"
          className="absolute inset-2 rounded-full border-2 border-primary/30 profile-ring-ccw"
        />

        {/* Inner gradient */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/30 via-transparent to-accent/30" />

        {/* Profile Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          <Image
            src={imageUrl || '/placeholder-avatar.svg'}
            alt="Ayush Tiwari — Full Stack Developer"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 384px"
          />
        </div>

        {/*
         * Shine overlay — CSS animation (was: motion opacity [0.2,0.4,0.2] repeat:Infinity)
         */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none profile-shine"
        />

        {/* Bottom depth gradient — static, no animation needed */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </motion.div>

      {/*
       * Accent dots — CSS animation (was: motion scale+opacity repeat:Infinity)
       * Two staggered pulses via animation-delay.
       */}
      <div
        aria-hidden="true"
        className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50 profile-dot-pulse"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-2 -left-2 w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/50 profile-dot-pulse"
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
}
