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
      {/* Hero consumes Supabase profile data internally, but always falls back
          to HERO_COPY.description so the hero is never generic even when the
          database is empty. */}
      <Hero fallbackProfile={HERO_COPY} />
      <CodingStats />
    </main>
  );
}
