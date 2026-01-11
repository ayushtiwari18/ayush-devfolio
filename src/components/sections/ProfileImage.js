'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// Animation for the circular image
const imageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -15,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      delay: 0.3,
    },
  },
  hover: {
    scale: 1.05,
    rotate: 5,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 10,
    },
  },
};

// Animation variants for the pulsing glow effect
const glowVariants = {
  initial: {
    opacity: 0.5,
    scale: 1,
  },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    scale: [1, 1.1, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

export default function ProfileImage({ imageUrl }) {
  return (
    <div className="relative flex items-center justify-center w-full">
      {/* Outer glow rings - More subtle on mobile */}
      <motion.div
        className="absolute w-full h-full max-w-[280px] max-h-[280px] sm:max-w-[320px] sm:max-h-[320px] lg:max-w-[400px] lg:max-h-[400px] rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl sm:blur-3xl"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />

      {/* Secondary glow */}
      <motion.div
        className="absolute w-[90%] h-[90%] max-w-[252px] max-h-[252px] sm:max-w-[288px] sm:max-h-[288px] lg:max-w-[360px] lg:max-h-[360px] rounded-full bg-gradient-to-br from-accent/30 to-primary/30 blur-xl sm:blur-2xl"
        variants={glowVariants}
        initial="initial"
        animate="animate"
        style={{ animationDelay: '1s' }}
      />

      {/* Main circular container - Responsive sizing */}
      <motion.div
        className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/50"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* Animated rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-accent/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Counter-rotating ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-primary/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner glowing border with better contrast */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/30 via-transparent to-accent/30" />

        {/* Profile Image with better fallback */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          <Image
            src={imageUrl || '/placeholder-avatar.svg'}
            alt="Profile"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 384px"
          />
        </div>

        {/* Overlay shine effect - More subtle */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Bottom gradient for depth */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </motion.div>

      {/* Decorative corner accents */}
      <motion.div
        className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-2 -left-2 w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/50"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
    </div>
  );
}
