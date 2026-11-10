'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Trophy, Calendar, MapPin, Users,
  ArrowRight, Search, X, Sparkles, Film,
  Code2, ExternalLink
} from 'lucide-react';

const CATEGORY_TABS = [
  { key: 'all',        label: 'All Milestones' },
  { key: 'hackathon',  label: 'Hackathons' },
  { key: 'podium',     label: 'Podium & Wins' },
  { key: 'leadership', label: 'Leadership & Creative' },
];

function isPodium(result) {
  if (!result) return false;
  const r = result.toLowerCase();
  return (
    r.includes('win') ||
    r.includes('1st') ||
    r.includes('first') ||
    r.includes('top') ||
    r.includes('podium') ||
    r.includes('final')
  );
}

function resultBadge(result) {
  if (!result) return null;
  const r = result.toLowerCase();
  if (r.includes('win') || r.includes('1st')) {
    return 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
  }
  if (r.includes('top') || r.includes('podium') || r.includes('final')) {
    return 'border-orange-500/40 bg-orange-500/10 text-orange-300';
  }
  return 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300';
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return null;
  }
}

export default function EventsCatalogClient({ events = [] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats computation
  const totalEvents = events.length;
  const totalWins = events.filter(e => isPodium(e.result)).length;
  const totalHackathons = events.filter(e => e.type === 'hackathon').length;
  const totalImpact = events.filter(e => e.type === 'other' || e.type === 'leadership' || e.category === 'College Event').length;

  // Filtered list
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Tab filter
      if (activeTab === 'hackathon' && event.type !== 'hackathon') return false;
      if (activeTab === 'podium' && !isPodium(event.result)) return false;
      if (activeTab === 'leadership' && !(event.type === 'other' || event.type === 'leadership' || event.category === 'College Event')) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title?.toLowerCase().includes(q);
        const matchesDesc = event.description?.toLowerCase().includes(q);
        const matchesOrg = event.organizer?.toLowerCase().includes(q);
        const matchesRole = event.role?.toLowerCase().includes(q);
        const matchesTech = Array.isArray(event.technologies) &&
          event.technologies.some(t => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesDesc && !matchesOrg && !matchesRole && !matchesTech) {
          return false;
        }
      }

      return true;
    });
  }, [events, activeTab, searchQuery]);

  return (
    <div className="space-y-12">
      {/* ── METRICS RIBBON ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#090D16] border border-white/10 hover:border-white/20 transition-all shadow-xl">
          <span className="block text-3xl font-black text-white font-mono">{totalEvents}</span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1 block">
            Verified Milestones
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#090D16] border border-amber-500/20 shadow-[0_0_20px_-5px_rgba(245,158,11,0.1)] hover:border-amber-500/40 transition-all">
          <span className="block text-3xl font-black text-amber-400 font-mono">{totalWins}</span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1 block">
            Podium &amp; Finalist Wins
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#090D16] border border-violet-500/20 shadow-[0_0_20px_-5px_rgba(139,92,246,0.1)] hover:border-violet-500/40 transition-all">
          <span className="block text-3xl font-black text-violet-400 font-mono">{totalHackathons}</span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1 block">
            Hackathons &amp; Sprints
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#090D16] border border-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.1)] hover:border-emerald-500/40 transition-all">
          <span className="block text-3xl font-black text-emerald-400 font-mono">{totalImpact}</span>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1 block">
            Community &amp; Leadership
          </span>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 rounded-2xl bg-[#090D16] border border-white/10">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] md:min-w-[320px] px-2 pb-2 md:pb-0">
          <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, stack, roles..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── EVENTS CATALOG GRID ── */}
      {filteredEvents.length === 0 ? (
        <div className="py-24 text-center rounded-3xl border border-white/5 bg-[#090D16]">
          <Code2 size={40} className="mx-auto text-slate-500 mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">No milestones match your criteria</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
            Try adjusting your search terms or selecting another category filter.
          </p>
          <button
            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-mono text-cyan-400 hover:bg-white/[0.08]"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const hasCaseStudy = Boolean(event.hasCaseStudy || event.caseStudyUrl || event.slug === 'pehel');
            const targetUrl = event.caseStudyUrl || `/events/${event.slug}`;
            const dateFmt = formatDate(event.date);

            return (
              <div
                key={event.id || event.slug}
                className="group flex flex-col rounded-2xl bg-[#090D16] border border-white/10 overflow-hidden hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl"
              >
                {/* Poster / Media Frame */}
                <div className="aspect-[16/10] w-full relative overflow-hidden bg-black/40 border-b border-white/5">
                  {event.cover_image ? (
                    <img
                      src={event.cover_image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0D121F] to-[#06080E]">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-2.5">
                        {event.type === 'hackathon' ? (
                          <Code2 size={20} className="text-cyan-400" />
                        ) : event.slug === 'pehel' ? (
                          <Film size={20} className="text-indigo-400" />
                        ) : (
                          <Trophy size={20} className="text-amber-400" />
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        {event.organizer || 'Official Circuit'}
                      </span>
                    </div>
                  )}

                  {/* Top Badge Overlay */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/10 text-slate-200">
                      {event.category || event.type}
                    </span>
                    {event.result && (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${resultBadge(event.result)}`}>
                        {event.result}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                      {dateFmt && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} className="text-cyan-400" />
                          {dateFmt}
                        </span>
                      )}
                      {event.location && (
                        <span className="inline-flex items-center gap-1 truncate">
                          <MapPin size={12} className="text-slate-500 shrink-0" />
                          <span className="truncate max-w-[140px]">{event.location}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {event.tagline || event.description}
                    </p>
                  </div>

                  {/* Tech Stack / Tags */}
                  {Array.isArray(event.technologies) && event.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {event.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                      {event.technologies.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.02] text-slate-500">
                          +{event.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Action Link */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    {hasCaseStudy ? (
                      <Link
                        href={targetUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400 group-hover:gap-2.5 transition-all"
                      >
                        <span>Read Case Study</span>
                        <ArrowRight size={13} />
                      </Link>
                    ) : event.links?.live ? (
                      <a
                        href={event.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-cyan-400 transition-colors"
                      >
                        <span>Project Demo</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500">
                        {event.role || 'Participant'}
                      </span>
                    )}

                    {event.team_size > 1 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
                        <Users size={12} />
                        Team of {event.team_size}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
