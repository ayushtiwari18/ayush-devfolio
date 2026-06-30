import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublishedEvents } from '@/services/events.service';
import EventTimelineCard from '@/components/events/EventTimelineCard';

export const metadata = {
  title: 'Events — Ayush Tiwari',
  description: 'Hackathons, conferences, and tech events — my journey through the Indian tech circuit.',
};

// Group events by year
function groupByYear(events) {
  const map = {};
  events.forEach(e => {
    const year = e.date ? new Date(e.date).getFullYear() : 'Unknown';
    if (!map[year]) map[year] = [];
    map[year].push(e);
  });
  // Sort years descending
  return Object.entries(map).sort((a, b) => b[0] - a[0]);
}

export default async function EventsPage() {
  let events = [];
  try {
    events = await getPublishedEvents();
  } catch (err) {
    console.error('Failed to load events:', err);
  }

  const grouped = groupByYear(events);

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <Link href="/">
          <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="mr-2" size={16} />Back to Home
          </Button>
        </Link>

        {/* Header */}
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
            {events.length > 0 && (
              <span className="ml-2 text-sm text-muted-foreground/60">
                {events.length} event{events.length !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>

        {/* Timeline */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap size={36} className="text-primary/60" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Events Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Stories from hackathons and tech events will be listed here.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

            <div className="space-y-12">
              {grouped.map(([year, yearEvents]) => (
                <div key={year}>
                  {/* Year label */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-4 h-4 rounded-full bg-primary border-2 border-background ring-2 ring-primary/30 shrink-0 z-10" />
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">{year}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Cards for this year */}
                  <div className="ml-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {yearEvents.map(event => (
                      <EventTimelineCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
