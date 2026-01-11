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

export default function Hero({ profile }) {
  const [showOrbits, setShowOrbits] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Solar System Background */}
      <div className="absolute inset-0 w-full h-full">
        <SolarSystem showOrbits={showOrbits} autoRotate={autoRotate} />
      </div>

      {/* Enhanced readability overlay - stronger on mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 md:from-black/50 md:via-black/30 md:to-black/70" />
      
      {/* Additional vignette effect for better focus */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50" />

      {/* Main Content - Improved Mobile Layout */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Content Container with Better Spacing */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            {/* Mobile: Vertical Stack | Desktop: Side by Side */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 py-12 lg:py-0">
              
              {/* Profile Image - Top on Mobile, Right on Desktop */}
              <div className="flex justify-center lg:justify-end lg:order-2 lg:flex-1">
                <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[400px]">
                  <ProfileImage imageUrl={profile?.image_url} />
                </div>
              </div>

              {/* Hero Content - Bottom on Mobile, Left on Desktop */}
              <div className="lg:order-1 lg:flex-1">
                <HeroContent profile={profile} />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Fixed Bottom with Better Visibility */}
        <div className="pb-8 lg:pb-12 flex justify-center">
          <ScrollIndicator />
        </div>
      </div>

      {/* Solar System Controls - Better Mobile Positioning */}
      <div className="absolute top-20 sm:top-24 right-2 sm:right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setShowOrbits(!showOrbits)}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-black/60 backdrop-blur-md border border-primary/30 rounded-lg text-xs sm:text-sm font-medium text-white hover:bg-primary/20 hover:border-primary transition-all shadow-lg shadow-primary/20"
          aria-label={showOrbits ? 'Hide orbits' : 'Show orbits'}
        >
          <span className="hidden sm:inline">{showOrbits ? 'Hide' : 'Show'} Orbits</span>
          <span className="sm:hidden">🔭</span>
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-black/60 backdrop-blur-md border border-primary/30 rounded-lg text-xs sm:text-sm font-medium text-white hover:bg-primary/20 hover:border-primary transition-all shadow-lg shadow-primary/20"
          aria-label={autoRotate ? 'Pause rotation' : 'Play rotation'}
        >
          <span className="hidden sm:inline">{autoRotate ? 'Pause' : 'Play'}</span>
          <span className="sm:hidden">{autoRotate ? '⏸️' : '▶️'}</span>
        </button>
      </div>

      {/* Decorative Elements for Style */}
      <div className="absolute top-1/4 left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-4 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </section>
  );
}
