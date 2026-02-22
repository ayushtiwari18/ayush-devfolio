'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Code2 } from 'lucide-react';
import RippleEffectLayer from './RippleEffectLayer';

const VideoPreviewController = dynamic(
  () => import('./VideoPreviewController'),
  { ssr: false }
);

/**
 * ProjectHero
 * -----------
 * Full-width hero image with:
 *   - SVG ripple on hover (desktop only, respects prefers-reduced-motion)
 *   - 10-second delayed video autoplay
 *   - Click-to-play or YouTube redirect
 *
 * Client Component — owns mouseenter/leave state + heroRef for IntersectionObserver.
 */
export default function ProjectHero({ heroImage, coverImage, previewVideo, youtubeUrl, title }) {
  const heroRef = useRef(null);
  const [rippleActive, setRippleActive] = useState(false);

  const imageSrc = heroImage || coverImage || null;

  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20"
      style={{ aspectRatio: '16 / 7' }}
      onMouseEnter={() => setRippleActive(true)}
      onMouseLeave={() => setRippleActive(false)}
    >
      {/* Hero image */}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={`${title} project preview`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Code2 size={80} className="text-primary/20" />
        </div>
      )}

      {/* Ripple overlay — activated via CSS class, 0 JS in loop */}
      <div
        className="project-ripple-overlay"
        data-ripple={rippleActive ? 'active' : undefined}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          filter: rippleActive ? 'url(#project-hero-ripple)' : 'none',
          willChange: 'filter',
          transition: 'filter 0.3s ease',
          backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: rippleActive ? 1 : 0,
        }}
      />

      {/* Hidden SVG filter definition */}
      <RippleEffectLayer />

      {/* Video controller — dynamically imported, never in initial bundle */}
      {previewVideo && (
        <VideoPreviewController
          previewVideo={previewVideo}
          youtubeUrl={youtubeUrl}
          heroRef={heroRef}
        />
      )}

      {/* Bottom gradient for text legibility if overlay needed */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
    </div>
  );
}
