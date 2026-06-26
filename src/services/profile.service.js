import { supabase } from '@/lib/supabase';

/**
 * Read hero profile from profile_settings.
 * Real columns: id, name, title, description, image_url,
 *   resume_url, github_url, linkedin_url, twitter_url, form_endpoint
 */
export async function getProfileSettings() {
  const { data, error } = await supabase
    .from('profile_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}
