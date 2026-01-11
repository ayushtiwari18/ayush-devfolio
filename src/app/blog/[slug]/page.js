import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/services/blog.service';
import { generateArticleMetadata } from '@/lib/seo';
import { formatDate } from '@/utils/formatDate';

export async function generateStaticParams() {
  try {
    const posts = await getPublishedBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const post = await getBlogPostBySlug(params.slug);
    
    if (!post) {
      return {};
    }

    return generateArticleMetadata({
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      publishedTime: post.created_at,
      tags: post.tags || [],
      path: `/blog/${post.slug}`,
    });
  } catch (error) {
    return {};
  }
}

export default async function BlogPostPage({ params }) {
  let post = null;

  try {
    post = await getBlogPostBySlug(params.slug);
  } catch (error) {
    console.error('Failed to fetch blog post:', error);
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20">
      <article className="container mx-auto px-4 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2" size={16} />
            Back to Blog
          </Button>
        </Link>

        {post.cover_image && (
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{post.reading_time} min read</span>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {post.excerpt && (
          <p className="text-lg text-muted-foreground mb-8 pb-8 border-b border-border">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-lg max-w-none">
          <div className="text-foreground whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
}
