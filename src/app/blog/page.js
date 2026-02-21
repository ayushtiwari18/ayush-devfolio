import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublishedBlogPosts } from '@/services/blog.service';

export const metadata = {
  title: 'Blog - Ayush Tiwari',
  description: 'Insights, tutorials, and thoughts on web development, MERN stack, and my learning journey.',
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default async function BlogPage() {
  let posts = [];

  try {
    posts = await getPublishedBlogPosts();
  } catch (err) {
    console.error('Failed to load blog posts:', err);
    // Graceful degradation — show empty state, don't crash
  }

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Button>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            My <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on web development and technology
          </p>
        </div>

        {/* Blog Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Cover Image */}
                <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-20">✍️</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    {post.created_at && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(post.created_at)}
                      </span>
                    )}
                    {post.reading_time && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.reading_time} min read
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.content?.substring(0, 120)}...
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/blog/${post.slug}`}>
                    <Button size="sm" className="w-full">
                      Read Post
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-5xl">✍️</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Blog Coming Soon!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              I'm working on creating valuable content about web development, MERN stack, and my learning journey. Stay tuned!
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
