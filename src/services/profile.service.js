import { supabase } from '@/lib/supabase';

/**
 * Read hero profile from Supabase.
 * Used by the public home page and admin settings.
 */
export async function getProfileSettings() {
  const { data, error } = await supabase
    .from('profile_settings')
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

/**
 * Update hero profile fields (name, title, description, image_url).
 * Called by the admin settings page via the /api/admin/profile API route.
 * Never called client-side with service key — all writes go through the API route.
 */
export async function updateProfileSettings(fields) {
  const { data, error } = await supabase
    .from('profile_settings')
    .update(fields)
    .eq('id', fields.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
