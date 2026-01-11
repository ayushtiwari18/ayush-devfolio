'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ChevronDown } from 'lucide-react';

export default function ScrollIndicator() {
  return (
    <Link href={ROUTES.ABOUT}>
      <motion.div
        className="relative flex flex-col items-center gap-2 sm:gap-3 cursor-pointer group"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-xs sm:text-sm font-medium text-gray-400 group-hover:text-primary transition-colors">
          Explore More
        </span>

        {/* Modern animated indicator */}
        <motion.div
          className="relative flex flex-col items-center"
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Glowing circle */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary/50 group-hover:border-primary flex items-center justify-center transition-colors">
            <ChevronDown className="text-primary" size={20} />
            
            {/* Pulsing glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20 blur-md"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>

        {/* Bottom glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary/10 blur-2xl rounded-full -z-10"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </Link>
  );
}
