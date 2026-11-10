import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPublishedEvents } from '@/services/events.service';
import EventsTimelineClient from '@/components/events/EventsTimelineClient';
import EventsLoading from './loading';
import { BASE_URL } from '@/lib/config';

export const revalidate = 60;

export const metadata = {
  title: 'Events & Hackathons — Ayush Tiwari',
  description:
    'Chronological log of hackathons, technical competitions, and creative leadership milestones across the Indian tech circuit by Ayush Tiwari.',
  keywords: [
    'Ayush Tiwari hackathons', 'Ayush Tiwari events', 'hackathons India',
    'tech events Jabalpur', 'Pehel 8th edition', 'Smart India Hackathon',
    'coding competitions India', 'Sentinal WAF hackathon',
  ],
  alternates: { canonical: `${BASE_URL}/events` },
  openGraph: {
    title: 'Events & Hackathons — Ayush Tiwari',
    description: 'Chronological log of hackathons and technical achievements by Ayush Tiwari.',
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

  const eventCount = events.length;

  return (
    <>
      {/* Editorial Masthead with Exact Portfolio Branding */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-gray-400 mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>AYUSH TIWARI // CHRONICLES &amp; TECH JOURNEY</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] leading-tight mb-4">
          Events &amp; <span className="text-primary inline-block">Hackathons</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          A chronological log of hackathons, technical competitions, and creative leadership milestones across the Indian tech circuit.
        </p>

        {eventCount > 0 && (
          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{eventCount} {eventCount === 1 ? 'MILESTONE' : 'MILESTONES'} INDEXED</span>
          </div>
        )}
      </div>

      <EventsTimelineClient events={events} />
    </>
  );
}

export default function EventsPage() {
  return (
    <main className="min-h-screen pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#05070B] text-slate-200 relative overflow-hidden selection:bg-primary/20 selection:text-white">
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/[0.03] rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Timeline Body */}
        <Suspense fallback={<EventsLoading />}>
          <EventsList />
        </Suspense>
      </div>
    </main>
  );
}
