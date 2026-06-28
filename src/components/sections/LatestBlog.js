'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import StaggeredList from '@/components/animations/StaggeredList';

// ---------------------------------------------------------------------------
// BLOG IMAGE — with error fallback
// ---------------------------------------------------------------------------
function BlogImage({ src, title, tags }) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    // Gradient fallback — uses first tag as accent label if available
    return (
      <div className="h-48 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 flex items-center justify-center flex-shrink-0">
        <div className="flex flex-col items-center gap-2 text-primary/40">
          <BookOpen size={36} />
          {tags?.[0] && (
            <span className="text-xs font-semibold font-mono-code uppercase tracking-widest text-primary/50">
              {tags[0]}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-48 bg-muted overflow-hidden flex-shrink-0">
      <Image
        src={src}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        onError={() => setImgError(true)}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWUyOTNiIi8+PC9zdmc+"
      />
    </div>
  );
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// LATEST BLOG — receives SSR-fetched posts as prop from page.js
// Fix: now a 'use client' component so useReveal + StaggeredList work
// Fix: BlogImage with onError fallback replaces broken conditional render
// ---------------------------------------------------------------------------
export default function LatestBlog({ posts }) {
  const header = useReveal({ threshold: 0.1 });

  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="py-section px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <div
          ref={header.ref}
          className="text-center mb-16"
          style={fadeUp(header.visible)}
        >
          <p className="section-label mb-3">Writing</p>
          <h2 className="section-heading mb-4">
            Latest <span className="gradient-text">Articles</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on web development
          </p>
        </div>

        <StaggeredList
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          staggerMs={80}
        >
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
              <article className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all h-full flex flex-col">

                <BlogImage src={post.cover_image} title={post.title} tags={post.tags} />

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    {post.reading_time && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{post.reading_time} min read</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                  )}

                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {post.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </StaggeredList>

        <div className="text-center">
          <Link href="/blog">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              View All Articles
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
