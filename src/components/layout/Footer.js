import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/#about' },
      { label: 'Skills', href: '/#skills' },
      { label: 'Projects', href: '/projects' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/#contact' },
    ],
    social: [
      { icon: Github, href: 'https://github.com/ayushtiwari18', label: 'GitHub' },
      { icon: Linkedin, href: 'https://linkedin.com/in/ayush-tiwari', label: 'LinkedIn' },
      { icon: Twitter, href: 'https://twitter.com/ayushtiwari', label: 'Twitter' },
      { icon: Mail, href: 'mailto:ayush@example.com', label: 'Email' },
    ],
  };

  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white">
                AT
              </div>
              <span className="text-xl font-bold gradient-text">Ayush Tiwari</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Full Stack Developer passionate about creating exceptional digital experiences.
            </p>
            <Link
              href="/admin/dashboard"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              Admin Panel →
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
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
            <p className="text-xs text-muted-foreground mt-4">
              Let's build something amazing together!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              © {currentYear} Ayush Tiwari. Built with
              <Heart size={14} className="text-red-500 fill-red-500" />
              using Next.js
            </p>
            <div className="flex items-center gap-4">
              <Link href="/admin/login" className="hover:text-primary transition-colors">
                Admin Login
              </Link>
              <span className="text-border">•</span>
              <a
                href="https://github.com/ayushtiwari18/ayush-devfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Source Code
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
