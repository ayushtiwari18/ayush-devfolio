import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Tag, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import BlogContent from '@/components/blog/BlogContent';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogTakeaways from '@/components/blog/BlogTakeaways';
import SeriesBanner from '@/components/blog/SeriesBanner';

const BASE_URL = 'https://ayush-devfolio.vercel.app';

// Safe description — works whether content is JSON array, string, or null
function safeDescription(post) {
  if (post.excerpt) return post.excerpt.substring(0, 160);
  if (!post.content) return '';
  if (typeof post.content === 'string') {
    try {
      const blocks = JSON.parse(post.content);
      if (Array.isArray(blocks)) return extractTextFromBlocks(blocks).substring(0, 160);
    } catch {}
    return post.content.replace(/[#*`>_~]/g, '').trim().substring(0, 160);
  }
  if (Array.isArray(post.content)) return extractTextFromBlocks(post.content).substring(0, 160);
  return '';
}

function extractTextFromBlocks(blocks) {
  let text = '';
  const walk = (blocks) => {
    for (const block of blocks) {
      if (Array.isArray(block.content)) {
        for (const inline of block.content) {
          if (inline.type === 'text') text += inline.text + ' ';
        }
      }
      if (block.children?.length) walk(block.children);
    }
  };
  walk(blocks);
  return text.trim();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, content, cover_image, tags, created_at, updated_at, excerpt, canonical_url')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) return { title: 'Post Not Found' };

  const description = safeDescription(post);
  const ogImage = post.cover_image || `${BASE_URL}/opengraph-image`;

  return {
    title: `${post.title} — Ayush Tiwari`,
    description,
    alternates: {
      canonical: post.canonical_url || `${BASE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: `${post.title} — Ayush Tiwari`,
      description,
      url: `${BASE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [`${BASE_URL}/about`],
      tags: post.tags || [],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — Ayush Tiwari`,
      description,
      creator: '@ayushtiwari18',
      images: [ogImage],
    },
  };
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) notFound();

  const description = safeDescription(post);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    url: `${BASE_URL}/blog/${slug}`,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: { '@type': 'Person', name: 'Ayush Tiwari', url: BASE_URL },
    publisher: { '@type': 'Person', name: 'Ayush Tiwari', url: BASE_URL },
    ...(post.cover_image && { image: post.cover_image }),
    ...(post.tags?.length > 0 && { keywords: post.tags.join(', ') }),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${slug}` },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${slug}` },
    ],
  };

  const postUrl = `${BASE_URL}/blog/${slug}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Back */}
          <Link href="/blog">
            <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
              <ArrowLeft className="mr-2" size={16} />Back to Blog
            </Button>
          </Link>

          {/* Cover */}
          {post.cover_image && (
            <div className="relative w-full h-64 sm:h-[420px] rounded-2xl overflow-hidden mb-10 bg-gradient-to-br from-primary/20 to-accent/20">
              <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
              {post.featured && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/90 text-black text-xs font-bold rounded-full">
                  <Star size={12} fill="currentColor" /> Featured
                </div>
              )}
            </div>
          )}

          {/* Series Banner */}
          {post.series_name && (
            <SeriesBanner
              seriesName={post.series_name}
              seriesOrder={post.series_order}
            />
          )}

          {/* 2-col layout */}
          <div className="flex flex-col xl:flex-row gap-10">

            {/* ── Main Article ── */}
            <article className="flex-1 min-w-0">

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5">
                <div className="flex items-center gap-2">
                  <Calendar size={15} />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                {post.reading_time && (
                  <div className="flex items-center gap-2">
                    <Clock size={15} />
                    <span>{post.reading_time} min read</span>
                  </div>
                )}
                {post.series_name && (
                  <div className="flex items-center gap-2">
                    <BookOpen size={15} />
                    <span>Part {post.series_order} of {post.series_name}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 hover:bg-primary/20 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Excerpt callout */}
              {post.excerpt && (
                <div className="relative pl-5 py-4 pr-5 mb-8 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" />
                  <p className="text-base text-foreground/80 italic leading-relaxed font-medium">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Block content */}
              <BlogContent content={post.content} />

              {/* Key Takeaways */}
              {post.show_takeaways !== false && post.key_takeaways?.length > 0 && (
                <BlogTakeaways items={post.key_takeaways} />
              )}

              {/* Footer nav */}
              <footer className="mt-12 pt-8 border-t border-border">
                <Link href="/blog">
                  <Button variant="outline" className="hover:bg-primary/10 hover:border-primary">
                    <ArrowLeft className="mr-2" size={16} />Back to Blog
                  </Button>
                </Link>
              </footer>
            </article>

            {/* ── Sticky Sidebar ── */}
            <aside className="xl:w-72 shrink-0">
              <BlogSidebar
                content={post.content}
                postUrl={postUrl}
                postTitle={post.title}
                createdAt={post.created_at}
                readingTime={post.reading_time}
                tags={post.tags || []}
                showToc={post.show_toc !== false}
                showShare={post.show_share !== false}
              />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
