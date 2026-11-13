'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import {
  Cpu,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  X,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Skills' },
  { id: 'frontend', label: 'Frontend & UI' },
  { id: 'backend', label: 'Backend & Data' },
  { id: 'tools', label: 'Cloud & Tools' },
];

export default function SkillsInspector({ onClose }) {
  const router = useRouter();
  const { showToast } = useAdminMode();

  const [skills, setSkills]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery]     = useState('');

  // Add skill form state
  const [showAddForm, setShowAddForm]     = useState(false);
  const [name, setName]                   = useState('');
  const [category, setCategory]           = useState('frontend');
  const [icon, setIcon]                   = useState('');
  const [level, setLevel]                 = useState(80);
  const [adding, setAdding]               = useState(false);

  // Edit skill inline state
  const [editingId, setEditingId]         = useState(null);
  const [editName, setEditName]           = useState('');
  const [editCategory, setEditCategory]   = useState('frontend');
  const [editIcon, setEditIcon]           = useState('');
  const [editLevel, setEditLevel]         = useState(80);
  const [savingEdit, setSavingEdit]       = useState(false);

  async function getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession().catch(() => ({ data: {} }));
    const token = session?.access_token;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(process.env.NEXT_PUBLIC_ADMIN_SECRET ? { 'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET } : {}),
    };
  }

  useEffect(() => {
    let mounted = true;
    async function loadSkills() {
      try {
        const res = await fetch('/api/admin/skills');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted && Array.isArray(data)) {
          setSkills(data);
        }
      } catch (err) {
        console.warn('Failed to load skills:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSkills();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddSkill = async (e) => {
    e?.preventDefault();
    if (!name.trim()) return;

    setAdding(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          name: name.trim(),
          category,
          icon: icon.trim() || null,
          level: Number(level) || 80,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      const created = await res.json();
      setSkills((prev) => [created, ...prev]);
      setName('');
      setIcon('');
      setLevel(80);
      setShowAddForm(false);
      showToast(`Skill "${created.name}" created successfully`, 'success');
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Failed to add skill');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (skill) => {
    setEditingId(skill.id);
    setEditName(skill.name || '');
    setEditCategory(skill.category || 'frontend');
    setEditIcon(skill.icon || '');
    setEditLevel(skill.level != null ? skill.level : 80);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (skillId) => {
    if (!editName.trim()) return;

    setSavingEdit(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'PATCH',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          id: skillId,
          name: editName.trim(),
          category: editCategory,
          icon: editIcon.trim() || null,
          level: Number(editLevel) || 80,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      const updated = await res.json();
      setSkills((prev) =>
        prev.map((s) => (s.id === skillId ? { ...s, ...updated } : s))
      );
      setEditingId(null);
      showToast(`Skill "${updated.name}" updated`, 'success');
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Failed to update skill');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteSkill = async (skillId, skillName) => {
    if (!window.confirm(`Are you sure you want to delete "${skillName}"?`)) return;

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'DELETE',
        headers: await getAuthHeaders(),
        body: JSON.stringify({ id: skillId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      showToast(`Skill "${skillName}" removed`, 'info');
      router.refresh();
    } catch (err) {
      setError(err?.message || 'Failed to delete skill');
    }
  };

  // Filter skills
  const filteredSkills = skills.filter((s) => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <InspectorDrawer
      title="Skills & Technical Capabilities"
      description="Manage the engineering stack, add new competencies, update icons, or adjust categories in real time."
      icon={Cpu}
      isOpen={true}
      onClose={onClose}
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono-code mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Masthead Actions & Category Tabs */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between gap-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter skills (e.g. React, Docker)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* New Skill Toggle Button */}
          <button
            type="button"
            data-testid="add-skill-toggle-btn"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-mono-code font-semibold transition-all shrink-0"
          >
            {showAddForm ? <X size={13} /> : <Plus size={13} />}
            <span>{showAddForm ? 'Cancel' : '+ Add Skill'}</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 font-mono-code text-xs">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? skills.length
                : skills.filter((s) => s.category === cat.id).length;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold border border-white/20'
                    : 'bg-[#0f0f15] text-muted-foreground border border-white/5 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-gray-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Skill Expandable Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSkill}
          className="p-4 rounded-2xl bg-[#0f0f15] border border-primary/30 space-y-3 mb-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code text-primary uppercase font-semibold flex items-center gap-1">
              <Sparkles size={12} /> Add New Technology
            </span>
            <span className="text-[10px] font-mono-code text-muted-foreground">Saves to Supabase</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-mono-code text-muted-foreground uppercase mb-1">
                Skill Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Next.js, Kubernetes"
                required
                className="w-full px-3 py-1.5 rounded-lg bg-[#141520] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-muted-foreground uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#141520] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="frontend">Frontend & UI</option>
                <option value="backend">Backend & Data</option>
                <option value="tools">Cloud & Tools</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-mono-code text-muted-foreground uppercase mb-1">
                Icon (Devicon slug or SVG URL)
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g. react, nextjs, or https://..."
                className="w-full px-3 py-1.5 rounded-lg bg-[#141520] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-muted-foreground uppercase mb-1 flex items-center justify-between">
                <span>Proficiency Level</span>
                <span className="text-primary font-bold">{level}%</span>
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full accent-primary h-2 rounded bg-white/10 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 rounded-lg text-xs font-mono-code text-muted-foreground hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adding || !name.trim()}
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-mono-code font-semibold disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Save Skill'}
            </button>
          </div>
        </form>
      )}

      {/* Skills List */}
      <div className="space-y-2">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono-code text-muted-foreground animate-pulse">
            Loading skills inventory...
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="py-10 text-center text-xs font-mono-code text-muted-foreground">
            No skills found matching filter.
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const isEditing = editingId === skill.id;

            if (isEditing) {
              return (
                <div
                  key={skill.id}
                  className="p-3 rounded-xl bg-[#12131d] border border-primary/40 space-y-2.5 animate-in fade-in"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Skill name"
                      className="px-2.5 py-1 rounded-lg bg-[#181926] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="px-2.5 py-1 rounded-lg bg-[#181926] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="frontend">Frontend & UI</option>
                      <option value="backend">Backend & Data</option>
                      <option value="tools">Cloud & Tools</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editIcon}
                      onChange={(e) => setEditIcon(e.target.value)}
                      placeholder="Icon slug or URL"
                      className="px-2.5 py-1 rounded-lg bg-[#181926] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-code text-muted-foreground">Level:</span>
                      <input
                        type="range"
                        min="30"
                        max="100"
                        value={editLevel}
                        onChange={(e) => setEditLevel(e.target.value)}
                        className="flex-1 accent-primary h-2 rounded bg-white/10 cursor-pointer"
                      />
                      <span className="text-xs font-mono-code text-primary font-bold w-8 text-right">
                        {editLevel}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1 border-t border-white/5">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono-code text-muted-foreground hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingEdit}
                      onClick={() => handleSaveEdit(skill.id)}
                      className="px-3.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-mono-code font-semibold flex items-center gap-1"
                    >
                      <Check size={12} />
                      <span>{savingEdit ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={skill.id}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#0c0d14] border border-white/5 hover:border-white/15 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-xs font-bold font-mono-code text-primary shrink-0">
                    {skill.name[0]}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-white font-mono-code">
                        {skill.name}
                      </h4>
                      <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-white/5 text-muted-foreground uppercase border border-white/5">
                        {skill.category}
                      </span>
                    </div>

                    {skill.level != null && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-20 sm:w-28 h-1 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono-code text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => startEdit(skill)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                    title="Edit skill"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill.id, skill.name)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Delete skill"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </InspectorDrawer>
  );
}
