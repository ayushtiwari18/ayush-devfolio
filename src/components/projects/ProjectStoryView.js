'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield, AlertTriangle, CheckCircle2, Cpu, Database, Server,
  Terminal, ExternalLink, Github, Layers, ArrowLeft, ArrowRight,
  Sparkles, Wrench, Bug, Lock, Clock, Calendar, Check, BookOpen,
  ChevronRight, Network, Eye, Zap, ShieldAlert, Award
} from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const ArchitectureViewer = dynamic(
  () => import('@/components/projects/ArchitectureViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 rounded-2xl bg-[#090D16] border border-white/10 flex items-center justify-center text-xs font-mono text-gray-500">
        Loading interactive architecture canvas...
      </div>
    ),
  }
);

export default function ProjectStoryView({ project, authorHeroImage, authorName, relatedProjects = [] }) {
  const [activeTab, setActiveTab] = useState('story');
  const [openChallenge, setOpenChallenge] = useState(0);

  const isSentinal = project.slug === 'sentinal';
  const hasArchitecture = Boolean(project.architecture_plan);
  const challenges = project.challenges || [];
  const strategies = project.strategies || [];

  return (
    <div className="space-y-16">

      {/* ── Top Header / Executive Brief ── */}
      <section className="relative rounded-3xl overflow-hidden bg-[#090D16] border border-white/10 p-6 sm:p-10 shadow-2xl shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent pointer-events-none" />

        {/* Badge Strip */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 text-xs font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            SYSTEMS ARCHITECTURE CASE STUDY
          </span>

          {isSentinal && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30 text-xs font-mono font-bold">
              <Award size={13} fill="currentColor" />
              HackByte 4.0 Hackathon Build
            </span>
          )}

          {project.live_url && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live Deployment
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-display tracking-tight leading-[1.12] mb-6">
          {project.title}
        </h1>

        {/* Executive Hook / Plain English Description */}
        <p className="text-base sm:text-xl text-gray-200/90 font-sans leading-relaxed max-w-4xl mb-8">
          {project.description}
        </p>

        {/* Action Buttons & Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-3">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-11 px-5 bg-emerald-500 text-black hover:bg-emerald-400 font-mono font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20">
                  <ExternalLink size={14} className="mr-2" />
                  <span>Launch Live Security Center</span>
                </Button>
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="h-11 px-4 text-xs font-mono border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-primary/40 text-gray-200 rounded-xl"
                >
                  <GitHubIcon size={15} className="mr-2" />
                  <span>View Source Repository</span>
                </Button>
              </a>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-5 text-xs font-mono text-gray-400">
            {project.duration && (
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-primary" />
                <span>{project.duration}</span>
              </div>
            )}
            {project.date && (
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-emerald-400" />
                <span>{new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Cover Image Showcase ── */}
      {project.cover_image && (
        <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#070A12] shadow-2xl shadow-black/50">
          <div className="relative w-full h-72 sm:h-[480px]">
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-80" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#090D16]/90 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Production Interface Screenshot — Live Operations Center</span>
            </div>
            {project.technologies?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 5).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-white/[0.04] text-gray-300 text-[11px] font-mono border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Act I: The Plain-English Mental Model (Understand It Instantly) ── */}
      <section className="rounded-3xl bg-[#090D16] border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-black/30">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/[0.08]">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary block font-bold">
              Chapter 01 // The Core Concept
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              What is {project.title.split('—')[0].trim()} in Plain English?
            </h2>
          </div>
        </div>

        {/* Mental Model Callout */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0C121F] border border-primary/25 mb-8">
          <p className="text-base sm:text-lg text-gray-100 font-sans leading-relaxed italic">
            &ldquo;{isSentinal
              ? 'Think of SENTINAL as an intelligent digital border checkpoint for web applications. Traditional firewalls rely on dumb keyword lists that block innocent visitors and miss mutated attacks. SENTINAL inspects incoming HTTP traffic in sub-milliseconds, uses an ML model (XGBoost) to classify threats, and has an autonomous AI agent (Nexus) that auto-neutralizes low-risk attacks while escalating irreversible bans for human sign-off.'
              : project.description}&rdquo;
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <span className="text-xs font-mono font-bold text-primary block mb-2">01 // PRE-FILTERING</span>
            <h3 className="text-base font-bold text-white mb-2">30s In-Memory Cache</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Known malicious IPs are blocked in zero database round-trips via an in-memory cache, keeping latency sub-millisecond.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <span className="text-xs font-mono font-bold text-emerald-400 block mb-2">02 // ML CLASSIFIER</span>
            <h3 className="text-base font-bold text-white mb-2">XGBoost Attack Engine</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Evaluates payload structure against 11 attack categories (SQLi, XSS, Path Traversal) returning explicit confidence scores.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <span className="text-xs font-mono font-bold text-indigo-400 block mb-2">03 // HUMAN-IN-THE-LOOP</span>
            <h3 className="text-base font-bold text-white mb-2">PolicyGuard-v1 Safety</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Low-risk actions auto-execute; irreversible high-risk actions (permanent IP bans) queue for human authorization.
            </p>
          </div>
        </div>
      </section>

      {/* ── Act II: The Conflict — Traditional Flaws vs Modern Architecture ── */}
      {project.problem_statement && (
        <section className="rounded-3xl bg-[#090D16] border border-white/10 p-6 sm:p-8 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 block font-bold">
                Chapter 02 // The Problem & Friction
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Why Traditional Systems Fail
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* The Flaw */}
            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30">
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <ShieldAlert size={14} />
                <span>The Legacy Static Rule Fallacy</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-sans mb-4">
                {project.problem_statement}
              </p>
              <ul className="space-y-2 text-xs font-mono text-red-300/80">
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> Brittle regex bypassed by mutated strings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> High false positives blocking legitimate users
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> Zero explainability or forensic reasoning
                </li>
              </ul>
            </div>

            {/* The Architectural Solution */}
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 size={14} />
                <span>The Engineered Breakthrough</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-sans mb-4">
                {project.solution || 'Engineered an end-to-end multi-service pipeline that combines high-speed gateway caching with machine learning classification and agentic safety guardrails.'}
              </p>
              <ul className="space-y-2 text-xs font-mono text-emerald-300/80">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Sub-millisecond in-memory cache on gateway
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> XGBoost machine learning attack scoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> 1-click human approval queue for critical actions
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── Act III: The 5-Microservice Engine Breakdown ── */}
      {isSentinal && (
        <section className="rounded-3xl bg-[#090D16] border border-white/10 p-6 sm:p-8 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Cpu size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block font-bold">
                Chapter 03 // Distributed Systems Topology
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                The 5-Microservice Platform Anatomy
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Service 1 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold">
                  PORT 3000
                </span>
                <span className="text-gray-500">Node.js / Express</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Gateway &amp; Dispatcher</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Intercepts every HTTP request, checks the 30s in-memory blocklist, and pushes real-time telemetry alerts via Socket.IO.
              </p>
            </div>

            {/* Service 2 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 font-bold">
                  PORT 8002
                </span>
                <span className="text-gray-500">Python / FastAPI</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Detection Engine</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Runs regex pre-filters and trained XGBoost ML pipelines across 11 attack vectors to output confidence scores.
              </p>
            </div>

            {/* Service 3 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold">
                  PORT 8001
                </span>
                <span className="text-gray-500">Python / Gemini 1.5 Pro</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Nexus AI Policy Agent</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Evaluates PolicyGuard-v1 rules asynchronously: auto-executes low risk actions, queues irreversible bans for human sign-off.
              </p>
            </div>

            {/* Service 4 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  CLUSTER
                </span>
                <span className="text-gray-500">MongoDB Atlas</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">7 Collections &amp; Append Logs</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Maintains raw logs, confirmed attack events, alerts, and append-only audit histories with automatic TTL index cleanups.
              </p>
            </div>

            {/* Service 5 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold">
                  PORT 5173
                </span>
                <span className="text-gray-500">React / Vite</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Live Security Operations</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                17-page security cockpit featuring live threat feeds, AI Copilot chat streaming, geo-threat maps, and PCAP inspection.
              </p>
            </div>

            {/* Service 6 / Deployment */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between mb-3 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-bold">
                  INFRASTRUCTURE
                </span>
                <span className="text-gray-500">Ubuntu VPS / PM2</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Production Deployment</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Orchestrated with PM2 ecosystem configs, Nginx reverse proxy, and environment secret isolation.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Act IV: Interactive Architecture Pipeline Canvas ── */}
      {hasArchitecture && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Network size={16} className="text-primary" />
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                Chapter 04 // Interactive Pipeline Architecture
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-400 hidden sm:inline">
              Pinch or Scroll to Zoom &middot; Drag to Pan
            </span>
          </div>

          <ArchitectureViewer
            architecturePlan={project.architecture_plan}
            architectureType={project.architecture_type || 'mermaid'}
            apiFlowDiagram={project.api_flow_diagram}
            dbSchemaVisual={project.db_schema_visual}
          />
        </section>
      )}

      {/* ── Act V: Battle-Tested War Stories (Challenges Solved) ── */}
      {challenges.length > 0 && (
        <section className="rounded-3xl bg-[#090D16] border border-white/10 p-6 sm:p-8 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Wrench size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-bold">
                Chapter 05 // Engineering War Stories &amp; Fixes
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Real Challenges Faced &amp; How They Were Solved
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {challenges.map((item, idx) => {
              const isOpen = openChallenge === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] hover:border-primary/40 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenChallenge(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                        ✕
                      </span>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 block font-bold">
                          The Problem
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-white mt-0.5">
                          {item.problem}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-gray-500 shrink-0">
                      {isOpen ? 'Collapse' : 'View Fix'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-white/[0.08] bg-[#0C121F]">
                      <div className="flex items-start gap-3 pt-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-bold">
                            Engineered Battle Fix
                          </span>
                          <p className="text-xs sm:text-sm text-gray-200 mt-1 leading-relaxed font-sans">
                            {item.fix}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Act VI: Security Guardrails & PolicyGuard-v1 ── */}
      {project.security_notes && (
        <section className="rounded-3xl bg-[#090D16] border border-white/10 p-6 sm:p-8 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-white/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-bold">
                Chapter 06 // Safety Framework
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Security Constraints &amp; Guardrails
              </h2>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] font-mono text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {project.security_notes}
          </div>
        </section>
      )}

      {/* ── Act VII: Author Sign-off Bio ── */}
      <section className="rounded-3xl bg-[#090D16] border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-black/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 shrink-0 shadow-md bg-[#0A0D14]">
              <Image
                src={authorHeroImage || '/profile.png'}
                alt={authorName || 'Ayush Tiwari'}
                fill
                className="object-cover object-top"
                unoptimized={(authorHeroImage || '').includes('supabase.co')}
              />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>{authorName || 'Ayush Tiwari'}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Lead Engineer
                </span>
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-md leading-relaxed font-sans">
                Full-Stack Systems Engineer specializing in distributed platforms, intrusion detection engines, and high-concurrency applications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/projects" className="flex-1 sm:flex-none">
              <Button
                variant="outline"
                className="w-full text-xs font-mono border-white/10 hover:border-primary/50 hover:bg-primary/10 text-gray-200"
              >
                <ArrowLeft size={13} className="mr-1.5" /> All Projects
              </Button>
            </Link>
            <Link href="/#contact" className="flex-1 sm:flex-none">
              <Button className="w-full text-xs font-mono bg-primary text-black hover:bg-primary/90 font-semibold">
                Start Discussion
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Next Recommended Deep Dives ── */}
      {relatedProjects.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-primary" />
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                Explore More Production Artifacts
              </h3>
            </div>
            <Link
              href="/projects"
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
            >
              <span>View all builds</span>
              <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProjects.slice(0, 2).map((rel) => (
              <Link
                key={rel.id || rel.slug}
                href={`/projects/${rel.slug}`}
                className="group p-5 rounded-2xl bg-[#090D16] border border-white/10 hover:border-primary/40 hover:bg-[#0D1322] transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block mb-2">
                    Related Project
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2 font-display">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed font-sans">
                    {rel.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-gray-400 group-hover:text-primary transition-colors">
                  <span>Read Case Study</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
