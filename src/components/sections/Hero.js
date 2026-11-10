'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import HeroContent from './HeroContent';
import ProfileImage from './ProfileImage';
import ScrollIndicator from './ScrollIndicator';
import { HERO_COPY } from '@/lib/constants';

const SolarSystem = dynamic(
  () => import('@/components/animations/SolarSystem'),
  { ssr: false, loading: () => null }
);

/**
 * Hero — 7-phase cinematic reveal.
 *
 * Sequence:
 *   1. First paint is pure solid black (no placeholder clutter / dead skeletons).
 *   2. Solar System boots up into a complete black full-view cosmic stage.
 *   3. UI HUD elements (badge, name, title, CTAs, profile, controls) reveal sequentially.
 */
export default function Hero({ profile }) {
  const [showOrbits,  setShowOrbits]  = useState(false);
  const [autoRotate,  setAutoRotate]  = useState(true);
  const [sceneReady,  setSceneReady]  = useState(false);
  const [revealPhase, setRevealPhase] = useState(0);
  const timersRef    = useRef([]);
  const fallbackRef  = useRef(null);

  // 5-second fallback: if onReady never fires, start the reveal anyway
  useEffect(() => {
    fallbackRef.current = setTimeout(() => {
      if (!sceneReady) {
        handleSceneReady();
      }
    }, 5000);
    return () => clearTimeout(fallbackRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSceneReady = useCallback(() => {
    // Cancel the 5s fallback if WebGL loaded normally
    clearTimeout(fallbackRef.current);
    setSceneReady(true);
    // Allow the 3D Solar System to establish itself first in pure black view (~600ms)
    // then reveal UI elements sequentially one by one
    const delays = [600, 1000, 1400, 1800, 2200, 2600, 3000];
    timersRef.current = delays.map((d, i) =>
      setTimeout(() => {
        setRevealPhase(i + 1);
        if (i + 1 === 7 && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hero-navbar-show'));
        }
      }, d)
    );
  }, []);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const resolvedProfile = {
    name:        profile?.name        || HERO_COPY.name,
    title:       profile?.title       || HERO_COPY.title,
    description: profile?.description || HERO_COPY.description,
    image_url:   profile?.image_url   || null,
    rolling_texts: profile?.rolling_texts || null,
  };

  const reveal = (phase) => ({
    opacity:    revealPhase >= phase ? 1 : 0,
    transform:  revealPhase >= phase ? 'translateY(0)' : 'translateY(18px)',
    transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
  });

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* Solar System — pure black background on first paint, fades in smoothly when ready */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ opacity: sceneReady ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <SolarSystem showOrbits={showOrbits} autoRotate={autoRotate} onReady={handleSceneReady} />
      </div>

      {/* Left readability gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.0) 100%)' }}
      />

      {/* Content — pt-28 sm:pt-32 clears the floating navbar with generous breathing room */}
      <div className="relative z-10 min-h-screen flex flex-col pointer-events-none pt-28 sm:pt-32 pb-12">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 py-8 lg:py-0">

              {/* Profile image — phase 6 */}
              <div
                className="flex justify-center lg:justify-end lg:order-2 lg:flex-1"
                style={{
                  opacity:    revealPhase >= 6 ? 1 : 0,
                  transform:  revealPhase >= 6 ? 'translateX(0) scale(1)' : 'translateX(24px) scale(0.95)',
                  transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <div className="w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[360px] pointer-events-auto">
                  <ProfileImage imageUrl={resolvedProfile.image_url} />
                </div>
              </div>

              {/* Text — phases 1–5 */}
              <div className="lg:order-1 lg:flex-1 pointer-events-auto">
                <HeroContent profile={resolvedProfile} revealPhase={revealPhase} reveal={reveal} />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator — phase 7 */}
        <div
          className="pb-8 lg:pb-12 flex justify-center pointer-events-auto"
          style={{ opacity: revealPhase >= 7 ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <ScrollIndicator />
        </div>
      </div>

      {/* Controls — Docked in bottom-right corner to never collide with hero typography */}
      <div
        className="absolute bottom-20 right-3 sm:bottom-8 sm:right-8 z-20 flex sm:flex-col items-center sm:items-end gap-1.5 p-1.5 rounded-2xl bg-[#07090E]/85 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/80"
        style={{
          opacity: revealPhase >= 7 ? 1 : 0,
          transform: revealPhase >= 7 ? 'translateY(0)' : 'translateY(14px)',
          transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: revealPhase >= 7 ? 'auto' : 'none'
        }}
      >
        <button
          onClick={() => setShowOrbits(v => !v)}
          aria-label={showOrbits ? 'Hide orbit paths' : 'Show orbit paths'}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono-code transition-all ${
            showOrbits
              ? 'bg-primary text-white shadow-md shadow-primary/30'
              : 'text-muted-foreground hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="hidden sm:inline">{showOrbits ? '✓ Orbits ON' : 'Show Orbits'}</span>
          <span className="sm:hidden">{showOrbits ? '✓ Orbit' : '🔭 Orbit'}</span>
        </button>
        <button
          onClick={() => setAutoRotate(v => !v)}
          aria-label={autoRotate ? 'Pause rotation' : 'Resume rotation'}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono-code transition-all ${
            autoRotate
              ? 'bg-accent/20 text-accent border border-accent/40 shadow-sm'
              : 'text-muted-foreground hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="hidden sm:inline">{autoRotate ? '⏸ Orbiting' : '▶ Paused'}</span>
          <span className="sm:hidden">{autoRotate ? '⏸' : '▶'}</span>
        </button>
      </div>

      <div className="absolute top-1/4 left-6 w-40 h-40 bg-primary/8 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-6 w-48 h-48 bg-accent/8 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1.2s' }} />
    </section>
  );
}
