import { Code2, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'About Me',
  description: 'Learn more about my journey, skills, and experience as a full-stack developer.',
};

export default function AboutPage() {
  const skills = {
    frontend: ['React.js', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Three.js', 'HTML5', 'CSS3'],
    backend: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Supabase', 'REST APIs'],
    tools: ['Git', 'GitHub', 'VS Code', 'Figma', 'Postman', 'Vercel', 'Netlify'],
  };

  const experience = [
    {
      title: 'Full Stack Developer',
      company: 'Freelance',
      period: '2024 - Present',
      description: 'Building modern web applications using MERN stack, Next.js, and cloud services.',
    },
    {
      title: 'Web Developer',
      company: 'Personal Projects',
      period: '2023 - 2024',
      description: 'Developed multiple full-stack applications including e-commerce platforms, video conferencing tools, and educational platforms.',
    },
  ];

  const education = [
    {
      degree: 'Bachelor of Technology',
      field: 'Computer Science',
      institution: 'University Name',
      year: '2021 - 2025',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="gradient-text">Me</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            I'm a passionate full-stack developer who loves building modern web applications
            that solve real-world problems. With expertise in React, Next.js, and Node.js,
            I create seamless user experiences and robust backend systems.
          </p>
        </div>

        {/* Skills Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Code2 className="text-primary" size={32} />
            <h2 className="text-3xl font-bold text-foreground">Technical Skills</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend */}
            <div className="p-6 bg-card border border-border rounded-lg card-glow hover-lift">
              <h3 className="text-xl font-bold text-primary mb-4">Frontend</h3>
              <div className="flex flex-wrap gap-2">
                {skills.frontend.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-foreground rounded-full text-sm border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div className="p-6 bg-card border border-border rounded-lg card-glow hover-lift">
              <h3 className="text-xl font-bold text-primary mb-4">Backend</h3>
              <div className="flex flex-wrap gap-2">
                {skills.backend.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-foreground rounded-full text-sm border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="p-6 bg-card border border-border rounded-lg card-glow hover-lift">
              <h3 className="text-xl font-bold text-primary mb-4">Tools & Others</h3>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-foreground rounded-full text-sm border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="text-primary" size={32} />
            <h2 className="text-3xl font-bold text-foreground">Experience</h2>
          </div>

          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="p-6 bg-card border border-border rounded-lg card-glow hover-lift"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <span className="text-muted-foreground mt-2 md:mt-0">{exp.period}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="text-primary" size={32} />
            <h2 className="text-3xl font-bold text-foreground">Education</h2>
          </div>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <div
                key={index}
                className="p-6 bg-card border border-border rounded-lg card-glow hover-lift"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{edu.degree}</h3>
                    <p className="text-primary font-medium">{edu.field}</p>
                    <p className="text-muted-foreground">{edu.institution}</p>
                  </div>
                  <span className="text-muted-foreground mt-2 md:mt-0">{edu.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Award className="text-primary" size={32} />
            <h2 className="text-3xl font-bold text-foreground">Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg card-glow hover-lift">
              <h3 className="text-xl font-bold text-primary mb-2">7+ Projects</h3>
              <p className="text-muted-foreground">Built and deployed full-stack applications</p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-lg card-glow hover-lift">
              <h3 className="text-xl font-bold text-primary mb-2">Hackathons</h3>
              <p className="text-muted-foreground">Participated in multiple national hackathons</p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-lg card-glow hover-lift">
              <h3 className="text-xl font-bold text-primary mb-2">Open Source</h3>
              <p className="text-muted-foreground">Contributing to open-source projects</p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-lg card-glow hover-lift">
              <h3 className="text-xl font-bold text-primary mb-2">Certifications</h3>
              <p className="text-muted-foreground">Industry-recognized certifications</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto text-center p-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">Let's Work Together</h2>
          <p className="text-muted-foreground mb-6">
            I'm always interested in hearing about new projects and opportunities.
          </p>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary/90">
              Get In Touch
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
