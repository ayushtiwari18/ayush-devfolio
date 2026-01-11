import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Contact from '@/components/sections/Contact';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Contact - Ayush Tiwari',
  description: 'Get in touch with Ayush Tiwari for collaborations, opportunities, or just to say hello',
};

export default async function ContactPage() {
  const { data: profile } = await supabase
    .from('profile_settings')
    .select('*')
    .single();

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" className="mb-8">
            ← Back to Home
          </Button>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a
                      href="mailto:ayush@example.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      ayush@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Location</h3>
                    <p className="text-muted-foreground">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Connect With Me</h2>
              <div className="grid grid-cols-2 gap-4">
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="text-foreground group-hover:text-primary transition-colors">
                      GitHub
                    </div>
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="text-foreground group-hover:text-primary transition-colors">
                      LinkedIn
                    </div>
                  </a>
                )}
                {profile?.twitter_url && (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                  >
                    <div className="text-foreground group-hover:text-primary transition-colors">
                      Twitter
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Quick Links</h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/projects">
                  <Button variant="outline">View Projects</Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline">Read Blog</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline">About Me</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Contact />
          </div>
        </div>
      </div>
    </main>
  );
}
