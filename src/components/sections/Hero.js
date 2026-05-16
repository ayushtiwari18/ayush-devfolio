'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import HeroContent from './HeroContent';
import ProfileImage from './ProfileImage';
import ScrollIndicator from './ScrollIndicator';
import { HERO_COPY } from '@/lib/constants';

// Lazy load Solar System (heavy Three.js component — never touches SSR)
const SolarSystem = dynamic(() => import('@/components/animations/SolarSystem'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-primary/80 text-sm font-medium tracking-wide">Initialising universe…</p>
      </div>
    </div>
  ),
});

// WaterRipple intentionally removed — was killing readability + performance

export default function Hero({ profile }) {
  const [showOrbits, setShowOrbits] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Merge Supabase profile with HERO_COPY fallbacks so hero copy is never blank
  const resolvedProfile = {
    name: profile?.name || HERO_COPY.name,
    title: profile?.title || HERO_COPY.title,
    description: profile?.description || HERO_COPY.description,
    image_url: profile?.image_url || null,
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* ── Solar System Background ── */}
      <div className="absolute inset-0 w-full h-full">
        <SolarSystem showOrbits={showOrbits} autoRotate={autoRotate} />
      </div>

      {/* ── Readability gradient (no WaterRipple) ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75 pointer-events-none" />

      {/* ── Main Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 py-12 lg:py-0">
              <div className="flex justify-center lg:justify-end lg:order-2 lg:flex-1">
                <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] pointer-events-auto">
                  <ProfileImage imageUrl={resolvedProfile.image_url} />
                </div>
              </div>
              <div className="lg:order-1 lg:flex-1 pointer-events-auto">
                <HeroContent profile={resolvedProfile} />
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

      {/* ── Subtle ambient glows ── */}
      <div className="absolute top-1/4 left-6 w-40 h-40 bg-primary/8 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-6 w-48 h-48 bg-accent/8 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1.2s' }} />
    </section>
  );
}
