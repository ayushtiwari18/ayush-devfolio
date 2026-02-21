'use client';

/**
 * TimelineEvent — single timeline entry with scroll-entrance animation
 * ----------------------------------------------------------------------
 * POLISH CHANGES:
 * - Dot: 12px → 16px, pulse ring on featured events
 * - Spacing: mb-16 → mb-20
 * - Animation: x + y + opacity entrance with per-index stagger
 * - Content-only layout: card constrained to left column on desktop
 *   even when no media exists (track line stays visible)
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import MediaGallery from './MediaGallery';
import VideoPreview from './VideoPreview';

const TYPE_CONFIG = {
  hackathon:   { label: 'Hackathon',   dot: 'bg-violet-500',  border: 'border-violet-500/40',  glow: '139, 92, 246'  },
  work:        { label: 'Work',        dot: 'bg-blue-500',    border: 'border-blue-500/40',    glow: '59, 130, 246'  },
  freelancing: { label: 'Freelance',   dot: 'bg-emerald-500', border: 'border-emerald-500/40', glow: '16, 185, 129'  },
  college:     { label: 'Education',   dot: 'bg-amber-500',   border: 'border-amber-500/40',   glow: '245, 158, 11'  },
  project:     { label: 'Project',     dot: 'bg-pink-500',    border: 'border-pink-500/40',    glow: '236, 72, 153'  },
  enjoyment:   { label: 'Life',        dot: 'bg-orange-500',  border: 'border-orange-500/40',  glow: '249, 115, 22'  },
};

export default function TimelineEvent({ event, index }) {
  const wrapperRef  = useRef(null);
  const observerRef = useRef(null);
  const [isVisible,      setIsVisible]      = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  const isEven  = index % 2 === 0;
  const config  = TYPE_CONFIG[event.type] || TYPE_CONFIG.project;
  const hasMedia = Array.isArray(event.media) && event.media.length > 0;
  const hasVideo = Boolean(event.video_url);
  const hasContent = hasMedia || hasVideo;

  // Check reduced motion once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // IntersectionObserver — fires once, then disconnects
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, []);

  // Richer entrance: x + y + opacity, staggered per index
  const staggerDelay = index * 0.07;
  const variants = prefersReduced
    ? { hidden: { opacity: 1, x: 0, y: 0 }, visible: { opacity: 1, x: 0, y: 0 } }
    : {
        hidden:  { opacity: 0, x: isEven ? -36 : 36, y: 16 },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.55,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: staggerDelay,
          },
        },
      };

  return (
    <li
      ref={wrapperRef}
      className="relative mb-20 last:mb-0"
    >
      {/* ---- TIMELINE DOT ---- */}
      <span
        aria-hidden="true"
        className="
          absolute left-5 md:left-1/2
          top-7
          -translate-x-1/2 -translate-y-1/2
          z-10
          flex items-center justify-center
        "
      >
        {/* Pulse ring — only on featured events */}
        {event.featured && (
          <span
            className={`
              absolute inline-flex
              w-5 h-5 rounded-full
              ${config.dot} opacity-40
              animate-ping
            `}
          />
        )}
        {/* Solid dot */}
        <span
          className={`
            relative inline-flex
            w-4 h-4 rounded-full
            ${config.dot}
            ring-2 ring-background
            shadow-sm
          `}
        />
      </span>

      {/*
        LAYOUT STRATEGY:
        - Has media/video → two-column grid (image + card, alternating)
        - No media       → card constrained to left 55% on desktop,
                           right 45% stays empty so the track line
                           remains visually exposed and the layout
                           reads as a proper timeline (not a blog list)
      */}
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        className="pl-12 md:pl-0"
      >
        {hasContent ? (
          /* TWO-COLUMN: media present */
          <div className="md:grid md:grid-cols-2 md:gap-10 items-center">
            <div className={isEven ? 'md:order-2' : 'md:order-1'}>
              <EventCard event={event} config={config} />
            </div>
            <div className={`${isEven ? 'md:order-1' : 'md:order-2'} mb-4 md:mb-0`}>
              {hasVideo ? (
                <VideoPreview
                  thumbnailUrl={event.media?.[0]?.url || null}
                  videoUrl={event.video_url}
                  alt={event.title}
                />
              ) : (
                <MediaGallery media={event.media} title={event.title} />
              )}
            </div>
          </div>
        ) : (
          /* SINGLE-COLUMN: no media — constrain to left column on desktop */
          <div className="md:grid md:grid-cols-2">
            <div className={isEven ? 'md:col-start-1 md:pr-8' : 'md:col-start-2 md:pl-8'}>
              <EventCard event={event} config={config} />
            </div>
          </div>
        )}
      </motion.div>
    </li>
  );
}
