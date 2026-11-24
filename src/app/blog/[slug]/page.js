import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getProfileSettings } from '@/services/profile.service';
import BlogPostClient from '@/components/blog/BlogPostClient';
import { BASE_URL } from '@/lib/config';

// Always fetch fresh from Supabase on every request
export const revalidate = 60;

function extractTextFromBlocks(blocks) {
  let text = '';
  const walk = (items) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (item.type === 'text' && item.text) text += item.text + ' ';
      if (Array.isArray(item.content)) walk(item.content);
      if (Array.isArray(item.children)) walk(item.children);
    }
  };
  walk(Array.isArray(blocks) ? blocks : blocks?.content);
  return text.trim();
}

function safeDescription(post) {
  if (post.excerpt) return post.excerpt.substring(0, 160);
  if (!post.content) return '';
  if (typeof post.content === 'string') {
    try {
      const parsed = JSON.parse(post.content);
      if (Array.isArray(parsed) || parsed?.type === 'doc') {
        return extractTextFromBlocks(parsed).substring(0, 160);
      }
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

  const [postResult, profileResult, relatedResult] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single(),
    getProfileSettings().catch(() => null),
    supabase
      .from('blog_posts')
      .select('slug, title, excerpt, cover_image, reading_time, created_at, tags')
      .eq('published', true)
      .neq('slug', slug)
      .limit(2),
  ]);

  const post = postResult?.data;
  if (!post) notFound();

  const dbProfile = profileResult;
  const relatedPosts = relatedResult?.data || [];

  const isAyush = !post.author || post.author.toLowerCase().includes('ayush');
  const authorHeroImage = isAyush
    ? (dbProfile?.image_url || '/profile.png')
    : (post.author_image || '/placeholder-avatar.png');
  const authorName = isAyush ? 'Ayush Tiwari' : post.author;

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
    author: { '@type': 'Person', name: authorName, url: BASE_URL },
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
      <BlogPostClient
        initialPost={post}
        authorHeroImage={authorHeroImage}
        authorName={authorName}
        isAyush={isAyush}
        relatedPosts={relatedPosts}
        postUrl={postUrl}
      />
    </>
  );
}
