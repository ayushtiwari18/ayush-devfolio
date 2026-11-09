import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, BookOpen, Star, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import BlogContent from '@/components/blog/BlogContent';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogTakeaways from '@/components/blog/BlogTakeaways';
import BlogReadingNav from '@/components/blog/BlogReadingNav';
import SeriesBanner from '@/components/blog/SeriesBanner';
import { BASE_URL } from '@/lib/config';

// Always fetch fresh from Supabase on every request
export const revalidate = 60;

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
    alternates: { canonical: post.canonical_url || `${BASE_URL}/blog/${slug}` },
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

  let relatedPosts = [];
  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, cover_image, reading_time, created_at, tags')
      .eq('published', true)
      .neq('slug', slug)
      .limit(2);
    relatedPosts = data || [];
  } catch {
    relatedPosts = [];
  }

  const description = safeDescription(post);
  const postUrl = `${BASE_URL}/blog/${slug}`;
  const primaryCategory = post.tags?.[0] || 'ENGINEERING';

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description,
    url: postUrl,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: { '@type': 'Person', name: 'Ayush Tiwari', url: BASE_URL },
    publisher: { '@type': 'Person', name: 'Ayush Tiwari', url: BASE_URL },
    ...(post.cover_image && { image: post.cover_image }),
    ...(post.tags?.length > 0 && { keywords: post.tags.join(', ') }),
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Sticky Top Reading Navigation Bar */}
      <BlogReadingNav
        postTitle={post.title}
        postUrl={postUrl}
        category={primaryCategory}
      />

      <main className="min-h-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8 selection:bg-primary/20 selection:text-white">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb & Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <nav className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                Index
              </Link>
              <ChevronRight size={12} className="text-gray-600" />
              <Link href="/blog" className="hover:text-white transition-colors">
                Publications
              </Link>
              <ChevronRight size={12} className="text-gray-600" />
              <span className="text-primary truncate max-w-[200px] sm:max-w-xs">
                {post.title}
              </span>
            </nav>

            <Link href="/blog">
              <Button
                variant="outline"
                className="h-9 px-3.5 text-xs font-mono border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-primary/40 text-gray-300 hover:text-white rounded-xl transition-all"
              >
                <ArrowLeft className="mr-1.5" size={13} />
                <span>All Articles</span>
              </Button>
            </Link>
          </div>

          {/* Cover Hero Image (if present) */}
          {post.cover_image && (
            <div className="relative w-full h-64 sm:h-[420px] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl shadow-black/50">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              {post.featured && (
                <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/90 backdrop-blur-md text-black text-xs font-bold font-mono rounded-full shadow-lg">
                  <Star size={12} fill="currentColor" />
                  <span>Featured Case Study</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-80" />
            </div>
          )}

          {/* Series Banner */}
          {post.series_name && (
            <div className="mb-8">
              <SeriesBanner seriesName={post.series_name} seriesOrder={post.series_order} />
            </div>
          )}

          {/* Main Layout: Article + Editorial Sidebar */}
          <div className="flex flex-col xl:flex-row gap-12 lg:gap-16">

            <article className="flex-1 min-w-0">

              {/* Category & Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2.5 mb-5 font-mono text-xs">
                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/25 font-bold uppercase tracking-wider">
                  {primaryCategory}
                </span>
                {post.series_name && (
                  <span className="px-3 py-1 rounded-lg bg-white/[0.04] text-gray-300 border border-white/10 flex items-center gap-1.5">
                    <BookOpen size={12} className="text-primary" />
                    <span>Part {post.series_order} · {post.series_name}</span>
                  </span>
                )}
                {post.reading_time && (
                  <span className="px-3 py-1 rounded-lg bg-white/[0.04] text-gray-400 border border-white/10 flex items-center gap-1.5">
                    <Clock size={12} className="text-emerald-400" />
                    <span>{post.reading_time} min read</span>
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-[1.12] tracking-tight">
                {post.title}
              </h1>

              {/* Author Engineering Credibility Byline Card */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 mb-10 rounded-2xl bg-[#090D16] border border-white/10 shadow-lg shadow-black/30">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/40 shrink-0 shadow-md shadow-primary/20">
                    <Image
                      src="/images/profile/photo.jpg"
                      alt="Ayush Tiwari"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm sm:text-base">
                        Ayush Tiwari
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Verified Author
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      Systems & Full-Stack · 885+ DSA · LeetCode 1657
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-primary" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Editorial Lead Excerpt / Thesis */}
              {post.excerpt && (
                <div className="relative pl-6 sm:pl-8 py-5 pr-6 mb-10 rounded-2xl bg-[#090D16] border border-white/10 border-l-4 border-l-primary shadow-xl shadow-black/20">
                  <p className="text-base sm:text-lg text-gray-200/90 font-serif italic leading-relaxed">
                    &ldquo;{post.excerpt}&rdquo;
                  </p>
                </div>
              )}

              {/* Top Architectural Blueprint TL;DR */}
              {post.show_takeaways !== false && post.key_takeaways?.length > 0 && (
                <BlogTakeaways items={post.key_takeaways} position="top" />
              )}

              {/* Article Content Core */}
              <div className="mt-8">
                <BlogContent content={post.content} />
              </div>

              {/* Bottom Key Takeaways Synthesis */}
              {post.show_takeaways !== false && post.key_takeaways?.length > 0 && (
                <BlogTakeaways items={post.key_takeaways} position="bottom" />
              )}

              {/* Author Post-Reading Bio & Sign-off Card */}
              <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#090D16] border border-white/10 relative overflow-hidden shadow-xl shadow-black/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 shrink-0 shadow-md">
                      <Image
                        src="/images/profile/photo.jpg"
                        alt="Ayush Tiwari"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Ayush Tiwari</span>
                        <span className="text-xs font-mono font-normal text-primary">@ayushtiwari18</span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-md leading-relaxed font-sans">
                        Full-Stack & Systems Engineer building high-throughput web apps, compilers, and algorithmic platforms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link href="/blog" className="flex-1 sm:flex-none">
                      <Button
                        variant="outline"
                        className="w-full text-xs font-mono border-white/10 hover:border-primary/50 hover:bg-primary/10 text-gray-200"
                      >
                        <ArrowLeft size={13} className="mr-1.5" /> All Publications
                      </Button>
                    </Link>
                    <Link href="/#contact" className="flex-1 sm:flex-none">
                      <Button className="w-full text-xs font-mono bg-primary text-black hover:bg-primary/90 font-semibold">
                        Start Discussion
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Related Deep Dives (if available) */}
              {relatedPosts.length > 0 && (
                <section className="mt-16 pt-12 border-t border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={16} className="text-primary" />
                      <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                        More Engineering Deep Dives
                      </h3>
                    </div>
                    <Link
                      href="/blog"
                      className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View all</span>
                      <ChevronRight size={12} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}`}
                        className="group flex flex-col justify-between p-5 rounded-2xl bg-[#090D16] border border-white/10 hover:border-primary/40 hover:bg-[#0D1322] transition-all shadow-lg shadow-black/20"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-3">
                            <span className="text-primary font-bold uppercase">
                              {related.tags?.[0] || 'ENGINEERING'}
                            </span>
                            {related.reading_time && (
                              <span>{related.reading_time} min read</span>
                            )}
                          </div>
                          <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
                            {related.title}
                          </h4>
                          {related.excerpt && (
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                              {related.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-gray-400 group-hover:text-primary transition-colors">
                          <span>Read Deep Dive</span>
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            </article>

            {/* Editorial Sticky Sidebar */}
            <aside className="xl:w-80 shrink-0">
              <BlogSidebar
                content={post.content}
                postUrl={postUrl}
                postTitle={post.title}
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
