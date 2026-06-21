'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Mail, FileDown } from 'lucide-react';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: custom * 0.15, ease: 'easeOut' },
  }),
};

const RESUME_URL = '/resume.pdf';

export default function HeroContent({ profile }) {
  return (
    /**
     * Glassmorphism panel — solar system is fully visible through this.
     * bg-black/30 + backdrop-blur-md = frosted space glass effect.
     * No hard borders — uses a soft shadow ring instead.
     */
    <motion.div
      className="
        relative z-10
        flex flex-col items-center lg:items-start
        text-center lg:text-left
        rounded-2xl
        px-6 py-8 sm:px-8 sm:py-10
        bg-black/30
        backdrop-blur-md
        shadow-[0_0_40px_rgba(0,0,0,0.4)]
        border border-white/5
      "
      initial="hidden"
      animate="visible"
    >
      {/* Available badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/15 border border-primary/30 rounded-full text-xs sm:text-sm text-primary mb-4 sm:mb-6 backdrop-blur-sm shadow-lg shadow-primary/20"
        custom={0}
        variants={contentVariants}
      >
        <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-primary" />
        </span>
        <span className="font-medium">Available for opportunities</span>
      </motion.div>

      {/* Name */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-3 sm:mb-4 leading-tight tracking-tight"
        custom={1}
        variants={contentVariants}
      >
        Hi, I&apos;m{' '}
        <span className="block sm:inline mt-2 sm:mt-0">
          <span className="gradient-text">{profile?.name || 'Ayush Tiwari'}</span>
        </span>
      </motion.h1>

      {/* Title */}
      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-200 mb-3 sm:mb-4"
        custom={2}
        variants={contentVariants}
      >
        {profile?.title || 'Full Stack Developer'}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl mb-6 sm:mb-8 leading-relaxed"
        custom={3}
        variants={contentVariants}
      >
        {profile?.description ||
          'I build production-grade web systems using MERN Stack, Next.js, Three.js, and AWS. My research on network security is published in Springer. AWS certified — 5,600+ GitHub commits, 885+ DSA problems solved.'}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto"
        custom={4}
        variants={contentVariants}
      >
        {/* PRIMARY — solid gradient, stands out */}
        <Link href={ROUTES.PROJECTS} className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all hover:scale-105 border-0"
          >
            View My Work <ArrowRight className="ml-2" size={20} />
          </Button>
        </Link>

        {/* SECONDARY — ghost, lets space background through */}
        <Link href={ROUTES.CONTACT} className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border border-white/25 bg-white/5 backdrop-blur-sm text-white hover:bg-white/12 hover:border-white/40 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl transition-all hover:scale-105"
          >
            <Mail className="mr-2" size={20} /> Get In Touch
          </Button>
        </Link>

        {/* TERTIARY — even more transparent */}
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
            className="w-full sm:w-auto border border-white/12 bg-transparent text-gray-400 hover:text-white hover:bg-white/8 hover:border-white/25 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl transition-all hover:scale-105"
          >
            <FileDown className="mr-2" size={20} /> Resume
          </Button>
        </a>
      </motion.div>
    </motion.div>
  );
}
