import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

const BASE_URL = 'https://ayush-devfolio.vercel.app';
export const revalidate = 60;

export const metadata = {
  title: 'Blog - Ayush Tiwari',
  description: 'Technical articles, tutorials and insights on Full Stack Development, Next.js, React, and cloud-native engineering by Ayush Tiwari.',
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'Blog - Ayush Tiwari',
    description: 'Technical articles, tutorials and insights on Full Stack Development by Ayush Tiwari.',
    url: `${BASE_URL}/blog`,
    type: 'website',
  },
};

export default async function BlogPage() {
  let posts = [];
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, content, cover_image, created_at, reading_time, tags')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (!error) posts = data || [];
  } catch { /* degrade gracefully */ }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            My <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials and deep-dives on software engineering
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">No posts published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 card-glow">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {post.cover_image && (
                      <div className="relative w-full sm:w-40 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(post.created_at)}</span>
                        {post.reading_time && <span className="flex items-center gap-1"><Clock size={12} />{post.reading_time} min read</span>}
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.content?.replace(/[#*`>_~]/g, '').trim().substring(0, 140)}
                      </p>
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((t, i) => (
                            <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="hidden sm:flex items-center">
                      <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
