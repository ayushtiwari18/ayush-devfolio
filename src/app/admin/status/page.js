'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Save, RefreshCw, Loader2, CheckCircle, AlertCircle,
  ToggleLeft, ToggleRight, Code2, Trophy, Star, Award, TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

const inputClass =
  'w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition';

// Overall summary stats (top of page)
const OVERALL_FIELDS = [
  { key: 'total_problems', label: 'Total Problems', icon: Code2,       type: 'number', placeholder: '885' },
  { key: 'total_contests', label: 'Total Contests', icon: Trophy,      type: 'number', placeholder: '35'  },
  { key: 'total_badges',   label: 'Badges & Awards',icon: Award,       type: 'number', placeholder: '11'  },
  { key: 'max_streak',     label: 'Max Streak',     icon: TrendingUp,  type: 'text',   placeholder: '200 Days' },
];

// Per-platform config
const PLATFORMS = [
  {
    key: 'leetcode', label: 'LeetCode', icon: '🟡',
    color: 'from-yellow-800 to-yellow-950', border: 'border-yellow-700',
    usernameKey: 'leetcode_username', displayKey: 'leetcode_display',
    profileUrl: (u) => `https://leetcode.com/u/${u}`,
    placeholder: '_aayush03',
    stats: [
      { key: 'leetcode_solved',   label: 'Problems Solved', type: 'number', placeholder: '885'  },
      { key: 'leetcode_rating',   label: 'Contest Rating',  type: 'number', placeholder: '1657' },
      { key: 'leetcode_contests', label: 'Contests',        type: 'number', placeholder: '12'   },
    ],
  },
  {
    key: 'codechef', label: 'CodeChef', icon: '👨‍🍳',
    color: 'from-amber-700 to-amber-950', border: 'border-amber-600',
    usernameKey: 'codechef_username', displayKey: 'codechef_display',
    profileUrl: (u) => `https://www.codechef.com/users/${u}`,
    placeholder: 'ayush_03',
    stats: [
      { key: 'codechef_rating',   label: 'Rating',   type: 'number', placeholder: '1443' },
      { key: 'codechef_contests', label: 'Contests', type: 'number', placeholder: '10'   },
      { key: 'codechef_problems', label: 'Problems', type: 'number', placeholder: '150'  },
    ],
  },
  {
    key: 'codeforces', label: 'Codeforces', icon: '🔵',
    color: 'from-blue-800 to-blue-950', border: 'border-blue-700',
    usernameKey: 'codeforces_username', displayKey: 'codeforces_display',
    profileUrl: (u) => `https://codeforces.com/profile/${u}`,
    placeholder: 'ayush_tiwari',
    stats: [
      { key: 'codeforces_rating',   label: 'Max Rating', type: 'number', placeholder: '1002' },
      { key: 'codeforces_contests', label: 'Contests',   type: 'number', placeholder: '13'   },
      { key: 'codeforces_problems', label: 'Problems',   type: 'number', placeholder: '100'  },
    ],
  },
  {
    key: 'hackerrank', label: 'HackerRank', icon: '🟢',
    color: 'from-green-800 to-green-950', border: 'border-green-700',
    usernameKey: 'hackerrank_username', displayKey: 'hackerrank_display',
    profileUrl: (u) => `https://www.hackerrank.com/profile/${u}`,
    placeholder: 'ayushtiwari10201',
    stats: [
      { key: 'hackerrank_stars',    label: 'Java Badge', type: 'text',   placeholder: '4 Star' },
      { key: 'hackerrank_certs',    label: 'Certifications', type: 'number', placeholder: '5'  },
      { key: 'hackerrank_problems', label: 'Problems',   type: 'number', placeholder: '100'   },
    ],
  },
  {
    key: 'gfg', label: 'GeeksforGeeks', icon: '🟢',
    color: 'from-emerald-800 to-emerald-950', border: 'border-emerald-700',
    usernameKey: 'gfg_username', displayKey: 'gfg_display',
    profileUrl: (u) => `https://auth.geeksforgeeks.org/user/${u}`,
    placeholder: 'ayushtiwari',
    stats: [
      { key: 'gfg_problems', label: 'Problems', type: 'number', placeholder: '155' },
      { key: 'gfg_score',    label: 'Score',    type: 'number', placeholder: '500' },
      { key: 'gfg_streak',   label: 'Streak',   type: 'text',   placeholder: '15 Days' },
    ],
  },
  {
    key: 'github', label: 'GitHub', icon: '🐙',
    color: 'from-gray-700 to-gray-900', border: 'border-gray-600',
    usernameKey: 'github_username', displayKey: 'github_display',
    profileUrl: (u) => `https://github.com/${u}`,
    placeholder: 'ayushtiwari18',
    stats: [],
  },
];

