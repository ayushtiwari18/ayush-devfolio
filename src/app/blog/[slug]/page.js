import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye, Share2 } from 'lucide-react';
import { getBlogPostBySlug, incrementBlogPostViews } from '@/services/blog.service';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }) {
  try {
    const post = await getBlogPostBySlug(params.slug);
    
    return {
      title: post.title,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: post.cover_image ? [post.cover_image] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post Not Found',
    };
  }
}

export default async function BlogPostPage({ params }) {
  let post;

  try {
    post = await getBlogPostBySlug(params.slug);
    
    // Increment views in background (non-blocking)
    incrementBlogPostViews(params.slug).catch(console.error);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 hover:text-primary">
            <ArrowLeft className="mr-2" size={18} />
            Back to Blog
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {post.reading_time && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.reading_time} min read</span>
                </div>
              )}

              {post.views && (
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{post.views} views</span>
                </div>
              )}
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="mb-12 rounded-lg overflow-hidden border border-border shadow-lg">
              <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-12">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Share Section */}
          <div className="border-t border-border pt-8 mb-12">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Share2 size={20} className="text-primary" />
                Share this post
              </h3>
              
              <div className="flex gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors border border-primary/20"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors border border-primary/20"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Author Section */}
          <div className="p-6 bg-card border border-border rounded-lg card-glow">
            <h3 className="text-xl font-bold text-foreground mb-3">About the Author</h3>
            <p className="text-muted-foreground mb-4">
              Full-stack developer passionate about building modern web applications.
              I write about web development, programming, and technology.
            </p>
            <Link href="/about">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Learn More About Me
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
