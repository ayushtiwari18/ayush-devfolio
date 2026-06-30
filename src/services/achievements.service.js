import { supabase } from '@/lib/supabase';

/**
 * Fetch published achievement stat cards ordered by order_index.
 *
 * Returns [] on any error (never throws) so callers always get an array.
 * Check Vercel function logs if cards keep showing hardcoded fallback values
 * — most likely cause is missing RLS policy on the achievements table.
 *
 * Fix: run this in Supabase SQL Editor:
 *   create policy "public read achievements"
 *   on achievements for select
 *   to anon, authenticated
 *   using (true);
 */
export async function getAchievements() {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('id, label, value, description, icon, order_index')
      .eq('published', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('[getAchievements] Supabase error:', error.message, error.code);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('[getAchievements] Unexpected error:', err?.message);
    return [];
  }
}
