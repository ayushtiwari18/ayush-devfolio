import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';

export async function generateMetadata({ params }) {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, content')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const excerpt = post.content?.substring(0, 160) || '';

  return {
    title: `${post.title} - Ayush Tiwari`,
    description: excerpt,
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

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="mr-2" size={18} />
            Back to Blog
          </Button>
        </Link>

        {/* Hero Image */}
        {post.cover_image && (
          <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-primary/20 to-accent/20">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
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
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span>{post.tags.length} tags</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-8 border-b border-border">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none mb-12">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold text-foreground mt-8 mb-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-bold text-foreground mt-6 mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold text-foreground mt-4 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-muted-foreground leading-relaxed mb-4" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4" {...props} />
              ),
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-sm" {...props} />
                ) : (
                  <code className="block p-4 bg-muted rounded-lg text-sm overflow-x-auto mb-4" {...props} />
                ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
                  {...props}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Article Footer */}
        <footer className="pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <Button variant="outline" className="hover:bg-primary/10 hover:border-primary">
                <ArrowLeft className="mr-2" size={18} />
                Back to Blog
              </Button>
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
