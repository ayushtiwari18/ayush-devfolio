import { Code, Rocket, Users, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TimelineContainer from '@/components/timeline/TimelineContainer';

// ISR — revalidate this page every 60 seconds.
// This ensures newly uploaded timeline images / new events appear within 1 minute.
export const revalidate = 60;

export const metadata = {
  title: 'About Me - Ayush Tiwari',
  description:
    'Learn more about Ayush Tiwari — Full Stack Developer passionate about creating exceptional digital experiences',
};

export default async function AboutPage() {
  const [projects, certifications, hackathons] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('certifications').select('id', { count: 'exact', head: true }),
    supabase.from('hackathons').select('id', { count: 'exact', head: true }),
  ]);

  const features = [
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and well-documented code following best practices',
    },
    {
      icon: Rocket,
      title: 'Performance',
      description: 'Building high-performance applications optimised for speed and efficiency',
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Designing intuitive interfaces that provide exceptional user experiences',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Implementing agile methodologies for rapid development and iteration',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
            About <span className="gradient-text">Me</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A passionate developer dedicated to crafting exceptional digital experiences
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 text-center card-glow">
              <div className="text-4xl font-bold gradient-text mb-2">{projects.count || 0}+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center card-glow">
              <div className="text-4xl font-bold gradient-text mb-2">3+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center card-glow">
              <div className="text-4xl font-bold gradient-text mb-2">{certifications.count || 0}+</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center card-glow">
              <div className="text-4xl font-bold gradient-text mb-2">{hackathons.count || 0}+</div>
              <div className="text-sm text-muted-foreground">Hackathons</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            My <span className="gradient-text">Story</span>
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              I&apos;m a full-stack developer with a passion for creating elegant solutions to
              complex problems. My journey started with curiosity about how websites work, which
              quickly evolved into a deep passion for building exceptional digital experiences.
            </p>
            <p>
              With expertise in Next.js, React, Node.js, and cloud platforms, I specialise in
              building fast, scalable, and user-friendly applications. I believe in writing clean,
              maintainable code and following best practices to ensure long-term project success.
            </p>
            <p>
              Beyond coding, I actively participate in hackathons, contribute to open-source
              projects, write technical articles, and co-author research published in Springer
              Scopus-indexed journals. I believe in sharing knowledge and helping others grow.
            </p>
          </div>
        </div>
      </section>

      {/* What I Bring */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            What I <span className="gradient-text">Bring</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 card-glow hover-lift transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <TimelineContainer />

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Let&apos;s Work <span className="gradient-text">Together</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            I&apos;m always open to new opportunities and collaborations
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">Get In Touch</Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline">View My Work</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
