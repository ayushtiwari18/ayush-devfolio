import Link from 'next/link';
import { Mail, Heart } from 'lucide-react';
import { GitHubIcon, LinkedInIcon, TwitterXIcon } from '@/components/icons/BrandIcons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { label: 'Home',     href: '/' },
      { label: 'About',    href: '/#about' },
      { label: 'Skills',   href: '/#skills' },
      { label: 'Projects', href: '/projects' },
      { label: 'Blog',     href: '/blog' },
      { label: 'Contact',  href: '/#contact' },
    ],
    social: [
      { icon: GitHubIcon,    href: 'https://github.com/ayushtiwari18',          label: 'GitHub'   },
      { icon: LinkedInIcon,  href: 'https://www.linkedin.com/in/ayushtiwari18', label: 'LinkedIn' },
      { icon: TwitterXIcon,  href: 'https://twitter.com/ayushtiwari18',         label: 'Twitter'  },
      { icon: Mail,          href: 'mailto:ayushtiwari10201@gmail.com',          label: 'Email'    },
    ],
  };

  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
                AT
              </div>
              <span className="text-xl font-bold gradient-text font-display">Ayush Tiwari</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-sm">
              Full Stack Engineer & Researcher crafting high-performance distributed systems, Next.js applications, and cloud architecture.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono-code text-primary">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Jabalpur, IN · IST (UTC+5:30)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase mb-4">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-lg hover:border-primary hover:text-primary transition-all hover-lift"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">Let’s build something amazing together!</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              © {currentYear} Ayush Tiwari. Engineered with Next.js 14, Tailwind & Supabase.
            </p>
            <div className="flex items-center gap-4 font-mono-code text-xs">
              <a
                href="https://github.com/ayushtiwari18/ayush-devfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <span>View Source</span>
                <span>↗</span>
              </a>
              <span className="text-border">•</span>
              <a
                href="https://github.com/ayushtiwari18"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                @ayushtiwari18
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
