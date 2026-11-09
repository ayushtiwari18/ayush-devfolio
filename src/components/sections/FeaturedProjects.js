'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Code2, Sparkles, Layers } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import StaggeredList from '@/components/animations/StaggeredList';

// ---------------------------------------------------------------------------
// PROJECT IMAGE — with error fallback and status telemetry badge
// ---------------------------------------------------------------------------
function ProjectImage({ src, title, hasLiveUrl }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative h-52 bg-[#080B12] overflow-hidden flex-shrink-0 border-b border-white/10">
      {/* Telemetry Status Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#080C14]/90 border border-white/15 backdrop-blur-md shadow-lg text-[10px] font-mono-code font-semibold tracking-wider uppercase">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${hasLiveUrl ? 'bg-emerald-400 opacity-75' : 'bg-primary opacity-75'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${hasLiveUrl ? 'bg-emerald-500' : 'bg-primary'}`} />
        </span>
        <span className={hasLiveUrl ? 'text-emerald-400' : 'text-gray-300'}>
          {hasLiveUrl ? 'Production' : 'Artifact'}
        </span>
      </div>

      {!src || imgError ? (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-[#0A0D15] to-accent/10">
          <Code2 size={40} className="text-primary/40 mb-2" />
          <span className="text-xl font-bold font-display text-gray-400">
            {title?.[0]?.toUpperCase() ?? 'P'}
          </span>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDcwOTEwIi8+PC9zdmc+"
          />
          {/* Subtle gradient vignette over image bottom */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(9,13,22,0.9) 0%, rgba(9,13,22,0.1) 40%, transparent 100%)',
            }}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PROJECT CARD
// ---------------------------------------------------------------------------
function ProjectCard({ project }) {
  return (
    <div className="group bg-[#090D16] border border-white/10 hover:border-indigo-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <ProjectImage
        src={project.cover_image}
        title={project.title}
        hasLiveUrl={Boolean(project.live_url)}
      />

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors leading-snug font-display">
          {project.title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-300 mb-5 flex-1 line-clamp-3 leading-relaxed font-sans">
          {project.description}
        </p>

        {/* Tech stack pills */}
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.technologies.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-white/[0.03] text-gray-300 text-xs font-mono-code rounded-lg border border-white/10 font-medium"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2.5 py-1 bg-white/[0.02] text-gray-400 text-xs font-mono-code rounded-lg border border-white/5">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub repository`}
              title="View Repository"
              className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all active:scale-95"
            >
              <GitHubIcon size={16} />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              title="Live Deployment"
              className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all active:scale-95"
            >
              <ExternalLink size={16} />
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="ml-auto text-primary text-xs font-semibold font-mono-code hover:text-white flex items-center gap-1.5 transition-colors group/link"
          >
            <span>Case Study</span>
            <ArrowRight size={13} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FEATURED PROJECTS
// ---------------------------------------------------------------------------
export default function FeaturedProjects({ projects = [] }) {
  const header = useReveal({ threshold: 0.1 });

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#05070B] overflow-hidden">
      
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/4 w-[700px] h-[500px] bg-primary/[0.03] rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">

        <div
          ref={header.ref}
          className="text-center max-w-3xl mx-auto mb-16"
          style={fadeUp(header.visible)}
        >
          <p className="text-xs font-mono-code font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            // 04. PRODUCTION WORK & SYSTEM ARCHITECTURE
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em] leading-tight mb-4">
            Featured <span className="text-primary inline-block">Engineering Systems</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Architected for high throughput, robust security postures, and production performance.
          </p>
        </div>

        <StaggeredList
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14"
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
              className="h-12 px-8 border border-white/20 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white/10 hover:border-white/40 text-sm font-semibold rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore All Engineering Artifacts</span>
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
