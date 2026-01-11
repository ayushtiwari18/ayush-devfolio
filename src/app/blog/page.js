import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { getPublishedBlogPosts } from '@/services/blog.service';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Blog',
  description: 'Read my latest articles on web development, programming, and technology.',
};

export default async function BlogPage() {
  let posts = [];
  let error = null;

  try {
    posts = await getPublishedBlogPosts();
  } catch (err) {
    console.error('Error loading blog posts:', err);
    error = 'Failed to load blog posts. Please try again later.';
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            My <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Thoughts, tutorials, and insights on web development, programming, and technology.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && posts.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="p-8 bg-card border border-border rounded-lg">
              <h3 className="text-2xl font-bold text-foreground mb-4">No Posts Yet</h3>
              <p className="text-muted-foreground">
                I'm working on some amazing content. Check back soon!
              </p>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-card border border-border rounded-lg overflow-hidden card-glow hover-lift transition-all"
              >
                {/* Cover Image */}
                {post.cover_image && (
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {post.reading_time && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>{post.reading_time} min read</span>
                      </div>
                    )}
                  </div>

                  {/* Read More Button */}
                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-primary hover:text-primary hover:bg-primary/10"
                    >
                      Read More
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
