'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import StaggeredList from '@/components/animations/StaggeredList';
import { useReveal, fadeUp } from '@/components/animations/useReveal';

const CATEGORIES = [
  { id: 'frontend', label: 'Frontend'       },
  { id: 'backend',  label: 'Backend'        },
  { id: 'tools',    label: 'Tools & DevOps' },
  { id: 'other',    label: 'Other'          },
];

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
    { name: 'Git',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg' },
    { name: 'AWS',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
    { name: 'VS Code',icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  ],
  // 'other' — soft skills use emoji icons, not CDN images (avoids broken letter avatars)
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
// SkillIcon — Bug fixed: removed duplicate style prop
// ---------------------------------------------------------------------------
function SkillIcon({ src, name, size = 40 }) {
  const [err, setErr] = useState(false);
  useEffect(() => setErr(false), [src]);

  if (!src || err) {
    return (
      <div
        style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
        className="rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold"
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
      className="object-contain"
      onError={() => setErr(true)}
      unoptimized
    />
  );
}

// Emoji icon for soft-skill 'other' category
function EmojiIcon({ emoji, size = 40 }) {
  return (
    <span
      style={{ fontSize: Math.round(size * 0.7), lineHeight: 1 }}
      role="img"
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}

// ---------------------------------------------------------------------------
// SKILLS SECTION
// ---------------------------------------------------------------------------
export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const [dbSkills, setDbSkills]             = useState(null);
  const header = useReveal({ threshold: 0.1 });

  useEffect(() => {
    fetch('/api/public/skills')
      .then(r => r.ok ? r.json() : [])
      .then(data => setDbSkills(Array.isArray(data) && data.length > 0 ? data : []))
      .catch(() => setDbSkills([]));
  }, []);

  const getSkills = (catId) => {
    if (!dbSkills) return FALLBACK[catId] || [];
    const group = dbSkills.filter(s => s.category === catId);
    return group.length > 0 ? group : FALLBACK[catId] || [];
  };

  const displayed    = getSkills(activeCategory);
  const isOther      = activeCategory === 'other';
  const isLoading    = dbSkills === null;

  return (
    <section id="skills" className="py-section px-4 sm:px-6 lg:px-8">
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
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Category Tabs — with aria-pressed for accessibility */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-12"
          role="tablist"
          aria-label="Skill categories"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                role="tab"
                aria-pressed={isActive}
                aria-selected={isActive}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200
                  ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                    : 'bg-card border border-border text-foreground hover:border-primary/50 hover:text-primary hover:scale-105'
                  }
                `}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        {isLoading ? (
          // Skeleton while DB loads
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton rounded-2xl" style={{ height: 100 }} aria-hidden="true" />
            ))}
          </div>
        ) : (
          <StaggeredList
            key={activeCategory} // re-stagger when category changes
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
            staggerMs={60}
            durationMs={400}
          >
            {displayed.map((skill, index) => (
              <div
                key={skill.id || index}
                className="
                  bg-card border border-border rounded-2xl p-4
                  flex flex-col items-center gap-3 cursor-default
                  hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10
                  hover:-translate-y-1.5 hover:scale-[1.04]
                  transition-all duration-200 group
                "
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  {isOther && skill.emoji ? (
                    <EmojiIcon emoji={skill.emoji} size={40} />
                  ) : (
                    <SkillIcon src={skill.icon} name={skill.name} size={40} />
                  )}
                </div>
                <span className="text-xs font-semibold text-foreground text-center leading-tight group-hover:text-primary transition-colors">
                  {skill.name}
                </span>
              </div>
            ))}
          </StaggeredList>
        )}

      </div>
    </section>
  );
}
