import Link from 'next/link';
import { ArrowLeft, Mail, MapPin } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Contact - Ayush Tiwari',
  description: 'Get in touch with me for collaborations and opportunities',
  alternates: { canonical: 'https://ayush-devfolio.vercel.app/contact' },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's connect! I'm always open to discussing new projects, creative ideas, or opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email */}
          <a
            href="mailto:ayushtiwari102003@gmail.com"
            className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
            <p className="text-muted-foreground">ayushtiwari102003@gmail.com</p>
          </a>

          {/* Location */}
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MapPin size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Location</h3>
            <p className="text-muted-foreground">Jabalpur, Madhya Pradesh, India</p>
          </div>

          {/* GitHub */}
          <a
            href="https://github.com/ayushtiwari18"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GitHubIcon size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">GitHub</h3>
            <p className="text-muted-foreground">@ayushtiwari18</p>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/ayushtiwari18"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LinkedInIcon size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">LinkedIn</h3>
            <p className="text-muted-foreground">Ayush Tiwari</p>
          </a>
        </div>

        <div className="text-center p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <h3 className="text-2xl font-bold text-foreground mb-3">Ready to work together?</h3>
          <p className="text-muted-foreground mb-6">I'm available for freelance projects and full-time opportunities</p>
          <a href="mailto:ayushtiwari102003@gmail.com">
            <Button size="lg" className="font-semibold">
              Send me an email
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}
