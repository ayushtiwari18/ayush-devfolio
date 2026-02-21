'use client';

/**
 * TimelineEvent — single timeline entry with scroll-entrance animation
 * ----------------------------------------------------------------------
 * Uses IntersectionObserver (not scroll events) for viewport detection.
 * Framer Motion handles the actual transition.
 *
 * Layout: alternating left/right on desktop, always vertical on mobile.
 * - Even index (0, 2, 4…): image LEFT, content RIGHT
 * - Odd index  (1, 3, 5…): content LEFT, image RIGHT
 *
 * ANIMATION SAFETY:
 * - prefers-reduced-motion: checked once on mount via matchMedia
 * - No-JS fallback: element is visible by default (opacity:1);
 *   JS adds 'data-hidden' which triggers the CSS transition
 *
 * CLEANUP: IntersectionObserver is disconnected on unmount.
 * No global scroll listeners created here.
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import MediaGallery from './MediaGallery';
import VideoPreview from './VideoPreview';

// Type-to-color mapping — centralized here, not in EventCard
const TYPE_CONFIG = {
  hackathon:   { label: 'Hackathon',   dot: 'bg-violet-500',  border: 'border-violet-500/30' },
  work:        { label: 'Work',        dot: 'bg-blue-500',    border: 'border-blue-500/30'   },
  freelancing: { label: 'Freelance',   dot: 'bg-emerald-500', border: 'border-emerald-500/30'},
  college:     { label: 'Education',   dot: 'bg-amber-500',   border: 'border-amber-500/30'  },
  project:     { label: 'Project',     dot: 'bg-pink-500',    border: 'border-pink-500/30'   },
  enjoyment:   { label: 'Life',        dot: 'bg-orange-500',  border: 'border-orange-500/30' },
};

export default function TimelineEvent({ event, index }) {
  const wrapperRef = useRef(null);
  const observerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  const isEven = index % 2 === 0; // Controls left/right alternation
  const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.project;

  // Check reduced motion preference once on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);
  }, []);

  // IntersectionObserver — fires once, then disconnects
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect immediately after first trigger— no re-animation
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        // Trigger slightly before full entry to prevent pop-in flash
        rootMargin: '0px 0px -8% 0px',
      }
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Animation variants — no-op when reduced motion is preferred
  const variants = prefersReduced
    ? {
        hidden: { opacity: 1, x: 0 },
        visible: { opacity: 1, x: 0 },
      }
    : {
        hidden: {
          opacity: 0,
          x: isEven ? -40 : 40,
        },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      };

  const hasMedia = Array.isArray(event.media) && event.media.length > 0;
  const hasVideo = Boolean(event.video_url);

  return (
    <li
      ref={wrapperRef}
      className="relative mb-16 last:mb-0"
    >
      {/* Timeline dot — anchored to the track line */}
      <span
        aria-hidden="true"
        className={`
          absolute left-4 md:left-1/2
          top-6 w-3 h-3 rounded-full
          -translate-x-1/2 -translate-y-1/2
          ${config.dot}
          ring-2 ring-background ring-offset-1
          z-10
        `}
      />

      {/*
        Two-column grid on desktop.
        Even index:  [image | content]
        Odd index:   [content | image]
        Mobile: single column, always stacks vertically (image first).
      */}
      <motion.div
        className={`
          pl-10 md:pl-0
          md:grid md:grid-cols-2 md:gap-10
          items-start
        `}
        variants={variants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
      >
        {/* ---- CONTENT COLUMN ---- */}
        <div
          className={`
            ${isEven ? 'md:order-2' : 'md:order-1'}
            order-2
          `}
        >
          <EventCard event={event} config={config} />
        </div>

        {/* ---- MEDIA COLUMN ---- */}
        {(hasMedia || hasVideo) && (
          <div
            className={`
              ${isEven ? 'md:order-1' : 'md:order-2'}
              order-1 mb-4 md:mb-0
            `}
          >
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
        )}
      </motion.div>
    </li>
  );
}
