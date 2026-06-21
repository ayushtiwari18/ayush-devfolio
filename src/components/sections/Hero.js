'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import HeroContent from './HeroContent';
import ProfileImage from './ProfileImage';
import ScrollIndicator from './ScrollIndicator';
import { HERO_COPY } from '@/lib/constants';

const SolarSystem = dynamic(
  () => import('@/components/animations/SolarSystem'),
  { ssr: false, loading: () => <StarfieldSkeleton /> }
);

function StarfieldSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-black overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #0d1a2e 0%, #000008 65%, #000000 100%)',
      }}
    >
      <div className="absolute inset-0" style={{ opacity: 0.7 }}>
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5 + 'px',
              height: Math.random() * 2 + 0.5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: 0.4 + Math.random() * 0.5,
              animation: `pulse ${1.5 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: Math.random() * 2 + 's',
            }}
          />
        ))}
      </div>
      <div
        className="absolute rounded-full"
        style={{
          width: 120, height: 120,
          top: '50%', left: '38%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,200,60,0.35) 0%, rgba(255,100,0,0.12) 45%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
    </div>
  );
}

/**
 * revealPhase controls the orchestrated reveal sequence:
 *   0 = solar system loading (skeleton visible)
 *   1 = solar system ready -> profile image fades in (400ms after onReady)
 *   2 = text + buttons slide in (600ms after phase 1)
 */
export default function Hero({ profile }) {
  const [showOrbits,  setShowOrbits]  = useState(false);
  const [autoRotate,  setAutoRotate]  = useState(true);
  const [sceneReady,  setSceneReady]  = useState(false);
  const [revealPhase, setRevealPhase] = useState(0);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
    // Phase 1: image reveals 400ms after solar system is ready
    setTimeout(() => setRevealPhase(1), 400);
    // Phase 2: text + buttons reveal 1000ms after solar system
    setTimeout(() => setRevealPhase(2), 1000);
  }, []);

  const resolvedProfile = {
    name:        profile?.name        || HERO_COPY.name,
    title:       profile?.title       || HERO_COPY.title,
    description: profile?.description || HERO_COPY.description,
    image_url:   profile?.image_url   || null,
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* Solar System background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: sceneReady ? 1 : 0,
          transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <SolarSystem showOrbits={showOrbits} autoRotate={autoRotate} onReady={handleSceneReady} />
      </div>

      {/* Skeleton stays until solar system fades in */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: sceneReady ? 0 : 1,
          transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <StarfieldSkeleton />
      </div>

      {/* Subtle readability gradient - very light so planets stay visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.0) 100%)',
        }}
      />

      {/* Main content layout */}
      <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 py-12 lg:py-0">

              {/* Profile image — Phase 1 reveal */}
              <div
                className="flex justify-center lg:justify-end lg:order-2 lg:flex-1"
                style={{
                  opacity:   revealPhase >= 1 ? 1 : 0,
                  transform: revealPhase >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.94)',
                  transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <div className="w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[360px] pointer-events-auto">
                  <ProfileImage imageUrl={resolvedProfile.image_url} />
                </div>
              </div>

              {/* Text — Phase 2 reveal */}
              <div
                className="lg:order-1 lg:flex-1 pointer-events-auto"
                style={{
                  opacity:   revealPhase >= 2 ? 1 : 0,
                  transform: revealPhase >= 2 ? 'translateX(0)' : 'translateX(-24px)',
                  transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <HeroContent profile={resolvedProfile} />
              </div>
            </div>
          </div>
        </div>

        <div className="pb-8 lg:pb-12 flex justify-center pointer-events-auto"
          style={{
            opacity: revealPhase >= 2 ? 1 : 0,
            transition: 'opacity 0.6s ease 0.4s',
          }}
        >
          <ScrollIndicator />
        </div>
      </div>

      {/* Controls */}
      <div
        className="absolute top-20 sm:top-24 right-2 sm:right-4 z-20 flex flex-col gap-2"
        style={{
          opacity: sceneReady ? 1 : 0,
          transition: 'opacity 0.6s ease 0.4s',
          pointerEvents: sceneReady ? 'auto' : 'none',
        }}
      >
        <button
          onClick={() => setShowOrbits(v => !v)}
          aria-label={showOrbits ? 'Hide orbit paths' : 'Show orbit paths'}
          className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-md rounded-lg text-xs sm:text-sm font-medium transition-all shadow-lg ${
            showOrbits
              ? 'bg-primary/30 border-2 border-primary text-white shadow-primary/50'
              : 'bg-black/60 border border-primary/30 text-white hover:bg-primary/20 hover:border-primary'
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
              ? 'bg-accent/30 border-2 border-accent text-white shadow-accent/50'
              : 'bg-black/60 border border-primary/30 text-white hover:bg-primary/20 hover:border-primary'
          }`}
        >
          <span className="hidden sm:inline">{autoRotate ? '⏸ Playing' : '▶ Paused'}</span>
          <span className="sm:hidden">{autoRotate ? '⏸' : '▶'}</span>
        </button>
        <div className="hidden sm:flex items-center justify-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-lg text-xs text-gray-400 border border-white/10">
          <div className={`w-2 h-2 rounded-full ${autoRotate ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span>{autoRotate ? 'Live' : 'Paused'}</span>
        </div>
      </div>

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-6 w-40 h-40 bg-primary/8 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-6 w-48 h-48 bg-accent/8 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1.2s' }} />
    </section>
  );
}
