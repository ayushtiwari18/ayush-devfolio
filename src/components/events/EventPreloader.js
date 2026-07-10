'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventPreloader({ images = [] }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef(null);

  // 1. Preload all parallax images in the background
  useEffect(() => {
    if (images.length === 0) {
      setImagesLoaded(true);
      return;
    }

    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // Proceed even if an image fails
      });
    };

    Promise.all(images.map(preloadImage)).then(() => {
      setImagesLoaded(true);
    });
  }, [images]);

  // 2. Determine when to dismiss the loader
  useEffect(() => {
    if (imagesLoaded && videoEnded) {
      setIsLoading(false);
    }
  }, [imagesLoaded, videoEnded]);

  // Safety fallback: if video is missing or hangs, remove loader after 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader-wrapper"
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {/* Solid Background that fades away */}
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-background"
          />

          {/* Logo Video that plays with sound, then zooms into the screen */}
          <motion.video
            ref={videoRef}
            src="/logo-loader.mp4"
            autoPlay
            playsInline
            onEnded={() => setVideoEnded(true)}
            onError={() => setVideoEnded(true)} // If missing, proceed instantly
            initial={{ scale: 1, opacity: 1 }}
            exit={{ scale: 25, opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="relative z-10 w-full max-w-sm h-auto object-contain origin-center"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
