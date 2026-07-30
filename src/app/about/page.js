import { supabase } from '@/lib/supabase';
import { getAchievements } from '@/services/achievements.service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import TimelineContainer from '@/components/timeline/TimelineContainer';
import {
  MapPin, Mail, Download, ArrowRight,
  Shield, FlaskConical, Globe, GitBranch,
  Github, Code2, Rocket, BookOpen, Cloud, Trophy,
} from 'lucide-react';
import { ACHIEVEMENTS } from '@/lib/constants';
import { BASE_URL } from '@/lib/config';
import PeelCard from '@/components/ui/PeelCard';

export const revalidate = 60;

export const metadata = {
  title: 'About — Ayush Tiwari | Full Stack Developer',
  description:
    'Ayush Tiwari — Full Stack Developer, Springer-published researcher, AWS certified. ' +
    'B.Tech CSE, Gyan Ganga Institute of Technology and Sciences. ' +
    '5,600+ GitHub commits, 885+ DSA problems, MERN · Next.js · AWS.',
  alternates: { canonical: `${BASE_URL}/about` },
};

const ICON_MAP = {
  github:      Github,
  code:        Code2,
  rocket:      Rocket,
  'book-open': BookOpen,
  cloud:       Cloud,
  trophy:      Trophy,
};

const VALUES = [
  {
    icon:  Shield,
    title: 'Security-Aware',
    desc:  'WAF, IDS, OWASP Top 10 applied in production. Research published in Springer on network security.',
  },
  {
    icon:  FlaskConical,
    title: 'Research-Driven',
    desc:  'Springer-indexed publication. Applies academic rigour to real engineering decisions.',
  },
  {
    icon:  Globe,
    title: 'Systems Thinker',
    desc:  'Full-stack ownership — MERN, Next.js, Docker, AWS. Designs for scale from day one.',
  },
  {
    icon:  GitBranch,
    title: 'Open Source First',
    desc:  '5,600+ GitHub commits. Active contributor and maintainer across public repositories.',
  },
];

const FALLBACK_BIO =
  'Started with competitive programming and never stopped — 885+ DSA problems solved across ' +
  'LeetCode (rating 1657), CodeChef, and Codeforces. Completed B.Tech CSE at Gyan Ganga ' +
  'Institute of Technology and Sciences (2021–2025), where research on network security led to ' +
  'a Springer-indexed publication. Today I build production-grade MERN and Next.js systems with ' +
  '5,600+ GitHub commits, hold two AWS certifications, and ship fast.';

export default async function AboutPage() {
  const [profile, dbAchievements] = await Promise.all([
    supabase
      .from('profile_settings')
      .select('name,title,description,resume_url,about_bio,about_availability,about_location,about_email,about_highlights')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => data || {})
      .catch(() => ({})),
    getAchievements().catch(() => []),
  ]);

  const achievements = dbAchievements.length > 0 ? dbAchievements : ACHIEVEMENTS;

  const bio          = profile.about_bio          || FALLBACK_BIO;
  const availability = profile.about_availability || 'Open to opportunities';
  const location     = profile.about_location     || 'Jabalpur, Madhya Pradesh, India';
  const email        = profile.about_email        || 'ayushtiwari.dev@gmail.com';
  const resumeUrl    = profile.resume_url          || null;
  const highlights   = Array.isArray(profile.about_highlights) && profile.about_highlights.length > 0
    ? profile.about_highlights : null;

  return (
    <main id="main-content" className="min-h-screen">

      {/* HERO */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-center gap-2 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs font-medium text-green-500 tracking-wide">{availability}</span>
          </div>

          <p className="section-label mb-3">About Me</p>
          <h1 className="section-heading mb-6">
            Building systems that{' '}
            <span className="gradient-text">actually ship</span>
          </h1>

          {/* Full bio — no clamp on dedicated about page */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">
            {bio}
          </p>

          {/* All pills shown, each truncated at 260px with tooltip */}
          {highlights && (
            <div className="flex flex-wrap gap-2 mb-6">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  title={h}
                  className="max-w-[260px] truncate px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-5 mb-8">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary shrink-0" />{location}
            </span>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={14} className="text-primary shrink-0" />{email}
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                  <Download size={18} />Download Resume
                </Button>
              </a>
            )}
            <Link href="/#contact">
              <Button size="lg" variant="outline" className="gap-2">
                Get In Touch <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STAT STRIP — from DB */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-center mb-10">By the Numbers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((a) => {
              const Icon = ICON_MAP[a.icon] || Rocket;
              const front = (
                <div className="p-6 flex flex-col justify-between h-full gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-foreground leading-none mb-1.5">{a.value}</p>
                    <p className="text-base font-bold text-foreground mb-1">{a.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{a.description}</p>
                  </div>
                </div>
              );

              const back = (
                <div className="flex flex-col justify-between h-full text-xs space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Verified Metric</span>
                    <p className="font-bold text-foreground text-base mt-0.5">{a.label}</p>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{a.description}</p>
                  </div>

                  <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                    <p className="font-semibold text-primary text-xs">Proof Highlights</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {a.icon === 'github' && '5,600+ public commits across open source repositories.'}
                      {a.icon === 'code' && 'LeetCode Rating 1657 · 885+ DSA problems solved.'}
                      {a.icon === 'rocket' && '10+ production web applications built & deployed.'}
                      {a.icon === 'book-open' && 'Springer-indexed paper on network security.'}
                      {a.icon === 'cloud' && 'AWS Certified Cloud Practitioner & Solutions Architect.'}
                      {a.icon === 'trophy' && 'Multiple hackathon prizes & technical event awards.'}
                      {!['github','code','rocket','book-open','cloud','trophy'].includes(a.icon) && 'Verified production proof of work milestone.'}
                    </p>
                  </div>
                </div>
              );

              return (
                <PeelCard
                  key={a.id || a.label}
                  front={front}
                  back={back}
                  className="min-h-[220px]"
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* VALUE CARDS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-center mb-3">What I Bring</p>
          <h2 className="section-heading text-center mb-12">
            How I <span className="gradient-text">think &amp; work</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-1.5">{v.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <TimelineContainer />

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-heading mb-4">
            Let&apos;s Work <span className="gradient-text">Together</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            I&apos;m always open to new opportunities and collaborations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                Get In Touch <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline">View My Work</Button>
            </Link>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2">
                  <Download size={18} />Resume
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
