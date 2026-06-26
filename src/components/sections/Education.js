'use client';

import { useEffect, useRef, useState } from 'react';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';

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
    institution: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
    degree: 'B.Tech',
    field: 'Computer Science & Engineering',
    start_date: '2021', end_date: '2025',
    location: 'Bhopal, Madhya Pradesh, India',
    description: 'Studied core CS subjects including DSA, OS, DBMS, CN and Web Technologies. Active member of coding club.',
  },
  {
    id: 'f2',
    institution: 'Joy Senior Secondary School',
    degree: '12th CBSE', field: 'Science (PCM)',
    start_date: '2020', end_date: '2021',
    location: 'Jabalpur, Madhya Pradesh, India',
    description: null,
  },
  {
    id: 'f3',
    institution: 'Joy Senior Secondary School',
    degree: '10th CBSE', field: 'General Curriculum',
    start_date: '2018', end_date: '2020',
    location: 'Jabalpur, Madhya Pradesh, India',
    description: 'Scored 83.62%. Demonstrated academic excellence and contributed actively in extracurricular clubs.',
  },
];

function EducationCard({ entry, index, visible }) {
  return (
    <div
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s`,
      }}
      className="relative pl-8 before:absolute before:left-[11px] before:top-6 before:bottom-0 before:w-px before:bg-border last:before:hidden"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-5 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 ml-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">{entry.institution}</h3>
            <p className="text-primary font-semibold text-sm mt-0.5">
              {entry.degree}{entry.field ? ` · ${entry.field}` : ''}
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full whitespace-nowrap">
            <Calendar size={12} />
            {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
          </span>
        </div>

        {/* Location */}
        {entry.location && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <MapPin size={12} className="shrink-0" />{entry.location}
          </p>
        )}

        {/* Description */}
        {entry.description && (
          <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
            {entry.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function Education() {
  const [entries, setEntries] = useState(null);
  const section = useReveal();
  const list    = useReveal(0.05);

  useEffect(() => {
    fetch('/api/public/education')
      .then(r => r.ok ? r.json() : [])
      .then(data => setEntries(Array.isArray(data) && data.length > 0 ? data : FALLBACK))
      .catch(() => setEntries(FALLBACK));
  }, []);

  const displayed = entries ?? FALLBACK;

  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div ref={section.ref} style={{
          opacity: section.visible ? 1 : 0,
          transform: section.visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }} className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            <GraduationCap size={32} className="text-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            My <span className="gradient-text">Education</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Academic background and institutions that shaped my foundation
          </p>
        </div>

        {/* Timeline */}
        <div ref={list.ref} className="space-y-6">
          {displayed.map((entry, i) => (
            <EducationCard key={entry.id} entry={entry} index={i} visible={list.visible} />
          ))}
        </div>

      </div>
    </section>
  );
}
