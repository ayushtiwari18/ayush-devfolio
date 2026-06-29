'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useReveal, fadeUp } from '@/components/animations/useReveal';

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
    { name: 'Problem Solving',    emoji: '🧩' },
    { name: 'System Design',      emoji: '🏗️' },
    { name: 'Team Collaboration', emoji: '🤝' },
    { name: 'Agile / Scrum',      emoji: '🔄' },
    { name: 'Technical Writing',  emoji: '✍️' },
    { name: 'UI / UX Design',     emoji: '🎨' },
  ],
};

// ---------------------------------------------------------------------------
// SkillIcon — error-safe image with letter fallback
// ---------------------------------------------------------------------------
function SkillIcon({ src, name, size = 36 }) {
  const [err, setErr] = useState(false);
  useEffect(() => setErr(false), [src]);

  if (!src || err) {
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
      src={src}
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
// SkillPill — single pill shown in the marquee
// ---------------------------------------------------------------------------
function SkillPill({ skill, isOther }) {
  return (
    <div className="
      inline-flex items-center gap-2.5 mx-2
      px-4 py-2.5
      bg-card border border-border rounded-full
      hover:border-primary/60 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/10
      transition-all duration-200 cursor-default select-none shrink-0
    ">
      {isOther && skill.emoji ? (
        <span style={{ fontSize: 20, lineHeight: 1 }} role="img" aria-hidden="true">
          {skill.emoji}
        </span>
      ) : (
        <SkillIcon src={skill.icon} name={skill.name} size={24} />
      )}
      <span className="text-sm font-semibold text-foreground whitespace-nowrap">
        {skill.name}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MarqueeRow — one infinite scrolling row
// direction: 'forward' (→) or 'reverse' (←)
// speed: CSS duration string e.g. '28s'
// ---------------------------------------------------------------------------
function MarqueeRow({ skills, isOther = false, direction = 'forward', speed = '30s' }) {
  // Duplicate items to create seamless loop
  const items = [...skills, ...skills];

  return (
    <div className="marquee-row marquee-fade overflow-hidden py-2">
      <div
        className={`marquee-track marquee-track--${direction}`}
        style={{ '--marquee-duration': speed }}
      >
        {items.map((skill, i) => (
          <SkillPill key={`${skill.name}-${i}`} skill={skill} isOther={isOther} />
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

  // Build per-category arrays — DB first, fallback if empty
  const get = (catId) => {
    if (!dbSkills) return FALLBACK[catId] || [];
    const group = dbSkills.filter(s => s.category === catId);
    return group.length > 0 ? group : FALLBACK[catId] || [];
  };

  const row1 = get('frontend');           // → right
  const row2 = get('backend');            // ← left
  const row3 = [...get('tools'), ...get('other')]; // → right (tools + soft skills combined)

  // Row speeds — slightly different so they never feel in sync
  const isLoading = dbSkills === null;

  return (
    <section id="skills" className="py-section px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
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

      {/* Marquee rows — full width, outside max-w container for edge-to-edge */}
      <div
        ref={rows.ref}
        className="space-y-3"
        style={{
          opacity:    rows.visible ? 1 : 0,
          transform:  rows.visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        {isLoading ? (
          // Skeleton rows while DB loads
          <div className="space-y-3 px-4">
            {[35, 30, 32].map((w, i) => (
              <div key={i} className="flex gap-3 overflow-hidden">
                {[...Array(w)].map((_, j) => (
                  <div
                    key={j}
                    className="skeleton rounded-full shrink-0"
                    style={{ width: 120, height: 44 }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Row 1 — Frontend → right */}
            <MarqueeRow
              skills={row1}
              isOther={false}
              direction="forward"
              speed="28s"
            />

            {/* Row 2 — Backend ← left */}
            <MarqueeRow
              skills={row2}
              isOther={false}
              direction="reverse"
              speed="24s"
            />

            {/* Row 3 — Tools + Soft Skills → right */}
            <MarqueeRow
              skills={row3}
              isOther={false}
              direction="forward"
              speed="32s"
            />
          </>
        )}
      </div>

      {/* Legend — small note below rows */}
      <div
        className="max-w-6xl mx-auto mt-8 text-center"
        style={{
          opacity:    rows.visible ? 1 : 0,
          transition: 'opacity 0.7s ease 0.3s',
        }}
      >
        <p className="text-xs text-muted-foreground">
          Hover any row to pause &nbsp;·&nbsp; Row 1: Frontend &nbsp;·&nbsp; Row 2: Backend &nbsp;·&nbsp; Row 3: Tools &amp; Soft Skills
        </p>
      </div>
    </section>
  );
}
