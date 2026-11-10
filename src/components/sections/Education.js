'use client';

import { useEffect, useState } from 'react';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Binary,
  Layers,
  ArrowUpRight,
  School,
  Code2,
} from 'lucide-react';
import { useReveal, fadeUp } from '@/components/animations/useReveal';

const ENRICHED_EDUCATION = [
  {
    id: 'btech',
    institution: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya',
    subInstitution: 'Gyan Ganga Institute of Technology & Sciences (GGITS)',
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science & Engineering',
    start_date: '2021',
    end_date: '2025',
    status: 'Graduating 2025 · First Division with Distinction',
    location: 'Jabalpur / Bhopal, MP, India',
    isHero: true,
    highlights: [
      'Published network security research paper in Springer-indexed conference proceedings.',
      'Represented institution as a Smart India Hackathon (SIH) finalist software engineer.',
      'Solved 885+ algorithmic challenges across LeetCode, Codeforces, and CodeChef throughout curriculum.',
      'Active mentor in technical coding societies, conducting workshops on full-stack web and systems architecture.',
    ],
    coursework: [
      'Data Structures & Algorithms',
      'Operating Systems Architecture',
      'Database Management Systems',
      'Network Security & Cryptography',
      'Distributed Systems & Cloud',
      'Compiler Design & Theory',
    ],
    researchBadge: {
      title: 'Springer-Indexed Research Paper',
      subtitle: 'Network Security & Protocol Vulnerability Mitigation',
      link: '/#about',
    },
  },
  {
    id: 'cbse-12',
    institution: 'Joy Senior Secondary School',
    degree: 'Higher Secondary (Class XII) · CBSE',
    field: 'Science — Physics, Chemistry, Mathematics & CS',
    start_date: '2020',
    end_date: '2021',
    status: 'PCM + Computer Science Specialization',
    location: 'Jabalpur, MP, India',
    isHero: false,
    highlights: [
      'Rigorous mathematical grounding in Differential Calculus, Linear Algebra, and Analytical Geometry.',
      'Foundational computing with Python algorithms, Boolean algebra, and relational SQL modeling.',
    ],
    coursework: [
      'Advanced Mathematics',
      'Physics & Electromagnetism',
      'Python & Algorithmic Logic',
    ],
  },
  {
    id: 'cbse-10',
    institution: 'Joy Senior Secondary School',
    degree: 'Secondary School Certificate (Class X) · CBSE',
    field: 'General Science & Mathematics Curriculum',
    start_date: '2018',
    end_date: '2020',
    status: '83.62% Aggregate · Academic Distinction',
    location: 'Jabalpur, MP, India',
    isHero: false,
    highlights: [
      'Secured 83.62% aggregated score with subject distinctions in Mathematics and Natural Sciences.',
      'Active participant in inter-school science symposiums, mathematics olympiads, and school tech clubs.',
    ],
    coursework: [
      'Pure Mathematics',
      'Physics & Chemistry',
      'Foundational Informatics',
    ],
  },
];

const METRICS = [
  { label: 'Core CS Degree', value: '4 Years', detail: 'Curriculum & Lab Work', icon: GraduationCap },
  { label: 'Published Research', value: '1 Springer', detail: 'Peer-Reviewed Paper', icon: Award },
  { label: 'DSA Problems', value: '885+', detail: 'LeetCode · Codeforces', icon: Binary },
  { label: 'Board Honors', value: '83.62%', detail: 'Secondary Distinction', icon: Sparkles },
];

