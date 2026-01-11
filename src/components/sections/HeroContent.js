'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

// Animation variants for content
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: custom * 0.2,
      ease: 'easeOut',
    },
  }),
};

export default function HeroContent({ profile }) {
  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
    >
      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-8 backdrop-blur-sm"
        custom={0}
        variants={contentVariants}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
        Available for opportunities
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight"
        custom={1}
        variants={contentVariants}
      >
        Hi, I'm{' '}
        <span className="gradient-text inline-block">
          {profile?.name || 'Ayush Tiwari'}
        </span>
      </motion.h1>

      {/* Title */}
      <motion.h2
        className="text-2xl sm:text-3xl md:text-4xl font-semibold text-muted-foreground mb-6"
        custom={2}
        variants={contentVariants}
      >
        {profile?.title || 'Full Stack Developer'}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        custom={3}
        variants={contentVariants}
      >
        {profile?.description ||
          'Building innovative solutions with modern web technologies. Passionate about creating seamless user experiences.'}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-4 mb-16"
        custom={4}
        variants={contentVariants}
      >
        <Link href={ROUTES.PROJECTS}>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-primary/50 hover:shadow-primary/70 transition-all hover:scale-105"
          >
            View My Work
          </Button>
        </Link>
        <Link href={ROUTES.CONTACT}>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm"
          >
            Get In Touch
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
