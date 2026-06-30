'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar, MapPin, Users, Trophy,
  ArrowRight, Clock,
} from 'lucide-react';

// ── helpers ───────────────────────────────────────────────
const fmt = (d) => d
  ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  : null;

const TYPE_CONFIG = {
  hackathon:   { label: 'Hackathon',   color: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  conference:  { label: 'Conference',  color: 'bg-blue-500/15   text-blue-400   border-blue-500/30'   },
  workshop:    { label: 'Workshop',    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  fest:        { label: 'Fest',        color: 'bg-pink-500/15   text-pink-400   border-pink-500/30'   },
  competition: { label: 'Competition', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  other:       { label: 'Event',       color: 'bg-primary/15    text-primary    border-primary/30'    },
};

function resultStyle(result) {
  if (!result) return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
  const r = result.toLowerCase();
  if (r.includes('win') || r.includes('1st') || r.includes('first'))
    return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
  if (r.includes('final') || r.includes('2nd') || r.includes('top'))
    return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
}

// ── Cover with useState fallback ───────────────────────────
function EventCover({ src, alt }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div className="w-full h-44 flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-zinc-900">
        <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
          <Trophy size={26} className="text-primary/50" />
        </div>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-full h-44 object-cover"
      onError={() => setFailed(true)}
    />
  );
}

// ── Main card ─────────────────────────────────────────────
export default function EventTimelineCard({ event }) {
  const cfg  = TYPE_CONFIG[event.type] || TYPE_CONFIG.other;
  const imgs = Array.isArray(event.images) ? event.images : [];

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300">

        {/* Cover */}
        <div className="relative overflow-hidden">
          <EventCover src={event.cover_image} alt={event.title} />

          {/* Image count pill */}
          {imgs.length > 0 && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium rounded-full flex items-center gap-1">
              🖼️ {imgs.length} photos
            </span>
          )}

          {/* Type badge */}
          <span className={`absolute top-2 left-2 px-2.5 py-1 text-[10px] font-bold rounded-full border ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Result badge */}
          {event.result && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full border mb-3 ${resultStyle(event.result)}`}>
              <Trophy size={9} />{event.result}
            </span>
          )}

          <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
            {event.title}
          </h2>

          {event.tagline && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
              {event.tagline}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mb-3">
            {fmt(event.date) && (
              <span className="flex items-center gap-1"><Calendar size={10} />{fmt(event.date)}</span>
            )}
            {event.location && (
              <span className="flex items-center gap-1"><MapPin size={10} />{event.location}</span>
            )}
            {event.duration && (
              <span className="flex items-center gap-1"><Clock size={10} />{event.duration}</span>
            )}
            {event.team_size > 1 && (
              <span className="flex items-center gap-1"><Users size={10} />Team of {event.team_size}</span>
            )}
          </div>

          {/* Tech tags */}
          {event.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {event.technologies.slice(0, 4).map((t, i) => (
                <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full border border-primary/20">
                  {t}
                </span>
              ))}
              {event.technologies.length > 4 && (
                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-full">
                  +{event.technologies.length - 4}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <span className="text-[10px] text-muted-foreground/60">{event.organizer || ''}</span>
            <span className="flex items-center gap-1 text-xs text-primary font-semibold group-hover:gap-2 transition-all">
              Read story <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