export default function AdminStatusPage() {
  const [form, setForm]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setForm(data || {});
    } catch (err) {
      showToast('error', `Failed to load: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setForm(json);
      showToast('success', 'Coding stats saved! Portfolio reflects changes on next visit.');
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
          <h1 className="text-2xl font-bold text-foreground mb-1">Coding Status</h1>
          <p className="text-muted-foreground text-sm">Update your competitive programming stats — shown live on the portfolio.</p>
        </div>
        <button onClick={fetchStatus} className="text-muted-foreground hover:text-foreground transition" title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Overall Summary Card */}
      <div className="bg-card border border-primary/20 rounded-xl p-6">
        <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
          <Trophy size={18} className="text-primary" />Overall Summary
          <span className="text-xs text-muted-foreground font-normal ml-1">(shown in the top stats row)</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {OVERALL_FIELDS.map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key}>
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                <Icon size={13} className="text-primary" />{label}
              </label>
              <input
                type={type}
                value={form?.[key] ?? ''}
                onChange={e => set(key, type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Platform Cards */}
      <div className="space-y-4">
        {PLATFORMS.map(({ key, label, icon, color, border, usernameKey, displayKey, profileUrl, placeholder, stats }) => {
          const username = form?.[usernameKey] || '';
          const display  = form?.[displayKey] ?? true;
          return (
            <div key={key} className={`bg-card border ${border}/40 rounded-xl p-6 space-y-4`}>
              {/* Platform header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-xl border ${border}/60`}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{label}</h3>
                    {username
                      ? <a href={profileUrl(username)} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{profileUrl(username)}</a>
                      : <p className="text-xs text-muted-foreground">No username set</p>}
                  </div>
                </div>
                <button
                  onClick={() => set(displayKey, !display)}
                  className="flex items-center gap-2 text-sm font-medium transition-colors"
                  title={display ? 'Hide from portfolio' : 'Show on portfolio'}
                >
                  {display
                    ? <><ToggleRight size={28} className="text-primary" /><span className="text-primary hidden sm:inline text-xs">Visible</span></>
                    : <><ToggleLeft  size={28} className="text-muted-foreground" /><span className="text-muted-foreground hidden sm:inline text-xs">Hidden</span></>}
                </button>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Username</label>
                <input type="text" value={username} onChange={e => set(usernameKey, e.target.value)}
                  placeholder={placeholder} className={inputClass} />
              </div>

              {/* Stat fields */}
              {stats.length > 0 && (
                <div className={`grid gap-3 ${
                  stats.length === 3 ? 'grid-cols-3' :
                  stats.length === 2 ? 'grid-cols-2' : 'grid-cols-1'
                }`}>
                  {stats.map(({ key: sk, label: sl, type, placeholder: sp }) => (
                    <div key={sk}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{sl}</label>
                      <input
                        type={type}
                        value={form?.[sk] ?? ''}
                        onChange={e => set(sk, type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
                        placeholder={sp}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={fetchStatus} className="border-border" type="button">
          <RefreshCw size={16} className="mr-2" />Discard
        </Button>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 min-w-[140px]">
          {saving
            ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" />Saving…</span>
            : <span className="flex items-center gap-2"><Save size={16} />Save All Stats</span>}
        </Button>
      </div>
    </div>
  );
}
