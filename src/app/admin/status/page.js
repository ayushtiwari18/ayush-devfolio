'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Code2, Save, RefreshCw, Loader2, CheckCircle, AlertCircle, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

const PLATFORMS = [
  {
    key: 'github',
    label: 'GitHub',
    icon: '🐙',
    color: 'from-gray-700 to-gray-900',
    border: 'border-gray-600',
    usernameKey: 'github_username',
    displayKey: 'github_display',
    profileUrl: (u) => `https://github.com/${u}`,
    placeholder: 'e.g. ayushtiwari18',
  },
  {
    key: 'leetcode',
    label: 'LeetCode',
    icon: '🟡',
    color: 'from-yellow-800 to-yellow-950',
    border: 'border-yellow-700',
    usernameKey: 'leetcode_username',
    displayKey: 'leetcode_display',
    profileUrl: (u) => `https://leetcode.com/u/${u}`,
    placeholder: 'e.g. _aayush03',
  },
  {
    key: 'hackerrank',
    label: 'HackerRank',
    icon: '🟢',
    color: 'from-green-800 to-green-950',
    border: 'border-green-700',
    usernameKey: 'hackerrank_username',
    displayKey: 'hackerrank_display',
    profileUrl: (u) => `https://www.hackerrank.com/profile/${u}`,
    placeholder: 'e.g. ayushtiwari10201',
  },
];

const inputClass =
  'w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground ' +
  'focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition';

export default function AdminStatusPage() {
  const [form, setForm]     = useState(null);
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
      // data may be null if no row exists yet — seed defaults
      setForm(data || {
        github_username:     '',
        github_display:      true,
        leetcode_username:   '',
        leetcode_display:    true,
        hackerrank_username: '',
        hackerrank_display:  true,
      });
    } catch (err) {
      showToast('error', `Failed to load: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({
          github_username:     form.github_username     || null,
          github_display:      form.github_display      ?? true,
          leetcode_username:   form.leetcode_username   || null,
          leetcode_display:    form.leetcode_display    ?? true,
          hackerrank_username: form.hackerrank_username || null,
          hackerrank_display:  form.hackerrank_display  ?? true,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setForm(json);
      showToast('success', 'Coding profiles saved!');
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
    <div className="space-y-6 max-w-3xl">

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
          <h1 className="text-2xl font-bold text-foreground mb-1">Coding Status</h1>
          <p className="text-muted-foreground text-sm">Manage your coding platform usernames and control which ones appear on the portfolio.</p>
        </div>
        <button onClick={fetchStatus} className="text-muted-foreground hover:text-foreground transition" title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Platform cards */}
      <div className="space-y-4">
        {PLATFORMS.map(({ key, label, icon, color, border, usernameKey, displayKey, profileUrl, placeholder }) => {
          const username = form?.[usernameKey] || '';
          const display  = form?.[displayKey] ?? true;
          return (
            <div key={key} className={`bg-card border ${border}/40 rounded-xl p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-xl border ${border}/60`}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{label}</h3>
                    {username ? (
                      <a
                        href={profileUrl(username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {profileUrl(username)}
                      </a>
                    ) : (
                      <p className="text-xs text-muted-foreground">No username set</p>
                    )}
                  </div>
                </div>

                {/* Display toggle */}
                <button
                  onClick={() => handleChange(displayKey, !display)}
                  className="flex items-center gap-2 text-sm font-medium transition-colors"
                  title={display ? 'Click to hide from portfolio' : 'Click to show on portfolio'}
                >
                  {display ? (
                    <><ToggleRight size={28} className="text-primary" /><span className="text-primary hidden sm:inline">Visible</span></>
                  ) : (
                    <><ToggleLeft size={28} className="text-muted-foreground" /><span className="text-muted-foreground hidden sm:inline">Hidden</span></>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {label} Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => handleChange(usernameKey, e.target.value)}
                  placeholder={placeholder}
                  className={inputClass}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={fetchStatus} className="border-border" type="button">
          <RefreshCw size={16} className="mr-2" />Discard
        </Button>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 min-w-[140px]">
          {saving
            ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" />Saving…</span>
            : <span className="flex items-center gap-2"><Save size={16} />Save</span>}
        </Button>
      </div>

    </div>
  );
}