export default function Education() {
  const [entries, setEntries] = useState(ENRICHED_EDUCATION);
  const header = useReveal({ threshold: 0.1 });
  const grid   = useReveal({ threshold: 0.05 });
  const stats  = useReveal({ threshold: 0.05 });

  useEffect(() => {
    fetch('/api/public/education')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge with enriched fallback data to preserve coursework & highlights
          const merged = ENRICHED_EDUCATION.map((item, i) => {
            const dbMatch = data[i] || {};
            return {
              ...item,
              institution: dbMatch.institution || item.institution,
              degree: dbMatch.degree || item.degree,
              field: dbMatch.field || item.field,
              start_date: dbMatch.start_date || item.start_date,
              end_date: dbMatch.end_date || item.end_date,
              location: dbMatch.location || item.location,
            };
          });
          setEntries(merged);
        }
      })
      .catch(() => {
        // Fallback to local enriched data
      });
  }, []);

  const btech = entries[0] || ENRICHED_EDUCATION[0];
  const secondary = entries.slice(1);

  return (
    <section id="education" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#05070B] overflow-hidden">
      
      {/* Subtle background ambient mesh */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/[0.04] rounded-full blur-[140px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div ref={header.ref} className="mb-16 sm:mb-20" style={fadeUp(header.visible)}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono-code mb-5 backdrop-blur-md">
            <GraduationCap size={14} className="text-primary animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">Academic Track & CS Rigor</span>
          </div>

          <p className="text-xs font-mono-code font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            // 03. ACADEMIC PEDIGREE & THEORETICAL FOUNDATIONS
          </p>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] leading-tight mb-6">
            Foundations forged in{' '}
            <span className="text-primary inline-block">computer science & research</span>
          </h2>

          <div className="max-w-3xl">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              A deep theoretical grounding in algorithms, operating systems architecture, and distributed systems —
              bridging fundamental computer science principles with high-scale production web applications.
            </p>
          </div>
        </div>

        {/* Architectural Bento Showcase */}
        <div ref={grid.ref} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12" style={fadeUp(grid.visible, 0.1)}>

          {/* LEFT: Flagship B.Tech Engineering Dossier Card (Span 7) */}
          <div className="lg:col-span-7 bg-[#090D16] border border-white/10 hover:border-primary/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-black/80 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
            
            {/* Top Sheen */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/15 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold font-mono-code border border-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    {btech.status}
                  </span>
                </div>

                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-white/[0.04] px-3 py-1 rounded-full font-mono-code border border-white/10">
                  <Calendar size={12} className="text-primary" />
                  {btech.start_date} – {btech.end_date}
                </span>
              </div>

              {/* Title & University */}
              <div className="mb-6">
                <span className="text-[11px] uppercase tracking-wider font-bold text-primary font-mono-code flex items-center gap-1.5 mb-2">
                  <Cpu size={13} /> Core Degree Program
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-2">
                  {btech.degree}
                </h3>
                <p className="text-primary font-bold text-lg mb-2">
                  {btech.field}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-400 font-mono-code">
                  <span className="text-white/90 font-semibold">{btech.institution}</span>
                  <span className="hidden sm:inline text-white/20">|</span>
                  <span className="text-gray-400">{btech.subInstitution}</span>
                </div>
                {btech.location && (
                  <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-2 font-mono-code">
                    <MapPin size={12} className="text-primary shrink-0" />
                    {btech.location}
                  </p>
                )}
              </div>

              {/* Springer Research Callout */}
              {btech.researchBadge && (
                <div className="mb-6 p-4 rounded-2xl bg-primary/[0.07] border border-primary/25 hover:border-primary/50 transition-colors group/pub">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-primary/15 text-primary shrink-0 mt-0.5">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-primary font-mono-code">
                            Peer-Reviewed Publication
                          </p>
                          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-white text-[10px] font-mono-code font-bold">
                            Springer
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1 group-hover/pub:text-primary transition-colors">
                          {btech.researchBadge.title}
                        </h4>
                        <p className="text-xs text-gray-300 mt-0.5">
                          {btech.researchBadge.subtitle}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/#about"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                      title="View publication context"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Highlights */}
              <div className="space-y-2.5 mb-6">
                <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 font-mono-code mb-2">
                  Academic Milestones & Leadership:
                </p>
                {btech.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed">
                    <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coursework Tags Footer */}
            <div className="relative z-10 pt-5 border-t border-white/10">
              <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 font-mono-code mb-2.5 flex items-center gap-1.5">
                <Layers size={12} className="text-primary" /> Key Theoretical Pillars
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {btech.coursework.map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-gray-300 text-xs font-mono-code border border-white/10 hover:border-primary/40 hover:text-white transition-colors"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Secondary Academic Foundations (Span 5 Stacked) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {secondary.map((entry, idx) => (
              <div
                key={entry.id}
                className="bg-[#090D16] border border-white/10 hover:border-primary/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl shadow-black/80 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex-1"
              >
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-accent/10 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-white/10 mb-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full font-mono-code ${
                      idx === 1
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {entry.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 font-mono-code">
                      <Calendar size={12} className="text-primary" />
                      {entry.start_date} – {entry.end_date}
                    </span>
                  </div>

                  {/* Title & Institution */}
                  <div className="mb-4">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 font-mono-code flex items-center gap-1 mb-1">
                      <School size={12} className="text-primary" />
                      {idx === 0 ? 'Senior Secondary Milestone' : 'Secondary Milestone'}
                    </span>
                    <h4 className="font-display text-xl font-bold text-white tracking-tight leading-snug">
                      {entry.degree}
                    </h4>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {entry.field}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-mono-code">
                      {entry.institution} · {entry.location}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2 mb-4">
                    {entry.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                        <CheckCircle2 size={13} className="text-primary shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coursework Tags */}
                <div className="relative z-10 pt-3 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {entry.coursework.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-white/[0.03] text-gray-400 text-[11px] font-mono-code border border-white/5"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Academic Vital Metrics Bar */}
        <div ref={stats.ref} className="grid grid-cols-2 md:grid-cols-4 gap-4" style={fadeUp(stats.visible, 0.15)}>
          {METRICS.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="bg-[#090D16]/90 border border-white/10 hover:border-primary/40 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-xl transition-all duration-300 group hover:-translate-y-0.5"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {m.value}
                  </p>
                  <p className="text-xs font-semibold text-gray-300">
                    {m.label}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono-code">
                    {m.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
