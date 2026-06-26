'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const CATEGORIES = [
  { id: 'frontend', label: 'Frontend'       },
  { id: 'backend',  label: 'Backend'        },
  { id: 'tools',    label: 'Tools & DevOps' },
  { id: 'other',    label: 'Other'          },
];

// Fallback — shown per-category while DB loads or if that category is empty
const FALLBACK = {
  frontend: [
    { name: 'React',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'TypeScript',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'JavaScript',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'HTML/CSS',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
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
  other: [
    { name: 'Problem Solving',    icon: null },
    { name: 'System Design',      icon: null },
    { name: 'Team Collaboration', icon: null },
    { name: 'Agile/Scrum',        icon: null },
    { name: 'Technical Writing',  icon: null },
    { name: 'UI/UX Design',       icon: null },
  ],
};

function SkillIcon({ src, name, size = 40 }) {
  const [err, setErr] = useState(false);
  useEffect(() => setErr(false), [src]);

  if (!src || err) {
    // Letter avatar fallback
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold"
        style={{ width: size, height: size, fontSize: size * 0.42 }}
      >
        {name?.[0]?.toUpperCase() ?? '?'}
      </div>
    );
  }

  return (
    <Image
      src={src} alt={name}
      width={size} height={size}
      className="object-contain"
      onError={() => setErr(true)}
      unoptimized
    />
  );
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const [dbSkills, setDbSkills] = useState(null);

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

  const displayed = getSkills(activeCategory);

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Skills &amp; <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-card border border-border text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Skills Icon Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {displayed.map((skill, index) => (
            <div
              key={skill.id || index}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-3
                         hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10
                         hover:-translate-y-1 transition-all duration-200 group cursor-default"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <SkillIcon src={skill.icon} name={skill.name} size={40} />
              </div>
              <span className="text-xs font-semibold text-foreground text-center leading-tight group-hover:text-primary transition-colors">
                {skill.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
