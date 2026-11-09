'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Star, BookOpen, Search, X, Sparkles, FileText, ChevronRight } from 'lucide-react';
import FallbackImage from '@/components/ui/FallbackImage';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// ── Shared blog image fallback ────────────────────────────────
function BlogImageFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 via-[#0A0D15] to-accent/10">
      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
        <FileText size={22} className="text-primary/60" />
      </div>
      <span className="text-[11px] font-mono-code text-gray-400">ENGINEERING NOTE</span>
    </div>
  );
}

// ── Featured magazine publication spread ──────────────────────
function FeaturedCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block mb-12 select-none">
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#090D16] hover:border-indigo-500/40 transition-all duration-300 shadow-2xl shadow-black/80 hover:-translate-y-1">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Cover image container */}
          <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-full min-h-[260px] overflow-hidden bg-[#070A12] border-b lg:border-b-0 lg:border-r border-white/10">
            <FallbackImage
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
              fallback={<BlogImageFallback />}
              containerClassName="absolute inset-0"
            />
            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/90 via-transparent to-transparent lg:hidden pointer-events-none" />
            
            {/* Telemetry pill */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono-code font-bold rounded-full backdrop-blur-md shadow-lg">
              <Star size={10} fill="currentColor" />
              <span>FEATURED PUBLICATION</span>
            </div>
          </div>

          {/* Article Info Body */}
          <div className="lg:col-span-6 p-7 sm:p-9 flex flex-col justify-between">
            <div>
              {post.series_name && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-mono-code font-semibold rounded-full">
                    <BookOpen size={11} /> {post.series_name} · Part {post.series_order}
                  </span>
                </div>
              )}

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3.5 leading-snug group-hover:text-primary transition-colors">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6 line-clamp-3 font-sans">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Metadata & CTA */}
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono-code text-gray-400 mb-5 pt-4 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-primary" />
                  {formatDate(post.created_at)}
                </span>
                {post.reading_time && (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Clock size={12} />
                    {post.reading_time} MIN READ
                  </span>
                )}
                {post.tags?.slice(0, 3).map((t, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white/[0.03] text-gray-300 rounded-md border border-white/10 text-[11px]">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-mono-code font-semibold text-primary group-hover:text-white transition-colors">
                <span>Read Deep-Dive Analysis</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </Link>
  );
}

// ── Regular grid card ─────────────────────────────────────────
function PostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full select-none">
      <div className="h-full flex flex-col bg-[#090D16] border border-white/10 hover:border-indigo-500/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1">
        
        {/* Cover image */}
        <div className="relative w-full aspect-video bg-[#070A12] overflow-hidden flex-shrink-0 border-b border-white/10">
          <FallbackImage
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            fallback={<BlogImageFallback />}
            containerClassName="absolute inset-0"
          />
          {post.reading_time && (
            <div className="absolute bottom-2.5 right-2.5 z-10 px-2.5 py-1 bg-[#06080E]/90 backdrop-blur-md text-emerald-400 text-[10px] font-mono-code font-semibold rounded-full border border-white/10 flex items-center gap-1">
              <Clock size={10} />{post.reading_time} MIN READ
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6">
          <p className="text-xs font-mono-code text-gray-400 mb-2 flex items-center gap-1.5">
            <Calendar size={11} className="text-primary" />{formatDate(post.created_at)}
          </p>

          <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-2 mb-4 flex-1 font-sans">
              {post.excerpt}
            </p>
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-white/5">
              {post.tags.slice(0, 3).map((t, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/[0.03] text-gray-300 text-[11px] font-mono-code rounded-md border border-white/10">
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

// ── Empty state ───────────────────────────────────────────────
function EmptyState({ activeTag, searchQuery, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#090D16] border border-white/10 rounded-3xl my-6">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4">
        <Search size={24} className="text-primary/70" />
      </div>
      <h3 className="text-lg font-bold font-display text-white mb-2">
        No Matching Publications Found
      </h3>
      <p className="text-xs sm:text-sm text-gray-400 max-w-md mb-6 font-mono-code">
        No articles matched &ldquo;{searchQuery || activeTag}&rdquo;. Try another term or reset filters.
      </p>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-primary text-white text-xs font-mono-code font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
      >
        Reset All Filters
      </button>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function BlogFilterClient({ posts }) {
  const [activeTag, setActiveTag]     = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tagCounts = useMemo(() => {
    const map = {};
    posts.forEach(p => p.tags?.forEach(t => { map[t] = (map[t] || 0) + 1; }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const featuredPost = posts.find(p => p.featured);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = activeTag === 'All' || post.tags?.includes(activeTag);
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesTag;

      const titleMatch = post.title?.toLowerCase().includes(query);
      const excerptMatch = post.excerpt?.toLowerCase().includes(query);
      const tagsMatch = post.tags?.some((t) => t.toLowerCase().includes(query));

      return matchesTag && (titleMatch || excerptMatch || tagsMatch);
    });
  }, [posts, activeTag, searchQuery]);

  const isBrowsingAll = activeTag === 'All' && !searchQuery.trim();
  const showHero = isBrowsingAll && featuredPost;
  const heroPost = showHero ? featuredPost : null;
  const listPosts = showHero ? filtered.filter(p => p.id !== featuredPost.id) : filtered;

  return (
    <div>
      {/* Search Bar & Category Controls Bar */}
      <div className="space-y-4 mb-10">
        
        {/* Instant Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search publications by title, keyword, or algorithm pattern..."
            className="w-full pl-11 pr-10 py-3 bg-[#080B12] border border-white/10 hover:border-white/20 focus:border-primary rounded-2xl text-white placeholder-gray-500 text-xs sm:text-sm font-mono-code focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tag filter pills */}
        {tagCounts.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTag('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono-code font-semibold border transition-all select-none ${
                activeTag === 'All'
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                  : 'bg-[#090D16] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              All Articles
              <span className={`ml-1.5 text-[10px] ${activeTag === 'All' ? 'text-white/80' : 'text-gray-400'}`}>
                {posts.length}
              </span>
            </button>
            {tagCounts.map(([tag, count]) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono-code font-semibold border transition-all select-none ${
                  activeTag === tag
                    ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                    : 'bg-[#090D16] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                #{tag}
                <span className={`ml-1.5 text-[10px] ${activeTag === tag ? 'text-white/80' : 'text-gray-400'}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Content Stream */}
      {filtered.length === 0 ? (
        <EmptyState
          activeTag={activeTag}
          searchQuery={searchQuery}
          onReset={() => {
            setActiveTag('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <>
          {heroPost && <FeaturedCard post={heroPost} />}

          {listPosts.length > 0 && (
            <>
              {heroPost && (
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-xs font-mono-code font-bold text-gray-400 uppercase tracking-widest">
                    All Publications ({listPosts.length})
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listPosts.map((post) => (
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
