'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Code2, ShieldCheck, Cpu, Zap } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import StaggeredList from '@/components/animations/StaggeredList';
import PeelCard from '@/components/ui/PeelCard';

// ---------------------------------------------------------------------------
// PROJECT IMAGE — with error fallback (fixes broken image loading)
// ---------------------------------------------------------------------------
function ProjectImage({ src, title }) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
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
// PROJECT CARD WITH PEEL EFFECT
// ---------------------------------------------------------------------------
function ProjectCard({ project }) {
  const frontContent = (
    <div className="h-full flex flex-col">
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

        {/* Action row */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub repository`}
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={18} />
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="ml-auto text-primary text-xs font-semibold hover:underline flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div className="flex flex-col h-full justify-between gap-3 text-xs">
      <div>
        <h4 className="font-bold text-foreground text-base mb-1">{project.title}</h4>
        <p className="text-muted-foreground line-clamp-2 leading-relaxed">
          {project.problem_statement || project.description}
        </p>
      </div>

      <div className="space-y-2 my-2">
        <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-2">
          <Zap size={15} className="text-primary shrink-0" />
          <div>
            <p className="font-semibold text-foreground text-[11px]">Architecture Strategy</p>
            <p className="text-[10px] text-muted-foreground">Next.js App Router · Supabase ISR · Edge CDN</p>
          </div>
        </div>

        <div className="p-2.5 bg-accent/5 rounded-xl border border-accent/10 flex items-center gap-2">
          <ShieldCheck size={15} className="text-accent shrink-0" />
          <div>
            <p className="font-semibold text-foreground text-[11px]">Security & Scale</p>
            <p className="text-[10px] text-muted-foreground">OWASP Top 10 Hardened · WAF Guarded</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <Link
          href={`/projects/${project.slug}`}
          className="w-full py-2 px-3 bg-primary text-white text-center font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          Full Case Study <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );

  return (
    <PeelCard
      front={frontContent}
      back={backContent}
      className="h-full"
    />
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
