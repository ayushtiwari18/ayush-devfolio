import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import Contact from '@/components/sections/Contact';
import dynamic from 'next/dynamic';
import { HERO_COPY, ACHIEVEMENTS } from '@/lib/constants';
import { getProfileSettings } from '@/services/profile.service';

// Dynamically loaded sections (heavy JS / client-only)
const CodingStats = dynamic(
  () => import('@/components/sections/CodingStats'),
  { ssr: false, loading: () => <SectionSkeleton minH="400px" /> }
);
const FeaturedProjects = dynamic(
  () => import('@/components/sections/FeaturedProjects'),
  { ssr: false, loading: () => <SectionSkeleton minH="500px" /> }
);
const LatestBlog = dynamic(
  () => import('@/components/sections/LatestBlog'),
  { ssr: false, loading: () => <SectionSkeleton minH="300px" /> }
);
const Skills = dynamic(
  () => import('@/components/sections/Skills'),
  { ssr: false, loading: () => <SectionSkeleton minH="300px" /> }
);

// Inline skeleton — replaces invisible empty divs with a shimmer placeholder
// Kept here (not a separate file) because it's only used by this layout.
function SectionSkeleton({ minH = '200px' }) {
  return (
    <div
      className="w-full skeleton-card mx-auto px-4"
      style={{ minHeight: minH }}
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// METADATA
// ---------------------------------------------------------------------------

const BASE_URL = 'https://ayush-devfolio-nine.vercel.app';

export const metadata = {
  title: 'Ayush Tiwari - Full Stack Developer',
  description:
    HERO_COPY.shortDescription ||
    'Portfolio of Ayush Tiwari - Full Stack Developer specialising in MERN, Next.js, Three.js, and cloud-native systems.',
  alternates: {
    // Fixed: canonical now matches layout.js BASE_URL (was ayush-devfolio.vercel.app)
    canonical: BASE_URL,
  },
};

// ---------------------------------------------------------------------------
// HOME PAGE — Server Component
// Fetches profile_settings from Supabase at request time so Hero
// always reflects the latest data saved in Admin → Settings.
// Falls back to HERO_COPY constants if the DB is unreachable.
// ---------------------------------------------------------------------------

export default async function Home() {
  const dbProfile = await getProfileSettings().catch(() => null);

  const profile = {
    name:          dbProfile?.name          || HERO_COPY.name,
    title:         dbProfile?.title         || HERO_COPY.title,
    description:   dbProfile?.description   || HERO_COPY.description,
    image_url:     dbProfile?.image_url     || null,
    github_url:    dbProfile?.github_url    || 'https://github.com/ayushtiwari18',
    linkedin_url:  dbProfile?.linkedin_url  || 'https://linkedin.com/in/tiwariaayush',
    twitter_url:   dbProfile?.twitter_url   || null,
    resume_url:    dbProfile?.resume_url    || null,
    form_endpoint: dbProfile?.form_endpoint || null,
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* 1. Hero — above the fold, SSR'd, instant */}
      <Hero profile={profile} />

      {/* 2. About — who is Ayush, real numbers from ACHIEVEMENTS */}
      <About profile={profile} achievements={ACHIEVEMENTS} />

      {/* 3. Experience — work history timeline */}
      <Experience />

      {/* 4. Education — academic history timeline */}
      <Education />

      {/* 5. Skills — tech stack icon grid (client, DB-driven) */}
      <Skills />

      {/* 6. CodingStats — LeetCode / competitive programming (client, DB-driven) */}
      <CodingStats />

      {/* 7. FeaturedProjects — self-fetches from /api/public/projects (client) */}
      <FeaturedProjects />

      {/* 8. LatestBlog — recent blog posts (client, DB-driven) */}
      <LatestBlog />

      {/* 9. Contact — conversion CTA, always last */}
      <Contact />
    </main>
  );
}
