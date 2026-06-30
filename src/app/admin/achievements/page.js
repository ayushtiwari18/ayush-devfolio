'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, RefreshCw, Loader2,
  CheckCircle, AlertCircle, X, Pencil, Check, Trophy,
  Github, Code2, Rocket, BookOpen, Cloud, Eye, EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

const ICON_OPTIONS = [
  { value: 'github',    label: 'GitHub',   icon: Github   },
  { value: 'code',      label: 'Code',     icon: Code2    },
  { value: 'rocket',    label: 'Rocket',   icon: Rocket   },
  { value: 'book-open', label: 'Book',     icon: BookOpen },
  { value: 'cloud',     label: 'Cloud',    icon: Cloud    },
  { value: 'trophy',    label: 'Trophy',   icon: Trophy   },
];

const ICON_MAP = {
  github:      Github,
  code:        Code2,
  rocket:      Rocket,
  'book-open': BookOpen,
  cloud:       Cloud,
  trophy:      Trophy,
};

const inputClass =
  'w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition';

const EMPTY_FORM = {
  label: '', value: '', description: '', icon: 'rocket', order_index: 0, published: true,
};

// ── Inline edit row ──────────────────────────────────────────────────────────
function EditRow({ item, onSave, onCancel }) {
  const [draft, setDraft] = useState({
    label:       item.label,
    value:       item.value,
    description: item.description || '',
    icon:        item.icon || 'rocket',
    order_index: item.order_index ?? 0,
    published:   item.published ?? true,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!draft.label.trim() || !draft.value.trim()) return;
    setSaving(true);
    await onSave(item.id, {
      label:       draft.label.trim(),
      value:       draft.value.trim(),
      description: draft.description.trim() || null,
      icon:        draft.icon,
      order_index: Number(draft.order_index),
      published:   draft.published,
    });
    setSaving(false);
  };

  return (
    <div className="bg-card border border-primary/40 rounded-xl p-5 space-y-4 col-span-full">
      <p className="text-xs font-semibold text-primary uppercase tracking-wide">Editing “{item.label}”</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Label <span className="text-red-400">*</span></label>
          <input type="text" value={draft.label} autoFocus
            onChange={e => setDraft(p => ({ ...p, label: e.target.value }))}
            className={inputClass} placeholder="e.g. GitHub Commits" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Value <span className="text-red-400">*</span></label>
          <input type="text" value={draft.value}
            onChange={e => setDraft(p => ({ ...p, value: e.target.value }))}
            className={inputClass} placeholder="e.g. 5,600+" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-muted-foreground mb-1">Description</label>
          <input type="text" value={draft.description}
            onChange={e => setDraft(p => ({ ...p, description: e.target.value }))}
            className={inputClass} placeholder="Short description shown under the value" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Icon</label>
          <div className="grid grid-cols-3 gap-2">
            {ICON_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button key={value} type="button"
                onClick={() => setDraft(p => ({ ...p, icon: value }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                  draft.icon === value
                    ? 'bg-primary/15 border-primary text-primary'
                    : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                }`}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Order</label>
            <input type="number" value={draft.order_index}
              onChange={e => setDraft(p => ({ ...p, order_index: e.target.value }))}
              className={inputClass} min="0" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setDraft(p => ({ ...p, published: !p.published }))}
              className={`w-9 h-5 rounded-full transition-colors ${
                draft.published ? 'bg-primary' : 'bg-muted-foreground/30'
              } relative`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                draft.published ? 'translate-x-4' : ''
              }`} />
            </div>
            <span className="text-xs text-muted-foreground">{draft.published ? 'Visible' : 'Hidden'}</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={onCancel} className="border-border h-8 px-3 text-xs">
          <X size={13} className="mr-1" />Cancel
        </Button>
        <Button size="sm" onClick={save} disabled={saving || !draft.label.trim() || !draft.value.trim()}
          className="bg-primary hover:bg-primary/90 h-8 px-3 text-xs min-w-[80px]">
          {saving
            ? <Loader2 size={13} className="animate-spin" />
            : <><Check size={13} className="mr-1" />Save</>}
        </Button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AdminAchievementsPage() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [adding,   setAdding]   = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [toast,    setToast]    = useState(null);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [showAdd,  setShowAdd]  = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/achievements');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems((await res.json()) || []);
    } catch (err) {
      showToast('error', `Failed to load: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // ── Add ───────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!form.label.trim()) return showToast('error', 'Label is required.');
    if (!form.value.trim()) return showToast('error', 'Value is required.');
    setAdding(true);
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({
          label:       form.label.trim(),
          value:       form.value.trim(),
          description: form.description.trim() || null,
          icon:        form.icon,
          order_index: Number(form.order_index),
          published:   form.published,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Add failed');
      setItems(prev => [...prev, json].sort((a, b) => a.order_index - b.order_index));
      setForm(EMPTY_FORM);
      setShowAdd(false);
      showToast('success', `“${json.label}” added!`);
    } catch (err) {
      showToast('error', `Add failed: ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  // ── Edit save ─────────────────────────────────────────────────────────────
  const handleEditSave = async (id, fields) => {
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ id, ...fields }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Update failed');
      setItems(prev =>
        prev.map(i => i.id === json.id ? json : i)
            .sort((a, b) => a.order_index - b.order_index)
      );
      setEditingId(null);
      showToast('success', `“${json.label}” updated!`);
    } catch (err) {
      showToast('error', `Update failed: ${err.message}`);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (item) => {
    if (!confirm(`Delete “${item.label}”? This cannot be undone.`)) return;
    setDeleting(item.id);
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ id: item.id }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'Delete failed'); }
      setItems(prev => prev.filter(i => i.id !== item.id));
      if (editingId === item.id) setEditingId(null);
      showToast('success', `“${item.label}” deleted.`);
    } catch (err) {
      showToast('error', `Delete failed: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  // ── Toggle published ──────────────────────────────────────────────────────
  const handleTogglePublished = async (item) => {
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ id: item.id, published: !item.published }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Update failed');
      setItems(prev => prev.map(i => i.id === json.id ? json : i));
      showToast('success', `“${json.label}” ${json.published ? 'shown' : 'hidden'}.`);
    } catch (err) {
      showToast('error', `Toggle failed: ${err.message}`);
    }
  };

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
          toast.type === 'success'
            ? 'bg-green-950/90 border-green-700 text-green-200'
            : 'bg-red-950/90 border-red-700 text-red-200'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle size={20} className="text-green-400 shrink-0" />
            : <AlertCircle  size={20} className="text-red-400 shrink-0"  />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Achievements</h1>
          <p className="text-muted-foreground text-sm">
            {items.length} stat card{items.length !== 1 ? 's' : ''} — displayed in the About section on the home page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchItems} className="text-muted-foreground hover:text-foreground transition" title="Refresh">
            <RefreshCw size={18} />
          </button>
          <Button
            onClick={() => { setShowAdd(v => !v); setEditingId(null); }}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            {showAdd ? <X size={16} /> : <Plus size={16} />}
            {showAdd ? 'Cancel' : 'Add Card'}
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-card border border-primary/30 rounded-xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
            <Plus size={16} className="text-primary" />New Stat Card
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Label <span className="text-red-400">*</span>
              </label>
              <input type="text" value={form.label} autoFocus
                onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. GitHub Commits"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Value <span className="text-red-400">*</span>
              </label>
              <input type="text" value={form.value}
                onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                placeholder="e.g. 5,600+"
                className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
              <input type="text" value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Short line shown under the value"
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Icon</label>
              <div className="grid grid-cols-3 gap-2">
                {ICON_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <button key={value} type="button"
                    onClick={() => setForm(p => ({ ...p, icon: value }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      form.icon === value
                        ? 'bg-primary/15 border-primary text-primary'
                        : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                    }`}>
                    <Icon size={14} />{label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Order</label>
                <input type="number" value={form.order_index} min="0"
                  onChange={e => setForm(p => ({ ...p, order_index: e.target.value }))}
                  className={inputClass} />
              </div>
              <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
                <div
                  onClick={() => setForm(p => ({ ...p, published: !p.published }))}
                  className={`w-9 h-5 rounded-full transition-colors ${
                    form.published ? 'bg-primary' : 'bg-muted-foreground/30'
                  } relative cursor-pointer`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    form.published ? 'translate-x-4' : ''
                  }`} />
                </div>
                <span className="text-xs text-muted-foreground">{form.published ? 'Visible on site' : 'Hidden'}</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setForm(EMPTY_FORM); setShowAdd(false); }} className="border-border">Cancel</Button>
            <Button onClick={handleAdd} disabled={adding} className="bg-primary hover:bg-primary/90 min-w-[120px]">
              {adding
                ? <span className="flex items-center gap-2"><Loader2 size={15} className="animate-spin" />Adding…</span>
                : <span className="flex items-center gap-2"><Plus size={15} />Add Card</span>}
            </Button>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {items.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <Trophy size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No achievement cards yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Run the SQL seed from the setup guide to add defaults.</p>
          <Button onClick={() => setShowAdd(true)} variant="outline" className="mt-4 border-primary/40 hover:bg-primary/10">
            <Plus size={15} className="mr-2" />Add First Card
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item =>
            item.id === editingId ? (
              <EditRow key={item.id} item={item}
                onSave={handleEditSave}
                onCancel={() => setEditingId(null)} />
            ) : (
              <div key={item.id}
                className={`bg-card border rounded-xl p-5 flex flex-col gap-3 group transition-all relative ${
                  item.published ? 'border-border hover:border-primary/40' : 'border-dashed border-border opacity-50'
                }`}
              >
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleTogglePublished(item)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    title={item.published ? 'Hide' : 'Show'}
                  >
                    {item.published ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    onClick={() => { setEditingId(item.id); setShowAdd(false); }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    title="Edit"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={deleting === item.id}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete"
                  >
                    {deleting === item.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Trash2 size={13} />}
                  </button>
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  {(() => { const Icon = ICON_MAP[item.icon] || Rocket; return <Icon size={20} className="text-primary" />; })()}
                </div>

                {/* Content */}
                <div>
                  <p className="text-2xl font-bold text-foreground leading-none mb-1">{item.value}</p>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                  )}
                </div>

                {/* Footer meta */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Order: {item.order_index}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.published
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-zinc-500/10 text-zinc-400'
                  }`}>
                    {item.published ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
