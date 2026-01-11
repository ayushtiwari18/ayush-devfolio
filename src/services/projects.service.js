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

export async function incrementProjectViews(slug) {
  const { error } = await supabase.rpc('increment_project_views', {
    project_slug: slug,
  });

  if (error) console.error('Failed to increment views:', error);
}
