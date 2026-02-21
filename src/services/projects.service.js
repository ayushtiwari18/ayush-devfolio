import { supabase } from '@/lib/supabase';

export async function getPublishedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getFeaturedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) throw error;
  return data || [];
}

export async function getProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) throw error;
  return data;
}

// NOTE: increment_project_views RPC does not exist in DB yet.
// Silently skip — add the SQL function when needed.
export async function incrementProjectViews(slug) {
  try {
    await supabase.rpc('increment_project_views', { project_slug: slug });
  } catch {
    // Non-critical — views tracking is a future feature
  }
}
