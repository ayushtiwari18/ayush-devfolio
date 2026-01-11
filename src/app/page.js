import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import LatestBlog from '@/components/sections/LatestBlog';
import Contact from '@/components/sections/Contact';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Ayush Tiwari - Full Stack Developer',
  description: 'Portfolio of Ayush Tiwari - Full Stack Developer specializing in Next.js, React, and modern web technologies.',
  keywords: ['Full Stack Developer', 'Next.js', 'React', 'Portfolio', 'Web Development'],
  authors: [{ name: 'Ayush Tiwari' }],
  openGraph: {
    title: 'Ayush Tiwari - Full Stack Developer',
    description: 'Portfolio showcasing projects, blog posts, and achievements',
    type: 'website',
  },
};

export default async function HomePage() {
  // Fetch featured projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch latest blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, tags, reading_time, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch profile settings
  const { data: profile } = await supabase
    .from('profile_settings')
    .select('*')
    .single();

  return (
    <main className="min-h-screen">
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills />
      <FeaturedProjects projects={projects || []} />
      <LatestBlog posts={blogPosts || []} />
      <Contact />
    </main>
  );
}
