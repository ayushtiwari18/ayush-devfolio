'use client';

import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Calendar, Sparkles, Layers, CheckCircle2, Award, Zap, ArrowRight } from 'lucide-react';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import Peel from '@/components/ui/Peel';

const TYPE_COLORS = {
  'Full-time':   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  'Part-time':   'bg-blue-500/10    text-blue-400    border border-blue-500/20',
  'Internship':  'bg-amber-500/10   text-amber-400   border border-amber-500/20',
  'Contract':    'bg-purple-500/10  text-purple-400  border border-purple-500/20',
  'Freelance':   'bg-pink-500/10    text-pink-400    border border-pink-500/20',
  'Open Source': 'bg-cyan-500/10    text-cyan-400    border border-cyan-500/20',
};

// ---------------------------------------------------------------------------
// EXPANSIVE 85% SECTION COVERAGE LANDSCAPE BOOK PAGE SPREAD (ZERO SCROLLBARS)
// ---------------------------------------------------------------------------
function LandscapeBookPage({ entry, index, total }) {
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
    <div className="w-full h-[520px] sm:h-[480px] bg-gradient-to-br from-card via-card/95 to-muted/40 border border-primary/30 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl overflow-hidden relative backdrop-blur-md">
      {/* Background Accent Sheen & Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/15 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP METADATA BAR */}
      <div className="relative z-10 flex items-center justify-between gap-4 shrink-0 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1.5 shadow-sm">
            <Layers size={14} className="animate-pulse" />
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
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 my-5 items-center">
        {/* LEFT COLUMN: ROLE TITLE, COMPANY & IMPACT HIGHLIGHT BOX */}
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

          {/* KEY IMPACT HIGHLIGHT BOX */}
          {topMetric && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-start gap-3 shadow-sm">
              <Zap size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-primary mb-1">Core Impact Highlight</p>
                <p className="text-xs sm:text-sm text-foreground/90 font-medium line-clamp-2 leading-relaxed">
                  {topMetric}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: KEY DELIVERABLES BULLETS */}
        <div className="md:col-span-7 flex flex-col justify-center h-full border-t md:border-t-0 md:border-l border-border/60 pt-4 md:pt-0 md:pl-8 space-y-3">
          <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
            <Award size={14} className="text-primary" /> Key Architecture Deliverables
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
      <div className="relative z-10 pt-3 border-t border-border/60 shrink-0 flex items-center justify-between gap-4">
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
}

// ---------------------------------------------------------------------------
// PURE DB-DRIVEN WORK EXPERIENCE SECTION WITH ZERO-FLICKER CLICK DECK
// ---------------------------------------------------------------------------
export default function Experience() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isBookClosing, setIsBookClosing] = useState(false);
  const section = useReveal({ threshold: 0.1 });

  useEffect(() => {
    fetch('/api/public/experience')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Sort reverse chronological by date (newest role first)
          const sorted = [...data].sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
          console.log('[Experience:Init] Loaded DB experience entries.', {
            count: sorted.length,
            roles: sorted.map((s, idx) => `Page ${idx + 1}: ${s.role} at ${s.company}`),
          });
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

  const handlePageTurn = () => {
    if (isBookClosing) return;

    if (activeIdx < entries.length - 1) {
      console.log(`[Experience:PageTurn] Advancing from Page ${activeIdx + 1} to Page ${activeIdx + 2}`);
      setActiveIdx((prev) => prev + 1);
    } else {
      console.log(`[Experience:BookCloseTrigger] Final Page ${activeIdx + 1} turned! Executing book-close reset.`);
      setIsBookClosing(true);
    }
  };

  const handleBookCloseComplete = () => {
    console.log('[Experience:BookCloseComplete] Book close reset finished. Resetting to Page 1.');
    setActiveIdx(0);
    setIsBookClosing(false);
  };

  if (loading) {
    return (
      <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="h-[520px] w-full bg-card/50 border border-border rounded-3xl animate-pulse flex items-center justify-center">
            <span className="text-muted-foreground text-sm flex items-center gap-2">
              <Sparkles size={16} className="animate-spin text-primary" /> Loading Career Experience Book...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (!entries || entries.length === 0) return null;

  const isFinalCard = entries.length > 1 && activeIdx === entries.length - 1;
  const currentEntry = entries[activeIdx] || entries[0];
  const nextIdx = (activeIdx + 1) % entries.length;
  const nextEntry = entries[nextIdx];

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="max-w-6xl mx-auto">
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
            Roles in reverse chronological order — click card to turn the page
          </p>
        </div>

        {/* EXPANSIVE LANDSCAPE BOOK CONTAINER (85% SECTION COVERAGE) */}
        <div className="relative max-w-6xl mx-auto h-[520px] sm:h-[480px] w-full">
          {entries.length > 1 ? (
            <Peel
              side="left"
              mode="click"
              reveal={1400}
              zone={300}
              curl={320}
              bow={85}
              shade={0.35}
              shine={1}
              isBookClosing={isBookClosing}
              onBookCloseComplete={handleBookCloseComplete}
              under={
                <LandscapeBookPage
                  entry={nextEntry}
                  index={nextIdx}
                  total={entries.length}
                />
              }
              onPeelComplete={handlePageTurn}
              className="w-full h-full rounded-3xl"
            >
              <LandscapeBookPage
                entry={currentEntry}
                index={activeIdx}
                total={entries.length}
              />
            </Peel>
          ) : (
            <LandscapeBookPage
              entry={currentEntry}
              index={0}
              total={1}
            />
          )}
        </div>

        {/* DECK HINT BADGE & ROLE PROGRESS INDICATOR */}
        {entries.length > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto mt-8 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full shadow-sm font-medium">
                <Sparkles size={15} className="text-primary animate-pulse" />
                {isBookClosing
                  ? 'Closing Book & Resetting to Page 1...'
                  : isFinalCard
                  ? 'Final Page Reached — Click card to fold book back to Page 1'
                  : 'Click anywhere on the card to turn the page'}
              </span>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2.5">
              {entries.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Go to experience page ${i + 1}`}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    i === activeIdx ? 'w-9 bg-primary' : 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
