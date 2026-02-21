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

// NOTE: increment_blog_views RPC does not exist in DB yet.
// Silently skip — add the SQL function when needed.
export async function incrementBlogPostViews(slug) {
  try {
    await supabase.rpc('increment_blog_views', { blog_slug: slug });
  } catch {
    // Non-critical — views tracking is a future feature
  }
}
