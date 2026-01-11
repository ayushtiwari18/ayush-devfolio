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
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="text-white">Loading Solar System...</div>
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

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Section - Profile Image */}
        <div className="flex-1 flex items-center justify-center pt-24 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4">
            {/* Left: Hero Content */}
            <div className="order-2 lg:order-1">
              <HeroContent profile={profile} />
            </div>

            {/* Right: Profile Image */}
            <div className="order-1 lg:order-2 flex justify-center">
              <ProfileImage imageUrl={profile?.image_url} />
            </div>
          </div>
        </div>

        {/* Bottom Section - Scroll Indicator */}
        <div className="pb-12 flex justify-center">
          <ScrollIndicator />
        </div>
      </div>

      {/* Solar System Controls */}
      <div className="absolute top-24 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setShowOrbits(!showOrbits)}
          className="px-4 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg text-sm font-medium text-foreground hover:bg-primary/20 hover:border-primary transition-all"
        >
          {showOrbits ? 'Hide' : 'Show'} Orbits
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="px-4 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg text-sm font-medium text-foreground hover:bg-primary/20 hover:border-primary transition-all"
        >
          {autoRotate ? 'Pause' : 'Play'} Rotation
        </button>
      </div>
    </section>
  );
}
