'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import {
  FileText,
  Eye,
  Star,
  Plus,
  X,
  Clock,
  Image as ImageIcon,
  BookOpen,
  Sparkles,
  Columns,
  Maximize2,
} from 'lucide-react';

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default function BlogInspector({ mode = 'edit', post = null, onClose }) {
  const router = useRouter();
  const { showToast } = useAdminMode();

  const isNew = mode === 'new';

  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'preview', 'split', 'settings'

  // Form Fields
  const [title, setTitle]             = useState(post?.title || '');
  const [slug, setSlug]               = useState(post?.slug || '');
  const [excerpt, setExcerpt]         = useState(post?.excerpt || '');
  const [content, setContent]         = useState(() => {
    if (typeof post?.content === 'string') return post.content;
    if (Array.isArray(post?.content)) {
      // If block JSON, extract text
      return post.content.map((b) => (b.content?.[0]?.text ? b.content[0].text : '')).join('\n\n');
    }
    return '';
  });
  const [coverImage, setCoverImage]   = useState(post?.cover_image || '');
  const [featured, setFeatured]       = useState(Boolean(post?.featured));
  const [published, setPublished]     = useState(isNew ? true : Boolean(post?.published));
  const [readingTime, setReadingTime] = useState(post?.reading_time ?? 5);
  const [seriesName, setSeriesName]   = useState(post?.series_name || '');
  const [seriesOrder, setSeriesOrder] = useState(post?.series_order ?? 1);

  // Tags
  const [tags, setTags]               = useState(post?.tags || ['Engineering']);
  const [tagInput, setTagInput]       = useState('');

  // Auto calculate reading time based on words
  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const handleTitleChange = (e) => {
    const nextTitle = e.target.value;
    setTitle(nextTitle);
    if (isNew || !slug) {
      setSlug(slugify(nextTitle));
    }
  };

  const handleAddTag = (e) => {
    e?.preventDefault();
    const val = tagInput.trim().toLowerCase();
    if (val && !tags.includes(val)) {
      setTags((prev) => [...prev, val]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (item) => {
    setTags((prev) => prev.filter((t) => t !== item));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Article title is required.');
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      setError('A valid slug is required.');
      return;
    }

    setSaving(true);
    setError(null);

    const calculatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      cover_image: coverImage.trim() || null,
      featured,
      published,
      reading_time: readingTime || calculatedReadTime,
      series_name: seriesName.trim() || null,
      series_order: seriesName.trim() ? parseInt(seriesOrder, 10) || 1 : null,
      tags,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isNew) {
        const { error: insertError } = await supabase.from('blog_posts').insert([
          {
            ...payload,
            created_at: new Date().toISOString(),
          },
        ]);
        if (insertError) throw insertError;
        showToast(`Article "${title}" published successfully!`, 'success');
      } else {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', post.id);
        if (updateError) throw updateError;
        showToast(`Article "${title}" updated successfully!`, 'success');
      }

      router.refresh();
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <InspectorDrawer
      title={isNew ? 'Write New Article' : `Edit: ${post?.title || 'Article'}`}
      description="In-context markdown publication editor with live split-screen preview."
      icon={FileText}
      isOpen={true}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
      saveLabel={isNew ? 'Publish Article' : 'Save Changes'}
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono-code">
          {error}
        </div>
      )}

      {/* Editor Subnav Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all ${
              activeTab === 'editor'
                ? 'bg-primary text-black font-bold'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            Markdown
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all ${
              activeTab === 'preview'
                ? 'bg-primary text-black font-bold'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            Live Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1 rounded-lg text-xs font-mono-code transition-all ${
              activeTab === 'settings'
                ? 'bg-primary text-black font-bold'
                : 'text-muted-foreground hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>

        <span className="text-[11px] font-mono-code text-muted-foreground">
          {wordCount} words · {Math.max(1, Math.ceil(wordCount / 200))} min read
        </span>
      </div>

      {/* TAB 1: Editor View */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
              Article Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Building High-Performance Next.js Systems"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
              URL Slug *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-code text-muted-foreground">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="nextjs-systems"
                required
                className="flex-1 px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-primary text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
              Excerpt / Abstract
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="A comprehensive breakdown of edge computing, caching patterns, and streaming latency..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground">
                Article Body (Markdown)
              </label>
              <span className="text-[10px] font-mono-code text-zinc-500">
                Supports # Headings, ```code, &gt; blockquotes
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              placeholder="Write your article in markdown here..."
              className="w-full px-4 py-3 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary resize-y leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* TAB 2: Live Preview View */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <h1 className="text-2xl font-bold font-display text-white mb-2">{title || 'Untitled Article'}</h1>
            {excerpt && <p className="text-sm text-gray-400 italic mb-4">{excerpt}</p>}
            <div className="flex items-center gap-2 text-xs font-mono-code text-primary mb-6">
              <span>#{tags.join(' #')}</span>
              <span>· {Math.max(1, Math.ceil(wordCount / 200))} min read</span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-gray-300 prose-code:text-primary prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown>{content || '*No content written yet.*'}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Settings View */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* Cover Image */}
          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
              <ImageIcon size={13} className="text-primary" />
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Visibility and Featured toggles */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0f0f15] border border-white/10 cursor-pointer hover:border-white/20 transition-all">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-white/20 bg-black/40 text-yellow-400 focus:ring-0"
              />
              <div className="flex items-center gap-1.5 text-xs font-mono-code text-white">
                <Star size={13} className={featured ? 'text-yellow-400 fill-current' : 'text-zinc-500'} />
                <span>Featured Post</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0f0f15] border border-white/10 cursor-pointer hover:border-white/20 transition-all">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-white/20 bg-black/40 text-emerald-400 focus:ring-0"
              />
              <div className="flex items-center gap-1.5 text-xs font-mono-code text-white">
                <Eye size={13} className={published ? 'text-emerald-400' : 'text-zinc-500'} />
                <span>Published Live</span>
              </div>
            </label>
          </div>

          {/* Series information */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BookOpen size={13} className="text-primary" />
              Publication Series (Optional)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  value={seriesName}
                  onChange={(e) => setSeriesName(e.target.value)}
                  placeholder="Distributed Systems 101"
                  className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  value={seriesOrder}
                  onChange={(e) => setSeriesOrder(e.target.value)}
                  placeholder="Part #"
                  className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Tags Editor */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground">
              Article Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-mono-code text-primary"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400 p-0.5 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag (e.g. nextjs, cloud)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!tagInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-primary text-xs font-mono-code font-bold disabled:opacity-40"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </InspectorDrawer>
  );
}
