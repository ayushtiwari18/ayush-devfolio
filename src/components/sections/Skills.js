'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useReveal, fadeUp } from '@/components/animations/useReveal';

// ---------------------------------------------------------------------------
// Keyframes injected directly — bypasses Tailwind purge/@layer entirely
// Uses -25% translateX because we duplicate 4x (1/4 of total = 1 copy width)
// ---------------------------------------------------------------------------
const MARQUEE_CSS = `
@keyframes marquee-quad {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-25%); }
}
@keyframes marquee-quad-reverse {
  0%   { transform: translateX(-25%); }
  100% { transform: translateX(0); }
}
.marquee-row:hover .marquee-track {
  animation-play-state: paused !important;
}
`;

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------
const FALLBACK = {
  frontend: [
    { name: 'React',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'TypeScript',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'JavaScript',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'HTML/CSS',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'Three.js',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg' },
  ],
  backend: [
    { name: 'Node.js',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Express',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'MongoDB',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Supabase',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
    { name: 'REST APIs',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  ],
  tools: [
    { name: 'Git',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'Docker',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Vercel',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg' },
    { name: 'AWS',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  ],
  other: [
    { name: 'Problem Solving',    emoji: '\u{1F9E9}' },
    { name: 'System Design',      emoji: '\u{1F3D7}\uFE0F' },
    { name: 'Team Collaboration', emoji: '\u{1F91D}' },
    { name: 'Agile / Scrum',      emoji: '\u{1F504}' },
    { name: 'Technical Writing',  emoji: '\u270D\uFE0F' },
    { name: 'UI / UX Design',     emoji: '\u{1F3A8}' },
  ],
};

// ---------------------------------------------------------------------------
// SkillIcon — slug-safe: if src doesn’t start with http, treat as devicon slug
// ---------------------------------------------------------------------------
function resolveIcon(src) {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  const slug = src.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
}

function SkillIcon({ src, name, size = 22 }) {
  const [err, setErr] = useState(false);
  const resolved = resolveIcon(src);
  useEffect(() => setErr(false), [src]);

  if (!resolved || err) {
    return (
      <div
        style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
        className="rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0"
      >
        {name?.[0]?.toUpperCase() ?? '?'}
      </div>
    );
  }

  return (
    <Image
      src={resolved}
      alt={name}
      width={size}
      height={size}
      className="object-contain shrink-0"
      onError={() => setErr(true)}
      unoptimized
    />
  );
}

// ---------------------------------------------------------------------------
// SkillPill
// ---------------------------------------------------------------------------
function SkillPill({ skill }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 mx-2 px-4 py-2.5 bg-card border border-border rounded-full hover:border-primary/60 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10 transition-all duration-200 cursor-default select-none"
      style={{ flexShrink: 0 }}
    >
      {skill.emoji ? (
        <span style={{ fontSize: 18, lineHeight: 1 }} role="img" aria-hidden="true">
          {skill.emoji}
        </span>
      ) : (
        <SkillIcon src={skill.icon} name={skill.name} size={22} />
      )}
      <span className="text-sm font-semibold text-foreground whitespace-nowrap">
        {skill.name}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MarqueeRow
// 4x duplication ensures track is always wider than viewport — no gap/jump
// translateX(-25%) = scroll exactly one copy width seamlessly
// Animation 100% inline — no CSS class dependency
// ---------------------------------------------------------------------------
function MarqueeRow({ skills, direction = 'forward', duration = '30s' }) {
  // 4x duplication: translateX(-25%) scrolls exactly 1 copy, always seamless
  const items = useMemo(
    () => [...skills, ...skills, ...skills, ...skills],
    [skills]
  );

  return (
    <div
      className="marquee-row overflow-hidden py-2"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          width: 'max-content',
          willChange: 'transform',
          animationName: direction === 'forward' ? 'marquee-quad' : 'marquee-quad-reverse',
          animationDuration: duration,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: 'running',
        }}
      >
        {items.map((skill, i) => (
          <SkillPill key={`${skill.name}-${i}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SKILLS SECTION
// ---------------------------------------------------------------------------
export default function Skills() {
  const [dbSkills, setDbSkills] = useState(null);
  const header = useReveal({ threshold: 0.1 });
  const rows   = useReveal({ threshold: 0.05 });

  useEffect(() => {
    fetch('/api/public/skills')
      .then(r => r.ok ? r.json() : [])
      .then(data => setDbSkills(Array.isArray(data) && data.length > 0 ? data : []))
      .catch(() => setDbSkills([]));
  }, []);

  // Memoised so row arrays don’t change reference on unrelated re-renders
  const get = useMemo(() => (catId) => {
    if (!dbSkills) return FALLBACK[catId] || [];
    const group = dbSkills.filter(s => s.category === catId);
    return group.length > 0 ? group : FALLBACK[catId] || [];
  }, [dbSkills]);

  const row1 = useMemo(() => get('frontend'),                     [get]);
  const row2 = useMemo(() => get('backend'),                      [get]);
  const row3 = useMemo(() => [...get('tools'), ...get('other')],  [get]);

  const isLoading = dbSkills === null;

  return (
    <>
      {/* Keyframes injected directly — Tailwind cannot purge or override these */}
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />

      <section id="skills" className="py-section px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header reveal — translateY only on heading, never on marquee rows */}
          <div
            ref={header.ref}
            className="text-center mb-16"
            style={fadeUp(header.visible)}
          >
            <p className="section-label mb-3">Tech Stack</p>
            <h2 className="section-heading mb-4">
              Skills &amp; <span className="gradient-text">Expertise</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Technologies I use to build production-grade systems
            </p>
          </div>
        </div>

        {/* Marquee rows — opacity fade-in only, NO translateY (avoids GPU layer conflict) */}
        <div
          ref={rows.ref}
          className="space-y-3"
          style={{
            opacity:    rows.visible ? 1 : 0,
            transition: 'opacity 0.7s ease',
          }}
        >
          {isLoading ? (
            <div className="space-y-3 px-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3 overflow-hidden">
                  {[...Array(8)].map((_, j) => (
                    <div key={j} className="skeleton rounded-full shrink-0" style={{ width: 130, height: 44 }} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <>
              <MarqueeRow skills={row1} direction="forward" duration="40s" />
              <MarqueeRow skills={row2} direction="reverse" duration="35s" />
              <MarqueeRow skills={row3} direction="forward" duration="45s" />
            </>
          )}
        </div>

        <div
          className="max-w-6xl mx-auto mt-8 text-center"
          style={{ opacity: rows.visible ? 1 : 0, transition: 'opacity 0.7s ease 0.3s' }}
        >
          <p className="text-xs text-muted-foreground">
            Hover any row to pause &nbsp;·&nbsp; Row 1: Frontend &nbsp;·&nbsp; Row 2: Backend &nbsp;·&nbsp; Row 3: Tools &amp; Soft Skills
          </p>
        </div>
      </section>
    </>
  );
}
