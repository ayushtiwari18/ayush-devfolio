'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { Briefcase, Plus, Trash2, Edit2, Loader2, Calendar, MapPin, Code2, Check, ArrowLeft } from 'lucide-react';

export default function ExperienceInspector({ onClose }) {
  const router = useRouter();
  const { showToast } = useAdminMode();

  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [editingId, setEditingId] = useState(null); // 'new' or existing id
  const [error, setError]       = useState(null);

  // Form state
  const [company, setCompany]               = useState('');
  const [role, setRole]                     = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [startDate, setStartDate]           = useState('');
  const [endDate, setEndDate]               = useState('');
  const [isCurrent, setIsCurrent]           = useState(false);
  const [location, setLocation]             = useState('');
  const [description, setDescription]       = useState('');
  const [technologies, setTechnologies]     = useState('');

  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123';

  // Fetch experiences
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/experience');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch experience history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setCompany('');
    setRole('');
    setEmploymentType('Full-time');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setLocation('');
    setDescription('');
    setTechnologies('');
    setError(null);
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setCompany(item.company || '');
    setRole(item.role || '');
    setEmploymentType(item.employment_type || 'Full-time');
    setStartDate(item.start_date || '');
    setEndDate(item.end_date || '');
    setIsCurrent(!item.end_date);
    setLocation(item.location || '');
    setDescription(item.description || '');
    setTechnologies(item.technologies || '');
    setError(null);
  };

  const handleStartNew = () => {
    resetForm();
    setEditingId('new');
  };

  const handleSaveForm = async (e) => {
    e?.preventDefault();
    if (!company.trim() || !role.trim() || !startDate.trim()) {
      setError('Company, role, and start date are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      company: company.trim(),
      role: role.trim(),
      employment_type: employmentType,
      start_date: startDate.trim(),
      end_date: isCurrent ? null : (endDate.trim() || null),
      location: location.trim() || null,
      description: description.trim() || null,
      technologies: technologies.trim() || null,
    };

    try {
      if (editingId === 'new') {
        const res = await fetch('/api/admin/experience', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': secret,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showToast('Experience added successfully', 'success');
      } else {
        const res = await fetch('/api/admin/experience', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': secret,
          },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showToast('Experience updated successfully', 'success');
      }

      await fetchItems();
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this career milestone?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/experience', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('Experience deleted', 'info');
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
      title="Experience & Milestones"
      description="Manage career history, employment roles, and technical achievements."
      icon={Briefcase}
      isOpen={true}
      onClose={onClose}
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono-code">
          {error}
        </div>
      )}

      {/* Mode A: Form Editor (Adding or Editing) */}
      {editingId ? (
        <form onSubmit={handleSaveForm} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1.5 text-xs font-mono-code text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to list</span>
            </button>
            <span className="text-xs font-mono-code font-bold text-primary uppercase tracking-wider">
              {editingId === 'new' ? '+ New Role' : 'Edit Role'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                Company / Organization *
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Google, DeepMind, etc."
                required
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                Role / Title *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Full Stack Engineer"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Remote / Bengaluru, IN"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                Start Date *
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="June 2024"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
                End Date
              </label>
              <input
                type="text"
                value={isCurrent ? 'Present' : endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isCurrent}
                placeholder="August 2024"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <label className="flex items-center gap-1.5 mt-1 text-[11px] font-mono-code text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-primary focus:ring-0"
                />
                <span>Currently Working Here</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
              Description / Key Achievements
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Architected distributed caching layers, reduced API p99 latency by 42%..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1">
              Technologies (comma separated)
            </label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="Next.js, FastAPI, Redis, Docker, AWS"
              className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-2 focus:ring-primary"
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
              <span>{editingId === 'new' ? 'Create Role' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Mode B: List View */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-mono-code uppercase tracking-wider text-muted-foreground">
              {items.length} {items.length === 1 ? 'Milestone' : 'Milestones'}
            </span>
            <button
              type="button"
              onClick={handleStartNew}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-mono-code font-bold transition-all"
            >
              <Plus size={13} />
              <span>Add Role</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span className="text-xs font-mono-code">Loading history…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono-code text-muted-foreground border border-dashed border-white/10 rounded-2xl p-6">
              No career milestones recorded yet. Click &quot;Add Role&quot; to begin.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#0f0f15] border border-white/10 hover:border-white/20 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white tracking-tight">{item.role}</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono-code text-zinc-400">
                        {item.employment_type || 'Full-time'}
                      </span>
                    </div>
                    <div className="text-xs text-primary font-mono-code font-medium">{item.company}</div>
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
                    {item.technologies && (
                      <div className="pt-1 flex flex-wrap gap-1">
                        {item.technologies.split(',').map((tech) => (
                          <span
                            key={tech.trim()}
                            className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono-code text-zinc-400"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit role"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete role"
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
