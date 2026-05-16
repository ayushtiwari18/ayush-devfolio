import { getPublishedProjectSlugs } from '@/services/projects.service';
import { supabase } from '@/lib/supabase';

const baseUrl = 'https://ayush-devfolio.vercel.app';

/**
 * Fetch all published blog slugs for sitemap generation.
 * Kept inline here to avoid a circular service import.
 */
async function getPublishedBlogSlugs() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('published', true);
    if (error) return [];
    return (data || []).map((p) => p.slug);
  } catch {
    return [];
  }
}

export default async function sitemap() {
  // ── Static routes ───────────────────────────────────────
  const staticRoutes = [
    { url: baseUrl,                         lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/about`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projects`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/blog`,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/certifications`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/hackathons`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`,            lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ];

  // ── Dynamic project slugs ─────────────────────────────
  let projectRoutes = [];
  try {
    const slugs = await getPublishedProjectSlugs();
    projectRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch {
    // Non-critical — sitemap degrades gracefully
  }

  // ── Dynamic blog slugs ───────────────────────────────
  let blogRoutes = [];
  try {
    const slugs = await getPublishedBlogSlugs();
    blogRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    // Non-critical — sitemap degrades gracefully
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
