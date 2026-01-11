import { Code, Rocket, Users, Zap, Award, Trophy, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'About Me - Ayush Tiwari',
  description: 'Learn more about Ayush Tiwari - Full Stack Developer passionate about creating exceptional digital experiences',
};

export default async function AboutPage() {
  // Fetch stats
  const [projects, blogPosts, certifications, hackathons] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
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
      description: 'Building high-performance applications optimized for speed and efficiency',
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

  const journey = [
    {
      year: '2024',
      title: 'Senior Full Stack Developer',
      description: 'Leading development of enterprise-scale applications',
    },
    {
      year: '2023',
      title: 'Full Stack Developer',
      description: 'Built multiple production applications using modern tech stack',
    },
    {
      year: '2022',
      title: 'Started Web Development',
      description: 'Began journey into web development and software engineering',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
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

      {/* Stats Section */}
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

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            My <span className="gradient-text">Story</span>
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              I'm a full-stack developer with a passion for creating elegant solutions to complex problems. 
              My journey in software development started with curiosity about how websites work, which quickly 
              evolved into a deep passion for building exceptional digital experiences.
            </p>
            <p>
              With expertise in modern web technologies like Next.js, React, and Node.js, I specialize in 
              building fast, scalable, and user-friendly applications. I believe in writing clean, maintainable 
              code and following best practices to ensure long-term success of every project.
            </p>
            <p>
              Beyond coding, I'm an active contributor to the developer community. I write technical articles, 
              participate in hackathons, and continuously learn new technologies to stay at the forefront of 
              web development.
            </p>
            <p>
              When I'm not coding, you'll find me exploring new technologies, contributing to open-source 
              projects, or mentoring aspiring developers. I believe in sharing knowledge and helping others 
              grow in their development journey.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Journey Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            My <span className="gradient-text">Journey</span>
          </h2>
          <div className="space-y-8">
            {journey.map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {item.year.slice(-2)}
                  </div>
                  {index !== journey.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-primary mb-2">{item.year}</p>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Let's Work <span className="gradient-text">Together</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            I'm always open to new opportunities and collaborations
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get In Touch
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline">
                View My Work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
