'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, Save, RefreshCw, Loader2,
  CheckCircle, AlertCircle, Layers, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

const CATEGORIES = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend',  label: 'Backend'  },
  { id: 'tools',    label: 'Tools & DevOps' },
  { id: 'other',    label: 'Other'    },
];

const inputClass =
  'w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition';

const EMPTY_FORM = { name: '', icon: '', category: 'frontend', level: 80 };

export default function AdminSkillsPage() {
  const [skills, setSkills]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(null); // id or 'new'
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
      const data = await res.json();
      setSkills(data || []);
    } catch (err) {
      showToast('error', `Failed to load: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  // Add new skill
  const handleAdd = async () => {
    if (!form.name.trim()) return showToast('error', 'Skill name is required.');
    setSaving('new');
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ ...form, level: Number(form.level) }),
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
      setSaving(null);
    }
  };

  // Inline level edit
  const handleLevelChange = (id, level) =>
    setSkills(prev => prev.map(s => s.id === id ? { ...s, level: Number(level) } : s));

  const handleUpdateLevel = async (skill) => {
    setSaving(skill.id);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ id: skill.id, level: skill.level }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Update failed');
      setSkills(prev => prev.map(s => s.id === json.id ? json : s));
      showToast('success', `"${json.name}" updated!`);
    } catch (err) {
      showToast('error', `Update failed: ${err.message}`);
    } finally {
      setSaving(null);
    }
  };

  // Delete
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
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Skill Name <span className="text-red-400">*</span></label>
              <input type="text" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. React" className={inputClass} autoFocus />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Icon Slug <span className="text-muted-foreground/60">(optional)</span></label>
              <input type="text" value={form.icon}
                onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                placeholder="e.g. react, nodejs, docker" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
              <select value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className={inputClass}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Proficiency Level — <span className="text-primary font-semibold">{form.level}%</span>
              </label>
              <input type="range" min={5} max={100} step={5}
                value={form.level}
                onChange={e => setForm(p => ({ ...p, level: Number(e.target.value) }))}
                className="w-full accent-primary mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5%</span><span>100%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setForm(EMPTY_FORM); setShowAdd(false); }} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={saving === 'new'} className="bg-primary hover:bg-primary/90 min-w-[120px]">
              {saving === 'new'
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
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === cat.id
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              }`}
            >
              {cat.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === cat.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Skills List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <Layers size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No skills in this category yet.</p>
          <Button onClick={() => { setForm(p => ({ ...p, category: activeTab })); setShowAdd(true); }}
            variant="outline" className="mt-4 border-primary/40 hover:bg-primary/10">
            <Plus size={15} className="mr-2" />Add First Skill
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(skill => (
            <div key={skill.id} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 group hover:border-primary/30 transition-all">
              {/* Skill name + icon slug */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{skill.name}</span>
                  {skill.icon && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">{skill.icon}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground capitalize">{skill.category}</p>
              </div>

              {/* Level slider */}
              <div className="flex items-center gap-3 w-48">
                <input
                  type="range" min={5} max={100} step={5}
                  value={skill.level ?? 80}
                  onChange={e => handleLevelChange(skill.id, e.target.value)}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-bold text-primary w-10 text-right">{skill.level ?? 80}%</span>
              </div>

              {/* Save level */}
              <button
                onClick={() => handleUpdateLevel(skill)}
                disabled={saving === skill.id}
                title="Save level"
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              >
                {saving === skill.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(skill)}
                disabled={deleting === skill.id}
                title="Delete skill"
                className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                {deleting === skill.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
