import { PenLine } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BlogFilterClient from '@/components/blog/BlogFilterClient';

const BASE_URL = 'https://ayush-devfolio.vercel.app';
export const revalidate = 60;

export const metadata = {
  title: 'Blog — Ayush Tiwari',
  description: 'Technical articles, tutorials and deep-dives on Full Stack Development, Next.js, React, SEO and cloud-native engineering by Ayush Tiwari.',
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'Blog — Ayush Tiwari',
    description: 'Technical articles and deep-dives on Full Stack Development by Ayush Tiwari.',
    url: `${BASE_URL}/blog`,
    type: 'website',
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

        {/* ── Page header ── */}
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

        {/* ── Filter + cards (client) ── */}
        <BlogFilterClient posts={posts} />

      </div>
    </main>
  );
}
