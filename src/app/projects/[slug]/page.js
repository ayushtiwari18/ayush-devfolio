import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getProjectBySlug, getPublishedProjectSlugs, getRelatedProjects, getRelatedBlogs } from '@/services/projects.service';
import ProjectHero from '@/components/projects/ProjectHero';
import ProjectOverview from '@/components/projects/ProjectOverview';
import ProjectSection from '@/components/projects/ProjectSection';
import StrategyGrid from '@/components/projects/StrategyGrid';
import ChallengeAccordion from '@/components/projects/ChallengeAccordion';
import RelatedContentSection from '@/components/projects/RelatedContentSection';
import ProjectCTASection from '@/components/projects/ProjectCTASection';

const ArchitectureViewer = dynamic(
  () => import('@/components/projects/ArchitectureViewer'),
  { ssr: false }
);

// ── ISR: regenerate at most once per day ──────────────────────
export const revalidate = 86400;
// New slugs not pre-generated at build time are served on-demand
export const dynamicParams = true;

// ── Static params: pre-generate all published slugs at build ──
export async function generateStaticParams() {
  try {
    const slugs = await getPublishedProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

// ── SEO metadata per project ──────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  let project;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    return { title: 'Project Not Found' };
  }

  if (!project) return { title: 'Project Not Found' };

  const baseUrl = 'https://ayush-devfolio.vercel.app';
  const ogImage = project.hero_image || project.cover_image;
  const metaDescription =
    project.problem_statement?.slice(0, 160) ?? project.description;

  return {
    title: `${project.title} — Ayush Tiwari`,
    description: metaDescription,
    alternates: {
      canonical: `${baseUrl}/projects/${slug}`,
    },
    openGraph: {
      title: `${project.title} — Ayush Tiwari`,
      description: metaDescription,
      url: `${baseUrl}/projects/${slug}`,
      type: 'article',
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — Ayush Tiwari`,
      description: metaDescription,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

// ── Page ──────────────────────────────────────────────────────
export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  let project;

  try {
    project = await getProjectBySlug(slug);
  } catch {
    notFound();
  }

  if (!project) notFound();

  // Fetch related content in parallel — both are non-critical
  const [relatedProjects, relatedBlogs] = await Promise.allSettled([
    getRelatedProjects(project.tags || [], slug),
    getRelatedBlogs(project.related_blogs || []),
  ]).then((results) => results.map((r) => (r.status === 'fulfilled' ? r.value : [])));

  // ── JSON-LD structured data ──────────────────────────────────
  const baseUrl = 'https://ayush-devfolio.vercel.app';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: `${baseUrl}/projects/${slug}`,
    author: { '@type': 'Person', name: 'Ayush Tiwari' },
    applicationCategory: 'WebApplication',
    dateCreated: project.created_at,
    ...(project.tags?.length > 0 && { keywords: project.tags.join(', ') }),
  };

  // ── BreadcrumbList ───────────────────────────────────────────
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
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">

          {/* Overview: title, description, tech tags, action buttons */}
          <ProjectOverview project={project} />

          {/* Hero: image + ripple + video */}
          <div className="mb-12">
            <ProjectHero
              heroImage={project.hero_image}
              coverImage={project.cover_image}
              previewVideo={project.preview_video}
              youtubeUrl={project.youtube_url}
              title={project.title}
            />
          </div>

          {/* ── Case Study Sections (render only when non-null) ── */}
          <ProjectSection
            title="Problem Statement"
            content={project.problem_statement}
            icon="🎯"
          />
          <ProjectSection
            title="Solution"
            content={project.solution}
            icon="💡"
          />
          <ProjectSection
            title="Architecture"
            content={project.architecture_plan}
            icon="🏗️"
          />
          <ProjectSection
            title="Code Structure"
            content={project.code_structure}
            icon="📁"
          />

          {/* Strategies — JSONB array */}
          <StrategyGrid strategies={project.strategies} />

          {/* Challenges — JSONB array with accordion */}
          <ChallengeAccordion challenges={project.challenges} />

          <ProjectSection
            title="Performance Decisions"
            content={project.performance_notes}
            icon="⚡"
          />
          <ProjectSection
            title="Trade-offs Made"
            content={project.trade_offs}
            icon="⚖️"
          />
          <ProjectSection
            title="Lessons Learned"
            content={project.lessons_learned}
            icon="📚"
          />
          <ProjectSection
            title="Future Improvements"
            content={project.future_improvements}
            icon="🔮"
          />

          {/* Technical expansion — dynamically imported */}
          <ArchitectureViewer
            apiFlowDiagram={project.api_flow_diagram}
            dbSchemaVisual={project.db_schema_visual}
          />

          <ProjectSection
            title="Security Considerations"
            content={project.security_notes}
            icon="🔐"
          />

          {/* Bottom CTA */}
          <ProjectCTASection
            githubUrl={project.github_url}
            liveUrl={project.live_url}
            title={project.title}
          />

          {/* Related content */}
          <RelatedContentSection
            relatedProjects={relatedProjects}
            relatedBlogs={relatedBlogs}
          />

        </article>
      </main>
    </>
  );
}
