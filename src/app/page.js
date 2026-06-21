import Hero from '@/components/sections/Hero';
import dynamic from 'next/dynamic';
import { HERO_COPY } from '@/lib/constants';

const CodingStats = dynamic(
  () => import('@/components/sections/CodingStats'),
  { ssr: false, loading: () => <div className="min-h-[200px]" /> }
);
const FeaturedProjects = dynamic(
  () => import('@/components/sections/FeaturedProjects'),
  { ssr: false, loading: () => <div className="min-h-[200px]" /> }
);
const LatestBlog = dynamic(
  () => import('@/components/sections/LatestBlog'),
  { ssr: false, loading: () => <div className="min-h-[200px]" /> }
);
const Skills = dynamic(
  () => import('@/components/sections/Skills'),
  { ssr: false, loading: () => <div className="min-h-[200px]" /> }
);

export const metadata = {
  title: 'Ayush Tiwari - Full Stack Developer',
  description:
    HERO_COPY.shortDescription ||
    'Portfolio of Ayush Tiwari - Full Stack Developer specialising in MERN, Next.js, Three.js, and cloud-native systems.',
  // S6: explicit canonical for homepage
  alternates: {
    canonical: 'https://ayush-devfolio.vercel.app',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero profile={HERO_COPY} />
      <CodingStats />
      <FeaturedProjects />
      <LatestBlog />
      <Skills />
    </main>
  );
}
