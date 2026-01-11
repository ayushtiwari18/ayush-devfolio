'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Mail } from 'lucide-react';

// Animation variants for content
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: custom * 0.15,
      ease: 'easeOut',
    },
  }),
};

export default function HeroContent({ profile }) {
  return (
    <motion.div
      className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left"
      initial="hidden"
      animate="visible"
    >
      {/* Badge - Smaller on Mobile */}
      <motion.div
        className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/30 rounded-full text-xs sm:text-sm text-primary mb-4 sm:mb-6 backdrop-blur-sm shadow-lg shadow-primary/20"
        custom={0}
        variants={contentVariants}
      >
        <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-primary"></span>
        </span>
        <span className="font-medium">Available for opportunities</span>
      </motion.div>

      {/* Main Heading - Responsive Text Sizes */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight tracking-tight"
        custom={1}
        variants={contentVariants}
      >
        Hi, I'm{' '}
        <span className="block sm:inline mt-2 sm:mt-0">
          <span className="gradient-text">
            {profile?.name || 'Ayush Tiwari'}
          </span>
        </span>
      </motion.h1>

      {/* Title - Better Contrast */}
      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-300 mb-3 sm:mb-4 md:mb-6"
        custom={2}
        variants={contentVariants}
      >
        {profile?.title || 'Full Stack Developer'}
      </motion.h2>

      {/* Description - Better Readability on Mobile */}
      <motion.p
        className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-xl lg:max-w-2xl mb-6 sm:mb-8 md:mb-12 leading-relaxed"
        custom={3}
        variants={contentVariants}
      >
        {profile?.description ||
          'Building innovative solutions with modern web technologies. Passionate about creating seamless user experiences.'}
      </motion.p>

      {/* CTA Buttons - Mobile Optimized */}
      <motion.div
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto"
        custom={4}
        variants={contentVariants}
      >
        <Link href={ROUTES.PROJECTS} className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all hover:scale-105 border border-primary/20"
          >
            View My Work
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </Link>
        <Link href={ROUTES.CONTACT} className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-2 border-primary/50 bg-black/40 backdrop-blur-sm text-white hover:bg-primary/20 hover:border-primary px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
          >
            <Mail className="mr-2" size={20} />
            Get In Touch
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
