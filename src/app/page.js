import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import Contact from '@/components/sections/Contact';
import LatestBlog from '@/components/sections/LatestBlog';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import EditableSection from '@/components/admin/EditableSection';
import { HERO_COPY, ACHIEVEMENTS } from '@/lib/constants';
import { BASE_URL } from '@/lib/config';
import { getProfileSettings } from '@/services/profile.service';
import { getFeaturedProjects } from '@/services/projects.service';
import { getRecentBlogPosts } from '@/services/blog.service';
import { getAchievements } from '@/services/achievements.service';

// Always fetch fresh from Supabase on every request
export const revalidate = 60;

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

export const metadata = {
  title: 'Ayush Tiwari - Full Stack Developer',
  description:
    HERO_COPY.shortDescription ||
    'Portfolio of Ayush Tiwari — Full Stack Developer specialising in MERN, Next.js, Three.js, and cloud-native systems.',
  alternates: { canonical: BASE_URL },
};

export default async function Home() {
  // Execute sequentially to avoid Next.js `fetch failed` bug during concurrent no-store requests
  const dbProfile = await getProfileSettings().catch(() => null);
  const featuredProjects = await getFeaturedProjects().catch(() => []);
  const recentPosts = await getRecentBlogPosts(3).catch(() => []);
  const dbAchievements = await getAchievements().catch(() => []);

  let rollingTexts = dbProfile?.rolling_texts;
  if (typeof rollingTexts === 'string') {
    try {
      rollingTexts = JSON.parse(rollingTexts);
    } catch (e) {
      rollingTexts = [];
    }
  }

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
    rolling_texts:      Array.isArray(rollingTexts) ? rollingTexts : null,
  };

  // Use DB rows if available, otherwise fall back to hardcoded constants
  const achievements = dbAchievements.length > 0 ? dbAchievements : ACHIEVEMENTS;

  return (
    <main id="main-content" className="min-h-screen">
      <EditableSection title="Hero & Profile" drawerId="hero" drawerData={profile}>
        <Hero profile={profile} />
      </EditableSection>

      <EditableSection title="About & Bio" drawerId="about" drawerData={{ profile, achievements }}>
        <About profile={profile} achievements={achievements} />
      </EditableSection>

      <EditableSection title="Experience" drawerId="experience">
        <Experience />
      </EditableSection>

      <EditableSection title="Education" drawerId="education">
        <Education />
      </EditableSection>

      <EditableSection title="Skills Matrix" drawerId="skills">
        <Skills />
      </EditableSection>

      <EditableSection title="Coding & Competitive Stats" drawerId="coding-stats">
        <CodingStats />
      </EditableSection>

      <EditableSection title="Featured Projects" drawerId="projects">
        <FeaturedProjects projects={featuredProjects} />
      </EditableSection>

      <EditableSection title="Recent Blog Posts" drawerId="blog">
        <LatestBlog posts={recentPosts} />
      </EditableSection>

      <EditableSection title="Contact Information" drawerId="contact">
        <Contact />
      </EditableSection>
    </main>
  );
}
