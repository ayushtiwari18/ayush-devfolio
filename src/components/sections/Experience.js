'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Briefcase, MapPin, Calendar, Sparkles, CheckCircle2, Award, Zap, ArrowRight, BookOpen, ChevronLeft, ChevronRight, TestTube2, Server } from 'lucide-react';
import { useReveal, fadeUp } from '@/components/animations/useReveal';

// Dynamic import with SSR disabled to prevent hydration discrepancies with WebGL/DOM canvas
const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });

const TYPE_COLORS = {
  'Full-time':   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Part-time':   'bg-blue-500/10    text-blue-400    border border-blue-500/20',
  'Internship':  'bg-amber-500/10   text-amber-400   border border-amber-500/20',
  'Contract':    'bg-purple-500/10  text-purple-400  border border-purple-500/20',
  'Freelance':   'bg-pink-500/10    text-pink-400    border border-pink-500/20',
  'Open Source': 'bg-cyan-500/10    text-cyan-400    border border-cyan-500/20',
};

// ---------------------------------------------------------------------------
// DESKTOP PAGE 1 (LEFT SIDE): THE CONTEXT PAGE (560px x 540px)
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
      className="page w-[560px] h-[540px] bg-[#0c1017] border border-amber-500/25 border-r-0 border-l-4 border-l-primary/70 rounded-l-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden relative select-none"
      style={{ backgroundColor: '#0c1017' }}
    >
      {/* Inner Spine Seam Shadow */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/60 via-black/20 to-transparent pointer-events-none z-20" />

      {/* Book Spine Stitching Dots */}
      <div className="absolute top-0 right-1 bottom-0 w-1 flex flex-col justify-around items-center opacity-40 pointer-events-none z-20">
        {[...Array(9)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
        ))}
      </div>

      {/* Background Accent Sheen */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-primary/15 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP METADATA BAR */}
      <div className="relative z-10 flex items-center justify-between gap-4 shrink-0 border-b border-border/60 pb-3 pr-3">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1.5 shadow-sm">
            <BookOpen size={13} className="animate-pulse" />
            Page {pageNum} of {totalPages}
          </span>
          {entry.employment_type && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              TYPE_COLORS[entry.employment_type] || 'bg-muted text-muted-foreground'
            }`}>
              {entry.employment_type}
            </span>
          )}
        </div>

        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground bg-muted/80 px-3.5 py-1 rounded-full font-mono-code border border-border shadow-sm">
          <Calendar size={13} className="text-primary" />
          {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
        </span>
      </div>

      {/* BODY: ROLE BRANDING & BREATHABLE MISSION BLOCKQUOTE */}
      <div className="relative z-10 flex-1 my-4 pr-3 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-primary mb-1 font-mono-code flex items-center gap-1.5">
            <Briefcase size={13} /> Context & Architecture Scope
          </p>
          <h3 className="text-2xl sm:text-[26px] font-extrabold text-foreground mb-1.5 leading-snug tracking-tight text-pretty">
            {entry.role}
          </h3>
          <div className="flex items-center gap-2.5">
            <p className="text-primary font-bold text-base sm:text-lg">
              {entry.company}
            </p>
            {entry.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium bg-muted/50 px-2.5 py-0.5 rounded-full border border-border/60">
                <MapPin size={12} />
                {entry.location}
              </span>
            )}
          </div>
        </div>

        <div className="border-l-2 border-primary/60 pl-4 py-1.5 my-1">
          <p className="italic text-muted-foreground text-[14px] sm:text-[15px] leading-relaxed">
            Spearheaded technical development and software architecture at {entry.company}, driving scalable frontend engineering, robust API services, and high-quality cloud infrastructure.
          </p>
        </div>

        {/* PRIMARY APPLICATION TECH STACK */}
        {techs.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5 font-mono-code">
              <Server size={12} className="text-primary" /> Core Application Stack
            </p>
            <div className="flex flex-wrap gap-1.5">
              {techs.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-muted/80 text-foreground text-xs font-semibold rounded-lg border border-border/80 shadow-sm"
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
// DESKTOP PAGE 2 (RIGHT SIDE): THE IMPACT PAGE (560px x 540px)
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
      className="page w-[560px] h-[540px] bg-[#0c1017] border border-amber-500/25 border-l-0 rounded-r-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden relative select-none"
      style={{ backgroundColor: '#0c1017' }}
    >
      {/* Inner Spine Seam Shadow */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none z-20" />

      {/* Background Accent Sheen */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-accent/15 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Dog-Eared Paper Corner Fold */}
      <div className="absolute bottom-0 right-0 w-7 h-7 bg-gradient-to-tl from-primary/30 via-primary/10 to-transparent rounded-tl-lg border-t border-l border-primary/40 pointer-events-none z-20" />

      {/* TOP METADATA BAR */}
      <div className="relative z-10 flex items-center justify-between gap-4 shrink-0 border-b border-border/60 pb-3 pl-3">
        <span className="px-3 py-1 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1.5 shadow-sm">
          <BookOpen size={13} className="animate-pulse" />
          Page {pageNum} of {totalPages}
        </span>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-mono-code">
          <Zap size={12} /> Technical Impact
        </span>
      </div>

      {/* BODY: ENGINEERING ACHIEVEMENTS & METHODOLOGIES */}
      <div className="relative z-10 flex-1 my-4 pl-3 flex flex-col justify-between space-y-4">
        {topMetric && (
          <div className="p-3.5 bg-gradient-to-r from-primary/15 via-accent/10 to-transparent border border-primary/30 rounded-2xl flex items-start gap-3 shadow-md">
            <Zap size={17} className="text-primary shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-primary mb-0.5 font-mono-code">Core Engineering Highlight</p>
              <p className="text-xs sm:text-[14px] text-foreground/90 font-medium leading-relaxed line-clamp-2">
                {topMetric}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5 font-mono-code">
            <Award size={13} className="text-primary" /> Achievements & Testing Methodologies
          </p>
          <ul className="space-y-3">
            {bullets.slice(0, 3).map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[14px] text-foreground/90 leading-relaxed">
                <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                <span className="line-clamp-2">{bullet.replace(/^[✓•-]\s*/, '')}</span>
              </li>
            ))}
            <li className="flex items-start gap-2.5 text-xs sm:text-[14px] text-foreground/90 leading-relaxed font-mono-code bg-muted/30 p-2.5 rounded-xl border border-border/50">
              <TestTube2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>Rigorous E2E & Unit Testing with Cypress & Jest (95%+ code coverage).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 pt-3 border-t border-border/60 shrink-0 flex items-center justify-between pl-3">
        <span className="text-xs text-muted-foreground font-mono-code">Impact • Right Page</span>
        <div className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/10 px-3.5 py-1 rounded-full border border-primary/30 cursor-pointer">
          <span>Turn Page</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </div>
  );
});
ImpactPage.displayName = 'ImpactPage';

// ---------------------------------------------------------------------------
// ADAPTIVE MOBILE/TABLET CARD DECK (ZERO-OVERFLOW GUARANTEE FOR < 1024px)
// ---------------------------------------------------------------------------
function MobileJournalCard({ entry, index, totalSpreads, activeTab, onTabChange }) {
  if (!entry) return null;

  const techs = (entry.technologies || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const bullets = (entry.description || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const topMetric = bullets[0] ? bullets[0].replace(/^[✓•-]\s*/, '') : null;

  return (
    <div className="w-full bg-[#0c1017] border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background Sheen */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/15 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Segmented Tab Switcher */}
      <div className="flex items-center p-1 bg-white/[0.04] rounded-2xl border border-white/10 mb-5 relative z-10">
        <button
          onClick={() => onTabChange('context')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold font-mono-code transition-all ${
            activeTab === 'context'
              ? 'bg-primary text-white shadow-md shadow-primary/30'
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          Context & Stack
        </button>
        <button
          onClick={() => onTabChange('impact')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold font-mono-code transition-all ${
            activeTab === 'impact'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          Technical Impact
        </button>
      </div>

      {activeTab === 'context' ? (
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
            <span className="px-3 py-1 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1.5 font-mono-code">
              Spread {index + 1} of {totalSpreads}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/80 px-3 py-1 rounded-full font-mono-code border border-border">
              <Calendar size={12} className="text-primary" />
              {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              {entry.employment_type && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  TYPE_COLORS[entry.employment_type] || 'bg-muted text-muted-foreground'
                }`}>
                  {entry.employment_type}
                </span>
              )}
              {entry.location && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin size={11} /> {entry.location}
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">{entry.role}</h3>
            <p className="text-primary font-bold text-base mt-0.5">{entry.company}</p>
          </div>

          <div className="border-l-2 border-primary/60 pl-3.5 py-1">
            <p className="italic text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Spearheaded engineering architecture at {entry.company}, driving scalable frontend systems, performant APIs, and cloud infrastructure.
            </p>
          </div>

          {techs.length > 0 && (
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2 font-mono-code flex items-center gap-1.5">
                <Server size={12} className="text-primary" /> Core Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {techs.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-muted/80 text-foreground text-xs font-semibold rounded-lg border border-border">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-mono-code">
              <Zap size={12} /> Key Deliverables
            </span>
            <span className="text-xs text-muted-foreground font-mono-code">
              Impact Profile
            </span>
          </div>

          {topMetric && (
            <div className="p-3 bg-gradient-to-r from-primary/15 via-accent/10 to-transparent border border-primary/30 rounded-2xl flex items-start gap-2.5">
              <Zap size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-primary font-mono-code">Key Metric</p>
                <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
                  {topMetric}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {bullets.slice(0, 3).map((bullet, i) => (
              <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                <span>{bullet.replace(/^[✓•-]\s*/, '')}</span>
              </div>
            ))}
            <div className="flex items-start gap-2 text-xs text-foreground/90 leading-relaxed font-mono-code bg-muted/30 p-2.5 rounded-xl border border-border/50">
              <TestTube2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>Rigorous E2E & Unit Testing (Cypress / Jest).</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN WORK EXPERIENCE SECTION
// ---------------------------------------------------------------------------
export default function Experience() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState('context');

  const bookRef = useRef(null);
  const section = useReveal({ threshold: 0.1 });

  useEffect(() => {
    setIsMounted(true);

    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);

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

    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const handleFlip = (e) => {
    if (e && typeof e.data === 'number') {
      setActivePage(e.data);
    }
  };

  const handleNext = () => {
    if (isDesktop) {
      if (bookRef.current?.pageFlip()) {
        bookRef.current.pageFlip().flipNext();
      }
    } else {
      setMobileIndex((prev) => Math.min(entries.length - 1, prev + 1));
      setMobileTab('context');
    }
  };

  const handlePrev = () => {
    if (isDesktop) {
      if (bookRef.current?.pageFlip()) {
        bookRef.current.pageFlip().flipPrev();
      }
    } else {
      setMobileIndex((prev) => Math.max(0, prev - 1));
      setMobileTab('context');
    }
  };

  const totalPages = entries.length * 2;
  const isFinalPage = isDesktop
    ? totalPages > 0 && activePage >= totalPages - 2
    : mobileIndex >= entries.length - 1;

  const isFirstPage = isDesktop
    ? activePage === 0
    : mobileIndex === 0;

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/10 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div
          ref={section.ref}
          className="mb-14"
          style={fadeUp(section.visible || !isMounted)}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase font-mono-code">
              Career Track Record
            </span>
          </div>

          <p className="section-label mb-3">Career History</p>
          <h2 className="section-heading mb-4">
            Engineering & <span className="gradient-text">Leadership Roles</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Executive journal spread — view project architecture and context alongside verified technical impact metrics.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading || !isMounted ? (
          <div className="h-[460px] w-full bg-card/50 border border-border rounded-3xl animate-pulse flex items-center justify-center">
            <span className="text-muted-foreground text-sm flex items-center gap-2 font-mono-code">
              <Sparkles size={16} className="animate-spin text-primary" /> Loading Executive Experience Journal...
            </span>
          </div>
        ) : entries.length > 0 ? (
          <>
            {/* DESKTOP VIEW (>= 1024px): 3D PHYSICAL BOOK SPREAD */}
            {isDesktop ? (
              <div className="flex justify-center items-center overflow-visible my-4">
                {/* @ts-ignore */}
                <HTMLFlipBook
                  ref={bookRef}
                  width={560}
                  height={540}
                  size="fixed"
                  minWidth={320}
                  maxWidth={600}
                  minHeight={450}
                  maxHeight={600}
                  maxShadowOpacity={0.25}
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
            ) : (
              /* MOBILE & TABLET VIEW (< 1024px): FLUID ZERO-OVERFLOW FIELD NOTES LEDGER */
              <div className="my-4 max-w-xl mx-auto">
                <MobileJournalCard
                  entry={entries[mobileIndex]}
                  index={mobileIndex}
                  totalSpreads={entries.length}
                  activeTab={mobileTab}
                  onTabChange={setMobileTab}
                />
              </div>
            )}

            {/* NAVIGATION CONTROLS & PAGINATION DOTS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto mt-8 px-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={isFirstPage}
                  aria-label="Previous Career Spread"
                  className="p-2.5 rounded-full bg-card border border-border text-foreground hover:bg-primary/10 hover:border-primary/40 disabled:opacity-30 disabled:hover:bg-card transition-all active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full shadow-sm font-medium font-mono-code">
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  {isDesktop ? (
                    isFinalPage
                      ? 'Final Spread Reached'
                      : 'Click page or drag corner to turn'
                  ) : (
                    `Role ${mobileIndex + 1} of ${entries.length}`
                  )}
                </span>

                <button
                  onClick={handleNext}
                  disabled={isFinalPage}
                  aria-label="Next Career Spread"
                  className="p-2.5 rounded-full bg-card border border-border text-foreground hover:bg-primary/10 hover:border-primary/40 disabled:opacity-30 disabled:hover:bg-card transition-all active:scale-95"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Indicator Dots */}
              <div className="flex items-center gap-2.5">
                {entries.map((_, i) => {
                  const isActive = isDesktop
                    ? Math.floor(activePage / 2) === i
                    : mobileIndex === i;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (isDesktop) {
                          if (bookRef.current?.pageFlip()) {
                            bookRef.current.pageFlip().flip(i * 2);
                          }
                        } else {
                          setMobileIndex(i);
                          setMobileTab('context');
                        }
                      }}
                      aria-label={`Go to career record ${i + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-8 bg-primary ring-2 ring-primary/30 shadow-sm'
                          : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
