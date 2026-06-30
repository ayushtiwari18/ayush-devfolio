import Link from 'next/link';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';
import ContactForm from '@/components/contact/ContactForm';
import { BASE_URL } from '@/app/layout';

export const metadata = {
  title: 'Contact — Ayush Tiwari | Hire Full Stack Developer India',
  description:
    'Contact Ayush Tiwari — Full Stack Developer from Jabalpur, Madhya Pradesh, India. ' +
    'Available for freelance projects, full-time roles, and collaborations. ' +
    'MERN Stack, Next.js, AWS expert.',
  keywords: [
    'hire Ayush Tiwari', 'contact Ayush Tiwari', 'Full Stack Developer India hire',
    'freelance developer Jabalpur', 'hire MERN developer India',
    'Next.js developer for hire', 'web developer contact India',
  ],
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title:       'Contact — Ayush Tiwari | Hire Full Stack Developer India',
    description: 'Hire Ayush Tiwari — Full Stack Developer, Jabalpur India. Available for projects and roles.',
    url:          `${BASE_URL}/contact`,
    type:        'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card:    'summary_large_image',
    title:   'Contact — Ayush Tiwari',
    creator: '@ayushtiwari18',
  },
};

const INFO_CARDS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'ayushtiwari102003@gmail.com',
    href: 'mailto:ayushtiwari102003@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Jabalpur, Madhya Pradesh, India',
    href: null,
  },
  {
    icon: Github,
    label: 'GitHub',
    value: '@ayushtiwari18',
    href: 'https://github.com/ayushtiwari18',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Ayush Tiwari',
    href: 'https://www.linkedin.com/in/tiwariaayush',
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Let&apos;s <span className="text-primary">Work Together</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have a project in mind or just want to say hi? Fill out the form and I&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <aside className="lg:col-span-2 space-y-4">
            {INFO_CARDS.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm text-foreground font-medium">{value}</p>
                  </div>
                </>
              );
              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  {inner}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                  {inner}
                </div>
              );
            })}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <p className="text-sm text-emerald-400 font-medium">Available for new opportunities</p>
            </div>
          </aside>
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
