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
      className="page w-[560px] h-[540px] bg-[#0A0E17] border border-white/10 border-r-0 border-l-[6px] border-l-primary rounded-l-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden relative select-none"
      style={{
        backgroundColor: '#0A0E17',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        boxShadow: '-4px 0 0 -1px #070A10, -8px 0 0 -2px #05070B, -14px 0 24px -4px rgba(0,0,0,0.9)',
      }}
    >
      {/* Deep Inner Spine Seam Shadow */}
      <div
        className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        }}
      />

      {/* Book Spine Stitching Thread Dots */}
      <div className="absolute top-4 right-1.5 bottom-4 w-1 flex flex-col justify-around items-center opacity-50 pointer-events-none z-20">
        {[...Array(11)].map((_, i) => (
          <span key={i} className="w-1 h-2 rounded-full bg-amber-400/80 shadow-[0_0_4px_rgba(251,191,36,0.5)]" />
        ))}
      </div>

      {/* Background Ambient Sheen */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-primary/15 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP METADATA BAR */}
      <div className="relative z-10 flex items-center justify-between gap-4 shrink-0 border-b border-white/10 pb-3 pr-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white/[0.04] text-white text-xs font-bold rounded-full border border-white/15 flex items-center gap-1.5 shadow-sm font-mono-code">
            <BookOpen size={12} className="text-primary animate-pulse" />
            Page {pageNum} of {totalPages}
          </span>
          {entry.employment_type && (
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              TYPE_COLORS[entry.employment_type] || 'bg-white/5 text-gray-300'
            }`}>
              {entry.employment_type}
            </span>
          )}
        </div>

        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-white/[0.03] px-3 py-1 rounded-full font-mono-code border border-white/10 shadow-sm">
          <Calendar size={12} className="text-primary" />
          {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
        </span>
      </div>

      {/* BODY: ROLE BRANDING & BREATHABLE MISSION BLOCKQUOTE */}
      <div className="relative z-10 flex-1 my-4 pr-4 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider font-bold text-primary mb-1 font-mono-code flex items-center gap-1.5">
            <Briefcase size={12} /> Architectural Scope & Context
          </p>
          <h3 className="font-display text-2xl font-bold text-white mb-1.5 leading-snug tracking-tight">
            {entry.role}
          </h3>
          <div className="flex items-center gap-2.5">
            <p className="text-primary font-bold text-base">
              {entry.company}
            </p>
            {entry.location && (
              <span className="flex items-center gap-1 text-xs text-gray-400 font-medium bg-white/[0.03] px-2.5 py-0.5 rounded-full border border-white/5 font-mono-code">
                <MapPin size={11} className="text-primary" />
                {entry.location}
              </span>
            )}
          </div>
        </div>

        <div className="border-l-2 border-primary/60 pl-4 py-1.5 my-1 bg-white/[0.01] rounded-r-xl">
          <p className="italic text-gray-300 text-sm leading-relaxed">
            Spearheaded technical systems and software architecture at {entry.company}, driving scalable frontend engineering, robust API services, and high-reliability cloud deployments.
          </p>
        </div>

        {/* PRIMARY APPLICATION TECH STACK */}
        {techs.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1.5 font-mono-code">
              <Server size={11} className="text-primary" /> Core Technology Stack
            </p>
            <div className="flex flex-wrap gap-1.5">
              {techs.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-white/[0.03] text-gray-200 text-xs font-mono-code font-semibold rounded-lg border border-white/10 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="relative z-10 pt-3 border-t border-white/10 shrink-0 flex items-center justify-between pr-4">
        <span className="text-[11px] text-gray-400 font-mono-code">LEDGER // SPREAD {spreadIndex + 1}</span>
        <div className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
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
      className="page group w-[560px] h-[540px] bg-[#0A0E17] border border-white/10 border-l-0 border-r-[6px] border-r-primary rounded-r-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden relative select-none"
      style={{
        backgroundColor: '#0A0E17',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        boxShadow: '4px 0 0 -1px #070A10, 8px 0 0 -2px #05070B, 14px 0 24px -4px rgba(0,0,0,0.9)',
      }}
    >
      {/* Deep Inner Spine Seam Shadow */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        }}
      />

      {/* Background Accent Sheen */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-accent/15 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Tactile Dog-Eared Paper Corner Fold */}
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-amber-400/30 via-primary/20 to-transparent rounded-tl-xl border-t border-l border-amber-400/40 pointer-events-none z-20 group-hover:w-10 group-hover:h-10 transition-all duration-300" />

      {/* TOP METADATA BAR */}
      <div className="relative z-10 flex items-center justify-between gap-4 shrink-0 border-b border-white/10 pb-3 pl-4">
        <span className="px-3 py-1 bg-white/[0.04] text-white text-xs font-bold rounded-full border border-white/15 flex items-center gap-1.5 shadow-sm font-mono-code">
          <BookOpen size={12} className="text-primary animate-pulse" />
          Page {pageNum} of {totalPages}
        </span>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 flex items-center gap-1.5 font-mono-code shadow-[inset_0_1px_1px_rgba(52,211,153,0.3)]">
          <Zap size={12} /> Verified Technical Impact
        </span>
      </div>

      {/* BODY: ENGINEERING ACHIEVEMENTS & METHODOLOGIES */}
      <div className="relative z-10 flex-1 my-4 pl-4 flex flex-col justify-between space-y-4">
        {topMetric && (
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-primary/10 to-transparent border border-amber-500/30 rounded-2xl flex items-start gap-3 shadow-[inset_0_1px_1px_rgba(251,191,36,0.25)]">
            <Zap size={18} className="text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-amber-300 mb-0.5 font-mono-code">
                Key Engineering Deliverable
              </p>
              <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
                {topMetric}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1.5 font-mono-code">
            <Award size={12} className="text-primary" /> Proven Production Metrics
          </p>
          <ul className="space-y-2.5">
            {bullets.slice(0, 3).map((bullet, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200 leading-relaxed">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{bullet.replace(/^[✓•-]\s*/, '')}</span>
              </li>
            ))}
            <li className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed font-mono-code bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
              <TestTube2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>Rigorous E2E &amp; Unit Coverage (Jest / Cypress).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 pt-3 border-t border-white/10 shrink-0 flex items-center justify-between pl-4">
        <span className="text-[11px] text-gray-400 font-mono-code">EXECUTIVE JOURNAL</span>
        <div className="flex items-center gap-1.5 text-xs text-primary font-bold bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
          <span>Turn Spread</span>
          <ArrowRight size={12} />
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
    <div
      className="w-full bg-[#0A0E17] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* Background Sheen */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/15 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Segmented Tab Switcher */}
      <div className="flex items-center p-1 bg-white/[0.04] rounded-2xl border border-white/10 mb-5 relative z-10">
        <button
          onClick={() => onTabChange('context')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold font-mono-code transition-all ${
            activeTab === 'context'
              ? 'bg-primary text-white shadow-md shadow-primary/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Context &amp; Stack
        </button>
        <button
          onClick={() => onTabChange('impact')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold font-mono-code transition-all ${
            activeTab === 'impact'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Technical Impact
        </button>
      </div>

      {activeTab === 'context' ? (
        <div className="space-y-4 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <span className="px-3 py-1 bg-white/[0.04] text-white text-xs font-bold rounded-full border border-white/15 flex items-center gap-1.5 font-mono-code">
              Role {index + 1} of {totalSpreads}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-white/[0.03] px-3 py-1 rounded-full font-mono-code border border-white/10">
              <Calendar size={12} className="text-primary" />
              {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {entry.employment_type && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  TYPE_COLORS[entry.employment_type] || 'bg-white/5 text-gray-300'
                }`}>
                  {entry.employment_type}
                </span>
              )}
              {entry.location && (
                <span className="text-xs text-gray-400 flex items-center gap-1 font-mono-code">
                  <MapPin size={11} className="text-primary" /> {entry.location}
                </span>
              )}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">{entry.role}</h3>
            <p className="text-primary font-bold text-base mt-0.5">{entry.company}</p>
          </div>

          <div className="border-l-2 border-primary/60 pl-3.5 py-1 bg-white/[0.01] rounded-r-lg">
            <p className="italic text-gray-300 text-xs sm:text-sm leading-relaxed">
              Spearheaded engineering architecture at {entry.company}, driving scalable frontend systems, performant APIs, and cloud infrastructure.
            </p>
          </div>

          {techs.length > 0 && (
            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-2 font-mono-code flex items-center gap-1.5">
                <Server size={11} className="text-primary" /> Core Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {techs.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-white/[0.03] text-gray-200 text-xs font-mono-code font-semibold rounded-lg border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-mono-code">
              <Zap size={12} /> Key Deliverables
            </span>
            <span className="text-xs text-gray-400 font-mono-code">
              VERIFIED IMPACT
            </span>
          </div>

          {topMetric && (
            <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-primary/10 to-transparent border border-amber-500/30 rounded-2xl flex items-start gap-2.5 shadow-[inset_0_1px_1px_rgba(251,191,36,0.25)]">
              <Zap size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-amber-300 font-mono-code">Key Metric</p>
                <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">
                  {topMetric}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {bullets.slice(0, 3).map((bullet, i) => (
              <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-200 leading-relaxed">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{bullet.replace(/^[✓•-]\s*/, '')}</span>
              </div>
            ))}
            <div className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed font-mono-code bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
              <TestTube2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>Rigorous E2E &amp; Unit Coverage (Cypress / Jest).</span>
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
    <section id="experience" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#05070B] overflow-hidden">
      
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/[0.03] rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section Header */}
        <div
          ref={section.ref}
          className="mb-14 text-center max-w-3xl mx-auto"
          style={fadeUp(section.visible || !isMounted)}
        >
          <p className="text-xs font-mono-code font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            // 03. EXECUTIVE EXPERIENCE JOURNAL
          </p>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em] leading-tight mb-4">
            Engineering &amp; <span className="text-primary inline-block">Technical Leadership</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Physical dual-page ledger documenting system architecture context alongside verified technical impact metrics.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading || !isMounted ? (
          <div className="h-[460px] w-full bg-[#0A0E17] border border-white/10 rounded-3xl animate-pulse flex items-center justify-center">
            <span className="text-gray-400 text-sm flex items-center gap-2 font-mono-code">
              <Sparkles size={16} className="animate-spin text-primary" /> Loading Executive Experience Journal...
            </span>
          </div>
        ) : entries.length > 0 ? (
          <>
            {/* DESKTOP VIEW (>= 1024px): 3D PHYSICAL BOOK SPREAD */}
            {isDesktop ? (
              <div className="flex justify-center items-center overflow-visible my-6">
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mt-8 px-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={isFirstPage}
                  aria-label="Previous Career Spread"
                  className="p-2.5 rounded-full bg-[#0A0E17] border border-white/10 text-white hover:bg-white/10 hover:border-white/30 disabled:opacity-30 disabled:hover:bg-[#0A0E17] transition-all active:scale-95"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="text-xs sm:text-sm text-gray-300 flex items-center gap-2 bg-[#0A0E17] border border-white/10 px-4 py-2 rounded-full shadow-sm font-medium font-mono-code">
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
                  className="p-2.5 rounded-full bg-[#0A0E17] border border-white/10 text-white hover:bg-white/10 hover:border-white/30 disabled:opacity-30 disabled:hover:bg-[#0A0E17] transition-all active:scale-95"
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
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-8 bg-primary ring-2 ring-primary/30 shadow-sm'
                          : 'w-2 bg-white/20 hover:bg-white/40'
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
