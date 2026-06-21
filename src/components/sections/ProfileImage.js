'use client';

import Image from 'next/image';

/**
 * ProfileImage — clean, no heavy ring disc.
 * Just the circular photo + soft glow underneath.
 * No Framer Motion loops — all CSS animations (compositor thread).
 * Reveal animation handled by parent Hero.js revealPhase transitions.
 */
export default function ProfileImage({ imageUrl }) {
  const src = imageUrl || '/images/profile.jpg';

  return (
    <div className="relative flex items-center justify-center w-full">

      {/* Soft ambient glow behind photo — does NOT look like a disc */}
      <div
        aria-hidden="true"
        className="absolute rounded-full profile-glow-pulse"
        style={{
          width: '110%',
          height: '110%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 40%, transparent 70%)',
          filter: 'blur(24px)',
        }}
      />

      {/* Photo container — clean circle, thin glow border only */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: 'min(260px, 72vw)',
          height: 'min(260px, 72vw)',
          boxShadow: '0 0 0 2px rgba(99,102,241,0.5), 0 0 32px rgba(99,102,241,0.3), 0 0 64px rgba(139,92,246,0.15)',
        }}
      >
        <Image
          src={src}
          alt="Ayush Tiwari — Full Stack Developer"
          fill
          className="object-cover object-top"
          priority
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 360px"
          onError={(e) => { e.currentTarget.src = '/placeholder-avatar.svg'; }}
        />

        {/* Subtle inner vignette so edges blend with dark background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, transparent 55%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>

      {/* Accent dots — two small glowing dots, CSS pulsed */}
      <div aria-hidden="true" className="absolute -top-1 right-4 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/60 profile-dot-pulse" />
      <div aria-hidden="true" className="absolute -bottom-1 left-4 w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/60 profile-dot-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}
