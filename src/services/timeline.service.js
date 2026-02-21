import { supabase } from '@/lib/supabase';

/**
 * Timeline Service
 * ----------------
 * All queries enforce reverse-chronological ordering at the DB layer.
 * DECISION: Never call .sort() on timeline events in UI components.
 * Sort contract: start_date DESC (primary), order ASC (tie-breaker)
 */

/**
 * Fetch all published timeline events.
 * Returns events in reverse chronological order (newest first).
 *
 * @returns {Promise<TimelineEvent[]>}
 */
export async function getPublishedTimelineEvents() {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('published', true)
    .order('start_date', { ascending: false })
    .order('order', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch featured timeline events only.
 * Used for homepage preview — limit to 6 max.
 *
 * @returns {Promise<TimelineEvent[]>}
 */
export async function getFeaturedTimelineEvents() {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('start_date', { ascending: false })
    .order('order', { ascending: true })
    .limit(6);

  if (error) throw error;
  return data || [];
}

/**
 * Fetch timeline events filtered by type.
 * Used for filtered views (e.g., "only hackathons").
 *
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
    .order('order', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * TypeDef (for AI agent reference — not enforced at runtime in JS)
 *
 * @typedef {Object} TimelineEvent
 * @property {string}  id          - UUID
 * @property {string}  type        - 'hackathon'|'work'|'freelancing'|'college'|'project'|'enjoyment'
 * @property {string}  title
 * @property {string}  description
 * @property {string}  start_date  - ISO date string 'YYYY-MM-DD'
 * @property {string|null} end_date - ISO date string or null (ongoing)
 * @property {Array<{url:string, alt:string, width:number, height:number}>} media
 * @property {string|null} video_url
 * @property {number}  order       - Admin tie-breaker, default 0
 * @property {boolean} featured
 * @property {boolean} published
 * @property {string}  created_at
 * @property {string}  updated_at
 */
