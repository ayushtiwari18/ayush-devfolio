import { getPublishedProjectSlugs } from '@/services/projects.service';
import { supabase } from '@/lib/supabase';

const baseUrl = 'https://ayush-devfolio-nine.vercel.app';

/**
 * M5 FIX: Static ISO dates instead of new Date().
 * Using new Date() marks EVERY page as "updated today" on every build,
 * which Google treats as noise and may demote sitemap trust.
 * Static dates reflect actual last meaningful content change.
 * Update these dates when you do a real content update.
 */
const LAST_UPDATED = {
  home:           '2026-06-21',
  about:          '2026-06-15',
  projects:       '2026-06-21',
  blog:           '2026-06-20',
  certifications: '2026-06-10',
  hackathons:     '2026-06-10',
  contact:        '2026-01-01',
};

async function getPublishedBlogSlugs() {
  try {
    const { data, error } = await supabase.from('blog_posts').select('slug, updated_at').eq('published', true);
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const staticRoutes = [
    { url: baseUrl,                     lastModified: LAST_UPDATED.home,           changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/about`,          lastModified: LAST_UPDATED.about,          changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projects`,       lastModified: LAST_UPDATED.projects,       changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/blog`,           lastModified: LAST_UPDATED.blog,           changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/certifications`, lastModified: LAST_UPDATED.certifications, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/hackathons`,     lastModified: LAST_UPDATED.hackathons,     changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`,        lastModified: LAST_UPDATED.contact,        changeFrequency: 'yearly',  priority: 0.6 },
  ];

  let projectRoutes = [];
  try {
    const slugs = await getPublishedProjectSlugs();
    projectRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: LAST_UPDATED.projects,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch { /* non-critical */ }

  let blogRoutes = [];
  try {
    const posts = await getPublishedBlogSlugs();
    blogRoutes = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updated_at ? p.updated_at.split('T')[0] : LAST_UPDATED.blog,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch { /* non-critical */ }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
