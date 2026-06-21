'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const imageVariants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 18, delay: 0.2 },
  },
};

export default function ProfileImage({ imageUrl }) {
  // Fallback chain: DB url -> local optimised photo -> generic SVG
  const src = imageUrl || '/images/profile.jpg';

  return (
    <div className="relative flex items-center justify-center w-full">

      {/* Outer ambient glow — compositor thread CSS */}
      <div
        aria-hidden="true"
        className="absolute w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[340px] sm:max-h-[340px] lg:max-w-[420px] lg:max-h-[420px] rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl profile-glow-pulse"
      />
      <div
        aria-hidden="true"
        className="absolute w-[85%] h-[85%] max-w-[255px] max-h-[255px] sm:max-w-[290px] sm:max-h-[290px] lg:max-w-[360px] lg:max-h-[360px] rounded-full bg-gradient-to-br from-accent/25 to-primary/25 blur-2xl profile-glow-pulse"
        style={{ animationDelay: '1.5s' }}
      />

      {/* Conic-gradient ring — space-tech glowing border */}
      <div
        aria-hidden="true"
        className="absolute rounded-full profile-ring-cw"
        style={{
          width: 'calc(100% + 6px)',
          height: 'calc(100% + 6px)',
          maxWidth: '274px',
          maxHeight: '274px',
          background: 'conic-gradient(from 0deg, var(--color-primary, #3b82f6), var(--color-accent, #8b5cf6), transparent 60%, var(--color-primary, #3b82f6))',
          borderRadius: '50%',
          padding: '2px',
        }}
      />

      {/* Main circular image — entrance spring (once), hover scale (one-shot) */}
      <motion.div
        className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl shadow-primary/40"
        style={{ border: '3px solid rgba(139,92,246,0.4)' }}
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      >
        {/* Rotating accent ring inside */}
        <div aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-accent/30 profile-ring-cw" />
        <div aria-hidden="true" className="absolute inset-2 rounded-full border border-primary/20 profile-ring-ccw" />

        {/* Inner gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-accent/20 z-10 pointer-events-none" />

        {/* Profile photo */}
        <Image
          src={src}
          alt="Ayush Tiwari — Full Stack Developer"
          fill
          className="object-cover object-top"
          priority
          sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 384px"
          onError={(e) => { e.currentTarget.src = '/placeholder-avatar.svg'; }}
        />

        {/* Shine overlay */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none profile-shine z-20" />
        {/* Bottom depth */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />
      </motion.div>

      {/* Accent dots */}
      <div aria-hidden="true" className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/60 profile-dot-pulse" />
      <div aria-hidden="true" className="absolute -bottom-1 -left-1 w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/60 profile-dot-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}
