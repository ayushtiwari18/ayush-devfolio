'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventPreloader({ images = [] }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (images.length === 0) {
      setProgress(100);
      return;
    }

    let loadedCount = 0;
    const total = images.length;

    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        const complete = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / total) * 100));
          resolve();
        };
        img.onload = complete;
        img.onerror = complete;
      });
    };

    // To ensure the animation feels cinematic and doesn't just flash on cached loads
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 800));
    
    Promise.all([Promise.all(images.map(preloadImage)), minTimePromise]).then(() => {
      setProgress(100);
    });
  }, [images]);

  useEffect(() => {
    let timeout;
    if (progress === 100) {
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 500); // brief hold at 100%
    }
    return () => clearTimeout(timeout);
  }, [progress]);

  // Safety fallback: if images hang, force close after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="cinematic-preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background pointer-events-none"
          initial={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ 
            clipPath: 'inset(0% 0% 100% 0%)',
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          <div className="flex flex-col items-center relative z-10">
            {/* Number Counter */}
            <div className="overflow-hidden mb-6">
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="text-7xl md:text-9xl font-black text-foreground tracking-tighter tabular-nums"
              >
                {progress}
                <span className="text-primary text-4xl md:text-6xl">%</span>
              </motion.div>
            </div>

            {/* Premium Thin Progress Line */}
            <div className="w-64 md:w-80 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            
            {/* Subtext */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-6 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                Preparing Experience
              </p>
            </motion.div>
          </div>
          
          {/* Subtle Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.05)_0%,transparent_60%)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
