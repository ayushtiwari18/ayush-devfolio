'use client';

import Image from 'next/image';
import { useState } from 'react';
import { User, Sparkles } from 'lucide-react';

/**
 * ProfileImage — Cosmic Orbital Halo Architecture.
 *
 * Implements anti-slop celestial design:
 * 1. Dual counter-rotating concentric orbital rings (profile-ring-cw & profile-ring-ccw)
 * 2. Planetary satellite nodes anchored to the orbital paths
 * 3. 4-point cardinal precision ticks
 * 4. Micro-zoom hover physics (scale 1.03) masked cleanly inside the obsidian bezel
 * 5. Telemetric location/status capsule at the bottom
 */
export default function ProfileImage({ imageUrl }) {
  const [imgError, setImgError] = useState(false);

  const showImage = imageUrl && !imgError;

  return (
    <div className="relative flex flex-col items-center justify-center w-full select-none">
      
      {/* Outer wrapper maintaining aspect square with orbital margin */}
      <div className="relative flex items-center justify-center p-6 sm:p-8">

        {/* Ambient deep radial core glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full profile-glow-pulse pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(99,102,241,0.28) 0%, rgba(139,92,246,0.14) 45%, transparent 72%)',
            filter: 'blur(32px)',
          }}
        />

        {/* Outer Orbital Ring 1 (Clockwise, 20s) */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 sm:-inset-6 rounded-full border border-dashed border-indigo-500/25 profile-ring-cw pointer-events-none"
        >
          {/* Planetary satellite orb 1 */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.95)]" />
        </div>

        {/* Inner Orbital Ring 2 (Counter-Clockwise, 15s) */}
        <div
          aria-hidden="true"
          className="absolute inset-1 sm:inset-2 rounded-full border border-dotted border-purple-400/20 profile-ring-ccw pointer-events-none"
        >
          {/* Planetary satellite orb 2 */}
          <div className="absolute -bottom-1 right-1/4 w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(168,85,247,0.9)]" />
        </div>

        {/* Cardinal Precision Notches (N, S, E, W) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-white/[0.06] pointer-events-none"
        >
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-primary/60" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-0.5 bg-primary/60" />
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 h-1.5 w-0.5 bg-primary/60" />
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-1.5 w-0.5 bg-primary/60" />
        </div>

        {/* Primary Photo Obsidian Bezel */}
        <div
          className="group relative rounded-full overflow-hidden bg-[#0A0D14] flex items-center justify-center transition-all duration-500"
          style={{
            width: 'min(260px, 68vw)',
            height: 'min(260px, 68vw)',
            boxShadow:
              '0 0 0 2px rgba(99,102,241,0.4), inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 40px rgba(99,102,241,0.3), 0 0 80px rgba(139,92,246,0.15)',
          }}
        >
          {showImage ? (
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={imageUrl}
                alt="Ayush Tiwari — Full Stack Systems & Cloud Engineer"
                fill
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                priority
                sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 360px"
                onError={() => setImgError(true)}
                unoptimized={imageUrl.includes('supabase.co')}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/15 via-[#0B0F19] to-accent/15">
              <User size={80} className="text-primary/60 mb-1" />
              <span className="text-[11px] font-mono-code text-gray-400">AT // SYSTEMS</span>
            </div>
          )}

          {/* Inner Vignette for seamless atmospheric blend */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, transparent 58%, rgba(5,7,14,0.65) 100%)',
            }}
          />
        </div>

      </div>

      {/* Engineering Telemetry Capsule */}
      <div className="relative -mt-3 sm:-mt-4 z-20 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#080C14]/90 border border-white/15 backdrop-blur-xl shadow-xl shadow-black/80">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] font-mono-code font-medium text-gray-300 tracking-tight">
          SYS // <span className="text-emerald-400 font-semibold">ONLINE</span> · 5,600+ COMMITS
        </span>
      </div>

    </div>
  );
}
