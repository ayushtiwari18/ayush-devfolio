'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { ArrowDown } from 'lucide-react';

export default function ScrollIndicator() {
  return (
    <Link href={ROUTES.ABOUT} aria-label="Scroll to about section">
      <motion.div
        className="relative flex flex-col items-center gap-2 cursor-pointer group select-none"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="text-[10px] sm:text-xs font-mono-code font-semibold tracking-[0.2em] uppercase text-gray-400 group-hover:text-primary transition-colors">
          EXPLORE ARCHITECTURE
        </span>

        {/* Sleek Minimalist Mouse Capsule with sliding dot */}
        <div className="relative w-5 h-8 sm:w-6 sm:h-9 rounded-full border border-white/20 bg-white/[0.03] backdrop-blur-sm group-hover:border-primary/60 transition-colors flex justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-primary"
            animate={{
              y: [0, 10, 0],
              opacity: [0.8, 0.2, 0.8],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Subtle downward arrow */}
        <ArrowDown
          size={12}
          className="text-gray-500 group-hover:text-primary transition-all duration-300 group-hover:translate-y-0.5"
        />
      </motion.div>
    </Link>
  );
}
