'use client';

import React, { useEffect, useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Briefcase, MapPin, Calendar, Sparkles, Layers, CheckCircle2, Award, Zap, ArrowRight, BookOpen } from 'lucide-react';

// Hardcoded Dummy Experience Entries for Sandbox Testing
const DUMMY_EXPERIENCES = [
  {
    id: 1,
    role: 'Lead Systems Architect & Full Stack Lead',
    company: 'TechCorp Innovations',
    location: 'San Francisco, CA',
    start_date: 'Jan 2024',
    end_date: 'Present',
    employment_type: 'Full-time',
    description: '✓ Built real-time multi-tenant event pipeline processing 1.2M events/sec with <15ms latency\n✓ Spearheaded Next.js 14 micro-frontend architecture reducing bundle size by 42%\n✓ Mentored 8 senior engineers and led quarterly technical roadmaps',
    technologies: 'Next.js, TypeScript, WebGL, Node.js, PostgreSQL, Redis, Docker',
  },
  {
    id: 2,
    role: 'Senior Frontend & WebGL Engineer',
    company: 'Nexus Creative Studio',
    location: 'New York, NY',
    start_date: 'Mar 2022',
    end_date: 'Dec 2023',
    employment_type: 'Full-time',
    description: '✓ Designed high-performance 3D WebGL product configurator using Three.js and GSAP\n✓ Improved Lighthouse performance score from 64 to 99 across all core landing pages\n✓ Built custom design system components used by 14 product teams',
    technologies: 'React, Three.js, GSAP, TailwindCSS, WebGL, GraphQL, Vitest',
  },
  {
    id: 3,
    role: 'Full Stack Software Engineer',
    company: 'Apex Cloud Solutions',
    location: 'Remote',
    start_date: 'Jun 2020',
    end_date: 'Feb 2022',
    employment_type: 'Full-time',
    description: '✓ Engineered RESTful & GraphQL microservices with 99.99% uptime SLA\n✓ Authored automated CI/CD deployment pipelines cutting release time from 2hrs to 8mins\n✓ Implemented OAuth2 / JWT authentication service with RBAC permissions',
    technologies: 'React, Node.js, Express, MongoDB, AWS Lambda, Docker, Jest',
  },
  {
    id: 4,
    role: 'UI/UX & Frontend Developer',
    company: 'Vanguard Digital Agency',
    location: 'Austin, TX',
    start_date: 'Aug 2018',
    end_date: 'May 2020',
    employment_type: 'Contract',
    description: '✓ Crafted responsive web apps and interactive motion graphics for Fortune 500 clients\n✓ Optimized asset loading pipelines reducing first contentful paint by 1.4s\n✓ Collaborated directly with product designers to establish accessible UI patterns',
    technologies: 'JavaScript ES6+, HTML5, CSS3, Vue.js, Sass, Figma, Webpack',
  },
];

// Single ForwardRef Book Page Component for react-pageflip
const BookPage = React.forwardRef(({ entry, index, total }, ref) => {
  if (!entry) return null;

  const bullets = (entry.description || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const techs = (entry.technologies || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div
      ref={ref}
      className="page w-full h-full bg-[#0d131f] border border-primary/40 border-l-4 border-l-primary/70 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden relative select-none"
      style={{ backgroundColor: '#0d131f' }}
    >
      {/* Book Spine Seam Indicator */}
      <div className="absolute top-0 left-1 bottom-0 w-1 flex flex-col justify-around items-center opacity-40 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between gap-4 border-b border-border/60 pb-3 pl-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1.5">
            <BookOpen size={13} />
            Page {index + 1} of {total}
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {entry.employment_type}
          </span>
        </div>

        <span className="text-xs font-semibold text-muted-foreground font-mono-code bg-muted/80 px-3 py-1 rounded-full border border-border">
          {entry.start_date} – {entry.end_date}
        </span>
      </div>

      {/* Card Main Body */}
      <div className="relative z-10 flex-1 my-4 space-y-4 pl-3 flex flex-col justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mb-1 leading-tight">
            {entry.role}
          </h3>
          <p className="text-primary font-bold text-sm flex items-center gap-1.5 mb-2">
            <Briefcase size={16} />
            {entry.company} • <span className="text-xs font-normal text-muted-foreground">{entry.location}</span>
          </p>
        </div>

        {/* Deliverables Bullet List */}
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1">
            <Award size={13} className="text-primary" /> Impact Deliverables
          </p>
          <ul className="space-y-1.5">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                <span className="line-clamp-2">{b.replace(/^[✓•-]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Pills */}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
            {techs.map((t) => (
              <span key={t} className="px-2.5 py-0.5 bg-muted/80 text-foreground text-[11px] font-semibold rounded-md border border-border/80">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Prompt */}
      <div className="relative z-10 pt-2 border-t border-border/60 flex items-center justify-between pl-3">
        <span className="text-[11px] font-medium text-muted-foreground">Click or Drag Corner to Turn</span>
        <div className="flex items-center gap-1.5 text-primary text-xs font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
          <span>Turn Page</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </div>
  );
});
BookPage.displayName = 'BookPage';

// ---------------------------------------------------------------------------
// PAGE TURN ISOLATED TEST SANDBOX COMPONENT
// ---------------------------------------------------------------------------
export default function PageTurnSandbox() {
  const [isMounted, setIsMounted] = useState(false);
  const bookRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full py-16 px-4 bg-muted/20 border border-border/60 rounded-3xl my-8">
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <span className="px-3.5 py-1.5 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30 inline-flex items-center gap-1.5 mb-3">
          <Sparkles size={14} className="animate-spin" /> Isolated React-PageFlip Test Sandbox
        </span>
        <h3 className="text-2xl font-extrabold text-foreground">
          Native Paper-Bending <span className="gradient-text">Book Flip Engine</span>
        </h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-2">
          Testing native <code>react-pageflip</code> physical paper bending physics with hardcoded dummy cards without touching <code>Experience.js</code>.
        </p>
      </div>

      {/* REACT-PAGEFLIP CONTAINER */}
      <div className="flex justify-center items-center overflow-visible">
        {/* @ts-ignore */}
        <HTMLFlipBook
          ref={bookRef}
          width={540}
          height={480}
          size="fixed"
          minWidth={320}
          maxWidth={600}
          minHeight={400}
          maxHeight={550}
          maxShadowOpacity={0.6}
          showCover={false}
          mobileScrollSupport={true}
          useMouseEvents={true}
          swipeDistance={30}
          clickEventForward={true}
          usePortrait={false}
          className="shadow-2xl rounded-2xl overflow-visible"
        >
          {DUMMY_EXPERIENCES.map((entry, idx) => (
            <BookPage
              key={entry.id}
              entry={entry}
              index={idx}
              total={DUMMY_EXPERIENCES.length}
            />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}
