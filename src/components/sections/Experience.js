'use client';

import React, { useEffect, useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Briefcase, MapPin, Calendar, Sparkles, Layers, CheckCircle2, Award, Zap, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
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
// EXECUTIVE STUDIO LANDSCAPE BOOK SPREAD (REACT-PAGEFLIP FORWARDREF PAGE)
// ---------------------------------------------------------------------------
const ExperienceBookPage = React.forwardRef(({ entry, index, total }, ref) => {
  if (!entry) return null;

  const bullets = (entry.description || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 3); // Max 3 high-impact bullets for clean landscape fit

  const techs = (entry.technologies || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const topMetric = bullets[0] ? bullets[0].replace(/^[✓•-]\s*/, '') : null;

  return (
    <div
      ref={ref}
      className="page w-full h-full bg-[#0d131f] border border-primary/40 border-l-4 border-l-primary/70 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl overflow-hidden relative select-none"
      style={{ backgroundColor: '#0d131f' }}
    >
      {/* Book Spine Stitching Dots (Tactile Journal Seam) */}
      <div className="absolute top-0 left-1 bottom-0 w-1 flex flex-col justify-around items-center opacity-40 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
        ))}
      </div>

      {/* Background Accent Sheen & Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/15 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP METADATA BAR WITH STRICT CLAMPED PAGE NUMBER */}
      <div className="relative z-10 flex items-center justify-between gap-4 shrink-0 border-b border-border/60 pb-4 pl-3">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1.5 shadow-sm">
            <BookOpen size={14} className="animate-pulse" />
            Page {index + 1} of {total}
          </span>
          {entry.employment_type && (
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              TYPE_COLORS[entry.employment_type] || 'bg-muted text-muted-foreground'
            }`}>
              {entry.employment_type}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground bg-muted/80 px-4 py-1.5 rounded-full font-mono-code border border-border shadow-sm">
            <Calendar size={14} className="text-primary" />
            {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
          </span>
        </div>
      </div>

      {/* DUAL-COLUMN EXPANSIVE BODY */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 my-5 items-center pl-3">
        {/* LEFT COLUMN: ROLE TITLE, COMPANY & EXECUTIVE HIGHLIGHT */}
        <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2 leading-tight tracking-tight text-pretty">
              {entry.role}
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-primary font-bold text-base sm:text-lg flex items-center gap-2">
                <Briefcase size={18} />
                {entry.company}
              </p>
              {entry.location && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <MapPin size={13} />
                  {entry.location}
                </span>
              )}
            </div>
          </div>

          {/* EXECUTIVE IMPACT HIGHLIGHT BOX WITH FOIL ACCENT */}
          {topMetric && (
            <div className="p-4 bg-gradient-to-r from-primary/15 via-accent/10 to-transparent border border-primary/30 rounded-2xl flex items-start gap-3 shadow-md">
              <Zap size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-primary mb-1">Executive Impact Highlight</p>
                <p className="text-xs sm:text-sm text-foreground/90 font-medium line-clamp-2 leading-relaxed">
                  {topMetric}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: KEY ARCHITECTURE DELIVERABLES */}
        <div className="md:col-span-7 flex flex-col justify-center h-full border-t md:border-t-0 md:border-l border-border/60 pt-4 md:pt-0 md:pl-8 space-y-3">
          <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
            <Award size={14} className="text-primary" /> Core Technical Deliverables
          </p>
          <ul className="space-y-3">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-foreground/90 font-normal leading-relaxed">
                <CheckCircle2 size={17} className="text-primary shrink-0 mt-0.5" />
                <span className="line-clamp-2">{bullet.replace(/^[✓•-]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FOOTER TECH STACK PILLS & CLICK-TURN PROMPT */}
      <div className="relative z-10 pt-3 border-t border-border/60 shrink-0 flex items-center justify-between gap-4 pl-3">
        {techs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 overflow-hidden">
            <span className="text-xs font-bold text-muted-foreground mr-1">Stack:</span>
            {techs.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-muted/80 text-foreground text-xs sm:text-sm font-semibold rounded-lg border border-border/80 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Explicit Click-To-Turn Prompt Button */}
        <div className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer">
          <span>Turn Page</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
});
ExperienceBookPage.displayName = 'ExperienceBookPage';

// ---------------------------------------------------------------------------
// PURE DB-DRIVEN WORK EXPERIENCE SECTION WITH NATIVE REACT-PAGEFLIP ENGINE
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

  const isFinalPage = entries.length > 1 && activePage === entries.length - 1;

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
            Roles in reverse chronological order — click anywhere or drag the card corner to turn the page and explore full technical contributions.
          </p>
        </div>

        {/* LOADING SKELETON STATE */}
        {loading || !isMounted ? (
          <div className="h-[520px] sm:h-[480px] w-full bg-card/50 border border-border rounded-3xl animate-pulse flex items-center justify-center">
            <span className="text-muted-foreground text-sm flex items-center gap-2">
              <Sparkles size={16} className="animate-spin text-primary" /> Loading Career Experience Book...
            </span>
          </div>
        ) : entries.length > 0 ? (
          <>
            {/* REACT-PAGEFLIP NATIVE PHYSICAL PAPER-BENDING DECK */}
            <div className="flex justify-center items-center overflow-visible my-4">
              {/* @ts-ignore */}
              <HTMLFlipBook
                ref={bookRef}
                width={560}
                height={480}
                size="fixed"
                minWidth={320}
                maxWidth={620}
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
                {entries.map((entry, idx) => (
                  <ExperienceBookPage
                    key={entry.id || idx}
                    entry={entry}
                    index={idx}
                    total={entries.length}
                  />
                ))}
              </HTMLFlipBook>
            </div>

            {/* DECK HINT BADGE, NAVIGATION BUTTONS & PROGRESS INDICATOR */}
            {entries.length > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto mt-8 px-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevPage}
                    disabled={activePage === 0}
                    aria-label="Previous Page"
                    className="p-2 rounded-full bg-card border border-border text-foreground hover:bg-primary/10 hover:border-primary/40 disabled:opacity-30 disabled:hover:bg-card transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full shadow-sm font-medium">
                    <Sparkles size={15} className="text-primary animate-pulse" />
                    {isFinalPage
                      ? 'Final Page Reached — Click to review career summary'
                      : 'Click card or drag corner to turn the page'}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={isFinalPage}
                    aria-label="Next Page"
                    className="p-2 rounded-full bg-card border border-border text-foreground hover:bg-primary/10 hover:border-primary/40 disabled:opacity-30 disabled:hover:bg-card transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex items-center gap-2.5">
                  {entries.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (bookRef.current?.pageFlip()) {
                          bookRef.current.pageFlip().flip(i);
                        }
                      }}
                      aria-label={`Go to experience page ${i + 1}`}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        i === activePage ? 'w-9 bg-primary' : 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground'
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
