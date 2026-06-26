'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Trash2, Pencil, RefreshCw, Loader2,
  CheckCircle, AlertCircle, GraduationCap, X, Check, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

const inputClass =
  'w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition';

const EMPTY = {
  institution: '', degree: '', field: '',
  start_date: '', end_date: '', location: '', description: '',
};

function EducationForm({ initial = EMPTY, onSave, onCancel, saving, isEdit }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Institution <span className="text-red-400">*</span></label>
          <input type="text" value={form.institution} onChange={e => set('institution', e.target.value)}
            placeholder="e.g. Joy Senior Secondary School" className={inputClass} autoFocus />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Degree / Level <span className="text-red-400">*</span></label>
          <input type="text" value={form.degree} onChange={e => set('degree', e.target.value)}
            placeholder="e.g. B.Tech, 10th CBSE" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Field of Study</label>
          <input type="text" value={form.field} onChange={e => set('field', e.target.value)}
            placeholder="e.g. Computer Science" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Start Year <span className="text-red-400">*</span></label>
          <input type="text" value={form.start_date} onChange={e => set('start_date', e.target.value)}
            placeholder="e.g. 2021" className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">End Year</label>
          <input type="text" value={form.end_date} onChange={e => set('end_date', e.target.value)}
            placeholder="e.g. 2025 (or leave blank for Present)" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Location</label>
          <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
            placeholder="e.g. Jabalpur, Madhya Pradesh, India" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={3} placeholder="Key achievements, grades, activities…"
            className={inputClass + ' resize-none'} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-1">
        <Button variant="outline" onClick={onCancel} className="border-border h-9 px-4 text-sm"><X size={14} className="mr-1.5" />Cancel</Button>
        <Button onClick={() => onSave(form)} disabled={saving} className="bg-primary hover:bg-primary/90 h-9 px-4 text-sm min-w-[110px]">
          {saving
            ? <Loader2 size={14} className="animate-spin" />
            : <><Check size={14} className="mr-1.5" />{isEdit ? 'Save Changes' : 'Add Entry'}</>}
        </Button>
      </div>
    </div>
  );
}

export default function AdminEducationPage() {
  const [entries, setEntries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editId,  setEditId]    = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [toast,   setToast]     = useState(null);

  const showToast = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 4000); };

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/education');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setEntries((await res.json()) || []);
    } catch (err) { showToast('error', err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleAdd = async (form) => {
    if (!form.institution.trim() || !form.degree.trim() || !form.start_date.trim())
      return showToast('error', 'Institution, Degree and Start Year are required.');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Add failed');
      setEntries(prev => [json, ...prev]);
      setShowAdd(false);
      showToast('success', `"${json.institution}" added!`);
    } catch (err) { showToast('error', err.message); }
    finally { setSaving(false); }
  };

  const handleEdit = async (form) => {
    if (!form.institution.trim() || !form.degree.trim() || !form.start_date.trim())
      return showToast('error', 'Institution, Degree and Start Year are required.');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/education', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ id: editId, ...form }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Update failed');
      setEntries(prev => prev.map(e => e.id === json.id ? json : e));
      setEditId(null);
      showToast('success', 'Education entry updated!');
    } catch (err) { showToast('error', err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (entry) => {
    if (!confirm(`Delete "${entry.institution}"? This cannot be undone.`)) return;
    setDeleting(entry.id);
    try {
      const res = await fetch('/api/admin/education', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ id: entry.id }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error); }
      setEntries(prev => prev.filter(e => e.id !== entry.id));
      if (editId === entry.id) setEditId(null);
      showToast('success', 'Entry deleted.');
    } catch (err) { showToast('error', err.message); }
    finally { setDeleting(null); }
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
          toast.type === 'success' ? 'bg-green-950/90 border-green-700 text-green-200' : 'bg-red-950/90 border-red-700 text-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} className="text-green-400 shrink-0" /> : <AlertCircle size={20} className="text-red-400 shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Education</h1>
          <p className="text-muted-foreground text-sm">{entries.length} entr{entries.length === 1 ? 'y' : 'ies'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchEntries} className="text-muted-foreground hover:text-foreground transition" title="Refresh"><RefreshCw size={18} /></button>
          <Button onClick={() => { setShowAdd(v => !v); setEditId(null); }} className="bg-primary hover:bg-primary/90 gap-2">
            {showAdd ? <X size={16} /> : <Plus size={16} />}{showAdd ? 'Cancel' : 'Add Entry'}
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-card border border-primary/30 rounded-xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
            <Plus size={16} className="text-primary" />New Education Entry
          </h2>
          <EducationForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} isEdit={false} />
        </div>
      )}

      {/* Entries List */}
      {entries.length === 0 && !showAdd ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
          <GraduationCap size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No education entries yet.</p>
          <Button onClick={() => setShowAdd(true)} variant="outline" className="mt-4 border-primary/40 hover:bg-primary/10">
            <Plus size={15} className="mr-2" />Add First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all">

              {/* ─ Card header (always visible) */}
              <div className="flex items-start gap-4 p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{entry.institution}</h3>
                  <p className="text-sm text-primary font-medium">{entry.degree}{entry.field ? ` · ${entry.field}` : ''}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {entry.start_date}{entry.end_date ? ` – ${entry.end_date}` : ' – Present'}
                    {entry.location ? ` · ${entry.location}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => { setEditId(editId === entry.id ? null : entry.id); setShowAdd(false); }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Edit">
                    {editId === entry.id ? <ChevronUp size={16} /> : <Pencil size={16} />}
                  </button>
                  <button onClick={() => handleDelete(entry)} disabled={deleting === entry.id}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                    {deleting === entry.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>

              {/* ─ Inline edit form (expands below card) */}
              {editId === entry.id && (
                <div className="border-t border-border bg-muted/20 p-5">
                  <EducationForm
                    initial={{
                      institution: entry.institution || '',
                      degree:      entry.degree      || '',
                      field:       entry.field       || '',
                      start_date:  entry.start_date  || '',
                      end_date:    entry.end_date    || '',
                      location:    entry.location    || '',
                      description: entry.description || '',
                    }}
                    onSave={handleEdit}
                    onCancel={() => setEditId(null)}
                    saving={saving}
                    isEdit
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
