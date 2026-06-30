import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, Clock, Calendar, Tag } from 'lucide-react';
import {
  getProjectBySlug,
  getPublishedProjectSlugs,
  getRelatedProjects,
  getRelatedBlogs,
} from '@/services/projects.service';
import ProjectHero            from '@/components/projects/ProjectHero';
import ProjectSection         from '@/components/projects/ProjectSection';
import StrategyGrid           from '@/components/projects/StrategyGrid';
import ChallengeAccordion     from '@/components/projects/ChallengeAccordion';
import RelatedContentSection  from '@/components/projects/RelatedContentSection';
import ProjectCTASection      from '@/components/projects/ProjectCTASection';
import PerformanceMetrics     from '@/components/projects/PerformanceMetrics';

const ArchitectureViewer = dynamic(
  () => import('@/components/projects/ArchitectureViewer'),
  { ssr: false }
);

// Always fetch fresh from Supabase — never serve stale cached project pages
export const revalidate   = 0;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let project;
  try { project = await getProjectBySlug(slug); } catch { return { title: 'Project Not Found' }; }
  if (!project) return { title: 'Project Not Found' };

  const baseUrl        = 'https://ayush-devfolio.vercel.app';
  const ogImage        = project.hero_image || project.cover_image;
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

// ── Sticky sidebar TOC ─────────────────────────────────────────────
const TOC_ITEMS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'problem-statement', label: 'Problem' },
  { id: 'solution',    label: 'Solution' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'code-structure', label: 'Code Structure' },
  { id: 'strategies',  label: 'Strategies' },
  { id: 'challenges',  label: 'Challenges' },
  { id: 'performance', label: 'Performance' },
  { id: 'trade-offs-made', label: 'Trade-offs' },
  { id: 'lessons-learned', label: 'Lessons' },
  { id: 'future-improvements', label: 'Future Plans' },
  { id: 'security-considerations', label: 'Security' },
];

function Sidebar({ project }) {
  const hasSections = [
    project.problem_statement, project.solution,
    project.architecture_plan, project.code_structure,
    project.strategies?.length, project.challenges?.length,
    project.performance_metrics?.length, project.performance_notes,
    project.trade_offs, project.lessons_learned,
    project.future_improvements, project.security_notes,
  ].some(Boolean);

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-28 space-y-6">
        {hasSections && (
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">On This Page</p>
            <nav className="space-y-1">
              {TOC_ITEMS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block text-xs text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-150 py-1 border-l-2 border-transparent hover:border-primary pl-2"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Project Info</p>
          {project.duration && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} className="text-primary shrink-0" />
              <span>{project.duration}</span>
            </div>
          )}
          {project.date && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar size={12} className="text-primary shrink-0" />
              <span>{new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
          )}
          {project.tags?.slice(0, 4).map(tag => (
            <div key={tag} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tag size={12} className="text-primary shrink-0" />
              <span>{tag}</span>
            </div>
          ))}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-primary hover:underline mt-1">
              <Github size={12} /><span>View Source</span>
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-primary hover:underline">
              <ExternalLink size={12} /><span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  let project;
  try { project = await getProjectBySlug(slug); } catch { notFound(); }
  if (!project) notFound();

  const [relatedProjects, relatedBlogs] = await Promise.allSettled([
    getRelatedProjects(project.tags || [], slug),
    getRelatedBlogs(project.related_blogs || []),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : []));

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
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: `${baseUrl}/projects` },
      { '@type': 'ListItem', position: 3, name: project.title, item: `${baseUrl}/projects/${slug}` },
    ],
  };

  const show = (key) => project[key] !== false;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main className="min-h-screen pt-20 pb-24 px-4 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto mb-8">
          <Link href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={15} />
            <span>All Projects</span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto mb-12">
          <ProjectHero
            heroImage={project.hero_image}
            coverImage={project.cover_image}
            previewVideo={project.preview_video}
            youtubeUrl={project.youtube_url}
            title={project.title}
          />
        </div>

        <div className="max-w-7xl mx-auto flex gap-10 items-start">

          <article className="flex-1 min-w-0">

            <div id="overview" className="mb-12 scroll-mt-24">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {project.tags?.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 leading-tight">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">{project.description}</p>
              )}
              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map(t => (
                    <span key={t} className="px-3 py-1.5 bg-card border border-border text-xs font-medium text-foreground rounded-lg hover:border-primary/40 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-sm font-semibold text-foreground rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <Github size={16} /> View Source
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all">
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </div>

            <ProjectSection title="Problem Statement" content={project.problem_statement} />
            <ProjectSection title="Solution"          content={project.solution} />

            {show('show_architecture') && (
              <ArchitectureViewer
                architecturePlan={project.architecture_plan}
                architectureType={project.architecture_type || 'text'}
                apiFlowDiagram={project.api_flow_diagram}
                dbSchemaVisual={project.db_schema_visual}
              />
            )}

            {show('show_code_structure') && (
              <ProjectSection title="Code Structure" content={project.code_structure} />
            )}

            {show('show_strategies') && (
              <StrategyGrid strategies={project.strategies} />
            )}

            {show('show_challenges') && (
              <ChallengeAccordion challenges={project.challenges} />
            )}

            {show('show_performance') && (
              <>
                <PerformanceMetrics metrics={project.performance_metrics} />
                <ProjectSection title="Performance Decisions" content={project.performance_notes} />
              </>
            )}

            {show('show_tradeoffs') && (
              <ProjectSection title="Trade-offs Made" content={project.trade_offs} />
            )}

            {show('show_lessons') && (
              <ProjectSection title="Lessons Learned" content={project.lessons_learned} />
            )}

            {show('show_future') && (
              <ProjectSection title="Future Improvements" content={project.future_improvements} />
            )}

            {show('show_security') && (
              <ProjectSection title="Security Considerations" content={project.security_notes} />
            )}

            <ProjectCTASection
              githubUrl={project.github_url}
              liveUrl={project.live_url}
              title={project.title}
            />

            <RelatedContentSection
              relatedProjects={relatedProjects}
              relatedBlogs={relatedBlogs}
            />
          </article>

          <Sidebar project={project} />
        </div>
      </main>
    </>
  );
}
