'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Mail, FileDown } from 'lucide-react';

const RESUME_URL = '/resume.pdf';

const textShadow = '0 2px 16px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)';

export default function HeroContent({ profile, revealPhase, reveal }) {
  return (
    <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">

      {/* Phase 1 — Badge */}
      <div style={reveal(1)}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/30 rounded-full text-xs sm:text-sm text-primary mb-4 sm:mb-6 backdrop-blur-sm">
          <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-primary" />
          </span>
          <span className="font-medium">Available for opportunities</span>
        </div>
      </div>

      {/* Phase 2 — Name */}
      <div style={reveal(2)}>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-3 sm:mb-4 leading-tight tracking-tight"
          style={{ textShadow }}
        >
          Hi, I&apos;m{' '}
          <span className="text-primary">
            {profile?.name || 'Ayush Tiwari'}
          </span>
        </h1>
      </div>

      {/* Phase 3 — Title */}
      <div style={reveal(3)}>
        <h2
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-100 mb-3 sm:mb-4"
          style={{ textShadow }}
        >
          {profile?.title || 'Full Stack Developer'}
        </h2>
      </div>

      {/* Phase 4 — Description */}
      <div style={reveal(4)}>
        <p
          className="text-sm sm:text-base md:text-lg text-gray-300 max-w-xl mb-6 sm:mb-8 leading-relaxed"
          style={{ textShadow: '0 1px 10px rgba(0,0,0,0.98)' }}
        >
          {profile?.description ||
            'I build production-grade web systems using MERN Stack, Next.js, Three.js, and AWS. My research on network security is published in Springer. AWS certified — 5,600+ GitHub commits, 885+ DSA problems solved.'}
        </p>
      </div>

      {/* Phase 5 — Buttons */}
      <div style={reveal(5)}>
        <div className="flex flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap">

          {/* PRIMARY */}
          <Link href={ROUTES.PROJECTS}>
            <Button
              size="lg"
              className="h-12 px-6 sm:px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm sm:text-base font-semibold rounded-xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all hover:scale-105 border-0 whitespace-nowrap"
            >
              View My Work <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>

          {/* SECONDARY */}
          <Link href={ROUTES.CONTACT}>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 sm:px-8 border border-white/30 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 hover:border-white/50 text-sm sm:text-base font-semibold rounded-xl transition-all hover:scale-105 whitespace-nowrap"
            >
              <Mail className="mr-2" size={18} /> Get In Touch
            </Button>
          </Link>

          {/* TERTIARY */}
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" aria-label="Download resume">
            <Button
              size="lg"
              variant="ghost"
              className="h-12 px-6 sm:px-8 border border-white/15 bg-transparent text-gray-400 hover:text-white hover:bg-black/30 hover:border-white/30 text-sm sm:text-base font-semibold rounded-xl transition-all hover:scale-105 whitespace-nowrap"
            >
              <FileDown className="mr-2" size={18} /> Resume
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
