import { supabase } from '@/lib/supabase';

export async function getPublishedHackathons() {
  const { data, error } = await supabase
    .from('hackathons')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}
