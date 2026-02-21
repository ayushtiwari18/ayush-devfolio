/**
 * TimelineContainer — SERVER COMPONENT
 * --------------------------------------
 * Responsibilities:
 * 1. Fetch pre-sorted events from Supabase (reverse chronological, DB layer)
 * 2. Pass static event array to TimelineClient (Client boundary)
 * 3. Render SEO-safe static HTML shell (no JS required for initial content)
 *
 * DECISION: This component must remain a Server Component.
 * Do NOT add 'use client' here. Animations live in TimelineClient.
 */
import { getPublishedTimelineEvents } from '@/services/timeline.service';
import TimelineClient from './TimelineClient';

export default async function TimelineContainer() {
  let events = [];

  try {
    events = await getPublishedTimelineEvents();
  } catch (error) {
    // Non-critical: timeline failing should not break the page
    console.warn('[TimelineContainer] Failed to load timeline events:', error?.message);
    events = [];
  }

  if (events.length === 0) {
    return (
      <section className="py-20 px-4" aria-label="Timeline">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">Timeline coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-20 px-4"
      aria-label="Timeline of events"
    >
      {/* SEO: Static heading — rendered on server, indexed by crawlers */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          My Journey
        </h2>
        <p className="mt-3 text-muted-foreground text-base md:text-lg">
          A reverse-chronological log of work, learning, and building.
        </p>
      </div>

      {/*
        Pass pre-sorted events to Client boundary.
        events array is ALREADY sorted: start_date DESC, order ASC.
        TimelineClient must NOT re-sort this array.
      */}
      <TimelineClient events={events} />
    </section>
  );
}
