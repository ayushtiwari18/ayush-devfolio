'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

const navLinks = [
  { href: ROUTES.HOME, label: 'Home' },
  { href: ROUTES.ABOUT, label: 'About' },
  { href: ROUTES.PROJECTS, label: 'Projects' },
  { href: ROUTES.BLOG, label: 'Blog' },
  { href: ROUTES.CERTIFICATIONS, label: 'Certifications' },
  { href: ROUTES.HACKATHONS, label: 'Hackathons' },
  { href: ROUTES.CONTACT, label: 'Contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href) => {
    if (href === ROUTES.HOME) {
      return pathname === href;
    }
    return pathname.startsWith(href);
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
          <Link href={ROUTES.HOME} className="flex items-center space-x-2 group">
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
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Admin Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href={ROUTES.ADMIN}>
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href={ROUTES.ADMIN} onClick={() => setMobileMenuOpen(false)}>
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
