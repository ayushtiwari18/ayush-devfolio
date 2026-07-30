'use client';

import { useEffect, useState } from 'react';
import {
  Briefcase, MapPin, Calendar, ChevronLeft, ChevronRight,
  Sparkles, Layers, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import Peel from '@/components/ui/Peel';

// Rich fallback items sorted in reverse chronological order
const FALLBACK = [
  {
    id: 'exp-1',
    company: 'Ayush Devfolio / Open Source',
    role: 'Lead Full Stack Architect & Maintainer',
    employment_type: 'Full-time',
    start_date: 'Jan 2025',
    end_date: 'Present',
    location: 'Remote',
    description:
      'Architected high-performance Next.js 14 Web applications with SSR/ISR acceleration.\nImplemented WebGL interactive shaders, Canvas UI peel dynamics, and custom Framer Motion micro-interactions.\nOptimized Core Web Vitals to achieve 99+ Lighthouse performance & 100% SEO scores.',
    technologies: 'Next.js,React,WebGL,Tailwind CSS,Supabase,TypeScript',
  },
  {
    id: 'exp-2',
    company: 'Tech Solutions Inc.',
    role: 'Frontend Software Engineer',
    employment_type: 'Part-time',
    start_date: 'Jun 2024',
    end_date: 'Dec 2024',
    location: 'Hybrid',
    description:
      'Engineered real-time dashboard components using React and Supabase subscriptions.\nReduced bundle size by 35% through dynamic code splitting and tree-shaking optimizations.\nIntegrated OWASP hardened security policies and responsive glassmorphism UI systems.',
    technologies: 'React,JavaScript,Tailwind CSS,REST API,Git',
  },
  {
    id: 'exp-3',
    company: 'Open Source Community',
    role: 'UI/UX & Open Source Contributor',
    employment_type: 'Open Source',
    start_date: 'Jan 2024',
    end_date: 'May 2024',
    location: 'Remote',
    description:
      'Contributed to open source component libraries and fixed critical hydration bugs.\nAuthored comprehensive documentation and unit test suites with Jest and React Testing Library.',
    technologies: 'React,JavaScript,CSS3,GitHub Actions',
  },
];

const TYPE_COLORS = {
  'Full-time':   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Part-time':   'bg-blue-500/10    text-blue-400    border border-blue-500/20',
  'Internship':  'bg-amber-500/10   text-amber-400   border border-amber-500/20',
  'Contract':    'bg-purple-500/10  text-purple-400  border border-purple-500/20',
  'Freelance':   'bg-pink-500/10    text-pink-400    border border-pink-500/20',
  'Open Source': 'bg-cyan-500/10    text-cyan-400    border border-cyan-500/20',
};

// ---------------------------------------------------------------------------
// FULL-WIDTH STACKED EXPERIENCE CARD
// ---------------------------------------------------------------------------
function FullWidthExperienceCard({ entry, index, total }) {
  const bullets = (entry.description || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const techs = (entry.technologies || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  return (
    <div className="w-full h-full bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden relative">
      {/* Background Accent Sheen */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20 flex items-center gap-1.5">
              <Layers size={13} />
              Role {index + 1} of {total}
            </span>
            {entry.employment_type && (
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                TYPE_COLORS[entry.employment_type] || 'bg-muted text-muted-foreground'
              }`}>
                {entry.employment_type}
              </span>
            )}
          </div>

          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/80 px-3.5 py-1.5 rounded-full font-mono-code border border-border">
            <Calendar size={13} className="text-primary" />
            {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1 leading-snug">
            {entry.role}
          </h3>
          <div className="flex items-center gap-3">
            <p className="text-primary font-bold text-base sm:text-lg flex items-center gap-1.5">
              <Briefcase size={16} />
              {entry.company}
            </p>
            {entry.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} />
                {entry.location}
              </span>
            )}
          </div>
        </div>

        {/* Description Bullets */}
        {bullets.length > 0 && (
          <ul className="space-y-2.5 my-5 border-t border-border/60 pt-5">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Tech Stack Pills */}
      <div className="relative z-10 pt-4 border-t border-border/60 mt-auto">
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techs.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-muted/70 text-foreground text-xs font-medium rounded-lg border border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WORK EXPERIENCE SECTION WITH CANVAS UI WEBGLE PEEL STACK DECK
// ---------------------------------------------------------------------------
export default function Experience() {
  const [entries, setEntries] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const section = useReveal({ threshold: 0.1 });

  useEffect(() => {
    fetch('/api/public/experience')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Sort reverse chronological by date
          const sorted = [...data].sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
          setEntries(sorted);
        } else {
          setEntries(FALLBACK);
        }
      })
      .catch(() => setEntries(FALLBACK));
  }, []);

  const displayed = entries ?? FALLBACK;
  const currentEntry = displayed[activeIdx] || displayed[0];
  const nextIdx = (activeIdx + 1) % displayed.length;
  const nextEntry = displayed[nextIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % displayed.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + displayed.length) % displayed.length);
  };

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div
          ref={section.ref}
          className="text-center mb-12"
          style={fadeUp(section.visible)}
        >
          <p className="section-label mb-3">Career History</p>
          <h2 className="section-heading mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Roles and impact in reverse chronological order — hover or click left edge to peel to the next role
          </p>
        </div>

        {/* FULL-WIDTH STACKED EXPERIENCE DECK WITH CANVAS UI PEEL */}
        <div className="relative max-w-4xl mx-auto min-h-[420px] sm:min-h-[440px]">
          <Peel
            side="left"
            mode="cursor"
            reveal={520}
            zone={220}
            curl={300}
            shine={1}
            shade={0.3}
            under={
              <FullWidthExperienceCard
                entry={nextEntry}
                index={nextIdx}
                total={displayed.length}
              />
            }
            className="w-full h-full rounded-3xl"
          >
            <FullWidthExperienceCard
              entry={currentEntry}
              index={activeIdx}
              total={displayed.length}
            />
          </Peel>
        </div>

        {/* DECK CONTROLS & REVERSE CHRONOLOGICAL NAVIGATION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mt-8 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-card border border-border px-3.5 py-1.5 rounded-full">
              <Sparkles size={14} className="text-primary animate-pulse" />
              Hover left edge or click to peel to next experience
            </span>
          </div>

          {/* Dots & Nav Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous experience"
              className="p-2.5 rounded-xl bg-card border border-border hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1.5 px-3">
              {displayed.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Go to experience ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === activeIdx ? 'w-8 bg-primary' : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next experience"
              className="p-2.5 rounded-xl bg-card border border-border hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
