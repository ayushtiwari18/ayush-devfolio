'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { Sparkles, Plus, X, Globe, User, MapPin, Briefcase } from 'lucide-react';

export default function HeroInspector({ initialData = null, onClose }) {
  const router = useRouter();
  const { showToast } = useAdminMode();

  const [loading, setLoading] = useState(!initialData?.id);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  const [profileId, setProfileId] = useState(initialData?.id || null);
  const [name, setName]                   = useState(initialData?.name || '');
  const [title, setTitle]                 = useState(initialData?.title || '');
  const [description, setDescription]     = useState(initialData?.description || '');
  const [location, setLocation]           = useState(initialData?.about_location || '');
  const [availability, setAvailability]   = useState(initialData?.about_availability || '');
  const [githubUrl, setGithubUrl]         = useState(initialData?.github_url || '');
  const [linkedinUrl, setLinkedinUrl]     = useState(initialData?.linkedin_url || '');
  const [twitterUrl, setTwitterUrl]       = useState(initialData?.twitter_url || '');
  const [resumeUrl, setResumeUrl]         = useState(initialData?.resume_url || '');

  // Rolling texts array
  const [rollingTexts, setRollingTexts] = useState(() => {
    if (Array.isArray(initialData?.rolling_texts)) return initialData.rolling_texts;
    if (typeof initialData?.rolling_texts === 'string') {
      try {
        return JSON.parse(initialData.rolling_texts);
      } catch (_) {
        return [];
      }
    }
    return ['Full Stack Systems', 'Distributed Engines', 'Cloud Native', 'Next.js & Three.js'];
  });
  const [newTagInput, setNewTagInput] = useState('');

  // Fetch full profile row from server to get row ID and latest state
  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      try {
        const res = await fetch('/api/admin/profile');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted && data) {
          setProfileId(data.id);
          setName(data.name || '');
          setTitle(data.title || '');
          setDescription(data.description || '');
          setLocation(data.about_location || '');
          setAvailability(data.about_availability || '');
          setGithubUrl(data.github_url || '');
          setLinkedinUrl(data.linkedin_url || '');
          setTwitterUrl(data.twitter_url || '');
          setResumeUrl(data.resume_url || '');
          if (Array.isArray(data.rolling_texts)) {
            setRollingTexts(data.rolling_texts);
          } else if (typeof data.rolling_texts === 'string') {
            try {
              setRollingTexts(JSON.parse(data.rolling_texts));
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Failed to fetch profile row:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddTag = (e) => {
    e?.preventDefault();
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (!rollingTexts.includes(trimmed)) {
      setRollingTexts((prev) => [...prev, trimmed]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setRollingTexts((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!profileId) {
      setError('Profile ID is missing. Please refresh and try again.');
      return;
    }

    setSaving(true);
    setError(null);

    const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123';

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({
          id: profileId,
          name: name.trim(),
          title: title.trim(),
          description: description.trim(),
          about_location: location.trim(),
          about_availability: availability.trim(),
          rolling_texts: rollingTexts,
          github_url: githubUrl.trim() || null,
          linkedin_url: linkedinUrl.trim() || null,
          twitter_url: twitterUrl.trim() || null,
          resume_url: resumeUrl.trim() || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      showToast('Hero section updated successfully', 'success');
      router.refresh();
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <InspectorDrawer
      title="Hero & Profile Section"
      description="Update your live hero headline, rolling keywords, and availability."
      icon={Sparkles}
      isOpen={true}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
      saveLabel="Save Hero Section"
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono-code">
          {error}
        </div>
      )}

      {/* Primary Identity Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ayush Tiwari"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-zinc-600 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5">
            Professional Title / Role
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Full Stack Engineer & Researcher"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-zinc-600 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5">
            Hero Description / Bio Tagline
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Crafting high-performance distributed systems, Next.js applications, and cloud architecture..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-zinc-600 transition resize-none"
          />
        </div>
      </div>

      {/* Rolling Keywords Tag Editor */}
      <div className="pt-2 border-t border-white/10">
        <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5">
          Rotating Keywords / Roles
        </label>
        <p className="text-[11px] text-muted-foreground mb-3">
          These phrases animate across the rolling role ticker on the hero banner.
        </p>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {rollingTexts.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-mono-code"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-400 transition-colors p-0.5"
                title={`Remove ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {rollingTexts.length === 0 && (
            <span className="text-xs text-zinc-500 italic">No rotating keywords configured</span>
          )}
        </div>

        {/* Add tag input */}
        <form onSubmit={handleAddTag} className="flex gap-2">
          <input
            type="text"
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            placeholder="Add new keyword (e.g. Distributed Engines)..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={!newTagInput.trim()}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-primary text-xs font-mono-code font-semibold transition-all disabled:opacity-40"
          >
            Add
          </button>
        </form>
      </div>

      {/* Availability & Location Badges */}
      <div className="pt-2 border-t border-white/10 space-y-4">
        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Briefcase size={12} className="text-primary" />
            Availability Status
          </label>
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="Open for full-stack engineering & cloud systems."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-zinc-600 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <MapPin size={12} className="text-primary" />
            Location & Timezone
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Jabalpur, IN · IST (UTC+5:30)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-zinc-600 transition"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="pt-2 border-t border-white/10 space-y-3">
        <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
          <Globe size={12} className="text-primary" />
          Verified Channels & URLs
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="block text-[11px] font-mono-code text-muted-foreground mb-1">GitHub</span>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <span className="block text-[11px] font-mono-code text-muted-foreground mb-1">LinkedIn</span>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <span className="block text-[11px] font-mono-code text-muted-foreground mb-1">Twitter / X</span>
            <input
              type="url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://twitter.com/..."
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <span className="block text-[11px] font-mono-code text-muted-foreground mb-1">Resume PDF</span>
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </InspectorDrawer>
  );
}
