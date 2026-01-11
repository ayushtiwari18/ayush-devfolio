import { supabase } from '@/lib/supabase';

export async function getPublishedBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getBlogPostBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) throw error;
  return data;
}

export async function getRecentBlogPosts(limit = 3) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getBlogPostsByTag(tag) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .contains('tags', [tag])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function incrementBlogViews(slug) {
  const { error } = await supabase.rpc('increment_blog_views', {
    blog_slug: slug,
  });

  if (error) console.error('Failed to increment views:', error);
}
