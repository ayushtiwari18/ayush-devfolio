'use client';

/**
 * MediaFallback — per-type illustrated placeholder
 * --------------------------------------------------
 * Renders when an event has no media[] and no video_url.
 * Always fills the media column so the two-column layout is
 * preserved on every event — never collapses to single column.
 *
 * Design:
 * - Gradient background using the event type's color
 * - Per-type SVG icon (centered, large)
 * - Subtle animated noise texture (CSS only, GPU compositor)
 * - "Add media" badge only in development (NODE_ENV check)
 *
 * RULE: This component must stay purely decorative.
 * No click handlers. No state. No observers.
 */

const TYPE_ICONS = {
  hackathon: (
    // Trophy
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      <path d="M32 8C32 8 20 12 20 24C20 32 25 37 32 39C39 37 44 32 44 24C44 12 32 8 32 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
      <path d="M20 16H14C14 16 13 28 20 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M44 16H50C50 16 51 28 44 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M28 39V46M36 39V46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 46H42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="32" cy="24" r="4" fill="currentColor" fillOpacity="0.6"/>
    </svg>
  ),
  work: (
    // Code brackets
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      <path d="M22 20L10 32L22 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M42 20L54 32L42 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M36 14L28 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6"/>
    </svg>
  ),
  freelancing: (
    // Contract / handshake
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      <rect x="14" y="12" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08"/>
      <path d="M20 22H36M20 28H36M20 34H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M38 36L42 32L50 40L44 46L36 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="44" cy="38" r="1.5" fill="currentColor"/>
    </svg>
  ),
  college: (
    // Graduation cap
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      <path d="M32 14L8 26L32 38L56 26L32 14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.12"/>
      <path d="M20 32V44C20 44 24 50 32 50C40 50 44 44 44 44V32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M56 26V36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="56" cy="38" r="2" fill="currentColor"/>
    </svg>
  ),
  project: (
    // Sparkle / rocket
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      <path d="M32 8C32 8 44 12 44 28C44 36 40 42 36 46L28 46C24 42 20 36 20 28C20 12 32 8 32 8Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.12"/>
      <circle cx="32" cy="26" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
      <path d="M28 46L24 56L32 52L40 56L36 46" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M18 34L12 36M46 34L52 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  enjoyment: (
    // Camera / photo
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
      <rect x="8" y="20" width="48" height="34" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08"/>
      <path d="M22 20L26 12H38L42 20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="32" cy="37" r="9" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.12"/>
      <circle cx="32" cy="37" r="4" fill="currentColor" fillOpacity="0.4"/>
      <circle cx="46" cy="27" r="2" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  ),
};

// Background gradient configs per type
const TYPE_BG = {
  hackathon:   'from-violet-500/10 to-violet-500/5',
  work:        'from-blue-500/10 to-blue-500/5',
  freelancing: 'from-emerald-500/10 to-emerald-500/5',
  college:     'from-amber-500/10 to-amber-500/5',
  project:     'from-pink-500/10 to-pink-500/5',
  enjoyment:   'from-orange-500/10 to-orange-500/5',
};

// Icon color per type
const TYPE_COLOR = {
  hackathon:   'text-violet-400',
  work:        'text-blue-400',
  freelancing: 'text-emerald-400',
  college:     'text-amber-400',
  project:     'text-pink-400',
  enjoyment:   'text-orange-400',
};

const isDev = process.env.NODE_ENV === 'development';

export default function MediaFallback({ type, title }) {
  const icon    = TYPE_ICONS[type]  || TYPE_ICONS.project;
  const bg      = TYPE_BG[type]    || TYPE_BG.project;
  const color   = TYPE_COLOR[type] || TYPE_COLOR.project;

  return (
    <div
      role="img"
      aria-label={`Visual placeholder for: ${title}`}
      className={`
        relative overflow-hidden
        rounded-xl
        aspect-video w-full
        bg-gradient-to-br ${bg}
        border border-border/30
        flex flex-col items-center justify-center
        gap-3
      `}
    >
      {/* Subtle dot-grid texture — CSS only, zero JS */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          color: 'hsl(var(--border))',
        }}
      />

      {/* Centered icon */}
      <div
        aria-hidden="true"
        className={`relative z-10 ${color} opacity-60`}
      >
        {icon}
      </div>

      {/* Dev-only badge — stripped in production build */}
      {isDev && (
        <p
          aria-hidden="true"
          className="
            relative z-10
            text-xs text-muted-foreground/50
            font-medium tracking-wide
            px-3 py-1 rounded-full
            bg-background/30 backdrop-blur-sm
            border border-border/20
          "
        >
          Add media in Admin →
        </p>
      )}
    </div>
  );
}
