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

  return (
    <section
      className="py-24 px-4"
      aria-label="Timeline of events"
    >
      {/* Section header — server rendered, SEO indexed */}
      <div className="max-w-5xl mx-auto mb-20 text-center">
        {/* Eyebrow label */}
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4">
          Chronicles
        </p>

        {/* Main heading with gradient */}
        <h2 className="text-4xl md:text-5xl font-bold gradient-text inline-block">
          My Journey
        </h2>

        {/* Decorative divider */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
        </div>

        <p className="mt-5 text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          A reverse-chronological log of work, learning, and building.
        </p>
      </div>

      <TimelineClient events={events} />
    </section>
  );
}
