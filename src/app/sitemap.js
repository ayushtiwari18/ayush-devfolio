import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://ayush-tiwari.vercel.app'; // Update with your domain

  // Fetch all published projects
  const { data: projects } = await supabase
    .from('projects')
    .select('slug, created_at')
    .eq('published', true);

  // Fetch all published blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at')
    .eq('published', true);

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Dynamic project pages
  const projectPages = (projects || []).map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.created_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Dynamic blog pages
  const blogPages = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
