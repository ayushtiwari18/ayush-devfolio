'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { FALLBACK_BIO } from '@/components/sections/About';
import { ACHIEVEMENTS } from '@/lib/constants';
import {
  BookOpen,
  MapPin,
  Mail,
  Briefcase,
  Award,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Eye,
} from 'lucide-react';

export default function AboutInspector({ initialData = null, onClose }) {
  const router = useRouter();
  const { showToast } = useAdminMode();

  const [loading, setLoading] = useState(!initialData?.profile?.id);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  // Profile data
  const [profileId, setProfileId]       = useState(initialData?.profile?.id || null);
  const [bio, setBio]                   = useState(initialData?.profile?.about_bio || FALLBACK_BIO);
  const [availability, setAvailability] = useState(initialData?.profile?.about_availability || 'Open for full-stack engineering');
  const [location, setLocation]         = useState(initialData?.profile?.about_location || 'Jabalpur, Madhya Pradesh, India');
  const [email, setEmail]               = useState(initialData?.profile?.about_email || 'ayushtiwari.dev@gmail.com');

  // Quantified Achievements data
  const [achievements, setAchievements] = useState(() => {
    if (Array.isArray(initialData?.achievements) && initialData.achievements.length > 0) {
      return initialData.achievements;
    }
    return ACHIEVEMENTS;
  });

  const [activeTab, setActiveTab] = useState('narrative'); // 'narrative' | 'metrics'
  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123';

  // Fetch fresh profile & achievements from DB
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [profileRes, achRes] = await Promise.all([
          fetch('/api/admin/profile').catch(() => null),
          fetch('/api/admin/achievements').catch(() => null),
        ]);

        if (profileRes && profileRes.ok) {
          const profileData = await profileRes.json();
          if (mounted && profileData) {
            setProfileId(profileData.id);
            if (profileData.about_bio) setBio(profileData.about_bio);
            if (profileData.about_availability) setAvailability(profileData.about_availability);
            if (profileData.about_location) setLocation(profileData.about_location);
            if (profileData.about_email) setEmail(profileData.about_email);
          }
        }

        if (achRes && achRes.ok) {
          const achData = await achRes.json();
          if (mounted && Array.isArray(achData) && achData.length > 0) {
            setAchievements(achData);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch About section data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAchievementChange = (index, field, value) => {
    setAchievements((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!profileId) {
      setError('Profile configuration ID missing. Please reload.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // 1. Update Profile Settings (Bio, Availability, Location, Email)
      const profilePromise = fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({
          id: profileId,
          about_bio: bio.trim(),
          about_availability: availability.trim() || null,
          about_location: location.trim() || null,
          about_email: email.trim() || null,
        }),
      });

      // 2. Update modified achievements that have a database ID
      const achPromises = achievements
        .filter((a) => a.id)
        .map((a) =>
          fetch('/api/admin/achievements', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-secret': secret,
            },
            body: JSON.stringify({
              id: a.id,
              label: a.label,
              value: a.value,
              description: a.description,
              icon: a.icon,
            }),
          })
        );

      const [profileRes] = await Promise.all([profilePromise, ...achPromises]);

      if (!profileRes.ok) {
        const body = await profileRes.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${profileRes.status}`);
      }

      showToast('About section & narrative updated successfully', 'success');
      router.refresh();
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Failed to save About section');
    } finally {
      setSaving(false);
    }
  };

  const paragraphs = bio.split('\n\n').filter((p) => p.trim().length > 0);
  const wordCount = bio.trim().split(/\s+/).filter(Boolean).length;

  return (
    <InspectorDrawer
      title="About & Engineering Narrative"
      description="Edit your biographical story, availability status, location, and quantified metrics in place."
      icon={BookOpen}
      isOpen={true}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
      saveLabel="Save About Section"
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono-code mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl mb-4 font-mono-code text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('narrative')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'narrative'
              ? 'bg-primary text-white font-semibold shadow-md'
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          <BookOpen size={13} />
          Bio Narrative & Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'metrics'
              ? 'bg-primary text-white font-semibold shadow-md'
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          <BarChart3 size={13} />
          Deliverables Bar ({achievements.length})
        </button>
      </div>

      {activeTab === 'narrative' ? (
        <div className="space-y-5">
          {/* Availability Status */}
          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Briefcase size={13} className="text-emerald-400" />
              Availability Badge Status
            </label>
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Open for full-stack engineering & cloud systems"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono-code uppercase">Preview:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono-code">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {availability || 'Open for opportunities'}
              </span>
            </div>
          </div>

          {/* Paragraph Bio Story */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono-code uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen size={13} className="text-primary" />
                Biographical Narrative (Paragraphs)
              </label>
              <span className="text-[11px] font-mono-code text-muted-foreground">
                {wordCount} words · {paragraphs.length} paragraph{paragraphs.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">
              The continuous story rendered on your portfolio. Write naturally in complete paragraphs; press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono-code text-[10px]">Enter</kbd> twice for paragraph breaks.
            </p>
            <textarea
              rows={8}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={FALLBACK_BIO}
              className="w-full px-3.5 py-3 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Live In-Context Narrative Preview */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono-code text-primary">
              <Eye size={13} />
              <span>Live Website Preview</span>
            </div>
            <div className="space-y-3 pt-1 border-t border-white/5">
              {paragraphs.length > 0 ? (
                paragraphs.map((para, i) => (
                  <p key={i} className="text-xs text-gray-300 leading-relaxed">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">No bio content entered.</p>
              )}
            </div>
          </div>

          {/* Location & Contact Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                <MapPin size={12} className="text-primary" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Jabalpur, Madhya Pradesh, India"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
                <Mail size={12} className="text-primary" />
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ayushtiwari.dev@gmail.com"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Deliverables Metrics Tab */
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-mono-code">
            // Quantified engineering metrics rendered in the 6-tile bottom deliverables bar.
          </p>

          <div className="space-y-3">
            {achievements.map((item, index) => (
              <div
                key={item.id || index}
                className="p-3.5 rounded-2xl bg-[#0c0d14] border border-white/10 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono-code text-primary uppercase font-semibold">
                    Metric #{index + 1}
                  </span>
                  <span className="text-[11px] font-mono-code text-muted-foreground">
                    icon: {item.icon || 'rocket'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono-code text-muted-foreground uppercase mb-0.5">
                      Numeric Value
                    </label>
                    <input
                      type="text"
                      value={item.value || ''}
                      onChange={(e) => handleAchievementChange(index, 'value', e.target.value)}
                      placeholder="e.g. 5,600+"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141520] border border-white/10 text-white text-xs font-mono-code font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-muted-foreground uppercase mb-0.5">
                      Label / Title
                    </label>
                    <input
                      type="text"
                      value={item.label || ''}
                      onChange={(e) => handleAchievementChange(index, 'label', e.target.value)}
                      placeholder="e.g. GitHub Commits"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141520] border border-white/10 text-white text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-muted-foreground uppercase mb-0.5">
                    Subtext Description
                  </label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                    placeholder="e.g. Consistent open-source contributions"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#141520] border border-white/10 text-gray-300 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </InspectorDrawer>
  );
}
