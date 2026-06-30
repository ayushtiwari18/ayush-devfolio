'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Star, BookOpen, Flame } from 'lucide-react';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// ── Featured hero card ──────────────────────────────────────────
function FeaturedCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block mb-10">
      <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-card hover:border-primary/60 transition-all duration-300 shadow-lg hover:shadow-primary/10 hover:shadow-xl">
        {/* Cover image */}
        {post.cover_image && (
          <div className="relative w-full h-56 sm:h-72 overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-bold rounded-full">
              <Star size={10} fill="currentColor" /> Featured
            </span>
            {post.series_name && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full">
                <BookOpen size={10} /> {post.series_name} · Part {post.series_order}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-base text-muted-foreground leading-relaxed mb-5 line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta + CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />{formatDate(post.created_at)}
              </span>
              {post.reading_time && (
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />{post.reading_time} min read
                </span>
              )}
              {post.tags?.slice(0, 3).map((t, i) => (
                <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                  #{t}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
              Read article <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Regular grid card ───────────────────────────────────────────
function PostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="h-full flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
        {/* Cover */}
        <div className="relative w-full aspect-video bg-muted overflow-hidden flex-shrink-0">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <BookOpen size={32} className="text-primary/30" />
            </div>
          )}
          {/* Reading time pill overlay */}
          {post.reading_time && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium rounded-full flex items-center gap-1">
              <Clock size={9} />{post.reading_time} min
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Date */}
          <p className="text-xs text-muted-foreground mb-2.5 flex items-center gap-1.5">
            <Calendar size={11} />{formatDate(post.created_at)}
          </p>

          {/* Title */}
          <h2 className="text-base font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {post.tags.slice(0, 3).map((t, i) => (
                <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full border border-primary/20">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Empty state ─────────────────────────────────────────────────
function EmptyState({ activeTag, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
        <BookOpen size={28} className="text-primary/60" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">
        {activeTag ? `No posts tagged #${activeTag}` : 'No posts yet'}
      </h3>
      <p className="text-sm text-muted-foreground mb-5">
        {activeTag ? 'Try a different tag or browse all articles.' : 'Check back soon — articles are on the way.'}
      </p>
      {activeTag && (
        <button
          onClick={onClear}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Show all posts
        </button>
      )}
    </div>
  );
}

// ── Main client component ───────────────────────────────────────
export default function BlogFilterClient({ posts }) {
  const [activeTag, setActiveTag] = useState('All');

  // Build tag list with counts
  const tagCounts = useMemo(() => {
    const map = {};
    posts.forEach(p => p.tags?.forEach(t => { map[t] = (map[t] || 0) + 1; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  // Split featured vs rest
  const featuredPost = posts.find(p => p.featured);
  const filtered = useMemo(() => {
    const base = activeTag === 'All' ? posts : posts.filter(p => p.tags?.includes(activeTag));
    return base;
  }, [posts, activeTag]);

  const featuredFiltered = filtered.find(p => p.featured);
  const gridPosts = filtered.filter(p => !p.featured || activeTag !== 'All');
  // When filtering by tag, show featured in grid too (no special treatment)
  const showHero = activeTag === 'All' && featuredPost;
  const heroPost = showHero ? featuredPost : null;
  const listPosts = showHero ? filtered.filter(p => p.id !== featuredPost.id) : filtered;

  return (
    <div>
      {/* ── Tag filter bar ── */}
      {tagCounts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => setActiveTag('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              activeTag === 'All'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
            }`}
          >
            All
            <span className={`ml-1.5 text-xs ${ activeTag === 'All' ? 'text-primary-foreground/70' : 'text-muted-foreground' }`}>
              {posts.length}
            </span>
          </button>
          {tagCounts.map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeTag === tag
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              }`}
            >
              #{tag}
              <span className={`ml-1.5 text-xs ${ activeTag === tag ? 'text-primary-foreground/70' : 'text-muted-foreground' }`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <EmptyState activeTag={activeTag !== 'All' ? activeTag : null} onClear={() => setActiveTag('All')} />
      ) : (
        <>
          {/* Featured hero */}
          {heroPost && <FeaturedCard post={heroPost} />}

          {/* Grid */}
          {listPosts.length > 0 && (
            <>
              {heroPost && (
                <div className="flex items-center gap-3 mb-6">
                  <Flame size={15} className="text-primary" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-widest">More Articles</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
