'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Tag,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { supabase } from '@/lib/supabase';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  // Confirm modal state
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  useEffect(() => { getBlogPosts(); }, []);

  const getBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmedDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      setPosts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Derive unique tags from all posts
  const allTags = [...new Set(posts.flatMap(p => p.tags || []))].sort();

  // Client-side filtering
  const filtered = posts.filter(p => {
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && p.published) ||
      (statusFilter === 'draft' && !p.published);
    const matchesTag =
      tagFilter === 'all' || (p.tags || []).includes(tagFilter);
    return matchesSearch && matchesStatus && matchesTag;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="text-destructive" size={40} />
        <p className="text-destructive text-center">{error}</p>
        <Button onClick={getBlogPosts} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Blog Post?"
        description={deleteTarget ? `"${deleteTarget.title}" will be permanently removed. This cannot be undone.` : ''}
        confirmLabel="Delete Post"
        danger
        loading={!!deletingId}
        onConfirm={handleConfirmedDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground">{filtered.length} of {posts.length} posts</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />Write New Post
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search posts by title, excerpt, or tag..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
          </select>
          {(search || statusFilter !== 'all' || tagFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearch(''); setStatusFilter('all'); setTagFilter('all'); }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Posts List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {posts.length === 0 ? 'No Blog Posts Yet' : 'No Matching Posts'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {posts.length === 0
                ? 'Start sharing your knowledge by writing your first blog post.'
                : 'Try adjusting your search or filters.'}
            </p>
            {posts.length === 0 && (
              <Link href="/admin/blog/new">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2" size={18} />Write First Post
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(post => (
            <div key={post.id} className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all">
              <div className="flex flex-col md:flex-row">
                {post.cover_image && (
                  <div className="relative w-full md:w-64 h-48 bg-muted flex-shrink-0">
                    <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{post.title}</h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {post.published ? (
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full flex items-center gap-1 border border-green-500/20">
                          <CheckCircle size={12} /> Published
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-500/10 text-gray-500 text-xs font-bold rounded-full flex items-center gap-1 border border-gray-500/20">
                          <XCircle size={12} /> Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 items-center">
                      <Tag size={14} className="text-muted-foreground" />
                      {post.tags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">{tag}</span>
                      ))}
                      {post.tags.length > 4 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">+{post.tags.length - 4} more</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      {post.reading_time && (
                        <div className="flex items-center gap-1"><Clock size={14} /><span>{post.reading_time} min read</span></div>
                      )}
                      {post.views !== undefined && (
                        <div className="flex items-center gap-1"><Eye size={14} /><span>{post.views} views</span></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                          <Edit size={16} className="mr-2" />Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingId === post.id}
                        onClick={() => setDeleteTarget({ id: post.id, title: post.title })}
                        className="border-red-500 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deletingId === post.id
                          ? <Loader2 size={16} className="animate-spin" />
                          : <Trash2 size={16} />
                        }
                      </Button>
                      {post.slug && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="outline" size="sm" className="hover:bg-primary/10"><Eye size={16} /></Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
