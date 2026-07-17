import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublishedEvents } from '@/services/events.service';
import EventTimelineCard from '@/components/events/EventTimelineCard';
import EventsLoading from './loading';
import { BASE_URL } from '@/app/layout';

// Always fetch fresh from Supabase on every request
export const revalidate = 60;

export const metadata = {
  title: 'Events & Hackathons - Ayush Tiwari',
  description:
    'Hackathons, conferences, and tech events attended by Ayush Tiwari - ' +
    'Full Stack Developer from Jabalpur, India. My journey through the Indian tech circuit.',
  keywords: [
    'Ayush Tiwari hackathon', 'Ayush Tiwari events', 'hackathons India',
    'tech events Jabalpur', 'developer events Madhya Pradesh',
    'coding competitions India', 'Ayush Tiwari developer',
  ],
  alternates: { canonical: `${BASE_URL}/events` },
  openGraph: {
    title:       'Events & Hackathons - Ayush Tiwari',
    description: 'Hackathons and tech events by Ayush Tiwari, Full Stack Developer, Jabalpur India.',
    url:          `${BASE_URL}/events`,
    type:        'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card:    'summary_large_image',
    title:   'Events & Hackathons - Ayush Tiwari',
    creator: '@ayushtiwari18',
  },
};

function groupByYear(events) {
  const map = {};
  events.forEach(e => {
    const year = e.date ? new Date(e.date).getFullYear() : 'Unknown';
    if (!map[year]) map[year] = [];
    map[year].push(e);
  });
  return Object.entries(map).sort((a, b) => b[0] - a[0]);
}

async function EventsList() {
  let events = [];
  try {
    events = await getPublishedEvents();
  } catch (err) {
    console.error('Failed to load events:', err);
  }

  const grouped = groupByYear(events);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Zap size={36} className="text-primary/60" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Events Coming Soon</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Stories from hackathons and tech events will be listed here.
        </p>
      </div>
    );
  }

  const totalEvents = events.length;
  const totalWins = events.filter(e => e.result && (e.result.toLowerCase().includes('win') || e.result.toLowerCase().includes('1st'))).length;
  const totalHackathons = events.filter(e => e.type === 'hackathon').length;
  const uniqueCities = new Set(events.map(e => e.location?.split(',')[0].trim()).filter(Boolean)).size || 1;

  let cardIndex = 0;
  return (
    <>
      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-3xl font-black text-foreground mb-1">{totalEvents}</span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Events</span>
        </div>
        <div className="bg-card border border-yellow-500/20 rounded-2xl p-5 flex flex-col items-center text-center justify-center relative overflow-hidden group shadow-[0_0_15px_-3px_rgba(234,179,8,0.1)]">
          <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-3xl font-black text-yellow-500 mb-1">{totalWins}</span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Podium Wins</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-3xl font-black text-foreground mb-1">{totalHackathons}</span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Hackathons</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-3xl font-black text-foreground mb-1">{uniqueCities}</span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Cities Visited</span>
        </div>
      </div>

      <div className="relative">
        {/* Responsive Center/Left Line */}
        <div className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />
        
        <div className="space-y-16">
          {grouped.map(([year, yearEvents]) => (
            <div key={year} className="relative z-10">
              
              {/* Year Badge */}
              <div className="flex items-center md:justify-center gap-4 mb-10 ml-0 md:ml-0">
                <div className="hidden md:flex flex-1 h-px bg-border" />
                <div className="bg-background px-4 py-1.5 rounded-full border border-primary/30 shadow-[0_0_15px_-3px_rgba(var(--primary),0.2)] ml-8 md:ml-0">
                  <span className="text-sm font-black text-primary tracking-widest">{year}</span>
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Alternating Timeline Cards */}
              <div className="space-y-24 mt-8">
                {yearEvents.map(event => {
                  const idx = cardIndex++;
                  const isLeft = idx % 2 === 0;
                  return (
                    <div key={event.id} className="relative w-full flex items-center">
                      {/* Timeline Node */}
                      <div className="absolute left-[9px] md:left-1/2 md:-translate-x-1/2 top-[30px] md:top-1/2 md:-translate-y-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background border border-primary/50 z-20 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />

                      {/* Full Width Split Card Container */}
                      <div className="w-full pl-10 md:pl-0">
                        <EventTimelineCard event={event} index={idx} isLeft={isLeft} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function EventsPage() {
  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="mr-2" size={16} />Back to Home
          </Button>
        </Link>
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <Zap size={17} className="text-primary" />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">My Journey</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 leading-tight">
            Events &amp; <span className="gradient-text">Hackathons</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Every hackathon, conference, and tech event that shaped how I build.
          </p>
        </div>
        <Suspense fallback={<EventsLoading />}>
          <EventsList />
        </Suspense>
      </div>
    </main>
  );
}
