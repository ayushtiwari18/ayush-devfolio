'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown, Github, Linkedin, Twitter, Mail, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero({ profile }) {
  const heroRef = useRef(null);

  useEffect(() => {
    // Simple fade-in animation
    if (heroRef.current) {
      heroRef.current.style.opacity = '0';
      heroRef.current.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        heroRef.current.style.transition = 'all 1s ease';
        heroRef.current.style.opacity = '1';
        heroRef.current.style.transform = 'translateY(0)';
      }, 100);
    }
  }, []);

  const name = profile?.name || 'Ayush Tiwari';
  const title = profile?.title || 'Full Stack Developer';
  const description = profile?.description || 'Building modern web applications with Next.js, React, and cutting-edge technologies.';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 animate-bounce-slow">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-primary">Available for opportunities</span>
        </div>

        {/* Main Content */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6">
          Hi, I'm{' '}
          <span className="gradient-text">{name}</span>
        </h1>
        
        <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-muted-foreground mb-4">
          {title}
        </p>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link href="#projects">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              View My Work
              <ArrowDown className="ml-2" size={20} />
            </Button>
          </Link>
          <Link href="#contact">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Get In Touch
              <Mail className="ml-2" size={20} />
            </Button>
          </Link>
          {profile?.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                <FileDown className="mr-2" size={20} />
                Resume
              </Button>
            </a>
          )}
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4">
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-full hover:border-primary hover:text-primary transition-all hover-lift"
            >
              <Github size={20} />
            </a>
          )}
          {profile?.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-full hover:border-primary hover:text-primary transition-all hover-lift"
            >
              <Linkedin size={20} />
            </a>
          )}
          {profile?.twitter_url && (
            <a
              href={profile.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-full hover:border-primary hover:text-primary transition-all hover-lift"
            >
              <Twitter size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="text-muted-foreground" size={24} />
      </div>
    </section>
  );
}
