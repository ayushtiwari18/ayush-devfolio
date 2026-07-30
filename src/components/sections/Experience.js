'use client';

import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Calendar, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
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
// FULL-WIDTH STACKED EXPERIENCE CARD
// ---------------------------------------------------------------------------
function FullWidthExperienceCard({ entry, index, total }) {
  if (!entry) return null;

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
// PURE DB-DRIVEN WORK EXPERIENCE SECTION WITH CANVAS UI PEEL DECK
// ---------------------------------------------------------------------------
export default function Experience() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const section = useReveal({ threshold: 0.1 });

  useEffect(() => {
    fetch('/api/public/experience')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Sort reverse chronological by date (newest role first)
          const sorted = [...data].sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
          setEntries(sorted);
        } else {
          setEntries([]);
        }
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-96 w-full bg-card/50 border border-border rounded-3xl animate-pulse flex items-center justify-center">
            <span className="text-muted-foreground text-sm flex items-center gap-2">
              <Sparkles size={16} className="animate-spin text-primary" /> Loading Career Experience...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (!entries || entries.length === 0) return null;

  const currentEntry = entries[activeIdx] || entries[0];
  const nextIdx = (activeIdx + 1) % entries.length;
  const nextEntry = entries[nextIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % entries.length);
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
            Roles in reverse chronological order — hover or click left edge to peel to the next role
          </p>
        </div>

        {/* FULL-WIDTH STACKED EXPERIENCE DECK WITH CANVAS UI PEEL */}
        <div className="relative max-w-4xl mx-auto min-h-[420px] sm:min-h-[440px]">
          {entries.length > 1 ? (
            <Peel
              side="left"
              mode="cursor"
              reveal={1200}
              zone={300}
              curl={320}
              bow={85}
              shade={0.35}
              shine={1}
              under={
                <FullWidthExperienceCard
                  entry={nextEntry}
                  index={nextIdx}
                  total={entries.length}
                />
              }
              onPeelComplete={handleNext}
              className="w-full h-full rounded-3xl"
            >
              <FullWidthExperienceCard
                entry={currentEntry}
                index={activeIdx}
                total={entries.length}
              />
            </Peel>
          ) : (
            <FullWidthExperienceCard
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
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-card border border-border px-3.5 py-1.5 rounded-full">
                <Sparkles size={14} className="text-primary animate-pulse" />
                Hover left edge or click card to peel to next experience
              </span>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {entries.map((_, i) => (
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
          </div>
        )}
      </div>
    </section>
  );
}
