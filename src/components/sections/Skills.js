'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Code2, Cloud, Shield, Cpu, LayoutGrid, ArrowRightLeft,
  CheckCircle2, Sparkles, Server
} from 'lucide-react';
import { useReveal, fadeUp } from '@/components/animations/useReveal';

// ---------------------------------------------------------------------------
// DOMAIN MATRIX DATA
// ---------------------------------------------------------------------------
const DOMAINS = [
  {
    id: 'fullstack',
    title: 'Distributed & Full Stack Systems',
    icon: Code2,
    accent: 'indigo',
    description: 'Server-rendered applications, edge runtimes, and high-throughput REST/GraphQL APIs.',
    skills: [
      {
        name: 'Next.js',
        tag: 'Architecture Standard',
        level: 'Production Core',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
        context: 'App Router, Server Components, Edge Middleware',
      },
      {
        name: 'React',
        tag: 'UI Engine',
        level: 'Production Core',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        context: 'Concurrent Mode, Custom Hooks, Performance Profiling',
      },
      {
        name: 'TypeScript',
        tag: 'Type Safety',
        level: 'Advanced',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        context: 'Strict Mode, Generic Utilities, API Contracts',
      },
      {
        name: 'Node.js',
        tag: 'Runtime Engine',
        level: 'Production Core',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        context: 'Event Loop Tuning, Cluster Mode, Streams',
      },
      {
        name: 'Express.js',
        tag: 'Microservices',
        level: 'Production Core',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
        context: 'REST Architectures, Rate Limiting Middleware',
      },
      {
        name: 'Tailwind CSS',
        tag: 'Design System',
        level: 'Production Core',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
        context: 'Design Tokens, Fluid Typography, Anti-Slop Layouts',
      },
    ],
  },
  {
    id: 'cloud',
    title: 'Cloud Infrastructure & Database Architecture',
    icon: Cloud,
    accent: 'amber',
    description: 'High-availability VPC networks, container orchestration, and multi-model databases.',
    skills: [
      {
        name: 'Amazon Web Services',
        tag: 'Certified Architect',
        level: '2x Certified',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
        context: 'EC2 Auto-scaling, S3 Buckets, Lambda, CloudFront, IAM',
      },
      {
        name: 'Docker',
        tag: 'Containerization',
        level: 'Production',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
        context: 'Multi-stage Builds, Docker Compose, Production Isolation',
      },
      {
        name: 'PostgreSQL',
        tag: 'Relational DB',
        level: 'Advanced',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        context: 'Complex Joins, Index Optimization, ACID Compliance',
      },
      {
        name: 'MongoDB',
        tag: 'Document Store',
        level: 'Production Core',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        context: 'Aggregation Pipelines, Replica Sets, Schema Modeling',
      },
      {
        name: 'Supabase',
        tag: 'BaaS & Realtime',
        level: 'Production',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
        context: 'Row Level Security (RLS), Postgres Triggers, Auth',
      },
      {
        name: 'Redis',
        tag: 'In-Memory Cache',
        level: 'Production',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
        context: 'Key-Value Caching, Session Stores, Pub/Sub Messaging',
      },
    ],
  },
  {
    id: 'security',
    title: 'Cybersecurity, Algorithms & Graphics',
    icon: Shield,
    accent: 'emerald',
    description: 'Intrusion detection research, competitive algorithmic rigor, and WebGL 3D math.',
    skills: [
      {
        name: 'Network Security',
        tag: 'Springer Research',
        level: 'Published',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
        context: 'WAF Rule Sets, IDS Pipelines, OWASP Top 10 Mitigation',
      },
      {
        name: 'Three.js / WebGL',
        tag: '3D Celestial Canvas',
        level: 'Specialized',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg',
        context: 'Orbital Mechanics, Custom Shaders, Camera Projections',
      },
      {
        name: 'Algorithms & DSA',
        tag: 'Competitive Rating',
        level: '885+ Solved',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
        context: 'LeetCode 1657, Dynamic Programming, Graph Traversals',
      },
      {
        name: 'Git & Version Control',
        tag: 'Open Source',
        level: '5,600+ Commits',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
        context: 'Atomic Commits, Trunk-based Development, CI/CD',
      },
      {
        name: 'Framer Motion',
        tag: 'Micro-Interactions',
        level: 'Advanced',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg',
        context: 'Spring Physics, LayoutId Shared Morphing, Gestures',
      },
      {
        name: 'Linux & Terminal',
        tag: 'Dev Environment',
        level: 'Advanced',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
        context: 'Bash Scripting, Process Management, Server Hardening',
      },
    ],
  },
];

// Marquee animation keyframes
const MARQUEE_CSS = `
@keyframes marquee-stream {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-stream-track {
  animation: marquee-stream 35s linear infinite;
}
.marquee-stream-track:hover {
  animation-play-state: paused;
}
`;

