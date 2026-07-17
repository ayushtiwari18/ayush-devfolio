'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar, MapPin, Users, Trophy,
  ArrowRight, Clock,
} from 'lucide-react';

// ── helpers ───────────────────────────────────────────
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

function getGradient(title) {
  const gradients = [
    'from-violet-900/40 via-purple-900/20 to-zinc-950',
    'from-blue-900/40 via-cyan-900/20 to-zinc-950',
    'from-emerald-900/40 via-teal-900/20 to-zinc-950',
    'from-orange-900/40 via-red-900/20 to-zinc-950',
    'from-pink-900/40 via-rose-900/20 to-zinc-950',
    'from-yellow-900/40 via-amber-900/20 to-zinc-950',
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// ── Event Cover Redesign ────────────────────────────────
function EventCover({ src, alt, title }) {
  const [failed, setFailed] = useState(!src);
  const gradient = getGradient(title || 'Event');

  // If missing or failed, show elegant fallback
  if (failed || !src) {
    return (
      <div className={`w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-gradient-to-br ${gradient}`}>
        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md mb-4 shadow-2xl">
          <Trophy size={36} className="text-white/40" />
        </div>
        <span className="text-xs font-mono text-white/30 tracking-widest uppercase">Media Unavailable</span>
      </div>
    );
  }

  // If valid, use object-contain over the gradient so the full poster is visible!
  return (
    <div className={`w-full h-full min-h-[300px] relative bg-gradient-to-br ${gradient} p-8 flex items-center justify-center`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full max-h-[350px] object-contain drop-shadow-2xl rounded-lg"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

// ── Main split card ──────────────────────────────────────
export default function EventTimelineCard({ event, index = 0, isLeft = true }) {
  const cfg         = TYPE_CONFIG[event.type] || TYPE_CONFIG.other;
  const imgs        = Array.isArray(event.images) ? event.images : [];
  const delay       = Math.min(index * 0.08, 0.32);

  const isWin = event.result && (event.result.toLowerCase().includes('win') || event.result.toLowerCase().includes('1st'));
  const ringClass = isWin ? 'ring-1 ring-yellow-500/50 shadow-[0_0_30px_-5px_rgba(234,179,8,0.15)]' : 'border-border/50 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5';

  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const variants = prefersReduced
    ? { hidden: { opacity: 1, x: 0, y: 0 }, visible: { opacity: 1, x: 0, y: 0 } }
    : {
        hidden:  { opacity: 0, x: isLeft ? -40 : 40, y: 16 },
        visible: {
          opacity: 1, x: 0, y: 0,
          transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay },
        },
      };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      className="w-full flex flex-col md:grid md:grid-cols-2 md:gap-12 items-stretch"
    >
      {/* Content Block */}
      <div className={`mb-6 md:mb-0 w-full h-full ${isLeft ? 'md:pr-2 md:text-right md:order-1' : 'md:pl-2 md:text-left md:order-2'}`}>
        <Link href={`/events/${event.slug}`} className="group block w-full h-full">
          <div className={`p-7 md:p-9 bg-card/60 backdrop-blur-sm border rounded-3xl h-full flex flex-col justify-center hover:-translate-y-1 transition-all duration-300 ${ringClass}`}>
            
            {/* Header / Labels */}
            <div className={`flex flex-wrap items-center gap-2 mb-5 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
              <span className={`px-3 py-1.5 text-[11px] font-bold rounded-full border ${cfg.color}`}>
                {cfg.label}
              </span>
              {event.result && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-full border ${resultStyle(event.result)}`}>
                  <Trophy size={11} />{event.result}
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-tight tracking-tight">
              {event.title}
            </h2>

            {event.tagline && (
              <p className="text-sm md:text-base text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                {event.tagline}
              </p>
            )}

            <div className={`flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground mb-6 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
              {fmt(event.date) && <span className="flex items-center gap-1.5"><Calendar size={14} />{fmt(event.date)}</span>}
              {event.location && <span className="flex items-center gap-1.5"><MapPin size={14} />{event.location}</span>}
              {event.duration && <span className="flex items-center gap-1.5"><Clock size={14} />{event.duration}</span>}
              {event.team_size > 1 && <span className="flex items-center gap-1.5"><Users size={14} />Team of {event.team_size}</span>}
            </div>

            {event.technologies?.length > 0 && (
              <div className={`flex flex-wrap gap-2 mb-6 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                {event.technologies.slice(0, 4).map((t, i) => (
                  <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-bold tracking-wide rounded-full border border-primary/20">
                    {t}
                  </span>
                ))}
                {event.technologies.length > 4 && (
                  <span className="px-3 py-1.5 bg-muted text-muted-foreground text-[10px] font-bold tracking-wide rounded-full">
                    +{event.technologies.length - 4}
                  </span>
                )}
              </div>
            )}

            <div className={`flex items-center pt-5 border-t border-border/40 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
              <span className="flex items-center gap-2 text-sm text-primary font-bold tracking-wide group-hover:gap-3 transition-all">
                Read story <ArrowRight size={16} />
              </span>
            </div>

          </div>
        </Link>
      </div>

      {/* Media Block */}
      <div className={`w-full relative overflow-hidden rounded-3xl border border-border/50 shadow-2xl h-full ${isLeft ? 'md:order-2' : 'md:order-1'}`}>
        <Link href={`/events/${event.slug}`} className="block w-full h-full group relative">
          <EventCover src={event.cover_image} alt={event.title} title={event.title} />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none" />
          
          {imgs.length > 0 && (
            <span className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-xl">
              🖼️ {imgs.length} photos
            </span>
          )}
        </Link>
      </div>

    </motion.div>
  );
}
