import { getPublishedProjects } from '@/services/projects.service';
import ProjectsCatalogClient from '@/components/projects/ProjectsCatalogClient';
import { BASE_URL } from '@/lib/config';

// Always fetch fresh from Supabase on every request
export const revalidate = 60;

export const metadata = {
  title: 'Projects - Ayush Tiwari | Full Stack Systems Developer',
  description:
    'Production-grade projects and distributed architectures by Ayush Tiwari. ' +
    'WAF/IDS security engines, MERN Stack, Next.js, FastAPI, XGBoost ML, and real-time Socket.IO systems.',
  keywords: [
    'Ayush Tiwari projects', 'Ayush Tiwari portfolio', 'Systems engineering India',
    'SENTINAL WAF', 'Next.js projects', 'React projects', 'Node.js projects',
    'FastAPI XGBoost', 'web developer Jabalpur',
  ],
  alternates: { canonical: `${BASE_URL}/projects` },
  openGraph: {
    title: 'Projects - Ayush Tiwari | Full Stack Systems Developer',
    description: 'Production-grade WAF/IDS, Next.js, and distributed systems by Ayush Tiwari.',
    url: `${BASE_URL}/projects`,
    type: 'website',
    images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects - Ayush Tiwari',
    creator: '@ayushtiwari18',
  },
};

export default async function ProjectsPage() {
  let projects = [];
  try {
    projects = await getPublishedProjects();
  } catch (err) {
    console.error('Failed to load projects:', err);
  }

  return (
    <main className="min-h-screen pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#05070B] relative overflow-hidden selection:bg-primary/20 selection:text-white">
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <ProjectsCatalogClient projects={projects} />
      </div>
    </main>
  );
}
