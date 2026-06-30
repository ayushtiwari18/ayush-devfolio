import { PenLine } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BlogFilterClient from '@/components/blog/BlogFilterClient';
import { BASE_URL } from '@/app/layout';

export const revalidate = 60;

export const metadata = {
  title: 'Blog — Ayush Tiwari | Full Stack Development Articles',
  description:
    'Technical articles, tutorials and deep-dives on Full Stack Development, Next.js, React, ' +
    'Node.js, network security and cloud engineering by Ayush Tiwari — developer from Jabalpur, India.',
  keywords: [
    'Ayush Tiwari blog', 'Full Stack Development blog India',
    'Next.js tutorials', 'React articles', 'Node.js tutorials',
    'network security blog', 'web developer blog Jabalpur',
    'Ayush Tiwari articles', 'MERN Stack blog',
  ],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title:       'Blog — Ayush Tiwari | Full Stack Development Articles',
    description: 'Technical deep-dives on Full Stack Development, Next.js and cloud engineering by Ayush Tiwari.',
    url:          `${BASE_URL}/blog`,
    type:        'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card:    'summary_large_image',
    title:   'Blog — Ayush Tiwari',
    creator: '@ayushtiwari18',
  },
};

export default async function BlogPage() {
  let posts = [];
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image, created_at, reading_time, tags, featured, series_name, series_order')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (!error) posts = data || [];
  } catch { /* degrade gracefully */ }

  const postCount = posts.length;

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <PenLine size={17} className="text-primary" />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Writing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 leading-tight">
            Articles &amp; <span className="gradient-text">Deep-dives</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Production engineering stories, tutorials and opinions.
            {postCount > 0 && (
              <span className="ml-2 text-sm text-muted-foreground/60">{postCount} {postCount === 1 ? 'article' : 'articles'} published</span>
            )}
          </p>
        </div>
        <BlogFilterClient posts={posts} />
      </div>
    </main>
  );
}
