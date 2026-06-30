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
 * StarfieldSkeleton — HYDRATION SAFE.
 * Stars generated once on client via useEffect, never on server.
 */
function StarfieldSkeleton() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      w:     (((i * 7  + 13) % 20) / 10 + 0.5).toFixed(2),
      h:     (((i * 11 +  7) % 20) / 10 + 0.5).toFixed(2),
      top:   (((i * 37 + 19) % 1000) / 10).toFixed(2),
      left:  (((i * 53 + 23) % 1000) / 10).toFixed(2),
      opacity: (0.4 + ((i * 17) % 60) / 100).toFixed(2),
      dur:   (1.5 + ((i * 29) % 20) / 10).toFixed(2),
      delay: ((i * 43) % 200 / 100).toFixed(2),
    }));
    setStars(generated);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d1a2e 0%, #000008 65%, #000000 100%)' }}
    >
      {stars.length > 0 && (
        <div className="absolute inset-0" style={{ opacity: 0.7 }}>
          {stars.map((s) => (
            <span
              key={s.id}
              className="absolute rounded-full bg-white"
              style={{
                width:          s.w + 'px',
                height:         s.h + 'px',
                top:            s.top + '%',
                left:           s.left + '%',
                opacity:        s.opacity,
                animation:      `pulse ${s.dur}s ease-in-out infinite`,
                animationDelay: s.delay + 's',
              }}
            />
          ))}
        </div>
      )}
      <div
        className="absolute rounded-full"
        style={{
          width: 120, height: 120,
          top: '50%', left: '38%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(255,200,60,0.35) 0%, rgba(255,100,0,0.12) 45%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
}

/**
 * Hero — 7-phase cinematic reveal.
 *
 * Animation sequence (intentional, unchanged):
 *   Solar System loads first → onReady fires → text phases in 1-by-1 → image last.
 *
 * What changed in this version:
 *   1. Controls moved from z-20 → z-10  (was colliding with navbar z-50)
 *   2. 5s timeout fallback: if WebGL never fires onReady (slow device / no GPU),
 *      revealPhase starts automatically so content is never permanently hidden.
 *      On normal devices this timeout is cancelled and never fires.
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
    const delays = [500, 900, 1300, 1700, 2100, 2700, 3000];
    timersRef.current = delays.map((d, i) =>
      setTimeout(() => setRevealPhase(i + 1), d)
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
  };

  const reveal = (phase) => ({
    opacity:    revealPhase >= phase ? 1 : 0,
    transform:  revealPhase >= phase ? 'translateY(0)' : 'translateY(18px)',
    transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
  });

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* Solar System */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ opacity: sceneReady ? 1 : 0, transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <SolarSystem showOrbits={showOrbits} autoRotate={autoRotate} onReady={handleSceneReady} />
      </div>

      {/* Skeleton — fades out when solar system ready */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: sceneReady ? 0 : 1, transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <StarfieldSkeleton />
      </div>

      {/* Left readability gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.0) 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 py-12 lg:py-0">

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

      {/* Controls — z-10 (was z-20, was colliding with navbar) */}
      <div
        className="absolute top-20 sm:top-24 right-2 sm:right-4 z-10 flex flex-col gap-2"
        style={{ opacity: sceneReady ? 1 : 0, transition: 'opacity 0.6s ease 1.8s', pointerEvents: sceneReady ? 'auto' : 'none' }}
      >
        <button
          onClick={() => setShowOrbits(v => !v)}
          aria-label={showOrbits ? 'Hide orbit paths' : 'Show orbit paths'}
          className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-md rounded-lg text-xs sm:text-sm font-medium transition-all shadow-lg ${
            showOrbits
              ? 'bg-primary/30 border-2 border-primary text-white'
              : 'bg-black/60 border border-primary/30 text-white hover:bg-primary/20'
          }`}
        >
          <span className="hidden sm:inline">{showOrbits ? '✓ Orbits ON' : 'Show Orbits'}</span>
          <span className="sm:hidden">{showOrbits ? '✓' : '🔭'}</span>
        </button>
        <button
          onClick={() => setAutoRotate(v => !v)}
          aria-label={autoRotate ? 'Pause rotation' : 'Resume rotation'}
          className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-md rounded-lg text-xs sm:text-sm font-medium transition-all shadow-lg ${
            autoRotate
              ? 'bg-accent/30 border-2 border-accent text-white'
              : 'bg-black/60 border border-primary/30 text-white hover:bg-primary/20'
          }`}
        >
          <span className="hidden sm:inline">{autoRotate ? '⏸ Playing' : '▶ Paused'}</span>
          <span className="sm:hidden">{autoRotate ? '⏸' : '▶'}</span>
        </button>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-lg text-xs text-gray-400 border border-white/10">
          <div className={`w-2 h-2 rounded-full ${autoRotate ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span>{autoRotate ? 'Live' : 'Paused'}</span>
        </div>
      </div>

      <div className="absolute top-1/4 left-6 w-40 h-40 bg-primary/8 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-6 w-48 h-48 bg-accent/8 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1.2s' }} />
    </section>
  );
}
