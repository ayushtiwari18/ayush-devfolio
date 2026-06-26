'use client';

import Image from 'next/image';
import { useState } from 'react';
import { User } from 'lucide-react';

/**
 * ProfileImage
 * - If imageUrl is a valid URL: renders Next.js <Image>
 * - On load error OR no imageUrl: renders a styled placeholder div (no broken img, no infinite loop)
 */
export default function ProfileImage({ imageUrl }) {
  const [imgError, setImgError] = useState(false);

  const showImage = imageUrl && !imgError;

  return (
    <div className="relative flex items-center justify-center w-full">

      {/* Ambient glow */}
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

      {/* Photo container */}
      <div
        className="relative rounded-full overflow-hidden bg-muted flex items-center justify-center"
        style={{
          width: 'min(260px, 72vw)',
          height: 'min(260px, 72vw)',
          boxShadow: '0 0 0 2px rgba(99,102,241,0.5), 0 0 32px rgba(99,102,241,0.3), 0 0 64px rgba(139,92,246,0.15)',
        }}
      >
        {showImage ? (
          <Image
            src={imageUrl}
            alt="Ayush Tiwari — Full Stack Developer"
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 360px"
            onError={() => setImgError(true)}
            unoptimized={imageUrl.includes('supabase.co')}
          />
        ) : (
          // Fallback: initials avatar — no broken image, no file needed in public/
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <User size={80} className="text-primary/60" />
          </div>
        )}

        {/* Inner vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, transparent 55%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </div>

      {/* Accent dots */}
      <div aria-hidden="true" className="absolute -top-1 right-4 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/60 profile-dot-pulse" />
      <div aria-hidden="true" className="absolute -bottom-1 left-4 w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/60 profile-dot-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}
