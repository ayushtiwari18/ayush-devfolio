'use client';

/**
 * TimelineEvent — single timeline entry with scroll-entrance animation
 * ----------------------------------------------------------------------
 * LAYOUT RULE (FINAL):
 * ALL events render two-column on desktop — always.
 * - Has real media/video → MediaGallery or VideoPreview in media column
 * - No media/video     → MediaFallback in media column
 * The media column is NEVER empty. Single-column layout is mobile-only.
 *
 * Alternating layout:
 * - Even index (0, 2, 4…): card LEFT  | media RIGHT
 * - Odd index  (1, 3, 5…): media LEFT | card RIGHT
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import MediaGallery from './MediaGallery';
import VideoPreview from './VideoPreview';
import MediaFallback from './MediaFallback';

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

  const isEven = index % 2 === 0;
  const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.project;

  const hasMedia = Array.isArray(event.media) && event.media.length > 0;
  const hasVideo = Boolean(event.video_url);
  const hasRealMedia = hasMedia || hasVideo;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

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

  // Cap stagger at index 3 — prevents excessive delay on deep items.
  // Items 0-3 stagger nicely (0ms → 210ms); everything after animates
  // immediately on scroll with no artificial wait.
  const staggerDelay = Math.min(index, 3) * 0.07;

  const variants = prefersReduced
    ? { hidden: { opacity: 1, x: 0, y: 0 }, visible: { opacity: 1, x: 0, y: 0 } }
    : {
        hidden:  { opacity: 0, x: isEven ? -36 : 36, y: 16 },
        visible: {
          opacity: 1, x: 0, y: 0,
          transition: {
            duration: 0.55,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: staggerDelay,
          },
        },
      };

  // Decide what goes in the media column
  const mediaSlot = hasVideo ? (
    <VideoPreview
      thumbnailUrl={event.media?.[0]?.url || null}
      videoUrl={event.video_url}
      alt={event.title}
    />
  ) : hasMedia ? (
    <MediaGallery media={event.media} title={event.title} />
  ) : (
    <MediaFallback type={event.type} title={event.title} />
  );

  return (
    <li
      ref={wrapperRef}
      className="relative mb-20 last:mb-0"
    >
      {/* Timeline dot */}
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
        {event.featured && (
          <span className={`absolute inline-flex w-5 h-5 rounded-full ${config.dot} opacity-40 animate-ping`} />
        )}
        <span className={`relative inline-flex w-4 h-4 rounded-full ${config.dot} ring-2 ring-background shadow-sm`} />
      </span>

      {/* Two-column layout — ALWAYS on desktop */}
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        className="pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-10 md:items-center"
      >
        {/* Card column */}
        <div className={isEven ? 'md:order-1' : 'md:order-2'}>
          <EventCard event={event} config={config} />
        </div>

        {/* Media column — real content OR fallback, never empty */}
        <div className={`${isEven ? 'md:order-2' : 'md:order-1'} mt-4 md:mt-0`}>
          {mediaSlot}
        </div>
      </motion.div>
    </li>
  );
}
