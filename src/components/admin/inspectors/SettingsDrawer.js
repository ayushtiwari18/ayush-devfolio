'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import {
  Settings,
  Globe,
  Mail,
  User,
  MapPin,
  Briefcase,
  FileText,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';

export default function SettingsDrawer({ onClose }) {
  const router = useRouter();
  const { showToast } = useAdminMode();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  const [profileId, setProfileId]       = useState(null);
  const [name, setName]                 = useState('');
  const [title, setTitle]               = useState('');
  const [imageUrl, setImageUrl]         = useState('');
  const [email, setEmail]               = useState('');
  const [location, setLocation]         = useState('');
  const [availability, setAvailability] = useState('');
  const [githubUrl, setGithubUrl]       = useState('');
  const [linkedinUrl, setLinkedinUrl]   = useState('');
  const [twitterUrl, setTwitterUrl]     = useState('');
  const [resumeUrl, setResumeUrl]       = useState('');
  const [formEndpoint, setFormEndpoint] = useState('');

  // Highlights array
  const [highlights, setHighlights]     = useState([]);
  const [newHighlight, setNewHighlight] = useState('');

  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123';

  useEffect(() => {
    let mounted = true;
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/profile');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted && data) {
          setProfileId(data.id);
          setName(data.name || '');
          setTitle(data.title || '');
          setImageUrl(data.image_url || '');
          setEmail(data.about_email || '');
          setLocation(data.about_location || '');
          setAvailability(data.about_availability || '');
          setGithubUrl(data.github_url || '');
          setLinkedinUrl(data.linkedin_url || '');
          setTwitterUrl(data.twitter_url || '');
          setResumeUrl(data.resume_url || '');
          setFormEndpoint(data.form_endpoint || '');
          if (Array.isArray(data.about_highlights)) {
            setHighlights(data.about_highlights);
          } else if (typeof data.about_highlights === 'string') {
            try {
              setHighlights(JSON.parse(data.about_highlights));
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Failed to load profile settings:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddHighlight = (e) => {
    e?.preventDefault();
    const val = newHighlight.trim();
    if (val && !highlights.includes(val)) {
      setHighlights((prev) => [...prev, val]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (item) => {
    setHighlights((prev) => prev.filter((h) => h !== item));
  };

  const handleSave = async () => {
    if (!profileId) {
      setError('Profile configuration missing. Please reload.');
      return;
    }

    setSaving(true);
    setError(null);

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
          image_url: imageUrl.trim() || null,
          about_email: email.trim() || null,
          about_location: location.trim() || null,
          about_availability: availability.trim() || null,
          about_highlights: highlights,
          github_url: githubUrl.trim() || null,
          linkedin_url: linkedinUrl.trim() || null,
          twitter_url: twitterUrl.trim() || null,
          resume_url: resumeUrl.trim() || null,
          form_endpoint: formEndpoint.trim() || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      showToast('Global settings updated successfully', 'success');
      router.refresh();
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <InspectorDrawer
      title="Global Site & SEO Settings"
      description="Configure portfolio identity, social links, resume endpoints, and key highlights."
      icon={Settings}
      isOpen={true}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
      saveLabel="Save Settings"
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono-code">
          {error}
        </div>
      )}

      {/* Identity & Contact */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ayush Tiwari"
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tiwariaayush780@gmail.com"
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
            Global Headline Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Full Stack Engineer & Researcher"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
            Profile Avatar Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3.5 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Verified Social Channels */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Globe size={13} className="text-primary" />
          Verified Channels &amp; Links
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

      {/* Location & Availability */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <MapPin size={12} className="text-primary" />
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Jabalpur, IN · IST (UTC+5:30)"
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
              <Briefcase size={12} className="text-primary" />
              Availability Badge
            </label>
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Open for full-stack engineering"
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* About Highlights */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary" />
          About Section Highlights
        </label>
        <p className="text-[11px] text-muted-foreground">
          Bullet highlights rendered on the About dossier view.
        </p>

        <div className="space-y-1.5">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-xs text-zinc-300 font-sans"
            >
              <span>{h}</span>
              <button
                type="button"
                onClick={() => handleRemoveHighlight(h)}
                className="hover:text-red-400 p-1 transition-colors"
                title="Remove bullet"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddHighlight} className="flex gap-2 pt-1">
          <input
            type="text"
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            placeholder="Add highlight (e.g. 885+ LeetCode problems solved)..."
            className="flex-1 px-3 py-1.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!newHighlight.trim()}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-primary text-xs font-mono-code font-bold disabled:opacity-40"
          >
            Add
          </button>
        </form>
      </div>
    </InspectorDrawer>
  );
}
