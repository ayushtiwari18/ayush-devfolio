'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight, ExternalLink, Code2, ShieldCheck,
  ChevronLeft, ChevronRight, Sparkles, Layers,
  CheckCircle2, Rocket
} from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import Peel from '@/components/ui/Peel';

// ---------------------------------------------------------------------------
// PROJECT IMAGE WITH FALLBACK
// ---------------------------------------------------------------------------
function ProjectImage({ src, title }) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className="w-full h-full min-h-[220px] bg-gradient-to-br from-primary/20 via-accent/15 to-background flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-primary/60">
          <Code2 size={48} />
          <span className="text-3xl font-extrabold font-display tracking-wide">
            {title?.[0]?.toUpperCase() ?? 'P'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[260px] sm:min-h-[320px] bg-muted overflow-hidden">
      <Image
        src={src}
        alt={title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        onError={() => setImgError(true)}
        priority
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// STACKED PROJECT CARD LAYOUT (Full-Width Card Layer)
// ---------------------------------------------------------------------------
function FullWidthProjectCard({ project, index, total }) {
  return (
    <div className="w-full h-full bg-card border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
      {/* Left Column: Image */}
      <div className="lg:w-1/2 relative bg-black/40">
        <ProjectImage src={project.cover_image} title={project.title} />
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[11px] font-semibold text-white flex items-center gap-1.5">
          <Layers size={12} className="text-primary" />
          Project {index + 1} of {total}
        </div>
      </div>

      {/* Right Column: Information & Actions */}
      <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-card/95">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
              Featured Case Study
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 leading-snug">
            {project.title}
          </h3>

          <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Tech Stack Pills */}
          {project.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.slice(0, 6).map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-muted/60 text-foreground text-xs font-medium rounded-lg border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Key Architecture Highlights */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-muted/30 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-400 shrink-0" />
              <span className="text-xs font-medium text-foreground">Production Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              <span className="text-xs font-medium text-foreground">Security Hardened</span>
            </div>
          </div>
        </div>

        {/* Action Row — Pointer Events Protected */}
        <div className="flex items-center gap-4 pt-4 border-t border-border mt-auto pointer-events-auto">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-muted hover:bg-primary/20 text-foreground hover:text-primary rounded-xl transition-colors flex items-center justify-center gap-2 text-xs font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <GitHubIcon size={18} />
              <span className="hidden sm:inline">Repository</span>
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-muted hover:bg-primary/20 text-foreground hover:text-primary rounded-xl transition-colors flex items-center justify-center gap-2 text-xs font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={18} />
              <span className="hidden sm:inline">Live Demo</span>
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="ml-auto px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center gap-2 text-xs sm:text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            View Case Study <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FEATURED PROJECTS SECTION WITH CANVAS UI WEBGLE PEEL SHADER
// ---------------------------------------------------------------------------
export default function FeaturedProjects({ projects = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const header = useReveal({ threshold: 0.1 });

  if (!projects || projects.length === 0) return null;

  const currentProject = projects[activeIdx];
  const nextIdx = (activeIdx + 1) % projects.length;
  const nextProject = projects[nextIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={header.ref}
          className="text-center mb-12"
          style={fadeUp(header.visible)}
        >
          <p className="section-label mb-3">Proof of Work</p>
          <h2 className="section-heading mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Move cursor to the left edge to peel the project sheet &amp; reveal the next build
          </p>
        </div>

        {/* FULL-WIDTH STACKED CARD CONTAINER WITH CANVAS UI PEEL */}
        <div className="relative max-w-5xl mx-auto min-h-[480px] sm:min-h-[500px]">
          <Peel
            side="left"
            mode="cursor"
            reveal={550}
            zone={220}
            curl={320}
            shine={1}
            shade={0.3}
            under={
              <FullWidthProjectCard
                project={nextProject}
                index={nextIdx}
                total={projects.length}
              />
            }
            className="w-full h-full rounded-3xl"
          >
            <FullWidthProjectCard
              project={currentProject}
              index={activeIdx}
              total={projects.length}
            />
          </Peel>
        </div>

        {/* STACK CONTROLS & PAGINATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto mt-8 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-full">
              <Sparkles size={14} className="text-primary animate-pulse" />
              Hover left edge to peel sticker sheet
            </span>
          </div>

          {/* Dots & Nav Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous project"
              className="p-2.5 rounded-xl bg-card border border-border hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1.5 px-3">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Go to project ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === activeIdx ? 'w-8 bg-primary' : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next project"
              className="p-2.5 rounded-xl bg-card border border-border hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="text-center mt-12">
          <Link href="/projects">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 gap-2"
            >
              Explore All Projects <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
