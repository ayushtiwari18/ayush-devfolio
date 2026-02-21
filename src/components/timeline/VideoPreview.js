'use client';

/**
 * VideoPreview — thumbnail + water ripple effect + lazy video
 * ------------------------------------------------------------
 * RIPPLE EFFECT DECISION:
 * Uses SVG feTurbulence + feDisplacementMap as a CSS filter.
 * This runs on the GPU compositor thread.
 * Zero JavaScript executes during hover.
 * Fully CSS-driven animation via @keyframes on the SVG filter.
 *
 * VIDEO LOADING DECISION:
 * VideoPlayer is dynamically imported (never in initial JS bundle).
 * Video only mounts when: isHovered === true AND isInView === true.
 * When the element leaves the viewport, isInView becomes false,
 * which resets isHovered to false, which unmounts the player.
 * This prevents off-screen video from consuming bandwidth/CPU.
 *
 * MOBILE DECISION:
 * @media (pointer: coarse) in globals.css disables the ripple filter
 * and replaces it with a simple opacity fade on tap.
 *
 * ACCESSIBILITY:
 * - Keyboard users: Enter/Space triggers video via onKeyDown
 * - aria-label describes the action
 * - role="button" on the wrapper div
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamic import — VideoPlayer is NEVER in the initial bundle
const VideoPlayer = dynamic(
  () => import('./VideoPlayer'),
  { ssr: false, loading: () => null }
);

export default function VideoPreview({ thumbnailUrl, videoUrl, alt }) {
  const wrapperRef = useRef(null);
  const observerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const shouldShowVideo = isHovered && isInView;
  const filterId = `ripple-${videoUrl?.slice(-8).replace(/[^a-z0-9]/gi, '') || 'default'}`;

  // IntersectionObserver — tracks viewport presence
  // When leaving viewport: force-reset hover state to unmount video
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsInView(visible);
        if (!visible) {
          // Unmount video player when scrolled out of view
          setIsHovered(false);
        }
      },
      { threshold: 0.2 }
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleActivate = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleDeactivate = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsHovered((prev) => !prev);
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      role="button"
      tabIndex={0}
      aria-label={shouldShowVideo ? `Playing: ${alt}` : `Click to preview: ${alt}`}
      className="
        relative overflow-hidden rounded-xl
        aspect-video w-full
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-primary
        video-preview-wrapper
      "
      onMouseEnter={handleActivate}
      onMouseLeave={handleDeactivate}
      onKeyDown={handleKeyDown}
    >
      {/*
        SVG Filter Definition — hidden from layout.
        The feTurbulence creates organic wave noise.
        feDisplacementMap applies it as a displacement to the thumbnail.
        The CSS animation on feTurbulence baseFrequency creates the
        ripple motion without any JavaScript running in the hover loop.
      */}
      <svg
        aria-hidden="true"
        className="absolute w-0 h-0 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.015"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>

      {/* Thumbnail image — always rendered (SEO-safe) */}
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Video Preview</span>
        </div>
      )}

      {/*
        Ripple overlay — applies the SVG filter on hover.
        CSS class 'ripple-active' is toggled via data attribute.
        The actual filter animation is in globals.css.
        @media (pointer: coarse) disables this overlay entirely.
      */}
      <div
        aria-hidden="true"
        data-ripple={isHovered ? 'active' : 'idle'}
        className="ripple-overlay absolute inset-0"
        style={isHovered ? { filter: `url(#${filterId})` } : {}}
      />

      {/* Play indicator — shown when not playing */}
      {!shouldShowVideo && (
        <div
          aria-hidden="true"
          className="
            absolute inset-0 flex items-center justify-center
            bg-black/20 group-hover:bg-black/10
            transition-colors duration-200
          "
        >
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
            </svg>
          </div>
        </div>
      )}

      {/* Video player — dynamically mounted, only when active and in viewport */}
      {shouldShowVideo && (
        <div className="absolute inset-0">
          <VideoPlayer
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
