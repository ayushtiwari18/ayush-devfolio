/**
 * TimelineContainer — SERVER COMPONENT
 * --------------------------------------
 * revalidate = 60: ISR belt-and-suspenders on top of about/page.js revalidate.
 * Ensures the timeline section freshens within 60s after admin edits,
 * even if the container is eventually used in other pages.
 */

import { getPublishedTimelineEvents } from '@/services/timeline.service';
import TimelineClient from './TimelineClient';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function TimelineContainer() {
  let events = [];

  try {
    events = await getPublishedTimelineEvents();
  } catch (error) {
    console.warn('[TimelineContainer] Failed to load timeline events:', error?.message);
    events = [];
  }

  if (events.length === 0) {
    return (
      <section className="py-24 px-4" aria-label="Timeline">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">Timeline coming soon.</p>
        </div>
      </section>
    );
  }

  // Assign a rank to each featured event (0-based, newest first)
  // TimelineEvent uses this to limit animate-ping to rank < 3
  let featuredCounter = 0;
  const eventsWithRank = events.map(event => ({
    ...event,
    featuredRank: event.featured ? featuredCounter++ : undefined,
  }));

  return (
    <section className="py-24 px-4" aria-label="Timeline of events">
      {/* Section header */}
      <div className="max-w-5xl mx-auto mb-20 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">
          Chronicles
        </p>
        <h2 className="text-4xl md:text-5xl font-bold gradient-text inline-block">
          My Journey
        </h2>
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <p className="mt-5 text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          A reverse-chronological log of work, learning, and building.
        </p>
      </div>

      <TimelineClient events={eventsWithRank} />
    </section>
  );
}
