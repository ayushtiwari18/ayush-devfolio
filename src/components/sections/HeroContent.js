'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Mail, FileDown, Github, Linkedin, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const textShadow = '0 2px 16px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)';

export default function HeroContent({ profile, revealPhase, reveal }) {
  const resumeUrl   = profile?.resume_url   || null;
  const githubUrl   = profile?.github_url   || 'https://github.com/ayushtiwari18';
  const linkedinUrl = profile?.linkedin_url || 'https://linkedin.com/in/tiwariaayush';
  const twitterUrl  = profile?.twitter_url  || null;

  const [rollingIndex, setRollingIndex] = useState(0);

  useEffect(() => {
    if (!profile?.rolling_texts?.length) return;
    const interval = setInterval(() => {
      setRollingIndex((prev) => (prev + 1) % profile.rolling_texts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [profile?.rolling_texts]);

  return (
    <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">

      {/* Phase 1 — Telemetric Availability Badge */}
      <div style={reveal(1)}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-mono-code text-emerald-400 mb-4 sm:mb-6 backdrop-blur-md shadow-lg shadow-emerald-500/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-semibold tracking-wider uppercase">Jabalpur, IN · Available for Q1/Q2 Roles</span>
        </div>
      </div>

      {/* Phase 2 — Name with Clash Display */}
      <div style={reveal(2)}>
        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-3 sm:mb-4 leading-[1.08] tracking-tighter"
          style={{ textShadow }}
        >
          Hi, I&apos;m{' '}
          <span className="gradient-text font-display">{profile?.name || 'Ayush Tiwari'}</span>
        </h1>
      </div>

      {/* Phase 3 & 4 Combined — Dynamic Rolling Title */}
      <div style={reveal(3)} className="min-h-[64px] sm:min-h-[88px] lg:min-h-[100px] mb-6 sm:mb-10 flex items-start w-full">
        {profile?.rolling_texts && profile.rolling_texts.length > 0 ? (
          <div 
            className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight relative w-full h-[64px] sm:h-[88px] lg:h-[100px]"
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={rollingIndex}
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)', scale: 0.96 }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, y: -24, filter: 'blur(6px)', scale: 1.04 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 w-full text-foreground/95 leading-snug sm:leading-tight"
              >
                {profile.rolling_texts[rollingIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <p
            className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.98)' }}
          >
            {profile?.description ||
              'Full Stack Engineer specializing in distributed web systems, Next.js architecture, and AWS cloud infrastructure. Published researcher in network security (Springer) with 5,600+ GitHub commits.'}
          </p>
        )}
      </div>

      {/* Phase 5 — CTA Buttons & Social Links */}
      <div style={reveal(5)} className="w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 w-full sm:w-auto">
          <Link href={ROUTES.PROJECTS} className="w-full sm:w-auto">
            <Button size="lg"
              className="w-full sm:w-auto h-12 px-6 sm:px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white text-sm sm:text-base font-semibold rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95 border-0 whitespace-nowrap">
              View Featured Work <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>

          <Link href={ROUTES.CONTACT} className="w-full sm:w-auto">
            <Button size="lg" variant="outline"
              className="w-full sm:w-auto h-12 px-6 sm:px-8 border border-white/20 bg-white/[0.04] backdrop-blur-md text-white hover:bg-white/10 hover:border-white/40 text-sm sm:text-base font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
              <Mail className="mr-2" size={18} />Get In Touch
            </Button>
          </Link>

          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button size="lg" variant="ghost"
                className="w-full sm:w-auto h-12 px-6 sm:px-8 border border-white/15 bg-transparent text-gray-400 hover:text-white hover:bg-black/30 hover:border-white/30 text-sm sm:text-base font-semibold rounded-xl transition-all hover:scale-105 whitespace-nowrap">
                <FileDown className="mr-2" size={18} />Resume
              </Button>
            </a>
          )}
        </div>

        {/* Social icons */}
        <div className="flex items-center justify-center lg:justify-start gap-4">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="p-2 rounded-full border border-white/20 bg-black/30 text-gray-400 hover:text-white hover:border-white/50 backdrop-blur-sm transition-all hover:scale-110">
              <Github size={18} />
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="p-2 rounded-full border border-white/20 bg-black/30 text-gray-400 hover:text-white hover:border-white/50 backdrop-blur-sm transition-all hover:scale-110">
              <Linkedin size={18} />
            </a>
          )}
          {twitterUrl && (
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"
              className="p-2 rounded-full border border-white/20 bg-black/30 text-gray-400 hover:text-white hover:border-white/50 backdrop-blur-sm transition-all hover:scale-110">
              <Twitter size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
