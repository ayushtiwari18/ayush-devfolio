import { supabase } from '@/lib/supabase';

// ── Listing ────────────────────────────────────────────────

export async function getPublishedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true, nullsFirst: false })
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
    .order('order_index', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) throw error;
  return data || [];
}

// ── Detail ─────────────────────────────────────────────────

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

// ── Slug list for generateStaticParams ────────────────────

export async function getPublishedProjectSlugs() {
  const { data, error } = await supabase
    .from('projects')
    .select('slug')
    .eq('published', true);

  if (error) throw error;
  return (data || []).map((p) => p.slug);
}

// ── Related content ────────────────────────────────────────

export async function getRelatedProjects(tags = [], currentSlug) {
  if (!tags || tags.length === 0) return [];
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, slug, description, cover_image, technologies, tags')
      .eq('published', true)
      .neq('slug', currentSlug)
      .overlaps('tags', tags)
      .order('order_index', { ascending: true, nullsFirst: false })
      .limit(3);
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getRelatedBlogs(slugs = []) {
  if (!slugs || slugs.length === 0) return [];
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, cover_image, tags, created_at, reading_time')
      .eq('published', true)
      .in('slug', slugs)
      .limit(3);
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

// ── Views (future) ─────────────────────────────────────────
export async function incrementProjectViews(slug) {
  try {
    await supabase.rpc('increment_project_views', { project_slug: slug });
  } catch {
    // Non-critical
  }
}
