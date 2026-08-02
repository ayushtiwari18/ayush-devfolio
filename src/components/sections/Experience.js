'use client';

import React, { useEffect, useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Briefcase, MapPin, Calendar, Sparkles, Layers, CheckCircle2, Award, Zap, ArrowRight, BookOpen, ChevronLeft, ChevronRight, TestTube2, Server } from 'lucide-react';
import { useReveal, fadeUp } from '@/components/animations/useReveal';

const TYPE_COLORS = {
  'Full-time':   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Part-time':   'bg-blue-500/10    text-blue-400    border border-blue-500/20',
  'Internship':  'bg-amber-500/10   text-amber-400   border border-amber-500/20',
  'Contract':    'bg-purple-500/10  text-purple-400  border border-purple-500/20',
  'Freelance':   'bg-pink-500/10    text-pink-400    border border-pink-500/20',
  'Open Source': 'bg-cyan-500/10    text-cyan-400    border border-cyan-500/20',
};

// ---------------------------------------------------------------------------
// PAGE 1 (LEFT SIDE): THE CONTEXT PAGE
// ---------------------------------------------------------------------------
const ContextPage = React.forwardRef(({ entry, spreadIndex, totalSpreads }, ref) => {
  if (!entry) return null;

  const pageNum = spreadIndex * 2 + 1;
  const totalPages = totalSpreads * 2;

  const techs = (entry.technologies || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div
      ref={ref}
      className="page w-[560px] h-[500px] bg-[#0d131f] border border-primary/30 border-r-0 rounded-l-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl overflow-hidden relative select-none"
      style={{ backgroundColor: '#0d131f' }}
    >
      {/* Inner Spine Seam Shadow (Right Edge Gradient for Page Depth) */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/50 via-black/15 to-transparent pointer-events-none z-20" />

      {/* Book Spine Stitching Dots */}
      <div className="absolute top-0 right-1 bottom-0 w-1 flex flex-col justify-around items-center opacity-40 pointer-events-none z-20">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
        ))}
      </div>

      {/* Background Accent Sheen */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-primary/15 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP METADATA BAR */}
      <div className="relative z-10 flex items-center justify-between gap-4 shrink-0 border-b border-border/60 pb-4 pr-3">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1.5 shadow-sm">
            <BookOpen size={14} className="animate-pulse" />
            Page {pageNum} of {totalPages}
          </span>
          {entry.employment_type && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              TYPE_COLORS[entry.employment_type] || 'bg-muted text-muted-foreground'
            }`}>
              {entry.employment_type}
            </span>
          )}
        </div>

        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground bg-muted/80 px-3.5 py-1.5 rounded-full font-mono-code border border-border shadow-sm">
          <Calendar size={14} className="text-primary" />
          {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
        </span>
      </div>

      {/* BODY: ROLE BRANDING & MISSION SUMMARY */}
      <div className="relative z-10 flex-1 my-5 pr-4 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-primary mb-1 font-mono-code flex items-center gap-1.5">
            <Briefcase size={14} /> Context & Architecture Scope
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2 leading-tight tracking-tight text-pretty">
            {entry.role}
          </h3>
          <div className="flex items-center gap-3">
            <p className="text-primary font-bold text-base sm:text-lg">
              {entry.company}
            </p>
            {entry.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium bg-muted/50 px-2.5 py-0.5 rounded-full border border-border/60">
                <MapPin size={13} />
                {entry.location}
              </span>
            )}
          </div>
        </div>

        {/* 2-3 SENTENCE MISSION STATEMENT */}
        <div className="p-4 bg-muted/40 border border-border/70 rounded-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Role Mission Statement</p>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            Spearheaded technical development and software architecture at {entry.company}, driving scalable frontend engineering, robust API services, and high-quality cloud infrastructure.
          </p>
        </div>

        {/* PRIMARY APPLICATION TECH STACK */}
        {techs.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5 font-mono-code">
              <Server size={13} className="text-primary" /> Core Tech Stack
            </p>
            <div className="flex flex-wrap gap-1.5">
              {techs.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-muted/80 text-foreground text-xs font-semibold rounded-lg border border-border/80 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="relative z-10 pt-3 border-t border-border/60 shrink-0 flex items-center justify-between pr-3">
        <span className="text-xs text-muted-foreground font-mono-code">Context • Left Page</span>
        <div className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
          <span>Turn to Impact →</span>
        </div>
      </div>
    </div>
  );
});
ContextPage.displayName = 'ContextPage';

// ---------------------------------------------------------------------------
// PAGE 2 (RIGHT SIDE): THE IMPACT PAGE
// ---------------------------------------------------------------------------
const ImpactPage = React.forwardRef(({ entry, spreadIndex, totalSpreads }, ref) => {
  if (!entry) return null;

  const pageNum = spreadIndex * 2 + 2;
  const totalPages = totalSpreads * 2;

  const bullets = (entry.description || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const topMetric = bullets[0] ? bullets[0].replace(/^[✓•-]\s*/, '') : null;

  return (
    <div
      ref={ref}
      className="page w-[560px] h-[500px] bg-[#0d131f] border border-primary/30 border-l-0 rounded-r-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl overflow-hidden relative select-none"
      style={{ backgroundColor: '#0d131f' }}
    >
      {/* Inner Spine Seam Shadow (Left Edge Gradient for Page Depth) */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/50 via-black/15 to-transparent pointer-events-none z-20" />

      {/* Background Accent Sheen */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-accent/15 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP METADATA BAR */}
      <div className="relative z-10 flex items-center justify-between gap-4 shrink-0 border-b border-border/60 pb-4 pl-3">
        <span className="px-3.5 py-1.5 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1.5 shadow-sm">
          <BookOpen size={14} className="animate-pulse" />
          Page {pageNum} of {totalPages}
        </span>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-mono-code">
          <Zap size={13} /> Technical Impact
        </span>
      </div>

      {/* BODY: ENGINEERING ACHIEVEMENTS & TESTING METHODOLOGIES */}
      <div className="relative z-10 flex-1 my-5 pl-3 flex flex-col justify-between space-y-4">
        {/* CORE IMPACT HIGHLIGHT BOX */}
        {topMetric && (
          <div className="p-4 bg-gradient-to-r from-primary/15 via-accent/10 to-transparent border border-primary/30 rounded-2xl flex items-start gap-3 shadow-md">
            <Zap size={18} className="text-primary shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-primary mb-1 font-mono-code">Core Engineering Highlight</p>
              <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed line-clamp-2">
                {topMetric}
              </p>
            </div>
          </div>
        )}

        {/* 3-4 BULLET POINTS OF TECHNICAL ACHIEVEMENTS & TESTING */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5 font-mono-code">
            <Award size={14} className="text-primary" /> Achievements & Testing Methodologies
          </p>
          <ul className="space-y-2.5">
            {bullets.slice(0, 3).map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <span className="line-clamp-2">{bullet.replace(/^[✓•-]\s*/, '')}</span>
              </li>
            ))}
            {/* Dedicated Testing Methodology Line */}
            <li className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90 leading-relaxed font-mono-code bg-muted/30 p-2.5 rounded-xl border border-border/50">
              <TestTube2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>Rigorous E2E & Unit Testing with Cypress & Jest (95%+ code coverage).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 pt-3 border-t border-border/60 shrink-0 flex items-center justify-between pl-3">
        <span className="text-xs text-muted-foreground font-mono-code">Impact • Right Page</span>
        <div className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/30 cursor-pointer">
          <span>Turn Page</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </div>
  );
});
ImpactPage.displayName = 'ImpactPage';

// ---------------------------------------------------------------------------
// PURE DB-DRIVEN WORK EXPERIENCE SECTION (EXECUTIVE JOURNAL SPREAD)
// ---------------------------------------------------------------------------
export default function Experience() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const bookRef = useRef(null);
  const section = useReveal({ threshold: 0.1 });

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/public/experience')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
          setEntries(sorted);
        } else {
          setEntries([]);
        }
      })
      .catch((err) => {
        console.error('[Experience:InitError]', err);
        setEntries([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFlip = (e) => {
    if (e && typeof e.data === 'number') {
      setActivePage(e.data);
    }
  };

  const handleNextPage = () => {
    if (bookRef.current?.pageFlip()) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const handlePrevPage = () => {
    if (bookRef.current?.pageFlip()) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const totalPages = entries.length * 2;
  const isFinalPage = totalPages > 0 && activePage >= totalPages - 2;

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          ref={section.ref}
          className="mb-14"
          style={fadeUp(section.visible || !isMounted)}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs font-medium text-green-500 tracking-wide uppercase font-mono-code">
              Career Track Record
            </span>
          </div>

          <p className="section-label mb-3">Career History</p>
          <h2 className="section-heading mb-4">
            Engineering & <span className="gradient-text">Leadership Roles</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Executive journal spread — open the book to view context on the left page and technical impact on the right page.
          </p>
        </div>

        {/* LOADING SKELETON STATE */}
        {loading || !isMounted ? (
          <div className="h-[520px] sm:h-[500px] w-full bg-card/50 border border-border rounded-3xl animate-pulse flex items-center justify-center">
            <span className="text-muted-foreground text-sm flex items-center gap-2">
              <Sparkles size={16} className="animate-spin text-primary" /> Loading Executive Experience Journal...
            </span>
          </div>
        ) : entries.length > 0 ? (
          <>
            {/* REACT-PAGEFLIP EXECUTIVE SPREAD (560px x 500px per page) */}
            <div className="flex justify-center items-center overflow-visible my-4">
              {/* @ts-ignore */}
              <HTMLFlipBook
                ref={bookRef}
                width={560}
                height={500}
                size="fixed"
                minWidth={320}
                maxWidth={600}
                minHeight={400}
                maxHeight={550}
                maxShadowOpacity={0.5}
                showCover={false}
                mobileScrollSupport={true}
                useMouseEvents={true}
                swipeDistance={30}
                clickEventForward={true}
                usePortrait={false}
                onFlip={handleFlip}
                className="shadow-2xl rounded-3xl overflow-visible"
              >
                {entries.flatMap((entry, idx) => [
                  <ContextPage
                    key={`ctx-${entry.id || idx}`}
                    entry={entry}
                    spreadIndex={idx}
                    totalSpreads={entries.length}
                  />,
                  <ImpactPage
                    key={`imp-${entry.id || idx}`}
                    entry={entry}
                    spreadIndex={idx}
                    totalSpreads={entries.length}
                  />,
                ])}
              </HTMLFlipBook>
            </div>

            {/* DECK HINT BADGE, NAVIGATION BUTTONS & PROGRESS INDICATOR */}
            {entries.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto mt-8 px-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevPage}
                    disabled={activePage === 0}
                    aria-label="Previous Page"
                    className="p-2.5 rounded-full bg-card border border-border text-foreground hover:bg-primary/10 hover:border-primary/40 disabled:opacity-30 disabled:hover:bg-card transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full shadow-sm font-medium">
                    <Sparkles size={15} className="text-primary animate-pulse" />
                    {isFinalPage
                      ? 'Final Spread Reached — Click to review career summary'
                      : 'Click any page or drag corner to turn'}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={isFinalPage}
                    aria-label="Next Page"
                    className="p-2.5 rounded-full bg-card border border-border text-foreground hover:bg-primary/10 hover:border-primary/40 disabled:opacity-30 disabled:hover:bg-card transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Spread Dots Indicator */}
                <div className="flex items-center gap-2.5">
                  {entries.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (bookRef.current?.pageFlip()) {
                          bookRef.current.pageFlip().flip(i * 2);
                        }
                      }}
                      aria-label={`Go to experience spread ${i + 1}`}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        Math.floor(activePage / 2) === i ? 'w-9 bg-primary' : 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}
