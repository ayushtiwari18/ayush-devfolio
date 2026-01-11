'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Briefcase, BookOpen, Award, Trophy, Mail, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/#about', label: 'About', icon: null },
    { href: '/#skills', label: 'Skills', icon: null },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/#contact', label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      // Smooth scroll to section
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
              AT
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">Ayush Tiwari</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('/#')) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Admin Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Settings size={16} className="mr-2" />
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('/#')) {
                    e.preventDefault();
                  }
                  handleNavClick(link.href);
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                {link.icon && <link.icon size={20} />}
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white mt-4"
              >
                <Settings size={16} className="mr-2" />
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
