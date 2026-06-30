import { supabase } from '@/lib/supabase';

/**
 * Fetch published achievement stat cards ordered by order_index.
 * Used by the home page to populate the About section stat strip.
 */
export async function getAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('id, label, value, description, icon, order_index')
    .eq('published', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}
