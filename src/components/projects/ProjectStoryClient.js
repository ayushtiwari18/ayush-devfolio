'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  Edit3,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Globe,
  Github,
  Plus,
  X,
  Tag,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import ProjectStoryView from './ProjectStoryView';

const BlogEditor = dynamic(() => import('@/components/blog/BlogEditor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] rounded-2xl border border-white/10 bg-[#080B11] flex flex-col items-center justify-center p-8 gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      <span className="text-xs font-mono text-gray-400">Loading Case Study Notion Editor...</span>
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

export default function ProjectStoryClient({
  initialProject,
  authorHeroImage,
  authorName,
  relatedProjects = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAdmin, editMode, showToast } = useAdminMode();

  const isEditParam = searchParams?.get('edit') === 'true';

  const [project, setProject] = useState(initialProject);
  const [activeView, setActiveView] = useState(() => (isEditParam && isAdmin ? 'edit' : 'read'));

  // If ?edit=true search param arrives and admin is logged in, switch to edit
  useEffect(() => {
    if (isEditParam && isAdmin) {
      setActiveView('edit');
    }
  }, [isEditParam, isAdmin]);

  // Form State
  const [title, setTitle] = useState(project.title || '');
  const [slug, setSlug] = useState(project.slug || '');
  const [description, setDescription] = useState(project.description || '');
  const [coverImage, setCoverImage] = useState(project.cover_image || project.image || '');
  const [liveUrl, setLiveUrl] = useState(project.live_url || '');
  const [githubUrl, setGithubUrl] = useState(project.github_url || '');
  const [published, setPublished] = useState(Boolean(project.published));
  const [featured, setFeatured] = useState(Boolean(project.featured));
  const [architectureType, setArchitectureType] = useState(project.architecture_type || 'text');
  const [architecturePlan, setArchitecturePlan] = useState(project.architecture_plan || '');
  const [technologies, setTechnologies] = useState(project.technologies || []);
  const [tags, setTags] = useState(project.tags || []);
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Check unsaved changes
  const hasChanges = useMemo(() => {
    return (
      title !== (project.title || '') ||
      slug !== (project.slug || '') ||
      description !== (project.description || '') ||
      coverImage !== (project.cover_image || project.image || '') ||
      liveUrl !== (project.live_url || '') ||
      githubUrl !== (project.github_url || '') ||
      published !== Boolean(project.published) ||
      featured !== Boolean(project.featured) ||
      architectureType !== (project.architecture_type || 'text') ||
      architecturePlan !== (project.architecture_plan || '') ||
      JSON.stringify(technologies) !== JSON.stringify(project.technologies || []) ||
      JSON.stringify(tags) !== JSON.stringify(project.tags || [])
    );
  }, [
    title,
    slug,
    description,
    coverImage,
    liveUrl,
    githubUrl,
    published,
    featured,
    architectureType,
    architecturePlan,
    technologies,
    tags,
    project,
  ]);

  // Tag & Tech handlers
  const handleAddTech = (e) => {
    e?.preventDefault();
    const val = techInput.trim();
    if (val && !technologies.includes(val)) {
      setTechnologies((prev) => [...prev, val]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (item) => {
    setTechnologies((prev) => prev.filter((t) => t !== item));
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

  const handleRevert = () => {
    setTitle(project.title || '');
    setSlug(project.slug || '');
    setDescription(project.description || '');
    setCoverImage(project.cover_image || project.image || '');
    setLiveUrl(project.live_url || '');
    setGithubUrl(project.github_url || '');
    setPublished(Boolean(project.published));
    setFeatured(Boolean(project.featured));
    setArchitectureType(project.architecture_type || 'text');
    setArchitecturePlan(project.architecture_plan || '');
    setTechnologies(project.technologies || []);
    setTags(project.tags || []);
    setError(null);
  };

  // Save changes to Supabase
  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setError('Project title is required.');
      showToast?.('Project title is required', 'error');
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      description: description.trim() || null,
      cover_image: coverImage.trim() || null,
      live_url: liveUrl.trim() || null,
      github_url: githubUrl.trim() || null,
      published,
      featured,
      architecture_type: architectureType,
      architecture_plan: architecturePlan.trim() || null,
      technologies,
      tags,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', project.id);

      if (updateError) throw updateError;

      const updatedProject = { ...project, ...payload };
      setProject(updatedProject);
      showToast?.(`Case study "${title}" saved successfully!`, 'success');

      // Invalidate Next.js cache
      try {
        await fetch('/api/admin/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || '',
          },
          body: JSON.stringify({ paths: ['/projects', `/projects/${finalSlug}`] }),
        });
      } catch {
        // Non-fatal
      }

      router.refresh();

      if (finalSlug !== project.slug) {
        router.push(`/projects/${finalSlug}${activeView !== 'read' ? '?edit=true' : ''}`);
      }
    } catch (err) {
      setError(err?.message || 'Failed to persist case study changes');
      showToast?.(err?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  }, [
    title,
    slug,
    description,
    coverImage,
    liveUrl,
    githubUrl,
    published,
    featured,
    architectureType,
    architecturePlan,
    technologies,
    tags,
    project,
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
    window.addEventListener('admin:set-project-view', handleSetView);
    window.addEventListener('admin:edit-story', handleSetView);
    window.addEventListener('admin:toggle-published', handleTogglePub);
    return () => {
      window.removeEventListener('admin:set-project-view', handleSetView);
      window.removeEventListener('admin:edit-story', handleSetView);
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
                  <span>Featured Case Study</span>
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
                <span>Story Editor</span>
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
        <ProjectStoryView
          project={project}
          authorHeroImage={authorHeroImage}
          authorName={authorName}
          relatedProjects={relatedProjects}
        />
      ) : (
        /* Full-Canvas Notion-Style Case Study Editor */
        <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Metadata Header Box */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#090D16] border border-white/10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h2 className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                  Case Study Metadata Header
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
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slug) setSlug(slugify(e.target.value));
                    }}
                    placeholder="e.g. Sentinal — AI Cloud Threat Interceptor"
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
                    placeholder="e.g. sentinal"
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-3 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Executive Summary / Hook */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold">
                  Executive Summary / Hook
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="High-signal overview of what problem this system solves..."
                  className="w-full text-sm text-gray-200 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl p-3.5 outline-none resize-none transition-all leading-relaxed"
                />
              </div>

              {/* Cover Image, Live URL & Github URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <ImageIcon size={12} className="text-primary" />
                    <span>Hero Cover Image URL</span>
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <Globe size={12} className="text-emerald-400" />
                    <span>Live Demo URL</span>
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://demo.example.com"
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                    <Github size={12} className="text-zinc-400" />
                    <span>GitHub Repository</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/ayushtiwari18/..."
                    className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              {/* Technologies Pills Manager */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-mono text-gray-400 uppercase font-semibold flex items-center gap-1.5">
                  <Layers size={12} className="text-primary" />
                  <span>Technologies &amp; Architecture Stack</span>
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/25 text-primary text-xs font-mono"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-400 ml-0.5"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                  <form onSubmit={handleAddTech} className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Add tech (e.g. Next.js)..."
                      className="px-2.5 py-1 rounded-lg bg-[#06080E] border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Narrative Block Canvas */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#090D16] border border-white/10 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FileCode size={16} className="text-primary" />
                <h2 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                  Architecture &amp; Engineering Narrative (Notion Canvas)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-gray-500">
                Type <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-primary font-bold">/</kbd> for blocks, code fences, callouts
              </span>
            </div>

            <BlogEditor
              value={architecturePlan}
              onChange={(jsonStr) => setArchitecturePlan(jsonStr)}
            />
          </section>
        </div>
      )}
    </>
  );
}
