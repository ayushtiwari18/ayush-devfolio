'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import StaggeredList from '@/components/animations/StaggeredList';

// ---------------------------------------------------------------------------
// PROJECT CARD SKELETON — shown per-card while data loads
// ---------------------------------------------------------------------------
function ProjectCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden h-full" aria-hidden="true">
      <div className="skeleton h-48 w-full" />
      <div className="p-6 space-y-3">
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="flex gap-2 mt-4">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PROJECT CARD
// ---------------------------------------------------------------------------
function ProjectCard({ project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <div className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all h-full flex flex-col">

        {/* Cover image */}
        {project.cover_image ? (
          <div className="relative h-48 bg-muted overflow-hidden flex-shrink-0">
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWUyOTNiIi8+PC9zdmc+"
            />
          </div>
        ) : (
          /* Gradient placeholder when no image */
          <div className="h-48 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 flex-shrink-0 flex items-center justify-center">
            <span className="text-4xl text-primary/30 font-display font-bold">
              {project.title?.[0] ?? 'P'}
            </span>
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
            {project.title}
          </h3>

          {/* Description — problem→impact format (first 120 chars) */}
          <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
            {project.description}
          </p>

          {/* Tech stack pills — show up to 5 */}
          {project.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.slice(0, 5).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 font-medium"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                  +{project.technologies.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`${project.title} GitHub repository`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <GitHubIcon size={18} />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`${project.title} live demo`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            )}
            <span className="ml-auto text-primary text-xs font-semibold group-hover:underline flex items-center gap-1">
              View Details <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// FEATURED PROJECTS — self-fetching (fixes the broken prop-only pattern)
// ---------------------------------------------------------------------------
export default function FeaturedProjects() {
  const [projects, setProjects]   = useState(null); // null = loading
  const [error, setError]         = useState(false);
  const header = useReveal({ threshold: 0.1 });

  useEffect(() => {
    fetch('/api/public/projects')
      .then(r => {
        if (!r.ok) throw new Error('fetch failed');
        return r.json();
      })
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.projects ?? []);
        // Show only featured projects (up to 6)
        const featured = list.filter(p => p.featured).slice(0, 6);
        setProjects(featured.length > 0 ? featured : list.slice(0, 6));
      })
      .catch(() => {
        setError(true);
        setProjects([]);
      });
  }, []);

  // Hide section only on confirmed error with no data
  if (error && projects?.length === 0) return null;

  const isLoading = projects === null;

  return (
    <section id="projects" className="py-section px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={header.ref}
          className="text-center mb-16"
          style={fadeUp(header.visible)}
        >
          <p className="section-label mb-3">My Work</p>
          <h2 className="section-heading mb-4">
            Featured{' '}
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Production-grade systems built to solve real problems
          </p>
        </div>

        {/* Grid — skeleton while loading, cards when ready */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)}
          </div>
        ) : projects.length === 0 ? null : (
          <StaggeredList
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            staggerMs={100}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </StaggeredList>
        )}

        {/* CTA */}
        {!isLoading && projects.length > 0 && (
          <div className="text-center">
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                View All Projects
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
