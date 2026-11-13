'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  Edit3,
  Save,
  RotateCcw,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Award,
  Globe,
  Plus,
  X,
  FileCode,
  AlertCircle,
  ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import PehelStoryView from './PehelStoryView';

const BlogEditor = dynamic(() => import('@/components/blog/BlogEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] rounded-2xl border border-white/10 bg-[#080B11] flex flex-col items-center justify-center p-8 gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      <span className="text-xs font-mono text-gray-400">Loading Event Notion Editor...</span>
    </div>
  ),
});

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default function EventStoryClient({ initialEvent }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAdmin, editMode, showToast } = useAdminMode();

  const isEditParam = searchParams?.get('edit') === 'true';

  const [event, setEvent] = useState(initialEvent);
  const [activeView, setActiveView] = useState(() => (isEditParam && isAdmin ? 'edit' : 'read'));

  // If ?edit=true search param arrives and admin is logged in, switch to edit
  useEffect(() => {
    if (isEditParam && isAdmin) {
      setActiveView('edit');
    }
  }, [isEditParam, isAdmin]);

  // Form State
  const [title, setTitle] = useState(event.title || '');
  const [slug, setSlug] = useState(event.slug || '');
  const [tagline, setTagline] = useState(event.tagline || '');
  const [description, setDescription] = useState(event.description || '');
  const [category, setCategory] = useState(event.category || event.type || 'Hackathon');
  const [organizer, setOrganizer] = useState(event.organizer || '');
  const [location, setLocation] = useState(event.location || '');
  const [date, setDate] = useState(event.date || '');
  const [duration, setDuration] = useState(event.duration || '');
  const [result, setResult] = useState(event.result || '');
  const [prize, setPrize] = useState(event.prize || '');
  const [role, setRole] = useState(event.role || '');
  const [coverImage, setCoverImage] = useState(event.cover_image || '');
  const [published, setPublished] = useState(event.published !== false);
  const [featured, setFeatured] = useState(Boolean(event.featured));
  const [content, setContent] = useState(() => {
    if (typeof event.content === 'string') return event.content;
    if (Array.isArray(event.content)) return JSON.stringify(event.content);
    return '';
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Check unsaved changes
  const hasChanges = useMemo(() => {
    return (
      title !== (event.title || '') ||
      slug !== (event.slug || '') ||
      tagline !== (event.tagline || '') ||
      description !== (event.description || '') ||
      organizer !== (event.organizer || '') ||
      location !== (event.location || '') ||
      date !== (event.date || '') ||
      duration !== (event.duration || '') ||
      result !== (event.result || '') ||
      prize !== (event.prize || '') ||
      role !== (event.role || '') ||
      coverImage !== (event.cover_image || '') ||
      published !== (event.published !== false) ||
      featured !== Boolean(event.featured) ||
      content !== (typeof event.content === 'string' ? event.content : JSON.stringify(event.content || ''))
    );
  }, [
    title,
    slug,
    tagline,
    description,
    organizer,
    location,
    date,
    duration,
    result,
    prize,
    role,
    coverImage,
    published,
    featured,
    content,
    event,
  ]);

  const handleRevert = () => {
    setTitle(event.title || '');
    setSlug(event.slug || '');
    setTagline(event.tagline || '');
    setDescription(event.description || '');
    setOrganizer(event.organizer || '');
    setLocation(event.location || '');
    setDate(event.date || '');
    setDuration(event.duration || '');
    setResult(event.result || '');
    setPrize(event.prize || '');
    setRole(event.role || '');
    setCoverImage(event.cover_image || '');
    setPublished(event.published !== false);
    setFeatured(Boolean(event.featured));
    setContent(typeof event.content === 'string' ? event.content : JSON.stringify(event.content || ''));
    setError(null);
  };

  // Save changes to Supabase
  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setError('Event title is required.');
      showToast?.('Event title is required', 'error');
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      tagline: tagline.trim() || null,
      description: description.trim() || null,
      category,
      organizer: organizer.trim() || null,
      location: location.trim() || null,
      date: date || null,
      duration: duration.trim() || null,
      result: result.trim() || null,
      prize: prize.trim() || null,
      role: role.trim() || null,
      cover_image: coverImage.trim() || null,
      published,
      featured,
      content: typeof content === 'string' ? content.trim() : JSON.stringify(content),
      updated_at: new Date().toISOString(),
    };

    try {
      // Upsert by slug
      const { error: upsertError } = await supabase
        .from('events')
        .upsert(
          event.id ? { id: event.id, ...payload } : payload,
          { onConflict: 'slug' }
        );

      if (upsertError) throw upsertError;

      const updatedEvent = { ...event, ...payload };
      setEvent(updatedEvent);
      showToast?.(`Event "${title}" saved successfully!`, 'success');

      // Revalidate cache
      try {
        await fetch('/api/admin/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || '',
          },
          body: JSON.stringify({ paths: ['/events', `/events/${finalSlug}`] }),
        });
      } catch {}

      router.refresh();

      if (finalSlug !== event.slug) {
        router.push(`/events/${finalSlug}${activeView !== 'read' ? '?edit=true' : ''}`);
      }
    } catch (err) {
      setError(err?.message || 'Failed to save event');
      showToast?.(err?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }, [
    title,
    slug,
    tagline,
    description,
    category,
    organizer,
    location,
    date,
    duration,
    result,
    prize,
    role,
    coverImage,
    published,
    featured,
    content,
    event,
    activeView,
    router,
    showToast,
  ]);

  // Handle external admin commands (e.g. from AdminDock)
  useEffect(() => {
    const handleSetView = (e) => {
      if (e?.detail) setActiveView(e.detail);
      else setActiveView('edit');
    };
    const handleTogglePub = () => {
      setPublished((prev) => !prev);
    };
    window.addEventListener('admin:set-event-view', handleSetView);
    window.addEventListener('admin:edit-event', handleSetView);
    window.addEventListener('admin:toggle-published', handleTogglePub);
    return () => {
      window.removeEventListener('admin:set-event-view', handleSetView);
      window.removeEventListener('admin:edit-event', handleSetView);
      window.removeEventListener('admin:toggle-published', handleTogglePub);
    };
  }, []);

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

  return (
    <>
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
              {featured && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold">
                  <Sparkles size={11} />
                  <span>Featured Milestone</span>
                </span>
              )}
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
                <span>Event Editor</span>
              </button>
            </div>

            {/* Quick Actions & Save Trigger */}
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 text-xs font-mono text-gray-400">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300">⌘S</kbd>
                <span>to save</span>
              </span>

              {hasChanges && (
                <button
                  type="button"
                  onClick={handleRevert}
                  disabled={saving}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  title="Discard unsaved changes"
                >
                  <RotateCcw size={12} />
                  <span>Revert</span>
                </button>
              )}

              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className={`h-8 px-3.5 rounded-xl text-xs font-mono font-bold transition-all shadow-lg ${
                  hasChanges
                    ? 'bg-primary text-black hover:bg-primary/90 shadow-primary/25'
                    : 'bg-white/10 text-gray-400 hover:bg-white/10 cursor-not-allowed'
                }`}
              >
                <Save size={13} className="mr-1.5" />
                <span>{saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Up to date'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {activeView === 'read' ? (
        <PehelStoryView event={event} />
      ) : (
        /* Full-Canvas Notion-Style Event Editor */
        <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-200">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Event Header Controls */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#090D16] border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h2 className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                  Event Header &amp; Metadata Controls
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="accent-primary rounded"
                  />
                  <span>Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-primary rounded"
                  />
                  <span>Featured</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slug) setSlug(slugify(e.target.value));
                    }}
                    placeholder="e.g. Pehel — Ek Nayi Subha"
                    className="w-full text-base sm:text-xl font-bold text-white bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-4 py-2.5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. pehel"
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-3 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Tagline / Subtitle */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold">
                  Tagline / Theme
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. 8th Edition University-Wide Gratitude Initiative"
                  className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2.5 outline-none"
                />
              </div>

              {/* Executive Summary */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold">
                  Event Overview / Thesis
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Concise overview of the milestone, mission, and achievements..."
                  className="w-full text-sm text-gray-200 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl p-3.5 outline-none resize-none transition-all leading-relaxed"
                />
              </div>

              {/* Organizer, Location, Date, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <Globe size={12} className="text-primary" />
                    <span>Organizer</span>
                  </label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="Gyan Ganga Group"
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <MapPin size={12} className="text-emerald-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Jabalpur, MP"
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <Calendar size={12} className="text-indigo-400" />
                    <span>Date</span>
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="2025-01-15"
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <Users size={12} className="text-amber-400" />
                    <span>Duration / Team</span>
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="8 hours / 24 members"
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              {/* Result, Prize, Role, Cover Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <Award size={12} className="text-yellow-400" />
                    <span>Result / Status</span>
                  </label>
                  <input
                    type="text"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="1st Place Winner"
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold">
                    Prize / Citation
                  </label>
                  <input
                    type="text"
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    placeholder="Grand Prize"
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold">
                    My Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Media Lead & Director"
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <ImageIcon size={12} className="text-primary" />
                    <span>Cover Image URL</span>
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Narrative Story Canvas with Notion Editor */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#090D16] border border-white/10 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FileCode size={16} className="text-primary" />
                <h2 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                  Event Retrospective &amp; Narrative Canvas (Notion Editor)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-gray-500">
                Type <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-primary font-bold">/</kbd> for headings, callouts, images, quotes
              </span>
            </div>

            <BlogEditor
              value={content}
              onChange={(jsonStr) => setContent(jsonStr)}
            />
          </section>
        </div>
      )}
    </>
  );
}
