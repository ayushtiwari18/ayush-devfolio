'use client';

import { useState } from 'react';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('frontend');

  const categories = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'tools', label: 'Tools & DevOps' },
    { id: 'other', label: 'Other' },
  ];

  const skills = {
    frontend: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'JavaScript', level: 90 },
      { name: 'HTML/CSS', level: 95 },
    ],
    backend: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'Supabase', level: 85 },
      { name: 'REST APIs', level: 90 },
    ],
    tools: [
      { name: 'Git/GitHub', level: 90 },
      { name: 'VS Code', level: 95 },
      { name: 'Docker', level: 70 },
      { name: 'Vercel', level: 90 },
      { name: 'AWS', level: 65 },
      { name: 'CI/CD', level: 75 },
    ],
    other: [
      { name: 'Problem Solving', level: 90 },
      { name: 'System Design', level: 80 },
      { name: 'Team Collaboration', level: 95 },
      { name: 'Agile/Scrum', level: 85 },
      { name: 'Technical Writing', level: 80 },
      { name: 'UI/UX Design', level: 75 },
    ],
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Skills & <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
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

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills[activeCategory].map((skill, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 card-glow hover-lift transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-foreground">{skill.name}</h4>
                <span className="text-sm font-medium text-primary">{skill.level}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
