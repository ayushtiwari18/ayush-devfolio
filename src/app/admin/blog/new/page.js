'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ArrowLeft, Save, X, Plus, FileText,
  ChevronDown, BookOpen, Lightbulb, Link2, Star, Eye,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/admin/ImageUploader';
import FallbackImage from '@/components/ui/FallbackImage';
import { supabase } from '@/lib/supabase';

const BlogEditor = dynamic(() => import('@/components/blog/BlogEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] rounded-xl border border-border bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
    </div>
  ),
});

const EMPTY = {
  title: '', slug: '', content: '[]', excerpt: '', cover_image: '',
  tags: [], published: true, reading_time: 1,
  key_takeaways: [], series_name: '', series_order: '',
  canonical_url: '', featured: false,
  show_takeaways: true, show_toc: true, show_share: true,
};

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading]             = useState(false);
  const [tagInput, setTagInput]           = useState('');
  const [takeawayInput, setTakeawayInput] = useState('');
  const [visOpen, setVisOpen]             = useState(false);
  const [formData, setFormData]           = useState(EMPTY);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'title')
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return next;
    });
  };

  const handleEditorChange = useCallback((json) => {
    setFormData(prev => ({ ...prev, content: json }));
  }, []);

  const handleMetaChange = useCallback(({ reading_time, excerpt }) => {
    setFormData(prev => ({
      ...prev,
      reading_time,
      excerpt: prev.excerpt || excerpt,
    }));
  }, []);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !formData.tags.includes(t)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, t] }));
      setTagInput('');
    }
  };
  const removeTag = (tag) =>
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));

  const addTakeaway = () => {
    const t = takeawayInput.trim();
    if (t) {
      setFormData(prev => ({ ...prev, key_takeaways: [...prev.key_takeaways, t] }));
      setTakeawayInput('');
    }
  };
  const removeTakeaway = (i) =>
    setFormData(prev => ({ ...prev, key_takeaways: prev.key_takeaways.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let contentJson;
      try { contentJson = JSON.parse(formData.content); } catch { contentJson = []; }
      // Explicit payload — never send id/created_at/updated_at
      const payload = {
        title:          formData.title,
        slug:           formData.slug,
        content:        contentJson,
        excerpt:        formData.excerpt,
        cover_image:    formData.cover_image,
        tags:           formData.tags,
        published:      formData.published,
        reading_time:   formData.reading_time,
        key_takeaways:  formData.key_takeaways,
        series_name:    formData.series_name,
        series_order:   formData.series_order === '' ? null : Number(formData.series_order),
        canonical_url:  formData.canonical_url,
        featured:       formData.featured,
        show_takeaways: formData.show_takeaways,
        show_toc:       formData.show_toc,
        show_share:     formData.show_share,
      };
      console.log('[Blog NEW] payload:', payload);
      const { data, error } = await supabase.from('blog_posts').insert([payload]).select();
      console.log('[Blog NEW] response:', { data, error });
      if (error) {
        console.error('[Blog NEW] Supabase error:', error);
        throw error;
      }
      router.push('/admin/blog');
    } catch (err) {
      console.error('[Blog NEW] submit failed:', err);
      alert('Error creating blog post: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const visibleCount = [formData.show_toc, formData.show_takeaways, formData.show_share].filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/blog">
          <Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back to Blog</Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Write New Post</h1>
            <p className="text-muted-foreground mt-2">Create a new blog article</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Post Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="My Awesome Blog Post" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">URL Slug *</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="my-awesome-blog-post" />
                <p className="text-xs text-muted-foreground mt-1">/blog/{formData.slug || 'your-post-slug'}</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Excerpt
                <span className="ml-2 text-xs text-muted-foreground font-normal">(auto-filled from first paragraph if left empty)</span>
              </label>
              <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3}
                placeholder="A brief summary shown in listings and social previews..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Content</label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Type <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">/</kbd> to insert blocks
                  </p>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full shrink-0">
                  {formData.reading_time} min read
                </span>
              </div>
              <BlogEditor
                value={formData.content}
                onChange={handleEditorChange}
                onMetaChange={handleMetaChange}
              />
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Lightbulb size={15} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">Key Takeaways</h3>
                  <p className="text-xs text-muted-foreground">Bullet summary card shown at the end of the post</p>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <input type="text" value={takeawayInput}
                  onChange={e => setTakeawayInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTakeaway())}
                  placeholder="e.g. Always separate concerns at the route level"
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <Button type="button" onClick={addTakeaway} size="sm"><Plus size={16} /></Button>
              </div>
              {formData.key_takeaways.length > 0 ? (
                <ul className="space-y-2">
                  {formData.key_takeaways.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 p-3 bg-background border border-border rounded-lg text-sm">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span className="flex-1 text-foreground">{item}</span>
                      <button type="button" onClick={() => removeTakeaway(i)}>
                        <X size={14} className="text-muted-foreground hover:text-red-400" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground italic">No takeaways yet — add at least 3.</p>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <BookOpen size={15} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">Series</h3>
                  <p className="text-xs text-muted-foreground">Group posts as a multi-part series</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Series Name</label>
                  <input type="text" name="series_name" value={formData.series_name} onChange={handleChange}
                    placeholder="e.g. React Performance Series"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Part #</label>
                  <input type="number" name="series_order" value={formData.series_order} onChange={handleChange}
                    min="1" placeholder="1"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Link2 size={15} className="text-violet-400" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">Canonical URL</h3>
                  <p className="text-xs text-muted-foreground">Only if cross-posted from dev.to / Hashnode</p>
                </div>
              </div>
              <input type="url" name="canonical_url" value={formData.canonical_url} onChange={handleChange}
                placeholder="https://dev.to/ayush/..."
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <button type="button" onClick={() => setVisOpen(v => !v)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-primary" />
                  <span className="font-bold text-foreground text-sm">Section Visibility</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{visibleCount} of 3 sections visible</span>
                  <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${visOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {visOpen && (
                <div className="px-6 pb-5 border-t border-border">
                  <p className="text-xs text-muted-foreground mt-4 mb-3">Toggle which sections render on the public post page.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'show_toc',       label: 'Table of Contents', desc: 'Sidebar TOC from headings' },
                      { key: 'show_takeaways', label: 'Key Takeaways',     desc: 'Summary card at end' },
                      { key: 'show_share',     label: 'Share Buttons',     desc: 'Twitter, LinkedIn, Copy link' },
                    ].map(({ key, label, desc }) => (
                      <label key={key}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData[key] ? 'border-primary/40 bg-primary/5' : 'border-border bg-background opacity-60'
                        }`}>
                        <input type="checkbox" name={key} checked={formData[key]} onChange={handleChange}
                          className="w-4 h-4 accent-primary mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <ImageUploader
                label="Cover Image"
                value={formData.cover_image}
                onChange={url => setFormData(prev => ({ ...prev, cover_image: url }))}
                folder="blog" hint="Recommended: 1200×630px (OG image ratio)."
              />
              {formData.cover_image && (
                <div className="relative h-40 rounded-xl overflow-hidden bg-muted mt-3 border border-border">
                  <FallbackImage src={formData.cover_image} alt="Cover preview" fill className="object-cover" unoptimized
                    fallback={<div className="flex flex-col items-center gap-2 text-muted-foreground"><FileText size={32} /><span className="text-xs">Preview unavailable</span></div>}
                    containerClassName="absolute inset-0 flex items-center justify-center bg-muted"
                  />
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold text-foreground mb-4">Tags</h3>
              <div className="flex gap-2 mb-3">
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
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

            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-bold text-foreground">Settings</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="w-4 h-4 accent-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Publish Post</p>
                  <p className="text-xs text-muted-foreground">Make visible to public immediately</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 accent-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Star size={13} className="text-yellow-400" /> Featured Post
                  </p>
                  <p className="text-xs text-muted-foreground">Highlighted on blog listing</p>
                </div>
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />Publishing...</span>
                : <span className="flex items-center gap-2"><Save size={18} />Publish Post</span>
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
