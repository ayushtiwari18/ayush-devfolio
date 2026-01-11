import { Code, Rocket, Users, Zap } from 'lucide-react';

export default function About({ profile }) {
  const features = [
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and well-documented code',
    },
    {
      icon: Rocket,
      title: 'Performance',
      description: 'Optimized applications with excellent Core Web Vitals',
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Designing intuitive interfaces with great UX',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Agile development with rapid iteration cycles',
    },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate developer crafting exceptional digital experiences
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Text Content */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Building the Future, One Line at a Time
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I'm a full-stack developer with a passion for creating elegant solutions to complex problems. 
                With expertise in modern web technologies, I specialize in building fast, scalable, and 
                user-friendly applications.
              </p>
              <p>
                My journey in software development started with curiosity and has evolved into a commitment 
                to excellence. I believe in continuous learning, clean code, and making a positive impact 
                through technology.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source 
                projects, or sharing knowledge with the developer community.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 card-glow text-center">
              <div className="text-4xl font-bold gradient-text mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 card-glow text-center">
              <div className="text-4xl font-bold gradient-text mb-2">3+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 card-glow text-center">
              <div className="text-4xl font-bold gradient-text mb-2">20+</div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 card-glow text-center">
              <div className="text-4xl font-bold gradient-text mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Certifications</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
}
