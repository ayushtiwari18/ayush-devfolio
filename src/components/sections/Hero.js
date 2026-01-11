'use client';

import { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Twitter, Mail, Download, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero({ profile }) {
  const heroRef = useRef(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  useEffect(() => {
    // Lazy load GSAP for hero animations only
    import('gsap').then(({ default: gsap }) => {
      setGsapLoaded(true);
      
      const ctx = gsap.context(() => {
        // Stagger animation for hero elements
        gsap.from('.hero-animate', {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        });

        // Floating animation for badge
        gsap.to('.floating-badge', {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });

        // Subtle rotation for social icons
        gsap.to('.social-icon', {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'none',
        });
      }, heroRef);

      return () => ctx.revert();
    });
  }, []);

  const socialLinks = [
    { icon: Github, href: profile?.github_url || 'https://github.com/ayushtiwari18', label: 'GitHub' },
    { icon: Linkedin, href: profile?.linkedin_url || 'https://linkedin.com/in/ayush-tiwari', label: 'LinkedIn' },
    { icon: Twitter, href: profile?.twitter_url || 'https://twitter.com/ayushtiwari', label: 'Twitter' },
    { icon: Mail, href: 'mailto:ayush@example.com', label: 'Email' },
  ];

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Available Badge */}
        <div className="floating-badge hero-animate inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-8 backdrop-blur-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          Available for opportunities
        </div>

        {/* Main Heading */}
        <h1 className="hero-animate text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight">
          Hi, I'm{' '}
          <span className="gradient-text inline-block">
            {profile?.name || 'Ayush Tiwari'}
          </span>
        </h1>

        {/* Title */}
        <h2 className="hero-animate text-2xl sm:text-3xl md:text-4xl font-semibold text-muted-foreground mb-6">
          {profile?.title || 'Full Stack Developer'}
        </h2>

        {/* Description */}
        <p className="hero-animate text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          {profile?.description || 'I craft exceptional digital experiences with modern web technologies. Specializing in Next.js, React, and building scalable applications.'}
        </p>

        {/* CTA Buttons */}
        <div className="hero-animate flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link href="/#projects">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-primary/50 hover:shadow-primary/70 transition-all hover:scale-105"
            >
              View My Work
            </Button>
          </Link>
          <Link href="/#contact">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm"
            >
              Get In Touch
            </Button>
          </Link>
          {profile?.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-border hover:border-primary hover:text-primary px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm"
              >
                <Download className="mr-2" size={20} />
                Resume
              </Button>
            </a>
          )}
        </div>

        {/* Social Links */}
        <div className="hero-animate flex items-center justify-center gap-4 mb-16">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon w-12 h-12 flex items-center justify-center bg-card/50 backdrop-blur-sm border border-border rounded-lg hover:border-primary hover:text-primary hover:bg-primary/10 transition-all hover:scale-110 group"
              aria-label={social.label}
            >
              <social.icon size={20} className="group-hover:scale-110 transition-transform" />
            </a>
          ))}
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToAbout}
          className="hero-animate inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
          aria-label="Scroll to about section"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-2">
            <ArrowDown
              size={16}
              className="animate-bounce group-hover:translate-y-1 transition-transform"
            />
          </div>
        </button>
      </div>

      {/* Decorative grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
    </section>
  );
}
