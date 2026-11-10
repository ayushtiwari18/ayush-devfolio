'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar, MapPin, Users, Trophy,
  ArrowRight, Search, X, Sparkles, Film,
  Code2, ExternalLink
} from 'lucide-react';

const FILTERS = [
  { key: 'all',        label: 'All Journey' },
  { key: 'hackathon',  label: 'Hackathons' },
  { key: 'podium',     label: 'Podium & Wins' },
  { key: 'leadership', label: 'Leadership & Community' },
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

function resultBadgeStyle(result) {
  if (!result) return null;
  const r = result.toLowerCase();
  if (r.includes('win') || r.includes('1st')) {
    return 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
  }
  if (r.includes('top') || r.includes('podium') || r.includes('final')) {
    return 'border-orange-500/40 bg-orange-500/10 text-orange-300';
  }
  return 'border-primary/40 bg-primary/10 text-primary';
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

function groupByYear(events) {
  const map = {};
  events.forEach(e => {
    const year = e.date ? new Date(e.date).getFullYear() : 'Milestones';
    if (!map[year]) map[year] = [];
    map[year].push(e);
  });
  return Object.entries(map).sort((a, b) => {
    if (a[0] === 'Milestones') return 1;
    if (b[0] === 'Milestones') return -1;
    return Number(b[0]) - Number(a[0]);
  });
}

export default function EventsTimelineClient({ events = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (activeFilter === 'hackathon' && event.type !== 'hackathon') return false;
      if (activeFilter === 'podium' && !isPodium(event.result)) return false;
      if (activeFilter === 'leadership' && !(event.type === 'other' || event.type === 'leadership' || event.category === 'College Event')) {
        return false;
      }

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
  }, [events, activeFilter, searchQuery]);

  const yearGroups = useMemo(() => groupByYear(filteredEvents), [filteredEvents]);

  return (
    <div className="space-y-12">
      {/* ── FILTER & SEARCH TOOLBAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 rounded-2xl bg-[#090D16] border border-white/10 shadow-xl">
        <div className="flex flex-wrap items-center gap-1.5 p-1">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeFilter === f.key
                  ? 'bg-primary text-white border border-primary shadow-sm shadow-primary/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {f.label}
              {f.key !== 'all' && (
                <span className="ml-1.5 opacity-60">
                  {events.filter(e => {
                    if (f.key === 'hackathon') return e.type === 'hackathon';
                    if (f.key === 'podium') return isPodium(e.result);
                    if (f.key === 'leadership') return e.type === 'other' || e.type === 'leadership' || e.category === 'College Event';
                    return true;
                  }).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px] md:min-w-[300px] px-2 pb-2 md:pb-0">
          <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journey by name, tech, role..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── TIMELINE TRACK CONTAINER ── */}
      {filteredEvents.length === 0 ? (
        <div className="py-24 text-center rounded-3xl border border-white/5 bg-[#090D16]">
          <Code2 size={40} className="mx-auto text-gray-500 mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">No timeline events match your filter</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
            Try adjusting your search query or selecting &quot;All Journey&quot;.
          </p>
          <button
            onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-xs font-mono text-primary hover:bg-white/[0.08]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical Timeline Spine Line */}
          <div
            aria-hidden="true"
            className="absolute left-4 sm:left-6 top-3 bottom-6 w-px bg-gradient-to-b from-primary via-white/15 to-transparent pointer-events-none"
          />

          <div className="space-y-16">
            {yearGroups.map(([year, yearEvents]) => (
              <div key={year} className="relative z-10">
                {/* Year Marker Badge */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative z-20 flex items-center justify-center w-8 sm:w-12">
                    <span className="w-3 h-3 rounded-full bg-primary ring-4 ring-[#05070B] shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-[#090D16] border border-primary/40 shadow-[0_0_15px_-3px_rgba(99,102,241,0.25)]">
                    <span className="text-sm font-mono font-bold text-primary tracking-widest">
                      {year}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {/* Timeline Events List for Year */}
                <div className="space-y-8 pl-8 sm:pl-12">
                  {yearEvents.map((event, idx) => {
                    const dateFmt = formatDate(event.date);
                    const isPodiumWin = isPodium(event.result);
                    const targetUrl = event.caseStudyUrl || (event.slug === 'pehel' ? '/events/pehel' : null);
                    const hasActionLink = Boolean(targetUrl || event.links?.live);

                    // Image handling
                    const imgSrc = event.cover_image;
                    const isSupabase = Boolean(imgSrc && imgSrc.includes('supabase.co'));

                    return (
                      <div
                        key={event.id || event.slug || idx}
                        className="relative group"
                      >
                        {/* Timeline Node on Spine */}
                        <div
                          aria-hidden="true"
                          className="absolute -left-[24px] sm:-left-[36px] top-6 w-2.5 h-2.5 rounded-full bg-white/40 ring-4 ring-[#05070B] group-hover:bg-primary group-hover:ring-primary/20 transition-all z-10"
                        />

                        {/* Full-Width Balanced Journey Card */}
                        <article className="rounded-2xl bg-[#090D16] border border-white/10 hover:border-primary/40 transition-colors duration-200 shadow-xl overflow-hidden">
                          <div className={`grid grid-cols-1 ${imgSrc ? 'lg:grid-cols-12' : ''} gap-0 items-stretch`}>
                            {/* Media Poster Column (Clean 16:9 ratio, ZERO black gradient mask) */}
                            {imgSrc && (
                              <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full bg-[#070A12] border-b lg:border-b-0 lg:border-r border-white/[0.08] overflow-hidden">
                                <Image
                                  src={imgSrc}
                                  alt={event.title}
                                  fill
                                  className="object-cover object-center"
                                  sizes="(max-width: 1024px) 100vw, 420px"
                                  unoptimized={isSupabase}
                                  priority={idx === 0}
                                />
                              </div>
                            )}

                            {/* Narrative Content Column */}
                            <div className={`${imgSrc ? 'lg:col-span-7' : 'w-full'} p-6 sm:p-7 flex flex-col justify-between space-y-4`}>
                              <div className="space-y-3">
                                {/* Badges Header */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-white/[0.04] border border-white/10 text-gray-300">
                                    {event.category || event.type}
                                  </span>

                                  {event.result && (
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${resultBadgeStyle(event.result)}`}>
                                      {isPodiumWin && <Trophy size={11} />}
                                      {event.result}
                                    </span>
                                  )}

                                  {dateFmt && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-400 ml-auto">
                                      <Calendar size={12} className="text-primary" />
                                      {dateFmt}
                                    </span>
                                  )}
                                </div>

                                {/* Event Title */}
                                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-primary transition-colors leading-snug font-display">
                                  {event.title}
                                </h3>

                                {/* Meta details: Role, Location, Team */}
                                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                                  {event.role && (
                                    <span className="text-white font-medium">
                                      {event.role}
                                    </span>
                                  )}
                                  {event.organizer && (
                                    <span>
                                      · {event.organizer}
                                    </span>
                                  )}
                                  {event.location && (
                                    <span className="inline-flex items-center gap-1 text-gray-400">
                                      <MapPin size={12} className="text-primary shrink-0" />
                                      {event.location}
                                    </span>
                                  )}
                                  {event.team_size > 1 && (
                                    <span className="inline-flex items-center gap-1 text-gray-400">
                                      <Users size={12} className="text-gray-500 shrink-0" />
                                      Team of {event.team_size}
                                    </span>
                                  )}
                                </div>

                                {/* Story / Description Narrative */}
                                <p className="text-sm text-gray-300 font-sans leading-relaxed">
                                  {event.description || event.tagline}
                                </p>

                                {/* Technologies / Learnings */}
                                {Array.isArray(event.technologies) && event.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    {event.technologies.map((tech, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-gray-300 border border-white/5"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Action Link if deep story or demo exists */}
                              {hasActionLink && (
                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                  {targetUrl ? (
                                    <Link
                                      href={targetUrl}
                                      className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-primary hover:text-white group-hover:gap-2.5 transition-all"
                                    >
                                      <span>
                                        {event.slug === 'pehel' ? 'Explore Pehel Event Story & Video' : 'Explore Case Study'}
                                      </span>
                                      <ArrowRight size={13} />
                                    </Link>
                                  ) : event.links?.live ? (
                                    <a
                                      href={event.links.live}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-300 hover:text-primary transition-colors"
                                    >
                                      <span>Project Live Demo</span>
                                      <ExternalLink size={12} />
                                    </a>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
