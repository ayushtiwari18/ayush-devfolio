import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Code2, Star } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';
import { getPublishedProjects } from '@/services/projects.service';
import { BASE_URL } from '@/app/layout';

export const metadata = {
  title: 'Projects — Ayush Tiwari | Full Stack Developer',
  description:
    'Production-grade projects by Ayush Tiwari — Full Stack Developer from Jabalpur, India. ' +
    'MERN Stack, Next.js, Node.js, AWS, Three.js builds. Open source contributions and live deployments.',
  keywords: [
    'Ayush Tiwari projects', 'Ayush Tiwari portfolio', 'Full Stack projects India',
    'MERN Stack projects', 'Next.js projects', 'React projects', 'Node.js projects',
    'open source projects India', 'web developer Jabalpur',
  ],
  alternates: { canonical: `${BASE_URL}/projects` },
  openGraph: {
    title:       'Projects — Ayush Tiwari | Full Stack Developer',
    description: 'Production-grade MERN, Next.js and AWS projects by Ayush Tiwari.',
    url:          `${BASE_URL}/projects`,
    type:        'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card:    'summary_large_image',
    title:   'Projects — Ayush Tiwari',
    creator: '@ayushtiwari18',
  },
};

function ProjectCard({ project }) {
  return (
    <article className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col">
      <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden shrink-0">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Code2 size={64} className="text-primary/20" />
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg">
              <Star size={11} fill="currentColor" /> Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 4).map((tech, i) => (
              <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md border border-primary/20">
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-border mt-auto">
          <Link href={`/projects/${project.slug}`} className="flex-1">
            <Button size="sm" className="w-full">View Details</Button>
          </Link>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer"
              aria-label={`${project.title} GitHub repository`}>
              <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary">
                <GitHubIcon size={16} />
              </Button>
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}>
              <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary">
                <ExternalLink size={16} />
              </Button>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function ProjectsPage() {
  let projects = [];

  try {
    projects = await getPublishedProjects();
  } catch (err) {
    console.error('Failed to load projects:', err);
  }

  const featured = projects.filter(p => p.featured);
  const rest     = projects.filter(p => !p.featured);

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my work — innovative solutions and creative implementations
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="space-y-16">

            {/* ── Featured ── */}
            {featured.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Star size={20} className="text-primary" fill="currentColor" />
                  <h2 className="text-xl font-bold text-foreground">Featured Projects</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featured.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}

            {/* ── All other projects ── */}
            {rest.length > 0 && (
              <section>
                {featured.length > 0 && (
                  <div className="flex items-center gap-3 mb-8">
                    <Code2 size={20} className="text-muted-foreground" />
                    <h2 className="text-xl font-bold text-foreground">All Projects</h2>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}

          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-5xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Projects Coming Soon!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              I&apos;m currently adding my projects to the database. Check back soon!
            </p>
            <div className="flex gap-4 justify-center">
              <a href="https://github.com/ayushtiwari18" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">View GitHub</Button>
              </a>
              <Link href="/"><Button>Back to Home</Button></Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
