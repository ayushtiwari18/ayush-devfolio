'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Mail, FileDown } from 'lucide-react';

const RESUME_URL = '/resume.pdf';

/**
 * HeroContent — NO glassmorphism panel, NO backdrop-blur.
 * Text sits directly on the solar system background.
 * Readability via text-shadow only — does not obscure planets.
 * Reveal animation handled by parent Hero.js (revealPhase CSS transitions).
 */
export default function HeroContent({ profile }) {
  const textShadow = '0 2px 12px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)';

  return (
    <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">

      {/* Available badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/30 rounded-full text-xs sm:text-sm text-primary mb-4 sm:mb-6 backdrop-blur-sm"
      >
        <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-primary" />
        </span>
        <span className="font-medium">Available for opportunities</span>
      </div>

      {/* Name */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-3 sm:mb-4 leading-tight tracking-tight"
        style={{ textShadow }}
      >
        Hi, I&apos;m{' '}
        <span className="block sm:inline mt-2 sm:mt-0">
          <span className="gradient-text">{profile?.name || 'Ayush Tiwari'}</span>
        </span>
      </h1>

      {/* Title */}
      <h2
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-200 mb-3 sm:mb-4"
        style={{ textShadow }}
      >
        {profile?.title || 'Full Stack Developer'}
      </h2>

      {/* Description */}
      <p
        className="text-sm sm:text-base md:text-lg text-gray-300 max-w-xl mb-6 sm:mb-8 leading-relaxed"
        style={{ textShadow: '0 1px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9)' }}
      >
        {profile?.description ||
          'I build production-grade web systems using MERN Stack, Next.js, Three.js, and AWS. My research on network security is published in Springer. AWS certified — 5,600+ GitHub commits, 885+ DSA problems solved.'}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">

        {/* PRIMARY — solid gradient */}
        <Link href={ROUTES.PROJECTS} className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all hover:scale-105 border-0"
          >
            View My Work <ArrowRight className="ml-2" size={20} />
          </Button>
        </Link>

        {/* SECONDARY — ghost */}
        <Link href={ROUTES.CONTACT} className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border border-white/30 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 hover:border-white/50 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl transition-all hover:scale-105"
          >
            <Mail className="mr-2" size={20} /> Get In Touch
          </Button>
        </Link>

        {/* TERTIARY — minimal */}
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download Ayush Tiwari's resume"
          className="w-full sm:w-auto"
        >
          <Button
            size="lg"
            variant="ghost"
            className="w-full sm:w-auto border border-white/15 bg-transparent text-gray-400 hover:text-white hover:bg-black/30 hover:border-white/30 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl transition-all hover:scale-105"
          >
            <FileDown className="mr-2" size={20} /> Resume
          </Button>
        </a>
      </div>
    </div>
  );
}
