import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Blog - Ayush Tiwari',
  description: 'Read articles about web development, programming, and technology',
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Button>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Blog <span className="gradient-text">Articles</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on modern web development
          </p>
        </div>

        {/* Blog Posts */}
        {posts && posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all">
                  <div className="flex flex-col md:flex-row">
                    {/* Post Image */}
                    {post.cover_image && (
                      <div className="relative w-full md:w-80 h-64 bg-muted flex-shrink-0 overflow-hidden">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="flex-1 p-6 md:p-8">
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        {post.reading_time && (
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{post.reading_time} min read</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
