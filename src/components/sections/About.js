'use client';

import { useEffect, useState } from 'react';
import {
  Github, Code2, Rocket, BookOpen, Cloud, Trophy,
  Shield, FlaskConical, Globe, GitBranch, MapPin, Mail,
} from 'lucide-react';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import { ACHIEVEMENTS } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Icon map — icons are stored as strings in DB, resolved here
// ---------------------------------------------------------------------------
const ICON_MAP = {
  github:      Github,
  code:        Code2,
  rocket:      Rocket,
  'book-open': BookOpen,
  cloud:       Cloud,
  trophy:      Trophy,
};

// ---------------------------------------------------------------------------
// Value cards — these describe who Ayush is, not numbers.
// If you want these editable too, add a 'values' table similarly.
// ---------------------------------------------------------------------------
const VALUES = [
  {
    icon:  Shield,
    title: 'Security-Aware',
    desc:  'WAF, IDS, OWASP Top 10 applied in production systems. Research published in Springer.',
  },
  {
    icon:  FlaskConical,
    title: 'Research-Driven',
    desc:  'Springer-indexed paper on network security. Applies academic rigour to engineering decisions.',
  },
  {
    icon:  Globe,
    title: 'Systems Thinker',
    desc:  'Full-stack ownership — MERN, Next.js, Docker, AWS. Designs for scale from day one.',
  },
  {
    icon:  GitBranch,
    title: 'Open Source First',
    desc:  '5,600+ GitHub commits. Active contributor and maintainer across public repositories.',
  },
];

const FALLBACK_BIO =
  'Started with competitive programming and never stopped — 885+ DSA problems solved across ' +
  'LeetCode (rating 1657), CodeChef, and Codeforces. Completed B.Tech CSE at Gyan Ganga ' +
  'Institute of Technology and Sciences (2021–2025), where research on network security led to ' +
  'a Springer-indexed publication. Today I build production-grade MERN and Next.js systems with ' +
  '5,600+ GitHub commits, hold two AWS certifications, and ship fast.';

// ---------------------------------------------------------------------------
// StatCard — renders one achievement row from DB
// ---------------------------------------------------------------------------
function StatCard({ achievement, index, visible }) {
  const Icon = ICON_MAP[achievement.icon] || Rocket;
  return (
    <div
      style={fadeUp(visible, index * 0.08)}
      className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon size={20} className="text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground leading-none mb-1">
          {achievement.value}
        </p>
        <p className="text-sm font-semibold text-foreground">{achievement.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {achievement.description}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ValueCard
// ---------------------------------------------------------------------------
function ValueCard({ item, index, visible }) {
  const Icon = item.icon;
  return (
    <div
      style={fadeUp(visible, 0.2 + index * 0.08)}
      className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon size={22} className="text-primary" />
      </div>
      <h4 className="text-base font-bold text-foreground mb-1.5">{item.title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ABOUT SECTION
// achievements prop: array from DB (or ACHIEVEMENTS constant as fallback)
// ---------------------------------------------------------------------------
export default function About({ profile = {}, achievements = ACHIEVEMENTS }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const header = useReveal({ threshold: 0.1 });
  const stats  = useReveal({ threshold: 0.05 });
  const values = useReveal({ threshold: 0.05 });

  const bio          = profile.about_bio          || FALLBACK_BIO;
  const availability = profile.about_availability || 'Open to opportunities';
  const location     = profile.about_location     || 'Jabalpur, Madhya Pradesh, India';
  const email        = profile.about_email        || 'ayushtiwari.dev@gmail.com';
  const highlights   = Array.isArray(profile.about_highlights) && profile.about_highlights.length > 0
    ? profile.about_highlights : null;

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={header.ref}
          className="mb-16"
          style={fadeUp(header.visible)}
        >
          {isMounted && (
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-xs font-medium text-green-500 tracking-wide">
                {availability}
              </span>
            </div>
          )}

          <p className="section-label mb-3">The Story</p>
          <h2 className="section-heading mb-6">
            Building systems that{' '}
            <span className="gradient-text">actually ship</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {bio}
          </p>

          {highlights && (
            <div className="flex flex-wrap gap-2 mt-6">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-5 mt-6">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary shrink-0" />{location}
            </span>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={14} className="text-primary shrink-0" />{email}
            </a>
          </div>
        </div>

        {/* Stat strip — powered by DB */}
        <div
          ref={stats.ref}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
        >
          {achievements.map((a, i) => (
            <StatCard key={a.id || a.label} achievement={a} index={i} visible={stats.visible} />
          ))}
        </div>

        {/* Value cards */}
        <div
          ref={values.ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {VALUES.map((v, i) => (
            <ValueCard key={v.title} item={v} index={i} visible={values.visible} />
          ))}
        </div>

      </div>
    </section>
  );
}
