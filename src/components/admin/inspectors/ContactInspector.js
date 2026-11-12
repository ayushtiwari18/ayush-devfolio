'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import {
  Mail,
  Inbox,
  Send,
  MapPin,
  Briefcase,
  Globe,
  Sparkles,
  CheckCircle2,
  Trash2,
  Archive,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';

export default function ContactInspector({ onClose }) {
  const router = useRouter();
  const { showToast } = useAdminMode();

  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'inbox'
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState(null);

  // Profile contact settings
  const [profileId, setProfileId]       = useState(null);
  const [email, setEmail]               = useState('');
  const [location, setLocation]         = useState('');
  const [availability, setAvailability] = useState('');
  const [formEndpoint, setFormEndpoint] = useState('');
  const [githubUrl, setGithubUrl]       = useState('');
  const [linkedinUrl, setLinkedinUrl]   = useState('');
  const [twitterUrl, setTwitterUrl]     = useState('');

  // Messages inbox
  const [messages, setMessages]         = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123';

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [profRes, msgRes] = await Promise.all([
          fetch('/api/admin/profile').catch(() => null),
          supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20)
            .catch(() => ({ data: [] })),
        ]);

        if (profRes && profRes.ok) {
          const profData = await profRes.json();
          if (mounted && profData) {
            setProfileId(profData.id);
            setEmail(profData.about_email || 'ayushtiwari.dev@gmail.com');
            setLocation(profData.about_location || 'Jabalpur, Madhya Pradesh, India');
            setAvailability(profData.about_availability || 'Open for full-stack engineering & cloud systems');
            setFormEndpoint(profData.form_endpoint || '');
            setGithubUrl(profData.github_url || '');
            setLinkedinUrl(profData.linkedin_url || '');
            setTwitterUrl(profData.twitter_url || '');
          }
        }

        if (mounted && msgRes && Array.isArray(msgRes.data)) {
          setMessages(msgRes.data);
        }
      } catch (err) {
        console.warn('Failed to load contact inspector data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveSettings = async () => {
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
          about_email: email.trim() || null,
          about_location: location.trim() || null,
          about_availability: availability.trim() || null,
          form_endpoint: formEndpoint.trim() || null,
          github_url: githubUrl.trim() || null,
          linkedin_url: linkedinUrl.trim() || null,
          twitter_url: twitterUrl.trim() || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      showToast('Contact channels & settings updated', 'success');
      router.refresh();
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Failed to save contact settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRead = async (msg) => {
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    try {
      const { error: err } = await supabase
        .from('contact_messages')
        .update({ status: nextStatus })
        .eq('id', msg.id);

      if (err) throw err;

      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m))
      );
      showToast(`Marked inquiry as ${nextStatus}`, 'info');
    } catch (err) {
      showToast(err?.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const { error: err } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', msgId);

      if (err) throw err;

      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      showToast('Message deleted', 'info');
    } catch (err) {
      showToast(err?.message || 'Failed to delete message', 'error');
    }
  };

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <InspectorDrawer
      title="Contact Section & Inquiries"
      description="Configure contact endpoints, verified inquiry channels, availability status, and review incoming messages."
      icon={Mail}
      isOpen={true}
      onClose={onClose}
      onSave={activeTab === 'settings' ? handleSaveSettings : null}
      saving={saving}
      saveLabel="Save Contact Settings"
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono-code mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl mb-5 font-mono-code text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'settings'
              ? 'bg-primary text-white font-semibold shadow-sm'
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          <Mail size={13} />
          <span>Contact Channels</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inbox')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
            activeTab === 'inbox'
              ? 'bg-primary text-white font-semibold shadow-sm'
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          <Inbox size={13} />
          <span>Inquiries Inbox</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'settings' ? (
        /* Settings Tab */
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Mail size={13} className="text-primary" />
              Primary Inquiries Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ayushtiwari.dev@gmail.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

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
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono-code uppercase">Pill Preview:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono-code">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {availability || 'Available for opportunities'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <MapPin size={13} className="text-primary" />
              Location & Timezone
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Jabalpur, Madhya Pradesh, India"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-3 border-t border-white/10">
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Globe size={13} className="text-primary" />
              Custom Form Endpoint (Optional)
            </label>
            <input
              type="url"
              value={formEndpoint}
              onChange={(e) => setFormEndpoint(e.target.value)}
              placeholder="https://formspree.io/f/... or webhook"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[11px] text-muted-foreground mt-1 font-mono-code">
              Leave blank to persist directly to Supabase (`contact_messages` table).
            </p>
          </div>

          {/* Social Channels */}
          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <span className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground">
              Verified Social Channels
            </span>

            <div className="space-y-2">
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="GitHub URL (https://github.com/...)"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="LinkedIn URL (https://linkedin.com/in/...)"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="Twitter / X URL (https://x.com/...)"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Inbox Tab */
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-mono-code text-muted-foreground">
            <span>Recent Inquiries ({messages.length})</span>
            {unreadCount > 0 && (
              <span className="text-amber-400 font-semibold">{unreadCount} Unread</span>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-mono-code text-muted-foreground animate-pulse">
              Loading inquiries...
            </div>
          ) : messages.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono-code text-muted-foreground">
              No contact submissions yet.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3.5 rounded-2xl bg-[#0c0d14] border transition-all ${
                  msg.status === 'unread'
                    ? 'border-primary/40 bg-primary/[0.02]'
                    : 'border-white/5 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{msg.name || 'Anonymous'}</span>
                      {msg.status === 'unread' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                      )}
                    </h4>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-[11px] font-mono-code text-primary hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>

                  <span className="text-[10px] font-mono-code text-muted-foreground">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed my-2 font-sans bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                  {msg.message}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs font-mono-code">
                  <button
                    type="button"
                    onClick={() => handleToggleRead(msg)}
                    className="text-[11px] text-muted-foreground hover:text-white transition-colors"
                  >
                    {msg.status === 'unread' ? '✓ Mark Read' : '↺ Mark Unread'}
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry`}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                    >
                      <Send size={11} /> Reply
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="text-muted-foreground hover:text-red-400 p-1 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </InspectorDrawer>
  );
}
