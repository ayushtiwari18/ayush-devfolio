import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import Contact from '@/components/sections/Contact';
import LatestBlog from '@/components/sections/LatestBlog';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import { HERO_COPY, ACHIEVEMENTS } from '@/lib/constants';
import { getProfileSettings } from '@/services/profile.service';
import { getFeaturedProjects } from '@/services/projects.service';
import { getRecentBlogPosts } from '@/services/blog.service';

// Heavy / client-only sections — dynamically imported
const CodingStats = dynamic(
  () => import('@/components/sections/CodingStats'),
  { ssr: false, loading: () => <SectionSkeleton minH="400px" /> }
);
const Skills = dynamic(
  () => import('@/components/sections/Skills'),
  { ssr: false, loading: () => <SectionSkeleton minH="300px" /> }
);

// Inline skeleton — shimmer placeholder while JS loads
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
    'Portfolio of Ayush Tiwari — Full Stack Developer specialising in MERN, Next.js, Three.js, and cloud-native systems.',
  alternates: { canonical: BASE_URL },
};

// ---------------------------------------------------------------------------
// HOME PAGE — Server Component
// All data is fetched here at SSR time and passed as props.
// No section needs to make its own API call for initial data.
// ---------------------------------------------------------------------------

export default async function Home() {
  // Run all three fetches in parallel — fail gracefully on each
  const [dbProfile, featuredProjects, recentPosts] = await Promise.all([
    getProfileSettings().catch(() => null),
    getFeaturedProjects().catch(() => []),
    getRecentBlogPosts(3).catch(() => []),
  ]);

  const profile = {
    name:          dbProfile?.name         || HERO_COPY.name,
    title:         dbProfile?.title        || HERO_COPY.title,
    description:   dbProfile?.description  || HERO_COPY.description,
    image_url:     dbProfile?.image_url    || null,
    github_url:    dbProfile?.github_url   || 'https://github.com/ayushtiwari18',
    linkedin_url:  dbProfile?.linkedin_url || 'https://linkedin.com/in/tiwariaayush',
    twitter_url:   dbProfile?.twitter_url  || null,
    resume_url:    dbProfile?.resume_url   || null,
    form_endpoint: dbProfile?.form_endpoint|| null,
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* 1. Hero */}
      <Hero profile={profile} />

      {/* 2. About */}
      <About profile={profile} achievements={ACHIEVEMENTS} />

      {/* 3. Experience — self-fetches via /api/public/experience */}
      <Experience />

      {/* 4. Education — self-fetches via /api/public/education */}
      <Education />

      {/* 5. Skills — self-fetches via /api/public/skills (client) */}
      <Skills />

      {/* 6. CodingStats — self-fetches via /api/public/status (client) */}
      <CodingStats />

      {/* 7. FeaturedProjects — SSR data passed as prop */}
      <FeaturedProjects projects={featuredProjects} />

      {/* 8. LatestBlog — SSR data passed as prop, hidden if no posts */}
      <LatestBlog posts={recentPosts} />

      {/* 9. Contact */}
      <Contact />
    </main>
  );
}
