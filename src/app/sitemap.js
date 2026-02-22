import { getPublishedProjectSlugs } from '@/services/projects.service';

const baseUrl = 'https://ayush-devfolio.vercel.app';

export default async function sitemap() {
  // Static routes
  const staticRoutes = [
    { url: baseUrl,                         lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/projects`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/blog`,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/certifications`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/hackathons`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`,            lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ];

  // Dynamic project slugs
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
    // Non-critical — sitemap degrades gracefully without project slugs
  }

  return [...staticRoutes, ...projectRoutes];
}
