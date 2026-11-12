'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import {
  Trophy,
  Code2,
  Award,
  TrendingUp,
  Terminal,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  SiLeetcode,
  SiCodechef,
  SiCodeforces,
  SiHackerrank,
  SiGeeksforgeeks,
} from 'react-icons/si';

const PLATFORM_TABS = [
  { id: 'overall',    label: 'Overall Totals', icon: Trophy },
  { id: 'leetcode',   label: 'LeetCode',       icon: SiLeetcode,   color: '#FFA116' },
  { id: 'codechef',   label: 'CodeChef',       icon: SiCodechef,   color: '#5B4638' },
  { id: 'codeforces', label: 'Codeforces',     icon: SiCodeforces, color: '#1F8ACB' },
  { id: 'hackerrank', label: 'HackerRank',     icon: SiHackerrank, color: '#00EA64' },
  { id: 'gfg',        label: 'GFG',            icon: SiGeeksforgeeks, color: '#2F8D46' },
];

export default function CodingStatsInspector({ onClose }) {
  const router = useRouter();
  const { showToast } = useAdminMode();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);
  const [activeTab, setActiveTab] = useState('overall');

  // Overall totals
  const [totalProblems, setTotalProblems] = useState('');
  const [totalContests, setTotalContests] = useState('');
  const [totalBadges, setTotalBadges]     = useState('');
  const [maxStreak, setMaxStreak]         = useState('');

  // LeetCode
  const [lcUsername, setLcUsername] = useState('');
  const [lcDisplay, setLcDisplay]   = useState(true);
  const [lcSolved, setLcSolved]     = useState('');
  const [lcRating, setLcRating]     = useState('');
  const [lcContests, setLcContests] = useState('');

  // CodeChef
  const [ccUsername, setCcUsername] = useState('');
  const [ccDisplay, setCcDisplay]   = useState(true);
  const [ccRating, setCcRating]     = useState('');
  const [ccContests, setCcContests] = useState('');
  const [ccProblems, setCcProblems] = useState('');

  // Codeforces
  const [cfUsername, setCfUsername] = useState('');
  const [cfDisplay, setCfDisplay]   = useState(true);
  const [cfRating, setCfRating]     = useState('');
  const [cfContests, setCfContests] = useState('');
  const [cfProblems, setCfProblems] = useState('');

  // HackerRank
  const [hrUsername, setHrUsername] = useState('');
  const [hrDisplay, setHrDisplay]   = useState(true);
  const [hrStars, setHrStars]       = useState('');
  const [hrCerts, setHrCerts]       = useState('');
  const [hrProblems, setHrProblems] = useState('');

  // GeeksforGeeks
  const [gfgUsername, setGfgUsername] = useState('');
  const [gfgDisplay, setGfgDisplay]   = useState(true);
  const [gfgProblems, setGfgProblems] = useState('');
  const [gfgScore, setGfgScore]       = useState('');
  const [gfgStreak, setGfgStreak]     = useState('');

  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'mysecret123';

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/status');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted && data) {
          // Overall
          setTotalProblems(data.total_problems != null ? String(data.total_problems) : '885');
          setTotalContests(data.total_contests != null ? String(data.total_contests) : '35');
          setTotalBadges(data.total_badges != null ? String(data.total_badges) : '11');
          setMaxStreak(data.max_streak || '200 Days');

          // LeetCode
          setLcUsername(data.leetcode_username || '_aayush03');
          setLcDisplay(data.leetcode_display ?? true);
          setLcSolved(data.leetcode_solved != null ? String(data.leetcode_solved) : '885');
          setLcRating(data.leetcode_rating != null ? String(data.leetcode_rating) : '1657');
          setLcContests(data.leetcode_contests != null ? String(data.leetcode_contests) : '12');

          // CodeChef
          setCcUsername(data.codechef_username || 'ayush_03');
          setCcDisplay(data.codechef_display ?? true);
          setCcRating(data.codechef_rating != null ? String(data.codechef_rating) : '1443');
          setCcContests(data.codechef_contests != null ? String(data.codechef_contests) : '10');
          setCcProblems(data.codechef_problems != null ? String(data.codechef_problems) : '150');

          // Codeforces
          setCfUsername(data.codeforces_username || 'ayush_tiwari');
          setCfDisplay(data.codeforces_display ?? true);
          setCfRating(data.codeforces_rating != null ? String(data.codeforces_rating) : '1002');
          setCfContests(data.codeforces_contests != null ? String(data.codeforces_contests) : '13');
          setCfProblems(data.codeforces_problems != null ? String(data.codeforces_problems) : '100');

          // HackerRank
          setHrUsername(data.hackerrank_username || 'ayushtiwari10201');
          setHrDisplay(data.hackerrank_display ?? true);
          setHrStars(data.hackerrank_stars || '4 Star');
          setHrCerts(data.hackerrank_certs != null ? String(data.hackerrank_certs) : '5');
          setHrProblems(data.hackerrank_problems != null ? String(data.hackerrank_problems) : '100');

          // GFG
          setGfgUsername(data.gfg_username || 'ayushtiwari');
          setGfgDisplay(data.gfg_display ?? true);
          setGfgProblems(data.gfg_problems != null ? String(data.gfg_problems) : '155');
          setGfgScore(data.gfg_score != null ? String(data.gfg_score) : '500');
          setGfgStreak(data.gfg_streak || '15 Days');
        }
      } catch (err) {
        console.warn('Failed to load coding stats:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const parseNum = (val) => {
      if (val === '' || val === null || val === undefined) return null;
      const clean = String(val).replace(/[^0-9]/g, '');
      const parsed = parseInt(clean, 10);
      return isNaN(parsed) ? null : parsed;
    };

    const payload = {
      total_problems: parseNum(totalProblems),
      total_contests: parseNum(totalContests),
      total_badges: parseNum(totalBadges),
      max_streak: maxStreak.trim() || null,

      leetcode_username: lcUsername.trim() || null,
      leetcode_display: lcDisplay,
      leetcode_solved: parseNum(lcSolved),
      leetcode_rating: parseNum(lcRating),
      leetcode_contests: parseNum(lcContests),

      codechef_username: ccUsername.trim() || null,
      codechef_display: ccDisplay,
      codechef_rating: parseNum(ccRating),
      codechef_contests: parseNum(ccContests),
      codechef_problems: parseNum(ccProblems),

      codeforces_username: cfUsername.trim() || null,
      codeforces_display: cfDisplay,
      codeforces_rating: parseNum(cfRating),
      codeforces_contests: parseNum(cfContests),
      codeforces_problems: parseNum(cfProblems),

      hackerrank_username: hrUsername.trim() || null,
      hackerrank_display: hrDisplay,
      hackerrank_stars: hrStars.trim() || null,
      hackerrank_certs: parseNum(hrCerts),
      hackerrank_problems: parseNum(hrProblems),

      gfg_username: gfgUsername.trim() || null,
      gfg_display: gfgDisplay,
      gfg_problems: parseNum(gfgProblems),
      gfg_score: parseNum(gfgScore),
      gfg_streak: gfgStreak.trim() || null,
    };

    try {
      const res = await fetch('/api/admin/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      showToast('Coding metrics updated successfully', 'success');
      router.refresh();
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Failed to save coding stats');
    } finally {
      setSaving(false);
    }
  };

  return (
    <InspectorDrawer
      title="Coding Stats & Telemetry"
      description="Manage overall algorithmic milestones and configure platform telemetry (LeetCode, CodeChef, Codeforces, HackerRank, GFG)."
      icon={Trophy}
      isOpen={true}
      onClose={onClose}
      onSave={handleSave}
      saving={saving}
      saveLabel="Save Coding Stats"
    >
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono-code mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl mb-5 font-mono-code text-xs">
        {PLATFORM_TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[70px] flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg transition-all text-xs ${
                isActive
                  ? 'bg-primary text-white font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              <TabIcon size={12} style={{ color: isActive ? '#fff' : tab.color }} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERALL TOTALS */}
      {activeTab === 'overall' && (
        <div className="space-y-4 animate-in fade-in">
          <p className="text-xs text-muted-foreground font-mono-code">
            // Primary telemetry cards displayed at the top of the Coding Stats section.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                <Code2 size={13} className="text-primary" />
                Total Problems Solved
              </label>
              <input
                type="text"
                value={totalProblems}
                onChange={(e) => setTotalProblems(e.target.value)}
                placeholder="e.g. 885"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                <Trophy size={13} className="text-amber-400" />
                Contests Fought
              </label>
              <input
                type="text"
                value={totalContests}
                onChange={(e) => setTotalContests(e.target.value)}
                placeholder="e.g. 35"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                <Award size={13} className="text-purple-400" />
                Badges Earned
              </label>
              <input
                type="text"
                value={totalBadges}
                onChange={(e) => setTotalBadges(e.target.value)}
                placeholder="e.g. 11"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
                <Flame size={13} className="text-emerald-400" />
                Longest Streak
              </label>
              <input
                type="text"
                value={maxStreak}
                onChange={(e) => setMaxStreak(e.target.value)}
                placeholder="e.g. 200 Days"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEETCODE */}
      {activeTab === 'leetcode' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFA116]/5 border border-[#FFA116]/20">
            <div className="flex items-center gap-2">
              <SiLeetcode size={18} className="text-[#FFA116]" />
              <span className="text-xs font-mono-code text-white font-semibold">LeetCode Telemetry Card</span>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono-code text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={lcDisplay}
                onChange={(e) => setLcDisplay(e.target.checked)}
                className="accent-primary w-4 h-4 rounded cursor-pointer"
              />
              <span>Display on Page</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                LeetCode Username
              </label>
              <input
                type="text"
                value={lcUsername}
                onChange={(e) => setLcUsername(e.target.value)}
                placeholder="_aayush03"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Solved Count
              </label>
              <input
                type="text"
                value={lcSolved}
                onChange={(e) => setLcSolved(e.target.value)}
                placeholder="885"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Contest Rating
              </label>
              <input
                type="text"
                value={lcRating}
                onChange={(e) => setLcRating(e.target.value)}
                placeholder="1657"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Rounds / Contests
              </label>
              <input
                type="text"
                value={lcContests}
                onChange={(e) => setLcContests(e.target.value)}
                placeholder="12"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CODECHEF */}
      {activeTab === 'codechef' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2">
              <SiCodechef size={18} className="text-amber-400" />
              <span className="text-xs font-mono-code text-white font-semibold">CodeChef Card</span>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono-code text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={ccDisplay}
                onChange={(e) => setCcDisplay(e.target.checked)}
                className="accent-primary w-4 h-4 rounded cursor-pointer"
              />
              <span>Display on Page</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                CodeChef Username
              </label>
              <input
                type="text"
                value={ccUsername}
                onChange={(e) => setCcUsername(e.target.value)}
                placeholder="ayush_03"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Rating
              </label>
              <input
                type="text"
                value={ccRating}
                onChange={(e) => setCcRating(e.target.value)}
                placeholder="1443"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Contests
              </label>
              <input
                type="text"
                value={ccContests}
                onChange={(e) => setCcContests(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Problems Solved
              </label>
              <input
                type="text"
                value={ccProblems}
                onChange={(e) => setCcProblems(e.target.value)}
                placeholder="150"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CODEFORCES */}
      {activeTab === 'codeforces' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1F8ACB]/5 border border-[#1F8ACB]/20">
            <div className="flex items-center gap-2">
              <SiCodeforces size={18} className="text-[#1F8ACB]" />
              <span className="text-xs font-mono-code text-white font-semibold">Codeforces Card</span>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono-code text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={cfDisplay}
                onChange={(e) => setCfDisplay(e.target.checked)}
                className="accent-primary w-4 h-4 rounded cursor-pointer"
              />
              <span>Display on Page</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Codeforces Username
              </label>
              <input
                type="text"
                value={cfUsername}
                onChange={(e) => setCfUsername(e.target.value)}
                placeholder="ayush_tiwari"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Peak Rating
              </label>
              <input
                type="text"
                value={cfRating}
                onChange={(e) => setCfRating(e.target.value)}
                placeholder="1002"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Contests
              </label>
              <input
                type="text"
                value={cfContests}
                onChange={(e) => setCfContests(e.target.value)}
                placeholder="13"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Problems Solved
              </label>
              <input
                type="text"
                value={cfProblems}
                onChange={(e) => setCfProblems(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: HACKERRANK */}
      {activeTab === 'hackerrank' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#00EA64]/5 border border-[#00EA64]/20">
            <div className="flex items-center gap-2">
              <SiHackerrank size={18} className="text-[#00EA64]" />
              <span className="text-xs font-mono-code text-white font-semibold">HackerRank Card</span>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono-code text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={hrDisplay}
                onChange={(e) => setHrDisplay(e.target.checked)}
                className="accent-primary w-4 h-4 rounded cursor-pointer"
              />
              <span>Display on Page</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                HackerRank Username
              </label>
              <input
                type="text"
                value={hrUsername}
                onChange={(e) => setHrUsername(e.target.value)}
                placeholder="ayushtiwari10201"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Star Rating / Badges
              </label>
              <input
                type="text"
                value={hrStars}
                onChange={(e) => setHrStars(e.target.value)}
                placeholder="4 Star"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Certifications
              </label>
              <input
                type="text"
                value={hrCerts}
                onChange={(e) => setHrCerts(e.target.value)}
                placeholder="5"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Problems Solved
              </label>
              <input
                type="text"
                value={hrProblems}
                onChange={(e) => setHrProblems(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GEEKSFORGEEKS */}
      {activeTab === 'gfg' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#2F8D46]/5 border border-[#2F8D46]/20">
            <div className="flex items-center gap-2">
              <SiGeeksforgeeks size={18} className="text-[#2F8D46]" />
              <span className="text-xs font-mono-code text-white font-semibold">GeeksforGeeks Card</span>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono-code text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={gfgDisplay}
                onChange={(e) => setGfgDisplay(e.target.checked)}
                className="accent-primary w-4 h-4 rounded cursor-pointer"
              />
              <span>Display on Page</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                GFG Username
              </label>
              <input
                type="text"
                value={gfgUsername}
                onChange={(e) => setGfgUsername(e.target.value)}
                placeholder="ayushtiwari"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Problems Solved
              </label>
              <input
                type="text"
                value={gfgProblems}
                onChange={(e) => setGfgProblems(e.target.value)}
                placeholder="155"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Coding Score
              </label>
              <input
                type="text"
                value={gfgScore}
                onChange={(e) => setGfgScore(e.target.value)}
                placeholder="500"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono-code uppercase text-muted-foreground mb-1">
                Coding Streak
              </label>
              <input
                type="text"
                value={gfgStreak}
                onChange={(e) => setGfgStreak(e.target.value)}
                placeholder="15 Days"
                className="w-full px-3 py-2 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}
    </InspectorDrawer>
  );
}
