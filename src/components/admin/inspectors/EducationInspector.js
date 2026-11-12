'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { GraduationCap, Plus, Trash2, Edit2, Loader2, Calendar, MapPin, Check, ArrowLeft, BookOpen } from 'lucide-react';

export default function EducationInspector({ onClose }) {
  const router = useRouter();
  const { showToast } = useAdminMode();

  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [editingId, setEditingId] = useState(null); // 'new' or existing id
  const [error, setError]         = useState(null);

  // Form state
  const [institution, setInstitution] = useState('');
  const [degree, setDegree]           = useState('');
  const [field, setField]             = useState('');
  const [startDate, setStartDate]     = useState('');
  const [endDate, setEndDate]         = useState('');
  const [location, setLocation]       = useState('');
  const [description, setDescription] = useState('');

  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123';

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/education');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch academic history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setInstitution('');
    setDegree('');
    setField('');
    setStartDate('');
    setEndDate('');
    setLocation('');
    setDescription('');
    setError(null);
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setInstitution(item.institution || '');
    setDegree(item.degree || '');
    setField(item.field || '');
    setStartDate(item.start_date || '');
    setEndDate(item.end_date || '');
    setLocation(item.location || '');
    setDescription(item.description || '');
    setError(null);
  };

  const handleStartNew = () => {
    resetForm();
    setEditingId('new');
  };

  const handleSaveForm = async (e) => {
    e?.preventDefault();
    if (!institution.trim() || !degree.trim() || !startDate.trim()) {
      setError('Institution, degree, and start date are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      institution: institution.trim(),
      degree: degree.trim(),
      field: field.trim() || null,
      start_date: startDate.trim(),
      end_date: endDate.trim() || null,
      location: location.trim() || null,
      description: description.trim() || null,
    };

    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/education', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': secret,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showToast('Education credential added', 'success');
      } else {
        const res = await fetch('/api/admin/education', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': secret,
          },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showToast('Education updated successfully', 'success');
      }

      await fetchItems();
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Failed to save education');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this academic credential?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/education', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('Education deleted', 'info');
      await fetchItems();
      if (editingId === id) resetForm();
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <InspectorDrawer
      title="Academic Pedigree & Degrees"
      description="Manage universities, degrees, coursework tags, and theoretical foundations."
      icon={GraduationCap}
      isOpen={true}
      onClose={onClose}
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono-code">
          {error}
        </div>
      )}

      {/* Mode A: Form Editor */}
      {editingId ? (
        <form onSubmit={handleSaveForm} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1.5 text-xs font-mono-code text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to credentials</span>
            </button>
            <span className="text-xs font-mono-code font-bold text-primary uppercase tracking-wider">
              {editingId === 'new' ? '+ New Credential' : 'Edit Credential'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
              Institution / University *
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Jabalpur Engineering College"
              required
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                Degree *
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="Bachelor of Technology (B.Tech)"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="Computer Science & Engineering"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                Start Year *
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="2021"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                End Year
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="2025"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Jabalpur, MP"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
              Description / Coursework / Honors
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="GPA: 8.44 / 10.0 • Springer CCIS Research Publication • Smart India Hackathon Finalist..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl text-xs font-mono-code text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-black font-mono-code font-bold text-xs shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              <span>{editingId === 'new' ? 'Add Credential' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Mode B: List View */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-mono-code uppercase tracking-wider text-muted-foreground">
              {items.length} {items.length === 1 ? 'Degree' : 'Degrees'}
            </span>
            <button
              type="button"
              onClick={handleStartNew}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-mono-code font-bold transition-all"
            >
              <Plus size={13} />
              <span>Add Degree</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span className="text-xs font-mono-code">Loading credentials…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono-code text-muted-foreground border border-dashed border-white/10 rounded-2xl p-6">
              No education records found. Click &quot;Add Degree&quot; to create your first entry.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#0f0f15] border border-white/10 hover:border-white/20 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white tracking-tight">{item.degree}</div>
                    <div className="text-xs text-primary font-mono-code font-medium">
                      {item.institution} {item.field && `· ${item.field}`}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono-code text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {item.start_date} — {item.end_date || 'Present'}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {item.location}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-400 font-sans line-clamp-2 pt-1">{item.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit degree"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete degree"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </InspectorDrawer>
  );
}
