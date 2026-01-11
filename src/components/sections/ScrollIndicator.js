'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function ScrollIndicator() {
  return (
    <Link href={ROUTES.ABOUT}>
      <motion.div
        className="relative flex flex-col items-center gap-3 cursor-pointer group"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
          Scroll down
        </span>

        {/* Animated mouse icon */}
        <motion.div
          className="relative w-6 h-10 border-2 border-muted-foreground group-hover:border-primary rounded-full flex items-start justify-center p-2 transition-colors"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-muted-foreground group-hover:bg-primary rounded-full transition-colors"
            animate={{
              y: [0, 12, 0],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Glowing background effect */}
        <motion.div
          className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
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
