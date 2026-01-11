'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
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
      delay: 0.5,
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
    opacity: 0.7,
    scale: 1,
  },
  animate: {
    opacity: [0.7, 0.9, 0.7],
    scale: [1, 1.05, 1],
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
    <div className="relative flex items-center justify-center">
      {/* Multiple glowing rings */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-2xl"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />

      {/* Main circular container */}
      <motion.div
        className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/50"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-accent/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner glowing border */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20" />

        {/* Profile Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src={imageUrl || '/placeholder-avatar.png'}
            alt="Profile"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Overlay shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </div>
  );
}
