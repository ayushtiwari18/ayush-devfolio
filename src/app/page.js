import Hero from '@/components/sections/Hero';
import dynamic from 'next/dynamic';
import { HERO_COPY } from '@/lib/constants';
import { getProfileSettings } from '@/services/profile.service';

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
  alternates: {
    canonical: 'https://ayush-devfolio.vercel.app',
  },
};

/**
 * Home — Server Component.
 * Fetches profile_settings from Supabase at request time so the Hero
 * always reflects the latest data saved in Admin → Settings.
 * Falls back to HERO_COPY constants if the DB is unreachable.
 */
export default async function Home() {
  // Server-side fetch — no useEffect, no loading flash, no client bundle cost.
  const dbProfile = await getProfileSettings().catch(() => null);

  // Merge DB over static fallbacks so every field always has a value.
  const profile = {
    name:         dbProfile?.name         || HERO_COPY.name,
    title:        dbProfile?.title        || HERO_COPY.title,
    description:  dbProfile?.description  || HERO_COPY.description,
    image_url:    dbProfile?.image_url    || null,
    github_url:   dbProfile?.github_url   || 'https://github.com/ayushtiwari18',
    linkedin_url: dbProfile?.linkedin_url || 'https://linkedin.com/in/tiwariaayush',
    twitter_url:  dbProfile?.twitter_url  || null,
    resume_url:   dbProfile?.resume_url   || null,
    form_endpoint:dbProfile?.form_endpoint|| null,
  };

  return (
    <main className="min-h-screen">
      <Hero profile={profile} />
      <CodingStats />
      <FeaturedProjects />
      <LatestBlog />
      <Skills />
    </main>
  );
}
