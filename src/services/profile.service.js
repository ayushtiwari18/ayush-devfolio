import { supabase } from '@/lib/supabase';

export async function getProfileSettings() {
  const { data, error } = await supabase
    .from('profile_settings')
    .select('*')
    .single();

  if (error) throw error;
  return data;
}
