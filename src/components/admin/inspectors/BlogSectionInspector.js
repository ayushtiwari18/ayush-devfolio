'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import {
  BookOpen,
  Plus,
  Star,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function BlogSectionInspector({ onClose }) {
  const router = useRouter();
  const { openDrawer, showToast } = useAdminMode();

  const [posts, setPosts]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode]   = useState('all'); // 'all' | 'featured' | 'drafts'

  useEffect(() => {
    let mounted = true;
    async function loadPosts() {
      try {
        const { data, error: err } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, content, tags, published, featured, created_at')
          .order('created_at', { ascending: false });

        if (err) throw err;
        if (mounted && Array.isArray(data)) {
          setPosts(data);
        }
      } catch (e) {
        console.warn('Failed to load blog posts inventory:', e);
        setError('Could not load blog posts from Supabase.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPosts();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleFeatured = async (post) => {
    const nextState = !post.featured;
    try {
      const { error: err } = await supabase
        .from('blog_posts')
        .update({ featured: nextState })
        .eq('id', post.id);

      if (err) throw err;

      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, featured: nextState } : p))
      );
      showToast(
        nextState
          ? `⭐ Marked "${post.title}" as featured`
          : `Removed "${post.title}" from featured`,
        'success'
      );
      router.refresh();
    } catch (e) {
      showToast(e?.message || 'Failed to update featured state', 'error');
    }
  };

  const handleTogglePublished = async (post) => {
    const nextState = !post.published;
    try {
      const { error: err } = await supabase
        .from('blog_posts')
        .update({ published: nextState })
        .eq('id', post.id);

      if (err) throw err;

      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, published: nextState } : p))
      );
      showToast(
        nextState
          ? `Published "${post.title}"`
          : `Unpublished "${post.title}" (draft)`,
        'info'
      );
      router.refresh();
    } catch (e) {
      showToast(e?.message || 'Failed to update publication status', 'error');
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${post.title}"?`)) return;

    try {
      const { error: err } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (err) throw err;

      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      showToast(`Deleted "${post.title}"`, 'info');
      router.refresh();
    } catch (e) {
      showToast(e?.message || 'Failed to delete article', 'error');
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filterMode === 'featured' && !p.featured) return false;
    if (filterMode === 'drafts' && p.published) return false;
    if (!searchQuery) return true;
    return (
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const featuredCount = posts.filter((p) => p.featured).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <InspectorDrawer
      title="Recent Articles & Blog Management"
      description="Manage articles and tutorials. Toggle what is featured on the home page, edit drafts, or write new articles with live markdown preview."
      icon={BookOpen}
      isOpen={true}
      onClose={onClose}
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono-code mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Masthead Toolbar */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between gap-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title or slug..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Add New Article button */}
          <button
            type="button"
            data-testid="add-blog-btn"
            onClick={() => openDrawer('blog-new')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-mono-code font-semibold transition-all shrink-0"
          >
            <Plus size={13} />
            <span>+ Write Article</span>
          </button>
        </div>

        {/* Filter Tabs & Link to Blog Catalog */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 font-mono-code text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterMode === 'all'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'bg-[#0f0f15] text-muted-foreground hover:text-white'
              }`}
            >
              All ({posts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('featured')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filterMode === 'featured'
                  ? 'bg-yellow-400/20 text-yellow-300 font-semibold border border-yellow-400/30'
                  : 'bg-[#0f0f15] text-muted-foreground hover:text-white'
              }`}
            >
              <Star size={11} fill="currentColor" />
              <span>Featured ({featuredCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('drafts')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterMode === 'drafts'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'bg-[#0f0f15] text-muted-foreground hover:text-white'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          <Link
            href="/blog"
            onClick={onClose}
            className="text-[11px] font-mono-code text-primary hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Living Blog</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono-code text-muted-foreground animate-pulse">
            Loading articles inventory...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-10 text-center text-xs font-mono-code text-muted-foreground">
            No articles match the selected filter.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`p-3 rounded-2xl bg-[#0c0d14] border transition-all ${
                post.featured
                  ? 'border-yellow-400/30 shadow-sm shadow-yellow-500/5'
                  : 'border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white truncate font-display">
                      {post.title}
                    </h4>

                    {post.featured && (
                      <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 flex items-center gap-0.5">
                        <Star size={10} fill="currentColor" />
                        <span>Featured</span>
                      </span>
                    )}

                    {!post.published && (
                      <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        Draft
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400 line-clamp-1 mb-2 font-sans">
                    {post.excerpt || 'No excerpt provided.'}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-muted-foreground">
                    <span className="text-gray-500">/{post.slug}</span>
                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-primary truncate max-w-[200px]">
                          {post.tags.slice(0, 3).join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick In-Context Actions */}
                <div className="flex items-center gap-1 shrink-0 pt-0.5">
                  {/* Toggle Featured */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(post)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      post.featured
                        ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                        : 'text-zinc-500 hover:text-yellow-400 hover:bg-white/5'
                    }`}
                    title={post.featured ? 'Remove from Featured' : 'Mark as Featured on Home'}
                  >
                    <Star size={13} fill={post.featured ? 'currentColor' : 'none'} />
                  </button>

                  {/* Toggle Published */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(post)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      post.published
                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                        : 'text-amber-400 hover:bg-amber-500/10'
                    }`}
                    title={post.published ? 'Hide Article' : 'Publish Article'}
                  >
                    {post.published ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>

                  {/* Edit Full Article */}
                  <button
                    type="button"
                    onClick={() => openDrawer('blog-edit', post)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                    title="Edit article markdown & preview"
                  >
                    <Edit3 size={13} />
                  </button>

                  {/* Delete Post */}
                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Delete article"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </InspectorDrawer>
  );
}
