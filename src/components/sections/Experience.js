'use client';

import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Calendar, Sparkles, Layers, CheckCircle2, Award, Zap } from 'lucide-react';
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
// STUDIO-GRADE LANDSCAPE BOOK PAGE SPREAD (ZERO INTERNAL SCROLLBARS)
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
    <div className="w-full h-[460px] sm:h-[430px] bg-gradient-to-br from-card via-card/95 to-muted/40 border border-primary/30 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl overflow-hidden relative backdrop-blur-md">
      {/* Background Accent Sheen & Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/15 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* TOP METADATA BAR */}
      <div className="relative z-10 flex items-center justify-between gap-3 shrink-0 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 bg-primary/15 text-primary text-xs font-bold rounded-full border border-primary/30 flex items-center gap-1.5 shadow-sm">
            <Layers size={13} className="animate-pulse" />
            Page {index + 1} of {total}
          </span>
          {entry.employment_type && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              TYPE_COLORS[entry.employment_type] || 'bg-muted text-muted-foreground'
            }`}>
              {entry.employment_type}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/80 px-3 py-1 rounded-full font-mono-code border border-border shadow-sm">
            <Calendar size={13} className="text-primary" />
            {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
          </span>
        </div>
      </div>

      {/* DUAL-COLUMN LANDSCAPE BODY (LEFT: ROLE & HIGHLIGHT, RIGHT: BULLETS & TECH) */}
      <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 my-4 items-center">
        {/* LEFT COLUMN: ROLE TITLE, COMPANY & IMPACT HIGHLIGHT BOX */}
        <div className="md:col-span-5 flex flex-col justify-between h-full space-y-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mb-1 leading-snug tracking-tight text-pretty">
              {entry.role}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-primary font-bold text-base flex items-center gap-1.5">
                <Briefcase size={16} />
                {entry.company}
              </p>
              {entry.location && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <MapPin size={12} />
                  {entry.location}
                </span>
              )}
            </div>
          </div>

          {/* KEY IMPACT HIGHLIGHT BOX */}
          {topMetric && (
            <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-2xl flex items-start gap-2.5 shadow-sm">
              <Zap size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-primary mb-0.5">Core Impact Highlight</p>
                <p className="text-xs text-foreground/90 font-medium line-clamp-2 leading-relaxed">
                  {topMetric}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: KEY DELIVERABLES BULLETS */}
        <div className="md:col-span-7 flex flex-col justify-center h-full border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-6 space-y-2.5">
          <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
            <Award size={13} className="text-primary" /> Key Architecture Deliverables
          </p>
          <ul className="space-y-2">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90 font-normal leading-relaxed">
                <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                <span className="line-clamp-2">{bullet.replace(/^[✓•-]\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FOOTER TECH STACK PILLS */}
      <div className="relative z-10 pt-2.5 border-t border-border/60 shrink-0 flex items-center justify-between gap-3">
        {techs.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
            <span className="text-[11px] font-bold text-muted-foreground mr-1">Stack:</span>
            {techs.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 bg-muted/80 text-foreground text-xs font-semibold rounded-md border border-border/80 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="text-[11px] font-medium text-muted-foreground shrink-0 hidden sm:flex items-center gap-1">
          <Sparkles size={12} className="text-primary" /> Hover / Click left edge to turn
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PURE DB-DRIVEN WORK EXPERIENCE SECTION WITH STICKY CANVAS UI PEEL DECK
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
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-[440px] w-full bg-card/50 border border-border rounded-3xl animate-pulse flex items-center justify-center">
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
            Roles in reverse chronological order — hover or click left edge to turn the page
          </p>
        </div>

        {/* LANDSCAPE BOOK PAGE CONTAINER */}
        <div className="relative max-w-4xl mx-auto h-[460px] sm:h-[430px] w-full">
          {entries.length > 1 ? (
            <Peel
              key={activeIdx}
              side="left"
              mode="cursor"
              reveal={1200}
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mt-8 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-card border border-border px-3.5 py-1.5 rounded-full shadow-sm">
                <Sparkles size={14} className="text-primary animate-pulse" />
                {isBookClosing
                  ? 'Closing Book & Resetting to Recent Role...'
                  : isFinalCard
                  ? 'Final Page Reached — Click/hover to fold book back to Page 1'
                  : 'Hover or click left edge to turn the page'}
              </span>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {entries.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Go to experience page ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === activeIdx ? 'w-8 bg-primary' : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground'
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
