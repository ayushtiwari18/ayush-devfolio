'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Star, ExternalLink, Code2, ArrowRight, Shield, Sparkles, Layers, Cpu } from 'lucide-react';
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

  // Featured flagship project (SENTINAL or first featured)
  const flagshipProject = useMemo(() => {
    return filteredProjects.find(p => p.slug === 'sentinal') || filteredProjects.find(p => p.featured) || null;
  }, [filteredProjects]);

  const otherProjects = useMemo(() => {
    if (!flagshipProject) return filteredProjects;
    return filteredProjects.filter(p => p.id !== flagshipProject.id);
  }, [filteredProjects, flagshipProject]);

  return (
    <div className="space-y-12">
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

      {/* ── Flagship Showcase: SENTINAL (If present in filter) ── */}
      {flagshipProject && (
        <section className="relative rounded-3xl overflow-hidden bg-[#090D16] border border-white/10 shadow-2xl shadow-black/50 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.05] via-transparent to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10 items-center">
            {/* Visual Preview Left */}
            <div className="lg:col-span-5 relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/10 bg-[#070A12] shrink-0 shadow-xl">
              {flagshipProject.cover_image ? (
                <Image
                  src={flagshipProject.cover_image}
                  alt={flagshipProject.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
                  <Shield size={64} className="text-primary/40 mb-2" />
                  <span className="text-xs font-mono text-gray-400">ARCHITECTURAL PREVIEW</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent opacity-80" />

              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono font-bold backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE PRODUCTION DEPLOYMENT
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[11px] font-mono font-bold backdrop-blur-md">
                  <Star size={11} fill="currentColor" /> HackByte 4.0
                </span>
              </div>
            </div>

            {/* Narrative Content Right */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                    Featured Systems Architecture Case Study
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display leading-tight group-hover:text-primary transition-colors">
                  <Link href={`/projects/${flagshipProject.slug}`}>
                    {flagshipProject.title}
                  </Link>
                </h2>

                <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed font-sans line-clamp-3">
                  {flagshipProject.description}
                </p>

                {/* Key Architectural Metrics Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6 text-[11px] font-mono">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="text-gray-500 block text-[9px] uppercase">Architecture</span>
                    <span className="font-bold text-white">5 Microservices</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="text-gray-500 block text-[9px] uppercase">ML Classifier</span>
                    <span className="font-bold text-emerald-400">XGBoost Engine</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="text-gray-500 block text-[9px] uppercase">Policy AI</span>
                    <span className="font-bold text-indigo-400">Gemini 1.5 Pro</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <span className="text-gray-500 block text-[9px] uppercase">Telemetry</span>
                    <span className="font-bold text-cyan-400">Socket.IO Push</span>
                  </div>
                </div>

                {/* Technology Badges */}
                {flagshipProject.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {flagshipProject.technologies.slice(0, 6).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white/[0.03] text-gray-300 text-xs font-mono rounded-lg border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                    {flagshipProject.technologies.length > 6 && (
                      <span className="px-2 py-1 text-gray-500 text-xs font-mono">
                        +{flagshipProject.technologies.length - 6} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Triggers */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.08]">
                <Link href={`/projects/${flagshipProject.slug}`}>
                  <Button className="h-10 px-5 bg-primary text-black hover:bg-primary/90 font-mono font-semibold text-xs rounded-xl shadow-lg shadow-primary/20">
                    <span>Read Full Case Study</span>
                    <ArrowRight size={14} className="ml-1.5" />
                  </Button>
                </Link>

                {flagshipProject.live_url && (
                  <a
                    href={flagshipProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="h-10 px-4 text-xs font-mono border-white/10 bg-white/[0.02] hover:bg-white/10 hover:border-emerald-500/40 text-emerald-400 rounded-xl"
                    >
                      <ExternalLink size={13} className="mr-1.5" />
                      <span>Live SOC Dashboard</span>
                    </Button>
                  </a>
                )}

                {flagshipProject.github_url && (
                  <a
                    href={flagshipProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="h-10 px-3.5 text-xs font-mono border-white/10 bg-white/[0.02] hover:bg-white/10 hover:border-primary/40 text-gray-300 hover:text-white rounded-xl"
                      title="View GitHub Repository"
                    >
                      <GitHubIcon size={14} />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Production Artifacts Grid ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Layers size={16} className="text-primary" />
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              {flagshipProject ? 'Other Production Artifacts' : 'All Projects'}
            </h2>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {otherProjects.length} Systems Shown
          </span>
        </div>

        {otherProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col justify-between rounded-2xl bg-[#090D16] border border-white/10 hover:border-primary/40 hover:bg-[#0D1322] transition-all duration-300 shadow-xl shadow-black/20 overflow-hidden"
              >
                <div>
                  {/* Card Cover Preview */}
                  <div className="relative w-full h-44 bg-[#07090E] overflow-hidden border-b border-white/[0.08]">
                    {project.cover_image ? (
                      <Image
                        src={project.cover_image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Code2 size={48} className="text-primary/20" />
                      </div>
                    )}
                    {project.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-400/90 text-black text-[10px] font-mono font-bold rounded-full shadow-md">
                          <Star size={10} fill="currentColor" /> Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2 font-display">
                      <Link href={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4 font-sans">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-white/[0.03] text-gray-300 text-[11px] font-mono border border-white/[0.06]"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="px-1.5 py-0.5 text-gray-500 text-[10px] font-mono">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Trigger Buttons */}
                <div className="px-5 pb-5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <Link href={`/projects/${project.slug}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full h-8 text-xs font-mono border-white/10 hover:border-primary/50 hover:bg-primary/10 text-gray-300 hover:text-white rounded-lg transition-all"
                    >
                      <span>Explore Story</span>
                      <ArrowRight size={12} className="ml-1" />
                    </Button>
                  </Link>

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
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
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/10 border border-white/10 text-emerald-400 hover:text-emerald-300 transition-colors"
                      title="Live Deployment"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#090D16] border border-white/10 my-6">
            <Code2 size={36} className="text-gray-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white font-mono">No matching projects found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              No builds matched &quot;{searchQuery}&quot; under &quot;{activeCategory}&quot;.
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
      </section>
    </div>
  );
}
