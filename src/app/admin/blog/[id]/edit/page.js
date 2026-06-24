'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, X, Plus, Trash2, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/admin/ImageUploader';
import FallbackImage from '@/components/ui/FallbackImage';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { supabase } from '@/lib/supabase';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    tags: [],
    published: true,
    reading_time: 1,
  });

  useEffect(() => { fetchPost(); }, [params.id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', params.id)
        .single();
      if (error) throw error;
      // Null-safe: ensure arrays are never null
      setFormData({
        ...data,
        tags: data.tags || [],
        content: data.content || '',
        excerpt: data.excerpt || '',
        reading_time: data.reading_time || 1,
      });
    } catch (err) {
      console.error('Error fetching post:', err);
      alert('Error loading post: ' + err.message);
    } finally {
      setFetching(false);
    }
  };

  // Single unified change handler — no double setFormData
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'content') {
        const words = value.trim().split(/\s+/).filter(Boolean).length;
        next.reading_time = Math.max(1, Math.ceil(words / 200));
      }
      return next;
    });
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !formData.tags.includes(t)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, t] }));
      setTagInput('');
    }
  };
  const removeTag = (tag) => setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, updated_at: new Date().toISOString() };
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', params.id);
      if (error) throw error;
      router.push('/admin/blog');
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Error updating post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmedDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', params.id);
      if (error) throw error;
      router.push('/admin/blog');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Error deleting post: ' + err.message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Blog Post?"
        description={`"${formData.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete Post"
        danger
        loading={deleting}
        onConfirm={handleConfirmedDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/blog">
          <Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back to Blog</Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
            <p className="text-muted-foreground mt-2">Update blog article</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setShowPreview(!showPreview)}
              className="border-primary text-primary hover:bg-primary/10">
              <Eye className="mr-2" size={18} />{showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowDeleteModal(true)}
              className="border-red-500 text-red-500 hover:bg-red-500/10">
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title & Slug */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">URL Slug *</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <p className="text-xs text-muted-foreground mt-1">/blog/{formData.slug}</p>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-card border border-border rounded-xl p-6">
              <label className="block text-sm font-medium text-foreground mb-2">Excerpt</label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>

            {/* Content */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-foreground">Content (Markdown) *</label>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {formData.reading_time} min read
                </span>
              </div>
              {!showPreview ? (
                <textarea name="content" value={formData.content} onChange={handleChange} required rows={20}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
              ) : (
                <div className="w-full px-4 py-3 bg-background border border-border rounded-lg min-h-[500px] prose prose-invert max-w-none">
                  {formData.content
                    ? <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br />') }} />
                    : <p className="text-muted-foreground italic">Nothing to preview yet.</p>
                  }
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Supports Markdown: **bold**, *italic*, [links](url), # headings
              </p>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Cover Image */}
            <div className="bg-card border border-border rounded-xl p-6">
              <ImageUploader
                label="Cover Image"
                value={formData.cover_image}
                onChange={url => setFormData(prev => ({ ...prev, cover_image: url }))}
                folder="blog"
                hint="Recommended: 1200×630px (OG image ratio)."
              />
              {formData.cover_image && (
                <div className="relative h-40 rounded-xl overflow-hidden bg-muted mt-3 border border-border">
                  <FallbackImage
                    src={formData.cover_image}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    unoptimized
                    fallback={
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FileText size={32} />
                        <span className="text-xs">Image failed to load</span>
                      </div>
                    }
                    containerClassName="absolute inset-0 flex items-center justify-center bg-muted"
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-4">Tags</h3>
              <div className="flex gap-2 mb-3">
                <input type="text" value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add tag" />
                <Button type="button" onClick={addTag} size="sm"><Plus size={16} /></Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}><X size={12} className="hover:text-red-500" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-4">Settings</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="w-4 h-4 accent-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Publish Post</p>
                  <p className="text-xs text-muted-foreground">Make visible to public</p>
                </div>
              </label>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />Saving...</span>
                : <span className="flex items-center gap-2"><Save size={18} />Save Changes</span>
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
