import { PenLine } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BlogFilterClient from '@/components/blog/BlogFilterClient';
import { BASE_URL } from '@/lib/config';

// Always fetch fresh from Supabase on every request
export const revalidate = 60;

export const metadata = {
  title: 'Blog - Ayush Tiwari | Full Stack Development Articles',
  description:
    'Technical articles, tutorials and deep-dives on Full Stack Development, Next.js, React, ' +
    'Node.js, network security and cloud engineering by Ayush Tiwari - developer from Jabalpur, India.',
  keywords: [
    'Ayush Tiwari blog', 'Full Stack Development blog India',
    'Next.js tutorials', 'React articles', 'Node.js tutorials',
    'network security blog', 'web developer blog Jabalpur',
    'Ayush Tiwari articles', 'MERN Stack blog',
  ],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title:       'Blog - Ayush Tiwari | Full Stack Development Articles',
    description: 'Technical deep-dives on Full Stack Development, Next.js and cloud engineering by Ayush Tiwari.',
    url:          `${BASE_URL}/blog`,
    type:        'website',
    images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card:    'summary_large_image',
    title:   'Blog - Ayush Tiwari',
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
    <main className="min-h-screen pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 bg-[#05070B] relative overflow-hidden">
      
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/[0.03] rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Editorial Masthead */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono-code text-gray-400 mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>AYUSH TIWARI // PUBLICATIONS &amp; FIELD NOTES</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-[-0.03em] leading-tight mb-4">
            Engineering Notes &amp;{' '}
            <span className="text-primary inline-block">System Deep-Dives</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Production post-mortems, software architecture breakdowns, and algorithmic mental models from building distributed systems.
          </p>

          {postCount > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono-code text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{postCount} {postCount === 1 ? 'PUBLICATION' : 'PUBLICATIONS'} INDEXED</span>
            </div>
          )}
        </div>

        {/* Client filter & search client */}
        <BlogFilterClient posts={posts} />

      </div>
    </main>
  );
}
