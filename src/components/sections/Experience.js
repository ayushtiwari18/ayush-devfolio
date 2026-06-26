'use client';

import { useEffect, useRef, useState } from 'react';
import { Briefcase, MapPin, Calendar, ExternalLink } from 'lucide-react';

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const FALLBACK = [
  {
    id: 'f1',
    company: 'Open Source Contributor',
    role: 'Frontend Developer',
    employment_type: 'Open Source',
    start_date: 'Jan 2024', end_date: null,
    location: 'Remote',
    description: 'Contributing to open source React and Next.js projects.\nFixed critical accessibility issues in UI component libraries.\nReviewed pull requests and mentored new contributors.',
    technologies: 'React,Next.js,TypeScript,Tailwind CSS',
  },
];

const TYPE_COLORS = {
  'Full-time':   'bg-green-500/10 text-green-400 border border-green-500/20',
  'Part-time':   'bg-blue-500/10  text-blue-400  border border-blue-500/20',
  'Internship':  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  'Contract':    'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Freelance':   'bg-pink-500/10  text-pink-400  border border-pink-500/20',
  'Open Source': 'bg-cyan-500/10  text-cyan-400  border border-cyan-500/20',
};

function ExperienceCard({ entry, index, visible }) {
  const bullets = (entry.description || '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const techs = (entry.technologies || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  return (
    <div
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${index * 0.12}s, transform 0.55s ease ${index * 0.12}s`,
      }}
      className="relative pl-8 before:absolute before:left-[11px] before:top-6 before:bottom-0 before:w-px before:bg-border last:before:hidden"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-5 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 ml-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">

        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-foreground">{entry.role}</h3>
              {entry.employment_type && (
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  TYPE_COLORS[entry.employment_type] || 'bg-muted text-muted-foreground'
                }`}>
                  {entry.employment_type}
                </span>
              )}
            </div>
            <p className="text-primary font-semibold text-sm">{entry.company}</p>
          </div>

          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full whitespace-nowrap">
            <Calendar size={12} />
            {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
          </span>
        </div>

        {/* Location */}
        {entry.location && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <MapPin size={12} className="shrink-0" />{entry.location}
          </p>
        )}

        {/* Description bullets */}
        {bullets.length > 0 && (
          <ul className="space-y-1.5 mb-4 border-t border-border pt-4">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* Tech pills */}
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techs.map(tech => (
              <span key={tech} className="text-xs font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-lg">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Experience() {
  const [entries, setEntries] = useState(null);
  const section = useReveal();
  const list    = useReveal(0.05);

  useEffect(() => {
    fetch('/api/public/experience')
      .then(r => r.ok ? r.json() : [])
      .then(data => setEntries(Array.isArray(data) && data.length > 0 ? data : FALLBACK))
      .catch(() => setEntries(FALLBACK));
  }, []);

  const displayed = entries ?? FALLBACK;

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div ref={section.ref} style={{
          opacity: section.visible ? 1 : 0,
          transform: section.visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            <Briefcase size={32} className="text-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Roles and projects where I’ve applied my skills in real-world environments
          </p>
        </div>

        {/* Timeline */}
        <div ref={list.ref} className="space-y-6">
          {displayed.map((entry, i) => (
            <ExperienceCard key={entry.id} entry={entry} index={i} visible={list.visible} />
          ))}
        </div>

      </div>
    </section>
  );
}
