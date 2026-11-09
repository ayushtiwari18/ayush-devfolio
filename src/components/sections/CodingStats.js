'use client';

import { useEffect, useState } from 'react';
import { Code2, Trophy, Star, Award, TrendingUp, ExternalLink, Zap, Terminal } from 'lucide-react';
import { SiLeetcode, SiCodechef, SiCodeforces, SiHackerrank, SiGeeksforgeeks } from 'react-icons/si';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import CountUp from '@/components/animations/CountUp';

// Fallback values used if DB returns null for a field
const FALLBACK = {
  total_problems:       '885+',
  total_contests:       '35+',
  total_badges:         '11+',
  max_streak:           '200 Days',
  leetcode_username:    'aayush03',
  leetcode_solved:      '885+',
  leetcode_rating:      '1657',
  leetcode_contests:    12,
  codechef_username:    'ayush_03',
  codechef_rating:      '1443',
  codechef_contests:    10,
  codechef_problems:    '150+',
  codeforces_username:  'ayush_tiwari',
  codeforces_rating:    '1002',
  codeforces_contests:  13,
  codeforces_problems:  '100+',
  hackerrank_username:  'ayushtiwari10201',
  hackerrank_stars:     '4 Star',
  hackerrank_certs:     5,
  hackerrank_problems:  '100+',
  gfg_username:         'ayushtiwari',
  gfg_problems:         '155+',
  gfg_score:            '500+',
  gfg_streak:           '15 Days',
};

function val(db, key) {
  const v = db?.[key];
  if (v === null || v === undefined || v === '') return FALLBACK[key] ?? '—';
  return v;
}

function StatValue({ value, className }) {
  const raw       = String(value);
  const hasSuffix = raw.endsWith('+');
  const numeric   = parseInt(raw.replace(/[^0-9]/g, ''), 10);

  if (!isNaN(numeric) && numeric > 0) {
    return (
      <CountUp
        end={numeric}
        suffix={hasSuffix ? '+' : ''}
        duration={1500}
        className={`${className} tabular-nums font-mono-code`}
      />
    );
  }
  return <span className={`${className} tabular-nums font-mono-code`}>{value}</span>;
}

