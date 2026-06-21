import Hero from '@/components/sections/Hero';
import CodingStats from '@/components/sections/CodingStats';
import { HERO_COPY } from '@/lib/constants';

export const metadata = {
  title: 'Ayush Tiwari - Full Stack Developer',
  description:
    HERO_COPY.shortDescription ||
    'Portfolio of Ayush Tiwari - Full Stack Developer specialising in MERN, Next.js, Three.js, and cloud-native systems.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/*
       * B1 FIX: was fallbackProfile={HERO_COPY} — Hero.js destructures { profile }
       * so the old prop name was silently ignored. profile was always undefined.
       * Now passes as `profile` so HeroContent + ProfileImage get real data.
       */}
      <Hero profile={HERO_COPY} />
      <CodingStats />
    </main>
  );
}
