'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import HeroContent from './HeroContent';
import ProfileImage from './ProfileImage';
import ScrollIndicator from './ScrollIndicator';

// Lazy load Solar System (heavy Three.js component)
const SolarSystem = dynamic(() => import('@/components/animations/SolarSystem'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black via-primary/5 to-accent/5">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-primary font-medium">Loading Universe...</p>
      </div>
    </div>
  ),
});

// Lazy-load ripple so it never blocks SSR or the main bundle
const WaterRipple = dynamic(() => import('@/components/animations/WaterRipple'), {
  ssr: false,
  loading: () => null,
});

export default function Hero({ profile }) {
  const [showOrbits, setShowOrbits] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const handleOrbitToggle = () => setShowOrbits(v => !v);
  const handleRotationToggle = () => setAutoRotate(v => !v);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* ── Solar System Background ── */}
      <div className="absolute inset-0 w-full h-full">
        <SolarSystem showOrbits={showOrbits} autoRotate={autoRotate} />
      </div>

      {/* ── Water Ripple overlay (blends on top of solar system) ── */}
      <WaterRipple />

      {/* ── Readability overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 md:from-black/50 md:via-black/30 md:to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50 pointer-events-none" />

      {/* ── Main Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 py-12 lg:py-0">
              <div className="flex justify-center lg:justify-end lg:order-2 lg:flex-1">
                <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] pointer-events-auto">
                  <ProfileImage imageUrl={profile?.image_url} />
                </div>
              </div>
              <div className="lg:order-1 lg:flex-1 pointer-events-auto">
                <HeroContent profile={profile} />
              </div>
            </div>
          </div>
        </div>
        <div className="pb-8 lg:pb-12 flex justify-center pointer-events-auto">
          <ScrollIndicator />
        </div>
      </div>

      {/* ── Solar System Controls ── */}
      <div className="absolute top-20 sm:top-24 right-2 sm:right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleOrbitToggle}
          className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-md rounded-lg text-xs sm:text-sm font-medium transition-all shadow-lg ${
            showOrbits
              ? 'bg-primary/30 border-2 border-primary text-white shadow-primary/50'
              : 'bg-black/60 border border-primary/30 text-white hover:bg-primary/20 hover:border-primary shadow-primary/20'
          }`}
        >
          <span className="hidden sm:inline">{showOrbits ? '✓ Orbits ON' : 'Show Orbits'}</span>
          <span className="sm:hidden text-base">{showOrbits ? '✓' : '🔭'}</span>
        </button>

        <button
          onClick={handleRotationToggle}
          className={`px-3 py-2 sm:px-4 sm:py-2 backdrop-blur-md rounded-lg text-xs sm:text-sm font-medium transition-all shadow-lg ${
            autoRotate
              ? 'bg-accent/30 border-2 border-accent text-white shadow-accent/50'
              : 'bg-black/60 border border-primary/30 text-white hover:bg-primary/20 hover:border-primary shadow-primary/20'
          }`}
        >
          <span className="hidden sm:inline">{autoRotate ? '⏸️ Playing' : '▶️ Paused'}</span>
          <span className="sm:hidden text-base">{autoRotate ? '⏸️' : '▶️'}</span>
        </button>

        <div className="hidden sm:flex items-center justify-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-lg text-xs text-gray-400 border border-white/10">
          <div className={`w-2 h-2 rounded-full ${autoRotate ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span>{autoRotate ? 'Live' : 'Paused'}</span>
        </div>
      </div>

      {/* ── Ambient glow accents ── */}
      <div className="absolute top-1/4 left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-4 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
    </section>
  );
}
