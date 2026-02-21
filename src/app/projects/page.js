import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Github, ExternalLink, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublishedProjects } from '@/services/projects.service';

export const metadata = {
  title: 'Projects - Ayush Tiwari',
  description: 'Browse all my projects — full-stack web apps, open source tools, and creative builds.',
};

export default async function ProjectsPage() {
  let projects = [];

  try {
    projects = await getPublishedProjects();
  } catch (err) {
    console.error('Failed to load projects:', err);
    // Graceful degradation — show empty state, don't crash
  }

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Button>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my work — innovative solutions and creative implementations
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Cover Image */}
                <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
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
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md border border-primary/20"
                        >
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

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <Link href={`/projects/${project.slug}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} GitHub repository`}
                      >
                        <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary">
                          <Github size={16} />
                        </Button>
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live demo`}
                      >
                        <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary">
                          <ExternalLink size={16} />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-5xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Projects Coming Soon!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              I'm currently adding my projects to the database. Check back soon for exciting work including GameON, Marine Minds, and more!
            </p>
            <div className="flex gap-4 justify-center">
              <a href="https://github.com/ayushtiwari18" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">View GitHub</Button>
              </a>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
