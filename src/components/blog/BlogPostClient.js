'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  Star,
  Sparkles,
  ChevronRight,
  Eye,
  Edit3,
  Columns,
  Save,
  RotateCcw,
  Tag,
  ImageIcon,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import BlogContent from './BlogContent';
import BlogSidebar from './BlogSidebar';
import BlogTakeaways from './BlogTakeaways';
import BlogReadingNav from './BlogReadingNav';
import SeriesBanner from './SeriesBanner';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function BlogPostClient({
  initialPost,
  authorHeroImage,
  authorName,
  isAyush,
  relatedPosts = [],
  postUrl,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAdmin, editMode, showToast } = useAdminMode();

  const isEditParam = searchParams?.get('edit') === 'true';

  const [post, setPost] = useState(initialPost);
  const [activeView, setActiveView] = useState(() => (isEditParam && isAdmin ? 'edit' : 'read'));

  // If search param ?edit=true arrives and admin is logged in, switch to edit
  useEffect(() => {
    if (isEditParam && isAdmin) {
      setActiveView((prev) => (prev === 'read' ? 'edit' : prev));
    }
  }, [isEditParam, isAdmin]);

  // Form State
  const [title, setTitle] = useState(post.title || '');
  const [slug, setSlug] = useState(post.slug || '');
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [content, setContent] = useState(() => {
    if (typeof post.content === 'string') return post.content;
    if (Array.isArray(post.content)) {
      return post.content.map((b) => (b.content?.[0]?.text ? b.content[0].text : '')).join('\n\n');
    }
    return '';
  });
  const [coverImage, setCoverImage] = useState(post.cover_image || '');
  const [featured, setFeatured] = useState(Boolean(post.featured));
  const [published, setPublished] = useState(Boolean(post.published));
  const [readingTime, setReadingTime] = useState(post.reading_time ?? 5);
  const [seriesName, setSeriesName] = useState(post.series_name || '');
  const [seriesOrder, setSeriesOrder] = useState(post.series_order ?? 1);
  const [tags, setTags] = useState(post.tags || ['Engineering']);
  const [tagInput, setTagInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Word count & auto reading time calculation
  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const calculatedReadingTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  // Detect unsaved changes
  const hasChanges = useMemo(() => {
    return (
      title !== (post.title || '') ||
      excerpt !== (post.excerpt || '') ||
      content !== (typeof post.content === 'string' ? post.content : '') ||
      coverImage !== (post.cover_image || '') ||
      featured !== Boolean(post.featured) ||
      published !== Boolean(post.published) ||
      seriesName !== (post.series_name || '') ||
      seriesOrder !== (post.series_order ?? 1) ||
      JSON.stringify(tags) !== JSON.stringify(post.tags || ['Engineering'])
    );
  }, [title, excerpt, content, coverImage, featured, published, seriesName, seriesOrder, tags, post]);

  // Tag management
  const handleAddTag = (e) => {
    e?.preventDefault();
    const val = tagInput.trim().toLowerCase();
    if (val && !tags.includes(val)) {
      setTags((prev) => [...prev, val]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Revert changes back to current saved post
  const handleRevert = () => {
    setTitle(post.title || '');
    setSlug(post.slug || '');
    setExcerpt(post.excerpt || '');
    setContent(typeof post.content === 'string' ? post.content : '');
    setCoverImage(post.cover_image || '');
    setFeatured(Boolean(post.featured));
    setPublished(Boolean(post.published));
    setReadingTime(post.reading_time ?? 5);
    setSeriesName(post.series_name || '');
    setSeriesOrder(post.series_order ?? 1);
    setTags(post.tags || ['Engineering']);
    setError(null);
    showToast?.('Unsaved edits reverted.', 'info');
  };

  // Save changes to Supabase
  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setError('Article title cannot be empty.');
      showToast?.('Article title is required', 'error');
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      cover_image: coverImage.trim() || null,
      featured,
      published,
      reading_time: readingTime || calculatedReadingTime,
      series_name: seriesName.trim() || null,
      series_order: seriesName.trim() ? parseInt(seriesOrder, 10) || 1 : null,
      tags,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', post.id);

      if (updateError) throw updateError;

      // Update local state
      const updatedPost = { ...post, ...payload };
      setPost(updatedPost);
      showToast?.(`Article "${title}" published and saved!`, 'success');

      // Trigger server-side revalidation
      try {
        await fetch('/api/admin/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || '',
          },
          body: JSON.stringify({ paths: ['/blog', `/blog/${finalSlug}`] }),
        });
      } catch {
        // Silent fallback
      }

      router.refresh();

      if (finalSlug !== post.slug) {
        router.push(`/blog/${finalSlug}${activeView !== 'read' ? '?edit=true' : ''}`);
      }
    } catch (err) {
      setError(err?.message || 'Failed to persist article changes.');
      showToast?.(err?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }, [
    title,
    slug,
    excerpt,
    content,
    coverImage,
    featured,
    published,
    readingTime,
    calculatedReadingTime,
    seriesName,
    seriesOrder,
    tags,
    post,
    activeView,
    router,
    showToast,
  ]);

  // Cmd/Ctrl+S Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (isAdmin && (editMode || isEditParam)) {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, isAdmin, editMode, isEditParam]);

  const primaryCategory = tags?.[0] || 'ENGINEERING';

  return (
    <>
      {/* Sticky Top Reading Navigation Bar (syncs with current live title) */}
      <BlogReadingNav
        postTitle={title || post.title}
        postUrl={postUrl}
        category={primaryCategory}
      />

      {/* Admin Mode In-Context Editorial Toolbar */}
      {isAdmin && (editMode || isEditParam) && (
        <div className="sticky top-20 z-40 px-4 sm:px-6 lg:px-8 mb-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#090D16]/95 border border-primary/30 backdrop-blur-md shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider ${
                  published
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${published ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{published ? 'Published' : 'Draft / Private'}</span>
              </span>
              <span className="text-xs font-mono text-gray-400 hidden sm:inline-block">
                {wordCount} words · {calculatedReadingTime}m read
              </span>
            </div>

            {/* View Switcher Pills */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveView('read')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'read'
                    ? 'bg-primary text-black font-bold shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Eye size={13} />
                <span>Read View</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'edit'
                    ? 'bg-primary text-black font-bold shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Edit3 size={13} />
                <span>In-Context Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'split'
                    ? 'bg-primary text-black font-bold shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Columns size={13} />
                <span>Split Preview</span>
              </button>
            </div>

            {/* Quick Save Hint */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-gray-400">
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-[11px] text-gray-300">⌘S</kbd>
              <span>to quick save</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="min-h-screen pt-4 pb-32 px-4 sm:px-6 lg:px-8 selection:bg-primary/20 selection:text-white">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb & Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <nav className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">
                Index
              </Link>
              <ChevronRight size={12} className="text-gray-600" />
              <Link href="/blog" className="hover:text-white transition-colors">
                Publications
              </Link>
              <ChevronRight size={12} className="text-gray-600" />
              <span className="text-primary truncate max-w-[200px] sm:max-w-xs">
                {title || post.title}
              </span>
            </nav>

            <Link href="/blog">
              <Button
                variant="outline"
                className="h-9 px-3.5 text-xs font-mono border-white/10 bg-white/[0.03] hover:bg-white/10 hover:border-primary/40 text-gray-300 hover:text-white rounded-xl transition-all"
              >
                <ArrowLeft className="mr-1.5" size={13} />
                <span>All Articles</span>
              </Button>
            </Link>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              VIEW MODE: In-Context Full Canvas Edit or Split Preview
          ────────────────────────────────────────────────────────────── */}
          {isAdmin && (editMode || isEditParam) && activeView !== 'read' ? (
            <div className={activeView === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'max-w-[720px] mx-auto'}>
              {/* Left Column: Markdown & Metadata Editor */}
              <div className="space-y-6">
                {/* Error Banner */}
                {error && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Cover Image Input & Preview */}
                <div className="p-5 rounded-2xl bg-[#090D16] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-gray-300 flex items-center gap-2 font-bold uppercase tracking-wider">
                      <ImageIcon size={13} className="text-primary" />
                      <span>Cover Image URL</span>
                    </label>
                    {coverImage && (
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="text-xs font-mono text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or Supabase storage URL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080E] border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  />
                  {coverImage && (
                    <div className="relative h-44 rounded-xl overflow-hidden border border-white/10">
                      <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Series & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-[#090D16] border border-white/10">
                    <label className="block text-[11px] font-mono text-gray-400 uppercase font-semibold mb-1.5">
                      Series Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={seriesName}
                      onChange={(e) => setSeriesName(e.target.value)}
                      placeholder="e.g. Distributed Systems"
                      className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#090D16] border border-white/10">
                    <label className="block text-[11px] font-mono text-gray-400 uppercase font-semibold mb-1.5">
                      Part #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={seriesOrder}
                      onChange={(e) => setSeriesOrder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#06080E] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Tags Manager */}
                <div className="p-4 rounded-2xl bg-[#090D16] border border-white/10 space-y-2.5">
                  <label className="block text-[11px] font-mono text-gray-400 uppercase font-semibold">
                    Tags & Topics
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-mono"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-red-400 ml-0.5"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <form onSubmit={handleAddTag} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag and press Enter..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#06080E] border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono"
                    >
                      Add
                    </button>
                  </form>
                </div>

                {/* Inline Headline Title Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold">
                    Article Headline (H1)
                  </label>
                  <textarea
                    rows={2}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article Headline..."
                    className="w-full text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white bg-[#090D16] border border-white/10 focus:border-primary rounded-2xl p-4 leading-tight tracking-tight outline-none resize-none transition-all"
                  />
                </div>

                {/* Inline Excerpt Lead Textarea */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold">
                    Editorial Lead Excerpt / Thesis
                  </label>
                  <textarea
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="A concise, high-signal takeaway or thesis that leads the article..."
                    className="w-full text-base sm:text-lg text-gray-200/90 font-serif italic bg-[#090D16] border border-white/10 focus:border-primary rounded-2xl p-4 leading-relaxed outline-none resize-none transition-all"
                  />
                </div>

                {/* Markdown Content Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-2">
                      <FileText size={13} className="text-primary" />
                      <span>Article Markdown Body</span>
                    </label>
                    <span className="text-[11px] font-mono text-gray-500">
                      GitHub Flavored Markdown · Syntax Highlighting Supported
                    </span>
                  </div>
                  <textarea
                    rows={26}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Heading 1\n\n## Section 2\n\nYour article content here with ```typescript code blocks..."
                    className="w-full font-mono text-sm leading-relaxed p-5 bg-[#080B11] border border-white/10 focus:border-primary rounded-2xl text-gray-100 outline-none resize-y transition-all custom-scrollbar selection:bg-primary/30"
                  />
                </div>
              </div>

              {/* Right Column (Only in Split Preview mode) */}
              {activeView === 'split' && (
                <div className="space-y-6">
                  <div className="sticky top-28 p-6 rounded-3xl bg-[#090D16] border border-white/10 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Live Reader Preview
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        {wordCount} words
                      </span>
                    </div>

                    {coverImage && (
                      <div className="relative h-48 rounded-2xl overflow-hidden mb-6 border border-white/10">
                        <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-snug">
                      {title || 'Untitled Article'}
                    </h1>

                    {excerpt && (
                      <div className="relative pl-4 py-3 mb-6 border-l-2 border-primary bg-primary/[0.05] rounded-r-xl">
                        <p className="text-sm font-serif italic text-gray-200">{excerpt}</p>
                      </div>
                    )}

                    <div className="pt-2">
                      <BlogContent content={content} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ─────────────────────────────────────────────────────────────
                READ VIEW: Clean Public Publication Layout
            ────────────────────────────────────────────────────────────── */
            <>
              {/* Cover Hero Image */}
              {(coverImage || post.cover_image) && (
                <div className="relative w-full h-64 sm:h-[420px] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl shadow-black/50">
                  <Image
                    src={coverImage || post.cover_image}
                    alt={title || post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {(featured || post.featured) && (
                    <div className="absolute top-5 left-5 flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/90 backdrop-blur-md text-black text-xs font-bold font-mono rounded-full shadow-lg">
                      <Star size={12} fill="currentColor" />
                      <span>Featured Case Study</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-80" />
                </div>
              )}

              {/* Series Banner */}
              {(seriesName || post.series_name) && (
                <div className="mb-8">
                  <SeriesBanner
                    seriesName={seriesName || post.series_name}
                    seriesOrder={seriesOrder || post.series_order}
                  />
                </div>
              )}

              {/* Main Layout: Article + Editorial Sidebar */}
              <div className="flex flex-col xl:flex-row gap-12 lg:gap-16">
                <div className="flex-1 min-w-0">
                  {!published && (
                    <div className="mb-6 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono-code font-bold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span>DRAFT PREVIEW MODE — This article is currently unpublished</span>
                      </div>
                    </div>
                  )}

                  <article>
                    {/* Category & Metadata Pills */}
                    <div className="flex flex-wrap items-center gap-2.5 mb-5 font-mono text-xs">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/25 font-bold uppercase tracking-wider">
                        {primaryCategory}
                      </span>
                      {(seriesName || post.series_name) && (
                        <span className="px-3 py-1 rounded-lg bg-white/[0.04] text-gray-300 border border-white/10 flex items-center gap-1.5">
                          <BookOpen size={12} className="text-primary" />
                          <span>Part {seriesOrder || post.series_order} · {seriesName || post.series_name}</span>
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-lg bg-white/[0.04] text-gray-400 border border-white/10 flex items-center gap-1.5">
                        <Clock size={12} className="text-emerald-400" />
                        <span>{readingTime || calculatedReadingTime} min read</span>
                      </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-[1.12] tracking-tight">
                      {title || post.title}
                    </h1>

                    {/* Author Byline Card */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 mb-10 rounded-2xl bg-[#090D16] border border-white/10 shadow-lg shadow-black/30">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/40 shrink-0 shadow-md shadow-primary/20 bg-[#0A0D14]">
                          <Image
                            src={authorHeroImage}
                            alt={authorName}
                            fill
                            className="object-cover object-top"
                            unoptimized={authorHeroImage.includes('supabase.co')}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm sm:text-base">
                              {authorName}
                            </span>
                            {isAyush && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                Verified Author
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">
                            Systems & Full-Stack · 885+ DSA · LeetCode 1657
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-primary" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Editorial Lead Excerpt */}
                    {(excerpt || post.excerpt) && (
                      <div className="relative pl-6 sm:pl-8 py-5 pr-6 mb-10 rounded-2xl bg-[#090D16] border border-white/10 border-l-4 border-l-primary shadow-xl shadow-black/20">
                        <p className="text-base sm:text-lg text-gray-200/90 font-serif italic leading-relaxed">
                          &ldquo;{excerpt || post.excerpt}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Top Architectural Blueprint TL;DR */}
                    {post.show_takeaways !== false && post.key_takeaways?.length > 0 && (
                      <BlogTakeaways items={post.key_takeaways} position="top" />
                    )}

                    {/* Article Content Core */}
                    <div className="mt-8">
                      <BlogContent content={content || post.content} />
                    </div>

                    {/* Bottom Key Takeaways Synthesis */}
                    {post.show_takeaways !== false && post.key_takeaways?.length > 0 && (
                      <BlogTakeaways items={post.key_takeaways} position="bottom" />
                    )}

                    {/* Author Post-Reading Bio Card */}
                    <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#090D16] border border-white/10 relative overflow-hidden shadow-xl shadow-black/30">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 shrink-0 shadow-md bg-[#0A0D14]">
                            <Image
                              src={authorHeroImage}
                              alt={authorName}
                              fill
                              className="object-cover object-top"
                              unoptimized={authorHeroImage.includes('supabase.co')}
                            />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                              <span>{authorName}</span>
                              {isAyush && (
                                <span className="text-xs font-mono font-normal text-primary">@ayushtiwari18</span>
                              )}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 max-w-md leading-relaxed font-sans">
                              Full-Stack & Systems Engineer building high-throughput web apps, compilers, and algorithmic platforms.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <Link href="/blog" className="flex-1 sm:flex-none">
                            <Button
                              variant="outline"
                              className="w-full text-xs font-mono border-white/10 hover:border-primary/50 hover:bg-primary/10 text-gray-200"
                            >
                              <ArrowLeft size={13} className="mr-1.5" /> All Publications
                            </Button>
                          </Link>
                          <Link href="/#contact" className="flex-1 sm:flex-none">
                            <Button className="w-full text-xs font-mono bg-primary text-black hover:bg-primary/90 font-semibold">
                              Start Discussion
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Related Deep Dives */}
                    {relatedPosts.length > 0 && (
                      <section className="mt-16 pt-12 border-t border-white/10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2.5">
                            <Sparkles size={16} className="text-primary" />
                            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                              More Engineering Deep Dives
                            </h3>
                          </div>
                          <Link
                            href="/blog"
                            className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                          >
                            <span>View all</span>
                            <ChevronRight size={12} />
                          </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {relatedPosts.map((related) => (
                            <Link
                              key={related.slug}
                              href={`/blog/${related.slug}`}
                              className="group flex flex-col justify-between p-5 rounded-2xl bg-[#090D16] border border-white/10 hover:border-primary/40 hover:bg-[#0D1322] transition-all shadow-lg shadow-black/20"
                            >
                              <div>
                                <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-3">
                                  <span className="text-primary font-bold uppercase">
                                    {related.tags?.[0] || 'ENGINEERING'}
                                  </span>
                                  {related.reading_time && (
                                    <span>{related.reading_time} min read</span>
                                  )}
                                </div>
                                <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2">
                                  {related.title}
                                </h4>
                                {related.excerpt && (
                                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                    {related.excerpt}
                                  </p>
                                )}
                              </div>

                              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-gray-400 group-hover:text-primary transition-colors">
                                <span>Read Deep Dive</span>
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </section>
                    )}
                  </article>
                </div>

                {/* Editorial Sticky Sidebar */}
                <aside className="xl:w-80 shrink-0">
                  <BlogSidebar
                    content={content || post.content}
                    postUrl={postUrl}
                    postTitle={title || post.title}
                    readingTime={readingTime || calculatedReadingTime}
                    tags={tags || []}
                    showToc={post.show_toc !== false}
                    showShare={post.show_share !== false}
                    authorImage={authorHeroImage}
                    authorName={authorName}
                  />
                </aside>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          STICKY PERSISTENCE DOCK (Always visible when in Edit or Split mode)
      ────────────────────────────────────────────────────────────── */}
      {isAdmin && (editMode || isEditParam) && activeView !== 'read' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-6 rounded-2xl bg-[#090D16]/95 border border-primary/40 backdrop-blur-xl shadow-2xl shadow-black/90">
            <div className="flex items-center gap-3">
              {hasChanges ? (
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="font-semibold">Unsaved Changes</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <CheckCircle2 size={13} />
                  <span>Up to date</span>
                </div>
              )}
            </div>

            {/* Quick toggles: Published, Featured */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPublished(!published)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all ${
                  published
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <span>{published ? 'Published 👁️' : 'Draft Mode'}</span>
              </button>

              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`p-1.5 rounded-xl border transition-all ${
                  featured
                    ? 'bg-yellow-400/20 border-yellow-400/40 text-yellow-300'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-yellow-300'
                }`}
                title="Toggle featured publication"
                aria-label="Toggle featured"
              >
                <Star size={14} fill={featured ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Actions: Revert, Save */}
            <div className="flex items-center gap-2">
              {hasChanges && (
                <button
                  type="button"
                  onClick={handleRevert}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <RotateCcw size={13} />
                  <span>Revert</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Save size={13} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
