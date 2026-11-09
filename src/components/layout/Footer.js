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
    <footer className="bg-[#05070B] border-t border-white/10 mt-24 relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.03] rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary/25">
                AT
              </div>
              <span className="text-xl font-bold text-white font-display">Ayush Tiwari</span>
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed max-w-sm">
              Full Stack Engineer &amp; Researcher crafting high-performance distributed systems, Next.js applications, and cloud architecture.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono-code text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Jabalpur, IN · IST (UTC+5:30)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold font-mono-code text-gray-400 uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-bold font-mono-code text-gray-400 uppercase tracking-wider mb-4">Verified Channels</h3>
            <div className="flex flex-wrap gap-2.5">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[#090D16] border border-white/10 rounded-xl text-gray-400 hover:border-indigo-500/40 hover:text-white transition-all hover:-translate-y-0.5 active:scale-95 shadow-md"
                  aria-label={social.label}
                  title={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-5 font-mono-code">Open for full-stack engineering &amp; cloud systems.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono-code text-gray-400">
            <p className="flex items-center gap-1.5">
              © {currentYear} Ayush Tiwari. Engineered with Next.js 14, Tailwind &amp; Supabase.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ayushtiwari18/ayush-devfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>View Source</span>
                <span>↗</span>
              </a>
              <span className="text-white/20">•</span>
              <a
                href="https://github.com/ayushtiwari18"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
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
