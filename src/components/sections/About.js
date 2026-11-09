'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Github, Code2, Rocket, BookOpen, Cloud, Trophy,
  Shield, Terminal, GraduationCap, Award, ExternalLink,
  MapPin, Mail, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import { ACHIEVEMENTS, ROUTES } from '@/lib/constants';

const ICON_MAP = {
  github:      Github,
  code:        Code2,
  rocket:      Rocket,
  'book-open': BookOpen,
  cloud:       Cloud,
  trophy:      Trophy,
};

const FALLBACK_BIO =
  'Started with competitive programming and never stopped — 885+ DSA problems solved across ' +
  'LeetCode (rating 1657), CodeChef, and Codeforces. Completed B.Tech CSE at Gyan Ganga ' +
  'Institute of Technology and Sciences (2021–2025), where research on network security led to ' +
  'a Springer-indexed publication. Today I build production-grade MERN and Next.js systems with ' +
  '5,600+ GitHub commits, hold two AWS certifications, and ship fast.';

export default function About({ profile = {}, achievements = ACHIEVEMENTS }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const header = useReveal({ threshold: 0.1 });
  const bento  = useReveal({ threshold: 0.05 });
  const stats  = useReveal({ threshold: 0.05 });

  const bio          = profile.about_bio          || FALLBACK_BIO;
  const availability = profile.about_availability || 'Open to opportunities';
  const location     = profile.about_location     || 'Jabalpur, Madhya Pradesh, India';
  const email        = profile.about_email        || 'ayushtiwari.dev@gmail.com';

  return (
    <section id="about" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#05070B] overflow-hidden">
      
      {/* Subtle background ambient mesh */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section Header */}
        <div ref={header.ref} className="mb-16 sm:mb-20" style={fadeUp(header.visible)}>
          {isMounted && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono-code mb-5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold uppercase tracking-wider">{availability}</span>
            </div>
          )}

          <p className="text-xs font-mono-code font-semibold tracking-[0.2em] uppercase text-primary mb-3">
            // 01. ENGINEERING FOUNDATION & ARCHITECTURE
          </p>

          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] leading-tight mb-6">
            Architecting for resilience,{' '}
            <span className="text-primary inline-block">verified by research</span>
          </h2>

          <div className="max-w-3xl">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              {bio}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-6 pt-6 border-t border-white/10 text-xs sm:text-sm font-mono-code text-gray-400">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary shrink-0" />
              {location}
            </span>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
            >
              <Mail size={14} className="text-primary shrink-0" />
              {email}
            </a>
          </div>
        </div>

        {/* Architectural Bento Grid */}
        <div ref={bento.ref} className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-16" style={fadeUp(bento.visible, 0.1)}>
          
          {/* Bento Tile 1: Springer Research Spotlight (Span 7) */}
          <div className="md:col-span-7 bg-[#090D16] border border-white/10 hover:border-indigo-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-black/80 transition-all duration-300 group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-[11px] font-mono-code font-semibold uppercase tracking-wider">
                  <Shield size={12} />
                  Peer-Reviewed Publication
                </span>
                <span className="text-xs font-mono-code text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Springer Indexed
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                Network Security & Automated Threat Analysis
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                Published researcher investigating intrusion detection systems (IDS), web application firewalls (WAF), and automated threat mitigation protocols. Theoretical security rigor applied directly to production cloud architectures.
              </p>

              {/* Research Metrics Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-white/10 font-mono-code text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase block">Publisher</span>
                  <span className="font-semibold text-white">Springer Nature</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase block">Focus</span>
                  <span className="font-semibold text-white">WAF / IDS / OWASP</span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase block">Validation</span>
                  <span className="font-semibold text-emerald-400">Peer Reviewed</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between">
              <Link
                href={ROUTES.CERTIFICATIONS}
                className="inline-flex items-center gap-1.5 text-xs font-mono-code font-semibold text-primary hover:text-white transition-colors"
              >
                <span>View Publication Details</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-[11px] font-mono-code text-gray-400">SCOPUS // INDEXED</span>
            </div>
          </div>

          {/* Bento Tile 2: Live Architecture & CLI Shell (Span 5) */}
          <div className="md:col-span-5 bg-[#080B12] border border-white/10 hover:border-white/20 rounded-3xl p-6 sm:p-7 flex flex-col justify-between font-mono-code shadow-2xl shadow-black/80 transition-all duration-300 group hover:-translate-y-1">
            <div>
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] text-gray-400">ayush@devfolio: ~ (zsh)</span>
              </div>

              {/* Code Snippet Shell */}
              <div className="text-xs space-y-3 leading-relaxed">
                <div>
                  <span className="text-primary">$</span> <span className="text-white">git log --oneline | wc -l</span>
                  <p className="text-emerald-400 mt-0.5">&gt; 5,600+ commits [10+ repos]</p>
                </div>

                <div>
                  <span className="text-primary">$</span> <span className="text-white">sys-info --stack</span>
                  <p className="text-gray-300 mt-0.5">
                    &gt; Next.js 14 · React · Node.js<br />
                    &gt; AWS (EC2/S3/Lambda) · Docker<br />
                    &gt; MongoDB · PostgreSQL · Redis
                  </p>
                </div>

                <div>
                  <span className="text-primary">$</span> <span className="text-white">competitive-rating</span>
                  <p className="text-indigo-300 mt-0.5">&gt; LeetCode 1657 · 885+ DSA</p>
                </div>
              </div>
            </div>

            {/* Terminal Live Prompt */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-gray-400">
              <span className="text-emerald-400">● LIVE</span>
              <span>All systems healthy</span>
              <span className="w-1.5 h-3 bg-primary animate-pulse ml-auto" />
            </div>
          </div>

          {/* Bento Tile 3: Academic Pedigree (Span 6) */}
          <div className="md:col-span-6 bg-[#090D16] border border-white/10 hover:border-blue-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-black/80 transition-all duration-300 group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[11px] font-mono-code font-semibold uppercase tracking-wider">
                  <GraduationCap size={13} />
                  Computer Science & Engineering
                </span>
                <span className="text-xs font-mono-code text-gray-400">2021 — 2025</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                B.Tech in Computer Science
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-5 font-mono-code">
                Gyan Ganga Institute of Technology & Sciences (RGPV)
              </p>

              {/* Core Disciplines Badges */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {[
                  'Data Structures & Algorithms',
                  'Operating Systems',
                  'Database Systems (DBMS)',
                  'Computer Networks',
                  'Object-Oriented Design',
                ].map((subject) => (
                  <span
                    key={subject}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono-code bg-white/[0.03] border border-white/10 text-gray-300"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 flex items-center justify-between text-xs font-mono-code text-gray-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 size={13} /> First Class with Distinction
              </span>
              <span>Jabalpur, MP</span>
            </div>
          </div>

          {/* Bento Tile 4: AWS Verified Credentials (Span 6) */}
          <div className="md:col-span-6 bg-[#090D16] border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl shadow-black/80 transition-all duration-300 group hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-mono-code font-semibold uppercase tracking-wider">
                  <Cloud size={13} />
                  Cloud Infrastructure
                </span>
                <span className="text-xs font-mono-code text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  2x AWS Certified
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
                Amazon Web Services (AWS) Credentials
              </h3>

              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <Award size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">AWS Certified Solutions Architect – Associate</h4>
                    <p className="text-xs text-gray-400 font-mono-code mt-0.5">High-availability architecture, multi-tier VPC, cost optimization</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <Award size={18} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">AWS Certified Cloud Practitioner</h4>
                    <p className="text-xs text-gray-400 font-mono-code mt-0.5">Cloud fundamentals, IAM security, compliance, core services</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href={ROUTES.CERTIFICATIONS}
                className="inline-flex items-center gap-1.5 text-xs font-mono-code font-semibold text-amber-400 hover:text-white transition-colors"
              >
                <span>View Verified Badges</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-[11px] font-mono-code text-gray-400">AMAZON WEB SERVICES</span>
            </div>
          </div>

        </div>

        {/* Quantified Engineering Deliverables Bar */}
        <div ref={stats.ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5" style={fadeUp(stats.visible, 0.2)}>
          {achievements.map((a, i) => {
            const Icon = ICON_MAP[a.icon] || Rocket;
            return (
              <div
                key={a.id || a.label}
                className="bg-[#090D16] border border-white/10 hover:border-primary/50 rounded-2xl p-4 flex flex-col justify-between shadow-lg transition-all duration-200 group hover:-translate-y-1"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <Icon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold font-mono-code text-white tracking-tight tabular-nums">
                    {a.value}
                  </p>
                  <p className="text-xs font-semibold text-gray-300 mt-1 line-clamp-1">{a.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{a.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
