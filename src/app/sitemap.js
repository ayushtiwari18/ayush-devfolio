import { BASE_URL } from '@/lib/config';
import { getPublishedProjects } from '@/services/projects.service';
import { getPublishedBlogPosts } from '@/services/blog.service';
import { getPublishedEvents } from '@/services/events.service';

/**
 * Next.js App Router sitemap — Dynamic Generation
 * Fetches all active slugs from Supabase to ensure Google indexes everything.
 */
export default async function sitemap() {
  const TODAY = new Date().toISOString().split('T')[0];

  // 1. Core static routes
  const routes = [
    { url: BASE_URL,                     lastModified: TODAY, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/about`,          lastModified: TODAY, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/projects`,       lastModified: TODAY, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/blog`,           lastModified: TODAY, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/certifications`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/events`,         lastModified: TODAY, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/hackathons`,     lastModified: TODAY, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`,        lastModified: TODAY, changeFrequency: 'yearly',  priority: 0.5 },
  ];

  try {
    // 2. Fetch all dynamic content in parallel
    const [projects, blogs, events] = await Promise.all([
      getPublishedProjects().catch(() => []),
      getPublishedBlogPosts().catch(() => []),
      getPublishedEvents().catch(() => [])
    ]);

    // 3. Append Dynamic Projects
    projects.forEach((item) => {
      if (item.slug) {
        routes.push({
          url: `${BASE_URL}/projects/${item.slug}`,
          lastModified: item.updated_at ? item.updated_at.split('T')[0] : TODAY,
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    });

    // 4. Append Dynamic Blogs
    blogs.forEach((item) => {
      if (item.slug) {
        routes.push({
          url: `${BASE_URL}/blog/${item.slug}`,
          lastModified: item.updated_at ? item.updated_at.split('T')[0] : TODAY,
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    });

    // 5. Append Dynamic Events
    events.forEach((item) => {
      if (item.slug) {
        routes.push({
          url: `${BASE_URL}/events/${item.slug}`,
          lastModified: item.updated_at ? item.updated_at.split('T')[0] : TODAY,
          changeFrequency: 'yearly',
          priority: 0.6,
        });
      }
    });

  } catch (error) {
    console.error('Failed to generate dynamic sitemap:', error);
  }

  return routes;
}
