'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: ROUTES.HOME,           label: 'Home'          },
  { href: ROUTES.ABOUT,          label: 'About'         },
  { href: ROUTES.PROJECTS,       label: 'Projects'      },
  { href: ROUTES.BLOG,           label: 'Blog'          },
  { href: ROUTES.CERTIFICATIONS, label: 'Certifications'},
  { href: ROUTES.EVENTS,         label: 'Events'        },
  { href: ROUTES.CONTACT,        label: 'Contact'       },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const pathname = usePathname();
  const [isAdmin,        setIsAdmin]        = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);

    // Check admin session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session?.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAdmin(!!session?.user);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href) =>
    href === ROUTES.HOME ? pathname === href : pathname.startsWith(href);

  return (
    <header className="fixed top-3 sm:top-5 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <nav
        className={`pointer-events-auto w-full max-w-5xl rounded-full border transition-all duration-300 ${
          scrolled
            ? 'bg-[#07090E]/90 border-white/15 backdrop-blur-2xl shadow-2xl shadow-black/80 py-2 sm:py-2.5 px-4 sm:px-6'
            : 'bg-[#07090E]/75 border-white/10 backdrop-blur-xl shadow-xl shadow-black/50 py-2.5 sm:py-3 px-4 sm:px-6'
        }`}
      >
        <div className="flex items-center justify-between">

          {/* Brand Logo & Name */}
          <Link href={ROUTES.HOME} className="flex items-center space-x-2.5 group">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20 group-hover:ring-primary/60 transition-all duration-300">
              <Image
                src="/brand-icon.png"
                alt="Ayush Tiwari Logo"
                fill
                sizes="32px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
            <span className="text-base sm:text-lg font-bold font-display tracking-tight text-white group-hover:text-primary transition-colors">
              Ayush Tiwari
            </span>
          </Link>

          {/* Desktop Nav Links with Shared Layout Sliding Pill */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/5 relative">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 select-none ${
                    active
                      ? 'text-white'
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-primary/25 border border-primary/45 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action / Mobile Trigger */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-full hover:bg-red-500/20 transition-colors border border-red-500/20"
              >
                <ShieldAlert size={12} />
                <span>Admin</span>
              </Link>
            )}

            <Link
              href={ROUTES.CONTACT}
              className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold font-mono-code text-white bg-gradient-to-r from-primary to-accent px-4 py-1.5 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight size={13} />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-foreground hover:bg-white/10 active:scale-95 transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Overlay with Spring Transition */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl md:hidden pointer-events-auto"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md mx-auto mt-20 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#0B0F19] border border-white/15 rounded-3xl p-5 shadow-2xl shadow-black/90 space-y-2">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 px-2">
                  <span className="text-xs font-mono-code uppercase tracking-wider text-muted-foreground font-semibold">
                    Navigation
                  </span>
                  <span className="text-xs font-mono-code text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                    Ayush Tiwari
                  </span>
                </div>

                <div className="space-y-1 pt-2">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          active
                            ? 'bg-primary/20 text-white border border-primary/40'
                            : 'text-muted-foreground hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{link.label}</span>
                        {active && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </Link>
                    );
                  })}
                </div>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 mt-3"
                  >
                    <ShieldAlert size={16} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <div className="pt-4 border-t border-white/10 mt-3 flex items-center justify-between px-2 text-xs text-muted-foreground font-mono-code">
                  <span>Jabalpur, IN</span>
                  <span className="text-emerald-400 font-semibold">Available Q1/Q2</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
