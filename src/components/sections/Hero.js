'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // Lazy load GSAP only for hero animation
    import('gsap').then((gsap) => {
      const timeline = gsap.default.timeline();
      
      timeline
        .from(titleRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out',
        })
        .from(
          subtitleRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        );
    });
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div ref={titleRef}>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            {SITE_CONFIG.name}
          </h1>
        </div>
        <div ref={subtitleRef}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {SITE_CONFIG.title}
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            {SITE_CONFIG.description}
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/projects">View My Work</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/contact">Get In Touch</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-label="Scroll to content"
      >
        <ArrowDown className="text-muted-foreground" size={32} />
      </button>
    </section>
  );
}
