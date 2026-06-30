import { supabase } from '@/lib/supabase';

/**
 * Fetch all published events ordered by date descending.
 */
export async function getPublishedEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch a single event by slug.
 */
export async function getEventBySlug(slug) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch all published events of a specific type.
 * @param {'hackathon'|'conference'|'workshop'|'fest'|'competition'|'other'} type
 */
export async function getEventsByType(type) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .eq('type', type)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch all event slugs — used for generateStaticParams in /events/[slug].
 */
export async function getAllEventSlugs() {
  const { data, error } = await supabase
    .from('events')
    .select('slug')
    .eq('published', true);

  if (error) throw error;
  return (data || []).map(e => e.slug);
}

// ── Admin ──────────────────────────────────────────────────────────

export async function getAllEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getEventById(id) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createEvent(payload) {
  const { data, error } = await supabase
    .from('events')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(id, payload) {
  const { data, error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function toggleEventPublished(id, published) {
  return updateEvent(id, { published });
}
