'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Star, ExternalLink, Code2, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  'All Projects',
  'Cybersecurity & WAF',
  'Full-Stack & Cloud',
  'AI & Real-Time',
  'Game Engines',
];

function matchesCategory(project, cat) {
  if (cat === 'All Projects') return true;
  const tags = (project.tags || []).map(t => t.toLowerCase());
  const techs = (project.technologies || []).map(t => t.toLowerCase());
  const allText = `${project.title} ${project.description} ${tags.join(' ')} ${techs.join(' ')}`.toLowerCase();

  if (cat === 'Cybersecurity & WAF') {
    return allText.includes('security') || allText.includes('waf') || allText.includes('ids') || allText.includes('sentinal');
  }
  if (cat === 'Full-Stack & Cloud') {
    return allText.includes('e-commerce') || allText.includes('booking') || allText.includes('consultation') || allText.includes('platform') || allText.includes('base');
  }
  if (cat === 'AI & Real-Time') {
    return allText.includes('ai') || allText.includes('gemini') || allText.includes('stream') || allText.includes('real-time') || allText.includes('websocket') || allText.includes('video');
  }
  if (cat === 'Game Engines') {
    return allText.includes('game') || allText.includes('memory') || allText.includes('tournament') || allText.includes('word');
  }
  return true;
}

// ── Reusable, Pixel-Perfect Grid Card ──────────────────────────
function ProjectGridCard({ project }) {
  const imgSrc = project.cover_image || project.image || null;
  const isSupabase = Boolean(imgSrc && imgSrc.includes('supabase.co'));

  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-[#090D16] border border-white/10 hover:border-primary/45 hover:bg-[#0D1322] transition-all duration-300 shadow-xl shadow-black/30 overflow-hidden">
      <div>
        {/* Uniform 16:10 Aspect Ratio Image Frame */}
        <div className="relative w-full aspect-[16/10] bg-[#070A12] overflow-hidden border-b border-white/[0.08]">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={project.title}
              fill
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={isSupabase}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
              <Code2 size={44} className="text-primary/30 mb-1" />
              <span className="text-[10px] font-mono text-gray-500 uppercase">ARTIFACT PREVIEW</span>
            </div>
          )}

          {/* Bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/70 via-transparent to-transparent pointer-events-none" />

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            {project.featured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-400 text-black text-[10px] font-mono font-bold rounded-full shadow-lg">
                <Star size={10} fill="currentColor" /> Featured
              </span>
            ) : <span />}

            {project.live_url && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-semibold rounded-full shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo
              </span>
            )}
          </div>
        </div>

        {/* Card Content Details */}
        <div className="p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2.5 font-display">
            <Link href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4 font-sans">
            {project.description}
          </p>

          {/* Technology Pills */}
          {project.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-white/[0.03] text-gray-300 text-[11px] font-mono border border-white/[0.06]"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-1.5 py-0.5 text-gray-500 text-[10px] font-mono self-center">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2.5">
        <Link href={`/projects/${project.slug}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full h-9 text-xs font-mono border-white/10 hover:border-primary/50 hover:bg-primary/10 text-gray-300 hover:text-white rounded-xl transition-all"
          >
            <span>Explore Story</span>
            <ArrowRight size={13} className="ml-1.5" />
          </Button>
        </Link>

        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
            title="GitHub Repository"
          >
            <GitHubIcon size={14} />
          </a>
        )}

        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/10 text-emerald-400 hover:text-emerald-300 transition-colors"
            title="Live Deployment"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}

export default function ProjectsCatalogClient({ projects = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Projects');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCat = matchesCategory(project, activeCategory);
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const titleMatch = project.title?.toLowerCase().includes(q);
      const descMatch = project.description?.toLowerCase().includes(q);
      const techMatch = (project.technologies || []).some(t => t.toLowerCase().includes(q));
      const tagMatch = (project.tags || []).some(t => t.toLowerCase().includes(q));

      return titleMatch || descMatch || techMatch || tagMatch;
    });
  }, [projects, activeCategory, searchQuery]);

  // Separate into Featured Projects (Top Grid) and Other Projects (Bottom Grid)
  const featuredProjects = useMemo(() => {
    return filteredProjects.filter(p => p.featured);
  }, [filteredProjects]);

  const otherProjects = useMemo(() => {
    return filteredProjects.filter(p => !p.featured);
  }, [filteredProjects]);

  return (
    <div className="space-y-16">
      {/* ── Editorial Masthead ── */}
      <div className="relative border-b border-white/10 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>// 02. PRODUCTION ARTIFACTS & CASE STUDIES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
              Systems Architecture &amp; Engineering Field Projects
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 font-sans leading-relaxed max-w-2xl">
              Production-grade distributed platforms, intrusion detection engines, and full-stack systems built from scratch with verified telemetry.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-[#090D16] border border-white/10 text-right">
              <span className="text-[10px] font-mono uppercase text-gray-400 block tracking-widest">
                Artifacts Indexed
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                {String(projects.length).padStart(2, '0')} Builds
              </span>
            </div>
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Keyword Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by system, technology (e.g. FastAPI, MongoDB)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                    active
                      ? 'bg-primary text-black font-bold shadow-md shadow-primary/20 scale-[1.02]'
                      : 'bg-[#090D16] border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── TOP SECTION: Featured Projects Grid ── */}
      {featuredProjects.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Sparkles size={17} className="text-yellow-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white font-mono uppercase tracking-wider">
                Featured Production Artifacts
              </h2>
            </div>
            <span className="text-xs font-mono text-yellow-400 font-semibold px-2.5 py-0.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
              {featuredProjects.length} Flagship Systems
            </span>
          </div>

          {/* Clean 3-Column Grid for Featured Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {featuredProjects.map((project) => (
              <ProjectGridCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* ── BOTTOM SECTION: Other Projects Grid ── */}
      {otherProjects.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Layers size={17} className="text-primary" />
              <h2 className="text-lg sm:text-xl font-bold text-white font-mono uppercase tracking-wider">
                {featuredProjects.length > 0 ? 'All Other Systems & Builds' : 'All Projects'}
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-400 px-2.5 py-0.5 rounded-lg bg-white/[0.03] border border-white/10">
              {otherProjects.length} Systems
            </span>
          </div>

          {/* Clean 3-Column Grid for Other Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {otherProjects.map((project) => (
              <ProjectGridCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* ── Empty State ── */}
      {featuredProjects.length === 0 && otherProjects.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#090D16] border border-white/10 my-6">
          <Code2 size={40} className="text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white font-mono">No matching projects found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            No systems matched &quot;{searchQuery}&quot; under &quot;{activeCategory}&quot;.
          </p>
          <Button
            variant="outline"
            onClick={() => { setSearchQuery(''); setActiveCategory('All Projects'); }}
            className="mt-4 text-xs font-mono border-white/10 hover:border-primary/40"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
