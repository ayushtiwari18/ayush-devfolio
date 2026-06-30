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

// Always fetch fresh from Supabase on every request
export const revalidate = 0;

// Heavy / client-only sections
const CodingStats = dynamic(
  () => import('@/components/sections/CodingStats'),
  { ssr: false, loading: () => <SectionSkeleton minH="400px" /> }
);
const Skills = dynamic(
  () => import('@/components/sections/Skills'),
  { ssr: false, loading: () => <SectionSkeleton minH="300px" /> }
);

function SectionSkeleton({ minH = '200px' }) {
  return (
    <div
      className="w-full skeleton-card mx-auto px-4"
      style={{ minHeight: minH }}
      aria-hidden="true"
    />
  );
}

const BASE_URL = 'https://ayush-devfolio-nine.vercel.app';

export const metadata = {
  title: 'Ayush Tiwari - Full Stack Developer',
  description:
    HERO_COPY.shortDescription ||
    'Portfolio of Ayush Tiwari — Full Stack Developer specialising in MERN, Next.js, Three.js, and cloud-native systems.',
  alternates: { canonical: BASE_URL },
};

export default async function Home() {
  const [dbProfile, featuredProjects, recentPosts] = await Promise.all([
    getProfileSettings().catch(() => null),
    getFeaturedProjects().catch(() => []),
    getRecentBlogPosts(3).catch(() => []),
  ]);

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
    about_bio:          dbProfile?.about_bio          || null,
    about_availability: dbProfile?.about_availability || null,
    about_location:     dbProfile?.about_location     || null,
    about_email:        dbProfile?.about_email        || null,
    about_highlights:   dbProfile?.about_highlights   || null,
  };

  return (
    <main id="main-content" className="min-h-screen">
      <Hero profile={profile} />
      <About profile={profile} achievements={ACHIEVEMENTS} />
      <Experience />
      <Education />
      <Skills />
      <CodingStats />
      <FeaturedProjects projects={featuredProjects} />
      <LatestBlog posts={recentPosts} />
      <Contact />
    </main>
  );
}
