'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  User, Globe, Save, Upload, CheckCircle, AlertCircle,
  Image as ImageIcon, RefreshCw, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

// Matches real DB columns exactly
const SOCIAL_FIELDS = [
  { key: 'github_url',    label: 'GitHub URL',    type: 'url',   icon: '🐙', placeholder: 'https://github.com/username' },
  { key: 'linkedin_url', label: 'LinkedIn URL',  type: 'url',   icon: '💼', placeholder: 'https://linkedin.com/in/username' },
  { key: 'twitter_url',  label: 'Twitter / X URL',type: 'url',  icon: '🐦', placeholder: 'https://twitter.com/username' },
  { key: 'resume_url',   label: 'Resume URL',    type: 'url',   icon: '📄', placeholder: 'https://drive.google.com/...' },
  { key: 'form_endpoint',label: 'Contact Form Endpoint', type: 'url', icon: '✉', placeholder: 'https://formspree.io/f/...' },
];

const inputClass =
  'w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground ' +
  'focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition';

export default function AdminSettingsPage() {
  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [toast, setToast]           = useState(null);
  const fileInputRef                = useRef(null);
  const [dragOver, setDragOver]     = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/profile');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProfile(data);
      setPreviewUrl(data.image_url || null);
    } catch (err) {
      showToast('error', `Failed to load profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (field, value) =>
    setProfile(prev => ({ ...prev, [field]: value }));

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-secret': ADMIN_SECRET },
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setPreviewUrl(json.url);
      setProfile(prev => ({ ...prev, image_url: json.url }));
      showToast('success', 'Image uploaded — click Save to apply.');
    } catch (err) {
      showToast('error', `Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e) => uploadImage(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    uploadImage(e.dataTransfer.files?.[0]);
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': ADMIN_SECRET,
        },
        body: JSON.stringify({
          id:           profile.id,
          name:         profile.name         || null,
          title:        profile.title        || null,
          description:  profile.description  || null,
          image_url:    profile.image_url    || null,
          // Exact DB column names
          github_url:   profile.github_url   || null,
          linkedin_url: profile.linkedin_url || null,
          twitter_url:  profile.twitter_url  || null,
          resume_url:   profile.resume_url   || null,
          form_endpoint:profile.form_endpoint|| null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      showToast('success', 'Profile saved! Hero section reflects changes on next visit.');
    } catch (err) {
      showToast('error', `Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-sm ${
          toast.type === 'success'
            ? 'bg-green-950/90 border-green-700 text-green-200'
            : 'bg-red-950/90 border-red-700 text-red-200'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle size={20} className="text-green-400 shrink-0" />
            : <AlertCircle size={20} className="text-red-400 shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Hero &amp; Profile Settings</h1>
          <p className="text-muted-foreground text-sm">Changes go live after saving and a page refresh.</p>
        </div>
        <button onClick={fetchProfile} className="text-muted-foreground hover:text-foreground transition" title="Refresh from database">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image uploader */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <ImageIcon size={18} className="text-primary" />Profile Image
            </h2>
            <div className="mb-4 flex justify-center">
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-primary/40 bg-muted">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Profile preview" fill className="object-cover" sizes="144px" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <User size={48} />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={28} />
                  </div>
                )}
              </div>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Upload size={22} className="mx-auto mb-2" />
              <p className="text-sm font-medium">{uploading ? 'Uploading…' : 'Drop image or click to browse'}</p>
              <p className="text-xs mt-1 opacity-70">JPEG · PNG · WebP · max 5 MB</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} className="hidden" />
            <div className="mt-4">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Or paste image URL directly</label>
              <input type="url" value={profile?.image_url || ''}
                onChange={e => { setPreviewUrl(e.target.value); handleChange('image_url', e.target.value); }}
                placeholder="https://…" className={inputClass + ' text-sm'} />
            </div>
          </div>
        </div>

        {/* Text + social fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hero content */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
              <User size={18} className="text-primary" />Hero Content
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <input type="text" value={profile?.name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="e.g. Ayush Tiwari" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Professional Title</label>
                <input type="text" value={profile?.title || ''}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder="e.g. Full Stack Developer" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Hero Description</label>
                <textarea value={profile?.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  rows={4} placeholder="Short bio (2–3 sentences)…"
                  className={inputClass + ' resize-none'} />
                <p className="text-xs text-muted-foreground mt-1">{(profile?.description || '').length} / 300 recommended</p>
              </div>
            </div>
          </div>

          {/* Social + links */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
              <Globe size={18} className="text-primary" />Links &amp; Social
            </h2>
            <div className="space-y-4">
              {SOCIAL_FIELDS.map(({ key, label, type, icon, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <span className="mr-1.5">{icon}</span>{label}
                  </label>
                  <input type={type} value={profile?.[key] || ''}
                    onChange={e => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    className={inputClass} />
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={fetchProfile} className="border-border" type="button">
              <RefreshCw size={16} className="mr-2" />Discard
            </Button>
            <Button onClick={handleSave} disabled={saving || uploading} className="bg-primary hover:bg-primary/90 min-w-[140px]">
              {saving
                ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" />Saving…</span>
                : <span className="flex items-center gap-2"><Save size={16} />Save Changes</span>}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-sm text-amber-200/80">
        <strong className="text-amber-300">⚡ Upload not working?</strong>
        {' '}Make sure <code className="bg-amber-950/50 px-1 rounded">NEXT_PUBLIC_ADMIN_SECRET</code> and
        <code className="bg-amber-950/50 px-1 rounded"> ADMIN_SECRET</code> are set to the
        <strong> same value</strong> in your <code className="bg-amber-950/50 px-1 rounded">.env.local</code>.
        Also ensure Supabase Storage has a public bucket named <code className="bg-amber-950/50 px-1 rounded">avatars</code>.
      </div>
    </div>
  );
}
