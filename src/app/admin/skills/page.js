'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Plus, Trash2, RefreshCw, Loader2,
  CheckCircle, AlertCircle, Layers, X, ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

const CATEGORIES = [
  { id: 'frontend', label: 'Frontend'      },
  { id: 'backend',  label: 'Backend'       },
  { id: 'tools',    label: 'Tools & DevOps'},
  { id: 'other',    label: 'Other'         },
];

const inputClass =
  'w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition';

const EMPTY_FORM = { name: '', icon: '', category: 'frontend' };

function IconPreview({ src, name, size = 32 }) {
  const [err, setErr] = useState(false);
  useEffect(() => setErr(false), [src]);
  if (!src || err) return (
    <div
      style={{ width: size, height: size }}
      className="rounded bg-muted flex items-center justify-center text-muted-foreground"
    >
      <ImageIcon size={size * 0.55} />
    </div>
  );
  return (
    <Image
      src={src} alt={name || 'icon'}
      width={size} height={size}
      className="rounded object-contain"
      onError={() => setErr(true)}
      unoptimized
    />
  );
}

export default function AdminSkillsPage() {
  const [skills, setSkills]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [adding, setAdding]       = useState(false);
  const [deleting, setDeleting]   = useState(null);
  const [toast, setToast]         = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState('frontend');
  const [showAdd, setShowAdd]     = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/skills');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSkills((await res.json()) || []);
    } catch (err) {
      showToast('error', `Failed to load: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const handleAdd = async () => {
    if (!form.name.trim()) return showToast('error', 'Skill name is required.');
    setAdding(true);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ name: form.name.trim(), icon: form.icon.trim() || null, category: form.category }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Add failed');
      setSkills(prev => [...prev, json]);
      setForm(EMPTY_FORM);
      setShowAdd(false);
      setActiveTab(form.category);
      showToast('success', `"${json.name}" added!`);
    } catch (err) {
      showToast('error', `Add failed: ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (skill) => {
    if (!confirm(`Delete "${skill.name}"? This cannot be undone.`)) return;
    setDeleting(skill.id);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ id: skill.id }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'Delete failed'); }
      setSkills(prev => prev.filter(s => s.id !== skill.id));
      showToast('success', `"${skill.name}" deleted.`);
    } catch (err) {
      showToast('error', `Delete failed: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = skills.filter(s => s.category === activeTab);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-sm ${
          toast.type === 'success' ? 'bg-green-950/90 border-green-700 text-green-200' : 'bg-red-950/90 border-red-700 text-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} className="text-green-400 shrink-0" /> : <AlertCircle size={20} className="text-red-400 shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Skills</h1>
          <p className="text-muted-foreground text-sm">
            {skills.length} skill{skills.length !== 1 ? 's' : ''} across {CATEGORIES.length} categories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSkills} className="text-muted-foreground hover:text-foreground transition" title="Refresh">
            <RefreshCw size={18} />
          </button>
          <Button onClick={() => setShowAdd(v => !v)} className="bg-primary hover:bg-primary/90 gap-2">
            {showAdd ? <X size={16} /> : <Plus size={16} />}
            {showAdd ? 'Cancel' : 'Add Skill'}
          </Button>
        </div>
      </div>

      {/* Add Skill Form */}
      {showAdd && (
        <div className="bg-card border border-primary/30 rounded-xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
            <Plus size={16} className="text-primary" />New Skill
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Skill Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text" value={form.name} autoFocus
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. React" className={inputClass}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
              <select value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className={inputClass}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            {/* Icon URL — full width with preview */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Icon Image URL
                <span className="text-muted-foreground/60 font-normal ml-1">
                  — paste any image URL (PNG, SVG, WebP)
                </span>
              </label>
              <div className="flex items-center gap-3">
                {/* Live preview thumbnail */}
                <div className="shrink-0 w-12 h-12 rounded-xl border border-border bg-muted flex items-center justify-center overflow-hidden">
                  <IconPreview src={form.icon} name={form.name} size={36} />
                </div>
                <input
                  type="url" value={form.icon}
                  onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                  placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                  className={inputClass}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Tip: use{' '}
                <a href="https://devicon.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">devicon.dev</a>
                {' '}or{' '}
                <a href="https://simpleicons.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">simpleicons.org</a>
                {' '}— right-click any icon → Copy image address.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setForm(EMPTY_FORM); setShowAdd(false); }} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={adding} className="bg-primary hover:bg-primary/90 min-w-[120px]">
              {adding
                ? <span className="flex items-center gap-2"><Loader2 size={15} className="animate-spin" />Adding…</span>
                : <span className="flex items-center gap-2"><Plus size={15} />Add Skill</span>}
            </Button>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => {
          const count = skills.filter(s => s.category === cat.id).length;
          return (
            <button key={cat.id} onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === cat.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              }`}>
              {cat.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === cat.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <Layers size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No skills in this category yet.</p>
          <Button
            onClick={() => { setForm(p => ({ ...p, category: activeTab })); setShowAdd(true); }}
            variant="outline" className="mt-4 border-primary/40 hover:bg-primary/10">
            <Plus size={15} className="mr-2" />Add First Skill
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map(skill => (
            <div key={skill.id}
              className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-3 group hover:border-primary/40 transition-all relative"
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(skill)}
                disabled={deleting === skill.id}
                className="absolute top-2 right-2 p-1.5 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Delete"
              >
                {deleting === skill.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center overflow-hidden">
                <IconPreview src={skill.icon} name={skill.name} size={36} />
              </div>

              {/* Name */}
              <span className="text-sm font-semibold text-foreground text-center leading-tight">{skill.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
