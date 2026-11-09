import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getProjectBySlug,
  getPublishedProjectSlugs,
  getRelatedProjects,
  getRelatedBlogs,
} from '@/services/projects.service';
import { getProfileSettings } from '@/services/profile.service';
import ProjectStoryView from '@/components/projects/ProjectStoryView';
import { BASE_URL } from '@/lib/config';

// Always fetch fresh from Supabase — never serve stale cached project pages
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    return { title: 'Project Not Found' };
  }
  if (!project) return { title: 'Project Not Found' };

  const baseUrl = BASE_URL;
  const ogImage = project.hero_image || project.cover_image;
  const metaDescription = project.problem_statement?.slice(0, 160) ?? project.description;

  return {
    title: `${project.title} — Ayush Tiwari`,
    description: metaDescription,
    alternates: { canonical: `${baseUrl}/projects/${slug}` },
    openGraph: {
      title: `${project.title} — Ayush Tiwari`,
      description: metaDescription,
      url: `${baseUrl}/projects/${slug}`,
      type: 'article',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — Ayush Tiwari`,
      description: metaDescription,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;

  const [projectResult, profileResult] = await Promise.all([
    getProjectBySlug(slug).catch(() => null),
    getProfileSettings().catch(() => null),
  ]);

  const project = projectResult;
  if (!project) notFound();

  const [relatedProjects, relatedBlogs] = await Promise.allSettled([
    getRelatedProjects(project.tags || [], slug),
    getRelatedBlogs(project.related_blogs || []),
  ]).then((r) => r.map((x) => (x.status === 'fulfilled' ? x.value : [])));

  const authorHeroImage = profileResult?.image_url || '/profile.png';
  const authorName = profileResult?.name || 'Ayush Tiwari';

  const baseUrl = BASE_URL;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: `${baseUrl}/projects/${slug}`,
    author: { '@type': 'Person', name: authorName },
    applicationCategory: 'WebApplication',
    dateCreated: project.created_at,
    ...(project.tags?.length > 0 && { keywords: project.tags.join(', ') }),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${baseUrl}/projects` },
      { '@type': 'ListItem', position: 3, name: project.title, item: `${baseUrl}/projects/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main className="min-h-screen pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#05070B] selection:bg-primary/20 selection:text-white relative overflow-hidden">
        {/* Background ambient radial glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <nav className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                Index
              </Link>
              <ChevronRight size={12} className="text-gray-600" />
              <Link href="/projects" className="hover:text-white transition-colors">
                Artifacts
              </Link>
              <ChevronRight size={12} className="text-gray-600" />
              <span className="text-primary truncate max-w-[200px] sm:max-w-xs">
                {project.title.split('—')[0].trim()}
              </span>
            </nav>

            <Link href="/projects">
              <Button
                variant="outline"
                className="h-9 px-3.5 text-xs font-mono border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-primary/40 text-gray-300 hover:text-white rounded-xl transition-all"
              >
                <ArrowLeft className="mr-1.5" size={13} />
                <span>All Projects</span>
              </Button>
            </Link>
          </div>

          {/* High-Craft Narrative Story Case Study */}
          <ProjectStoryView
            project={project}
            authorHeroImage={authorHeroImage}
            authorName={authorName}
            relatedProjects={relatedProjects}
          />
        </div>
      </main>
    </>
  );
}
