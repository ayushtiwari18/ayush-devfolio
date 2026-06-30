'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Code2 } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import StaggeredList from '@/components/animations/StaggeredList';

// ---------------------------------------------------------------------------
// PROJECT IMAGE — with error fallback (fixes broken image loading)
// ---------------------------------------------------------------------------
function ProjectImage({ src, title }) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    // Gradient fallback with first letter of project title
    return (
      <div className="h-48 bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 flex-shrink-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-primary/40">
          <Code2 size={36} />
          <span className="text-2xl font-bold font-display">
            {title?.[0]?.toUpperCase() ?? 'P'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-48 bg-muted overflow-hidden flex-shrink-0">
      <Image
        src={src}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        onError={() => setImgError(true)}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWUyOTNiIi8+PC9zdmc+"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// PROJECT CARD
// Fix: outer wrapper is a plain <div>, NOT a <Link>/<a>
// Navigation handled by "View Details" button only
// This eliminates <a> nested inside <a> — the hydration error source
// ---------------------------------------------------------------------------
function ProjectCard({ project }) {
  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all h-full flex flex-col">

      <ProjectImage src={project.cover_image} title={project.title} />

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
          {project.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
          {project.description}
        </p>

        {/* Tech stack pills */}
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

        {/* Action row — all independent <a> tags, no nesting */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
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
              aria-label={`${project.title} live demo`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="ml-auto text-primary text-xs font-semibold hover:underline flex items-center gap-1"
          >
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FEATURED PROJECTS — receives SSR-fetched projects as prop from page.js
// ---------------------------------------------------------------------------
export default function FeaturedProjects({ projects = [] }) {
  const header = useReveal({ threshold: 0.1 });

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-section px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">

        <div
          ref={header.ref}
          className="text-center mb-16"
          style={fadeUp(header.visible)}
        >
          <p className="section-label mb-3">My Work</p>
          <h2 className="section-heading mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Production-grade systems built to solve real problems
          </p>
        </div>

        <StaggeredList
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          staggerMs={100}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </StaggeredList>

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

      </div>
    </section>
  );
}
