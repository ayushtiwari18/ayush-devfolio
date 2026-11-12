'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import {
  FolderGit2,
  Globe,
  Star,
  Eye,
  Plus,
  X,
  Layers,
  Code2,
  FileCode,
  Image as ImageIcon,
} from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default function ProjectInspector({ mode = 'edit', project = null, onClose }) {
  const router = useRouter();
  const { showToast } = useAdminMode();

  const isNew = mode === 'new';

  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  // Form Fields
  const [title, setTitle]                       = useState(project?.title || '');
  const [slug, setSlug]                         = useState(project?.slug || '');
  const [description, setDescription]           = useState(project?.description || '');
  const [coverImage, setCoverImage]             = useState(project?.cover_image || project?.image || '');
  const [featured, setFeatured]                 = useState(Boolean(project?.featured));
  const [published, setPublished]               = useState(isNew ? true : Boolean(project?.published));
  const [githubUrl, setGithubUrl]               = useState(project?.github_url || '');
  const [liveUrl, setLiveUrl]                   = useState(project?.live_url || '');
  const [architectureType, setArchitectureType] = useState(project?.architecture_type || 'text');
  const [architecturePlan, setArchitecturePlan] = useState(project?.architecture_plan || '');
  const [orderIndex, setOrderIndex]             = useState(project?.order_index ?? 0);

  // Array fields
  const [technologies, setTechnologies] = useState(project?.technologies || []);
  const [tags, setTags]                 = useState(project?.tags || []);
  const [techInput, setTechInput]       = useState('');
  const [tagInput, setTagInput]         = useState('');

  const handleTitleChange = (e) => {
    const nextTitle = e.target.value;
    setTitle(nextTitle);
    if (isNew || !slug) {
      setSlug(slugify(nextTitle));
    }
  };

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

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Project title is required.');
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      setError('A valid slug is required.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      description: description.trim() || null,
      cover_image: coverImage.trim() || null,
      featured,
      published,
      github_url: githubUrl.trim() || null,
      live_url: liveUrl.trim() || null,
      technologies,
      tags,
      architecture_type: architectureType,
      architecture_plan: architecturePlan.trim() || null,
      order_index: parseInt(orderIndex, 10) || 0,
      updated_at: new Date().toISOString(),
    };

    try {
      if (isNew) {
        const { error: insertError } = await supabase.from('projects').insert([payload]);
        if (insertError) throw insertError;
        showToast(`Project "${title}" created successfully!`, 'success');
      } else {
        const { error: updateError } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', project.id);
        if (updateError) throw updateError;
        showToast(`Project "${title}" updated successfully!`, 'success');
      }

      router.refresh();
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <InspectorDrawer
      title={isNew ? 'Create New Project' : `Edit: ${project?.title || 'Project'}`}
      description="In-context artifact manager for distributed engines and case studies."
      icon={FolderGit2}
      isOpen={true}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
      saveLabel={isNew ? 'Create Project' : 'Save Changes'}
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono-code">
          {error}
        </div>
      )}

      {/* Main Metadata */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
            Project Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Sentinal WAF Engine"
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
            URL Slug *
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code text-muted-foreground">/projects/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="sentinal-waf"
              required
              className="flex-1 px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-primary text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
            Executive Summary / Tagline
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Real-time multi-layered Web Application Firewall and automated intrusion detection engine..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
            <ImageIcon size={13} className="text-primary" />
            Cover Image URL
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* State & Ordering Toggles */}
      <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0f0f15] border border-white/10 cursor-pointer hover:border-white/20 transition-all">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-white/20 bg-black/40 text-yellow-400 focus:ring-0"
          />
          <div className="flex items-center gap-1.5 text-xs font-mono-code text-white">
            <Star size={13} className={featured ? 'text-yellow-400 fill-current' : 'text-zinc-500'} />
            <span>Featured</span>
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
            <span>Published</span>
          </div>
        </label>
      </div>

      {/* Links & Order */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <GitHubIcon className="w-3.5 h-3.5 fill-current text-primary" />
              GitHub URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <Globe size={13} className="text-primary" />
              Live Deployment URL
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
            Catalog Sort Order Index
          </label>
          <input
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(e.target.value)}
            className="w-24 px-3 py-1.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Technologies Tag Editor */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground">
          Technologies Stack
        </label>
        <div className="flex flex-wrap gap-1.5">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono-code text-zinc-300"
            >
              <span>{tech}</span>
              <button
                type="button"
                onClick={() => handleRemoveTech(tech)}
                className="hover:text-red-400 p-0.5 transition-colors"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={handleAddTech} className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Add tech (e.g. FastAPI, Redis)..."
            className="flex-1 px-3 py-1.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!techInput.trim()}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-primary text-xs font-mono-code font-bold disabled:opacity-40"
          >
            Add
          </button>
        </form>
      </div>

      {/* Category Tags Editor */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground">
          Category Tags
        </label>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-mono-code text-primary"
            >
              <span>{tag}</span>
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
            placeholder="Add category tag (e.g. cybersecurity, cloud)..."
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

      {/* Architecture Plan Section */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers size={13} className="text-primary" />
            Architecture Plan
          </label>
          <div className="flex items-center gap-1.5">
            {['text', 'mermaid', 'image'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setArchitectureType(type)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-code uppercase ${
                  architectureType === type
                    ? 'bg-primary text-black font-bold'
                    : 'bg-white/5 text-muted-foreground hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={architecturePlan}
          onChange={(e) => setArchitecturePlan(e.target.value)}
          rows={5}
          placeholder={
            architectureType === 'mermaid'
              ? 'flowchart TD\n  Client --> CDN\n  CDN --> WAF\n  WAF --> Backend'
              : 'Detailed architectural pipeline and dataflow documentation...'
          }
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary resize-y"
        />
      </div>
    </InspectorDrawer>
  );
}