export default function CodingStats() {
  const [db, setDb] = useState(null);
  const header = useReveal({ threshold: 0.1 });
  const stats  = useReveal({ threshold: 0.1 });
  const cards  = useReveal({ threshold: 0.05 });

  useEffect(() => {
    fetch('/api/public/status')
      .then(r => r.ok ? r.json() : null)
      .then(data => setDb(data))
      .catch(() => null);
  }, []);

  const overallStats = [
    { label: 'Total Problems',  value: val(db, 'total_problems'),  description: 'Verified algorithmic solutions', icon: Code2,      color: 'text-primary'    },
    { label: 'Contests Fought', value: val(db, 'total_contests'),  description: 'Timed competitive rounds',       icon: Trophy,     color: 'text-amber-400'  },
    { label: 'Badges Earned',   value: val(db, 'total_badges'),    description: 'Specialized topic proficiencies', icon: Award,      color: 'text-purple-400' },
    { label: 'Longest Streak',  value: val(db, 'max_streak'),      description: 'Continuous daily consistency',   icon: TrendingUp, color: 'text-emerald-400'}
  ];

  const codingPlatforms = [
    {
      name: 'LeetCode',
      icon: SiLeetcode,
      tier: 'Knight Path · 1657 Rating',
      ratingPct: 78,
      username: val(db, 'leetcode_username'),
      display: db?.leetcode_display ?? true,
      stats: [
        { label: 'Solved', value: val(db, 'leetcode_solved') },
        { label: 'Rating', value: val(db, 'leetcode_rating') },
        { label: 'Rounds', value: val(db, 'leetcode_contests') },
      ],
      brandColor: 'text-[#FFA116]',
      badgeBg: 'bg-[#FFA116]/10 text-[#FFA116] border-[#FFA116]/25',
      barColor: 'from-[#FFA116] to-amber-500',
      link: `https://leetcode.com/u/${val(db, 'leetcode_username')}`,
    },
    {
      name: 'CodeChef',
      icon: SiCodechef,
      tier: 'Division 2 · 1443 Rating',
      ratingPct: 62,
      username: val(db, 'codechef_username'),
      display: db?.codechef_display ?? true,
      stats: [
        { label: 'Rating',   value: val(db, 'codechef_rating') },
        { label: 'Solved',   value: val(db, 'codechef_problems') },
        { label: 'Contests', value: val(db, 'codechef_contests') },
      ],
      brandColor: 'text-[#D09B61]',
      badgeBg: 'bg-[#D09B61]/10 text-[#D09B61] border-[#D09B61]/25',
      barColor: 'from-[#D09B61] to-yellow-600',
      link: `https://www.codechef.com/users/${val(db, 'codechef_username')}`,
    },
    {
      name: 'Codeforces',
      icon: SiCodeforces,
      tier: 'Specialist Path · 1002 Rating',
      ratingPct: 50,
      username: val(db, 'codeforces_username'),
      display: db?.codeforces_display ?? true,
      stats: [
        { label: 'Peak',     value: val(db, 'codeforces_rating') },
        { label: 'Solved',   value: val(db, 'codeforces_problems') },
        { label: 'Contests', value: val(db, 'codeforces_contests') },
      ],
      brandColor: 'text-[#1F8ACB]',
      badgeBg: 'bg-[#1F8ACB]/10 text-[#1F8ACB] border-[#1F8ACB]/25',
      barColor: 'from-[#1F8ACB] to-cyan-500',
      link: `https://codeforces.com/profile/${val(db, 'codeforces_username')}`,
    },
    {
      name: 'HackerRank',
      icon: SiHackerrank,
      tier: '5-Star Problem Solving',
      ratingPct: 85,
      username: val(db, 'hackerrank_username'),
      display: db?.hackerrank_display ?? true,
      stats: [
        { label: 'Badges', value: val(db, 'hackerrank_stars') },
        { label: 'Certs',  value: val(db, 'hackerrank_certs') },
        { label: 'Solved', value: val(db, 'hackerrank_problems') },
      ],
      brandColor: 'text-[#00EA64]',
      badgeBg: 'bg-[#00EA64]/10 text-[#00EA64] border-[#00EA64]/25',
      barColor: 'from-[#00EA64] to-emerald-500',
      link: `https://www.hackerrank.com/profile/${val(db, 'hackerrank_username')}`,
    },
    {
      name: 'GeeksforGeeks',
      icon: SiGeeksforgeeks,
      tier: '500+ Campus Score',
      ratingPct: 70,
      username: val(db, 'gfg_username'),
      display: db?.gfg_display ?? true,
      stats: [
        { label: 'Solved', value: val(db, 'gfg_problems') },
        { label: 'Score',  value: val(db, 'gfg_score') },
        { label: 'Streak', value: val(db, 'gfg_streak') },
      ],
      brandColor: 'text-[#2F8D46]',
      badgeBg: 'bg-[#2F8D46]/10 text-[#2F8D46] border-[#2F8D46]/25',
      barColor: 'from-[#2F8D46] to-green-600',
      link: `https://auth.geeksforgeeks.org/user/${val(db, 'gfg_username')}`,
    },
  ].filter(p => p.display);

  return (
    <section id="stats" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#05070B] overflow-hidden">
      
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-1/4 w-[600px] h-[500px] bg-primary/[0.03] rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section Header */}
        <div ref={header.ref} className="text-center max-w-3xl mx-auto mb-16" style={fadeUp(header.visible)}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono-code text-gray-400 mb-4 backdrop-blur-md">
            <Terminal size={12} className="text-primary" />
            <span>AYUSH-CLI // PROOF_OF_WORK.sh</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em] leading-tight mb-4">
            Competitive Programming &amp;{' '}
            <span className="text-primary inline-block">Problem Solving</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Over 885+ algorithmic challenges solved across international coding platforms with consistent contest participation.
          </p>
        </div>

        {/* Top 4 Overall Telemetry Cards */}
        <div
          ref={stats.ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-14"
          style={fadeUp(stats.visible, 0.1)}
        >
          {overallStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-[#090D16] border border-white/10 hover:border-indigo-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-white/[0.08] transition-all">
                  <Icon size={18} className={stat.color} />
                </div>
                <div>
                  <StatValue
                    value={stat.value}
                    className="text-2xl sm:text-3xl font-bold text-white block tracking-tight"
                  />
                  <p className="text-xs sm:text-sm font-semibold text-gray-200 mt-1">{stat.label}</p>
                  <p className="text-[11px] font-mono-code text-gray-400 mt-0.5 line-clamp-1">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Command Center Platform Cards */}
        <div ref={cards.ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {codingPlatforms.map((platform, index) => {
            const PlatformIcon = platform.icon;
            return (
              <a
                key={index}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${platform.name} profile`}
                className="group select-none"
                style={fadeUp(cards.visible, index * 0.08)}
              >
                <div className="h-full bg-[#090D16] border border-white/10 hover:border-indigo-500/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl shadow-black/80 transition-all duration-300 group-hover:-translate-y-1">
                  
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <PlatformIcon size={24} className={platform.brandColor} />
                      </div>
                      <span className={`text-[10px] font-mono-code font-semibold px-2.5 py-1 rounded-full border ${platform.badgeBg}`}>
                        {platform.tier}
                      </span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-primary transition-colors flex items-center justify-between">
                      <span>{platform.name}</span>
                      <ExternalLink size={14} className="text-gray-500 group-hover:text-primary transition-colors" />
                    </h3>
                    <p className="text-xs font-mono-code text-gray-400 mt-0.5 mb-5">
                      @{platform.username}
                    </p>

                    {/* Mini Rating Meter */}
                    <div className="mb-5 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-mono-code text-gray-400">
                        <span>Progress Benchmark</span>
                        <span className="text-white font-semibold">{platform.ratingPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${platform.barColor}`}
                          style={{ width: `${platform.ratingPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats 3-Col Bar */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center font-mono-code">
                      {platform.stats.map((s, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <span className="text-[10px] text-gray-400 uppercase block">{s.label}</span>
                          <StatValue value={s.value} className="text-xs sm:text-sm font-bold text-white" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer link line */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono-code text-gray-400">
                    <span className="group-hover:text-white transition-colors">Verified Profile</span>
                    <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
                  </div>

                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
