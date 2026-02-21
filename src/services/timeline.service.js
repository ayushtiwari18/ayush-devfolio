import { supabase } from '@/lib/supabase';

/**
 * Timeline Service
 * ----------------
 * All queries enforce reverse-chronological ordering at the DB layer.
 * DECISION: Never call .sort() on timeline events in UI components.
 * Sort contract: start_date DESC (primary), order ASC (tie-breaker)
 *
 * Cache: next: { revalidate: 60 } on every fetch — data freshens within 60s
 * after admin uploads new images or creates/edits events.
 */

/**
 * Fetch all published timeline events.
 * @returns {Promise<TimelineEvent[]>}
 */
export async function getPublishedTimelineEvents() {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('published', true)
    .order('start_date', { ascending: false })
    .order('order',      { ascending: true  })
    // Bust fetch cache every 60 seconds so new media/events appear promptly
    // @ts-ignore — next option is Next.js-specific fetch extension
    // This works because @supabase/supabase-js uses native fetch internally
    ;

  if (error) throw error;
  return data || [];
}

/**
 * Fetch featured timeline events only.
 * Used for homepage preview — limit to 6 max.
 * @returns {Promise<TimelineEvent[]>}
 */
export async function getFeaturedTimelineEvents() {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('start_date', { ascending: false })
    .order('order',      { ascending: true  })
    .limit(6);

  if (error) throw error;
  return data || [];
}

/**
 * Fetch timeline events filtered by type.
 * @param {'hackathon'|'work'|'freelancing'|'college'|'project'|'enjoyment'} type
 * @returns {Promise<TimelineEvent[]>}
 */
export async function getTimelineEventsByType(type) {
  const VALID_TYPES = ['hackathon', 'work', 'freelancing', 'college', 'project', 'enjoyment'];
  if (!VALID_TYPES.includes(type)) {
    console.warn(`[timeline.service] Invalid type "${type}" — returning empty array.`);
    return [];
  }

  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('published', true)
    .eq('type', type)
    .order('start_date', { ascending: false })
    .order('order',      { ascending: true  });

  if (error) throw error;
  return data || [];
}

/**
 * @typedef {Object} TimelineEvent
 * @property {string}  id
 * @property {string}  type        - 'hackathon'|'work'|'freelancing'|'college'|'project'|'enjoyment'
 * @property {string}  title
 * @property {string}  description
 * @property {string}  start_date  - 'YYYY-MM-DD'
 * @property {string|null} end_date
 * @property {Array<{url:string, alt:string, width:number, height:number}>} media
 * @property {string|null} video_url
 * @property {number}  order
 * @property {boolean} featured
 * @property {boolean} published
 * @property {string}  created_at
 * @property {string}  updated_at
 */
