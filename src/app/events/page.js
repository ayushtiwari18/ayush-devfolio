import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { getPublishedEvents } from '@/services/events.service';
import EventsCatalogClient from '@/components/events/EventsCatalogClient';
import EventsLoading from './loading';
import { BASE_URL } from '@/lib/config';

export const revalidate = 60;

export const metadata = {
  title: 'Events & Hackathons — Ayush Tiwari',
  description:
    'Hackathons, competitions, and creative leadership productions by Ayush Tiwari — ' +
    'Full Stack Developer & Systems Engineer from Jabalpur, India.',
  keywords: [
    'Ayush Tiwari hackathons', 'Ayush Tiwari events', 'hackathons India',
    'tech events Jabalpur', 'Pehel 8th edition', 'Smart India Hackathon',
    'coding competitions India', 'Sentinal WAF hackathon',
  ],
  alternates: { canonical: `${BASE_URL}/events` },
  openGraph: {
    title: 'Events & Hackathons — Ayush Tiwari',
    description: 'Hackathons, podium finishes, and creative leadership productions by Ayush Tiwari.',
    url: `${BASE_URL}/events`,
    type: 'website',
    images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events & Hackathons — Ayush Tiwari',
    creator: '@ayushtiwari18',
  },
};

async function EventsList() {
  let events = [];
  try {
    events = await getPublishedEvents();
  } catch (err) {
    console.error('Failed to load events:', err);
  }

  return <EventsCatalogClient events={events} />;
}

export default function EventsPage() {
  return (
    <main className="min-h-screen pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#05070B] text-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Masthead */}
        <div className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles size={12} />
            Archive &amp; Milestones
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Events &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Hackathons</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-light leading-relaxed">
            A curated archive of hackathons, creative leadership productions, and tech competitions across the Indian circuit.
          </p>
        </div>

        {/* Catalog Body */}
        <Suspense fallback={<EventsLoading />}>
          <EventsList />
        </Suspense>
      </div>
    </main>
  );
}
