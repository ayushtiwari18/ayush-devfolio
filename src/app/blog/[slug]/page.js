import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Blog`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }) {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!post) {
    notFound();
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Simple markdown-to-HTML conversion (basic)
  const formatContent = (content) => {
    if (!content) return '';
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code class="px-2 py-1 bg-muted rounded text-sm">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br />');
  };

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2" size={18} />
            Back to Blog
          </Button>
        </Link>

        {/* Post Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.created_at)}</span>
            </div>
            {post.reading_time && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.reading_time} min read</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <Tag size={16} className="text-muted-foreground" />
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Cover Image */}
          {post.cover_image && (
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-muted">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${formatContent(post.content)}</p>` }}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border my-12"></div>

        {/* Share Section (Optional) */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Thank you for reading!</p>
          <Link href="/blog">
            <Button variant="outline">
              Read More Articles
            </Button>
          </Link>
        </div>
      </article>
    </main>
  );
}
