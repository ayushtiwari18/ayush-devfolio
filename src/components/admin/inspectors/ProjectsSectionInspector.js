'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import {
  FolderGit2,
  Plus,
  Star,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Search,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function ProjectsSectionInspector({ onClose }) {
  const router = useRouter();
  const { openDrawer, showToast } = useAdminMode();

  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode]   = useState('all'); // 'all' | 'featured' | 'drafts'

  useEffect(() => {
    let mounted = true;
    async function loadProjects() {
      try {
        const { data, error: err } = await supabase
          .from('projects')
          .select('id, title, slug, description, cover_image, technologies, featured, published, created_at')
          .order('created_at', { ascending: false });

        if (err) throw err;
        if (mounted && Array.isArray(data)) {
          setProjects(data);
        }
      } catch (e) {
        console.warn('Failed to load projects inventory:', e);
        setError('Could not load projects from Supabase.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProjects();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleFeatured = async (project) => {
    const nextState = !project.featured;
    try {
      const { error: err } = await supabase
        .from('projects')
        .update({ featured: nextState })
        .eq('id', project.id);

      if (err) throw err;

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: nextState } : p))
      );
      showToast(
        nextState
          ? `⭐ Marked "${project.title}" as featured`
          : `Removed "${project.title}" from featured`,
        'success'
      );
      router.refresh();
    } catch (e) {
      showToast(e?.message || 'Failed to update featured state', 'error');
    }
  };

  const handleTogglePublished = async (project) => {
    const nextState = !project.published;
    try {
      const { error: err } = await supabase
        .from('projects')
        .update({ published: nextState })
        .eq('id', project.id);

      if (err) throw err;

      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: nextState } : p))
      );
      showToast(
        nextState
          ? `Published "${project.title}"`
          : `Unpublished "${project.title}" (hidden)`,
        'info'
      );
      router.refresh();
    } catch (e) {
      showToast(e?.message || 'Failed to update publication status', 'error');
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${project.title}"?`)) return;

    try {
      const { error: err } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (err) throw err;

      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      showToast(`Deleted "${project.title}"`, 'info');
      router.refresh();
    } catch (e) {
      showToast(e?.message || 'Failed to delete project', 'error');
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filterMode === 'featured' && !p.featured) return false;
    if (filterMode === 'drafts' && p.published) return false;
    if (!searchQuery) return true;
    return (
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const featuredCount = projects.filter((p) => p.featured).length;
  const draftCount = projects.filter((p) => !p.published).length;

  return (
    <InspectorDrawer
      title="Featured Engineering Systems"
      description="Manage all portfolio projects. Toggle which systems appear on the home canvas, adjust visibility, or create new case studies."
      icon={FolderGit2}
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
              placeholder="Search projects by title or slug..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Add New Project button */}
          <button
            type="button"
            data-testid="add-project-btn"
            onClick={() => openDrawer('project-new')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-mono-code font-semibold transition-all shrink-0"
          >
            <Plus size={13} />
            <span>+ Add Project</span>
          </button>
        </div>

        {/* Filter Tabs & Link to Catalog */}
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
              All ({projects.length})
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
            href="/projects"
            onClick={onClose}
            className="text-[11px] font-mono-code text-primary hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Living Catalog</span>
            <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono-code text-muted-foreground animate-pulse">
            Loading engineering artifacts...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-10 text-center text-xs font-mono-code text-muted-foreground">
            No projects match the selected filter.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`p-3 rounded-2xl bg-[#0c0d14] border transition-all ${
                project.featured
                  ? 'border-yellow-400/30 shadow-sm shadow-yellow-500/5'
                  : 'border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white truncate font-display">
                      {project.title}
                    </h4>

                    {project.featured && (
                      <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 flex items-center gap-0.5">
                        <Star size={10} fill="currentColor" />
                        <span>Featured</span>
                      </span>
                    )}

                    {!project.published && (
                      <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        Draft / Hidden
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400 line-clamp-1 mb-2 font-sans">
                    {project.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono-code text-muted-foreground">
                    <span className="text-gray-500">/{project.slug}</span>
                    {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-primary truncate max-w-[200px]">
                          {project.technologies.slice(0, 3).join(', ')}
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
                    onClick={() => handleToggleFeatured(project)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      project.featured
                        ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                        : 'text-zinc-500 hover:text-yellow-400 hover:bg-white/5'
                    }`}
                    title={project.featured ? 'Remove from Featured' : 'Mark as Featured on Home'}
                  >
                    <Star size={13} fill={project.featured ? 'currentColor' : 'none'} />
                  </button>

                  {/* Toggle Published */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(project)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      project.published
                        ? 'text-emerald-400 hover:bg-emerald-500/10'
                        : 'text-amber-400 hover:bg-amber-500/10'
                    }`}
                    title={project.published ? 'Hide Project' : 'Publish Project'}
                  >
                    {project.published ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>

                  {/* Edit Full Project */}
                  <button
                    type="button"
                    onClick={() => openDrawer('project-edit', project)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                    title="Edit project details & architecture"
                  >
                    <Edit3 size={13} />
                  </button>

                  {/* Delete Project */}
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Delete project"
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