function SkillCard({ skill }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#0B0F19] border border-white/10 hover:border-indigo-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center p-2 group-hover:scale-110 group-hover:bg-white/[0.08] transition-all">
            {!imgError ? (
              <Image
                src={skill.icon}
                alt={skill.name}
                width={24}
                height={24}
                className="object-contain"
                onError={() => setImgError(true)}
                unoptimized
              />
            ) : (
              <span className="text-xs font-mono-code font-bold text-primary">
                {skill.name[0]}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono-code font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {skill.level}
          </span>
        </div>

        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-primary transition-colors">
          {skill.name}
        </h4>
        <p className="text-[11px] font-mono-code text-gray-400 mt-0.5 mb-2">
          {skill.tag}
        </p>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed pt-2.5 border-t border-white/5 font-sans">
        {skill.context}
      </p>
    </div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode]   = useState('matrix'); // 'matrix' | 'stream'

  const header = useReveal({ threshold: 0.1 });
  const grid   = useReveal({ threshold: 0.05 });

  const filteredDomains = useMemo(() => {
    if (activeTab === 'all') return DOMAINS;
    return DOMAINS.filter((d) => d.id === activeTab);
  }, [activeTab]);

  const allSkillsList = useMemo(() => {
    return DOMAINS.flatMap((d) => d.skills);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />

      <section id="skills" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#05070B] overflow-hidden">
        
        {/* Ambient background glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-600/[0.03] rounded-full blur-[140px] pointer-events-none"
        />

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Section Header */}
          <div ref={header.ref} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16" style={fadeUp(header.visible)}>
            <p className="text-xs font-mono-code font-semibold tracking-[0.2em] uppercase text-primary mb-3">
              // 02. TECHNICAL ARCHITECTURE & DOMAINS
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em] leading-tight mb-4">
              Capabilities Matrix &amp;{' '}
              <span className="text-primary inline-block">Tech Radar</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              Battle-tested technologies deployed across production systems, research publications, and open-source infrastructure.
            </p>

            {/* Controls Bar: Domain Tabs + View Mode Toggle */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
              
              {/* Category Pills */}
              <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#0B0F19] border border-white/10 text-xs font-mono-code">
                {[
                  { id: 'all',      label: 'All Domains' },
                  { id: 'fullstack',label: 'Full Stack'  },
                  { id: 'cloud',    label: 'Cloud & DB'  },
                  { id: 'security', label: 'Security & Systems' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full transition-all duration-200 select-none ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-sm font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* View Switcher */}
              <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#0B0F19] border border-white/10 text-xs font-mono-code">
                <button
                  onClick={() => setViewMode('matrix')}
                  aria-label="Matrix View"
                  className={`px-2.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                    viewMode === 'matrix'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={13} />
                  <span className="hidden sm:inline">Matrix</span>
                </button>
                <button
                  onClick={() => setViewMode('stream')}
                  aria-label="Stream View"
                  className={`px-2.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                    viewMode === 'stream'
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <ArrowRightLeft size={13} />
                  <span className="hidden sm:inline">Stream</span>
                </button>
              </div>

            </div>
          </div>

          {/* VIEW MODE 1: MATRIX VIEW */}
          {viewMode === 'matrix' && (
            <div ref={grid.ref} className="space-y-12" style={fadeUp(grid.visible, 0.1)}>
              {filteredDomains.map((domain) => {
                const DomainIcon = domain.icon;
                return (
                  <div key={domain.id} className="space-y-5">
                    
                    {/* Domain Category Heading */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                          <DomainIcon size={16} />
                        </div>
                        <div>
                          <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                            {domain.title}
                          </h3>
                          <p className="text-xs text-gray-400 font-mono-code hidden sm:block">
                            {domain.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono-code text-gray-400">
                        {domain.skills.length} TECHNOLOGIES
                      </span>
                    </div>

                    {/* Skill Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {domain.skills.map((skill) => (
                        <SkillCard key={skill.name} skill={skill} />
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: CONTINUOUS STREAM VIEW */}
          {viewMode === 'stream' && (
            <div className="py-6 overflow-hidden">
              <div
                className="overflow-hidden py-4"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                }}
              >
                <div className="flex gap-4 marquee-stream-track w-max">
                  {[...allSkillsList, ...allSkillsList].map((skill, idx) => (
                    <div
                      key={`${skill.name}-${idx}`}
                      className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0B0F19] border border-white/10 shadow-lg shrink-0 select-none hover:border-primary/50 transition-colors"
                    >
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={20}
                        height={20}
                        className="object-contain"
                        unoptimized
                      />
                      <span className="text-sm font-semibold text-white whitespace-nowrap">
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-xs font-mono-code text-gray-400 mt-4">
                Hover to pause stream · Interactive Matrix view available via top toggle
              </p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
