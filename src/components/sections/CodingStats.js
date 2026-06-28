'use client';

import { useEffect, useState } from 'react';
import { Code2, Trophy, Star, Award, TrendingUp } from 'lucide-react';
import { SiLeetcode, SiCodechef, SiCodeforces, SiHackerrank, SiGeeksforgeeks } from 'react-icons/si';
import { useReveal, fadeUp } from '@/components/animations/useReveal';
import CountUp from '@/components/animations/CountUp';

// Fallback values used if DB returns null for a field
const FALLBACK = {
  total_problems:       '885+',  // fixed: was 655+, now matches HERO_COPY
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

// Render a stat value: if it's a pure number (or ends in +), use CountUp
// Otherwise render as plain text (e.g. "200 Days", "4 Star")
function StatValue({ value, className }) {
  const raw    = String(value);
  const hasSuffix = raw.endsWith('+');
  const numeric   = parseInt(raw.replace(/[^0-9]/g, ''), 10);

  if (!isNaN(numeric) && numeric > 0) {
    return (
      <CountUp
        end={numeric}
        suffix={hasSuffix ? '+' : ''}
        duration={1600}
        className={className}
      />
    );
  }
  return <span className={className}>{value}</span>;
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
    { label: 'Total Problems',  value: val(db, 'total_problems'),  description: 'Across all platforms',    icon: Code2,      color: 'text-primary'    },
    { label: 'Total Contests',  value: val(db, 'total_contests'),  description: 'Competitive programming', icon: Trophy,     color: 'text-yellow-500' },
    { label: 'Badges & Awards', value: val(db, 'total_badges'),    description: 'Achievements earned',     icon: Award,      color: 'text-purple-500' },
    { label: 'Max Streak',      value: val(db, 'max_streak'),      description: 'Consistent practice',     icon: TrendingUp, color: 'text-green-500'  },
  ];

  const codingPlatforms = [
    {
      name: 'LeetCode', icon: SiLeetcode,
      username: val(db, 'leetcode_username'),
      display: db?.leetcode_display ?? true,
      stats: [
        { label: 'Problems Solved', value: val(db, 'leetcode_solved'),   icon: Code2  },
        { label: 'Contest Rating',  value: val(db, 'leetcode_rating'),   icon: Trophy },
        { label: 'Contests',        value: val(db, 'leetcode_contests'), icon: Award  },
      ],
      color: 'from-orange-500 to-yellow-500', bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      link: `https://leetcode.com/u/${val(db, 'leetcode_username')}`,
    },
    {
      name: 'CodeChef', icon: SiCodechef,
      username: val(db, 'codechef_username'),
      display: db?.codechef_display ?? true,
      stats: [
        { label: 'Rating',   value: val(db, 'codechef_rating'),   icon: Star   },
        { label: 'Contests', value: val(db, 'codechef_contests'), icon: Trophy },
        { label: 'Problems', value: val(db, 'codechef_problems'), icon: Code2  },
      ],
      color: 'from-amber-600 to-amber-400', bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      link: `https://www.codechef.com/users/${val(db, 'codechef_username')}`,
    },
    {
      name: 'Codeforces', icon: SiCodeforces,
      username: val(db, 'codeforces_username'),
      display: db?.codeforces_display ?? true,
      stats: [
        { label: 'Max Rating', value: val(db, 'codeforces_rating'),   icon: TrendingUp },
        { label: 'Contests',   value: val(db, 'codeforces_contests'), icon: Trophy     },
        { label: 'Problems',   value: val(db, 'codeforces_problems'), icon: Code2      },
      ],
      color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      link: `https://codeforces.com/profile/${val(db, 'codeforces_username')}`,
    },
    {
      name: 'HackerRank', icon: SiHackerrank,
      username: val(db, 'hackerrank_username'),
      display: db?.hackerrank_display ?? true,
      stats: [
        { label: 'Java Badge',     value: val(db, 'hackerrank_stars'),    icon: Star  },
        { label: 'Certifications', value: val(db, 'hackerrank_certs'),    icon: Award },
        { label: 'Problems',       value: val(db, 'hackerrank_problems'), icon: Code2 },
      ],
      color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      link: `https://www.hackerrank.com/profile/${val(db, 'hackerrank_username')}`,
    },
    {
      name: 'GeeksforGeeks', icon: SiGeeksforgeeks,
      username: val(db, 'gfg_username'),
      display: db?.gfg_display ?? true,
      stats: [
        { label: 'Problems', value: val(db, 'gfg_problems'), icon: Code2      },
        { label: 'Score',    value: val(db, 'gfg_score'),    icon: Trophy     },
        { label: 'Streak',   value: val(db, 'gfg_streak'),   icon: TrendingUp },
      ],
      color: 'from-emerald-600 to-green-500', bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      link: `https://auth.geeksforgeeks.org/user/${val(db, 'gfg_username')}`,
    },
  ].filter(p => p.display);

  return (
    <section className="py-section px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={header.ref} className="text-center mb-16" style={fadeUp(header.visible)}>
          <p className="section-label mb-3">Proof of Work</p>
          <h2 className="section-heading mb-4">
            Competitive{' '}
            <span className="gradient-text">Programming</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My journey across coding platforms, problem-solving stats, and competitive achievements
          </p>
        </div>

        {/* Overall stats — CountUp on all numeric values */}
        <div
          ref={stats.ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          style={fadeUp(stats.visible, 0.1)}
        >
          {overallStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={24} className={stat.color} />
                  </div>
                  <StatValue
                    value={stat.value}
                    className="text-3xl font-bold font-mono-code text-foreground mb-1 block"
                  />
                  <p className="text-sm font-semibold text-foreground mb-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform cards */}
        <div ref={cards.ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {codingPlatforms.map((platform, index) => {
            const PlatformIcon = platform.icon;
            return (
              <a
                key={index}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${platform.name} profile of ${platform.username}`}
                className="group cursor-pointer"
                style={fadeUp(cards.visible, index * 0.08)}
              >
                <div className={`relative h-full p-6 bg-card border ${platform.borderColor} rounded-2xl hover:border-primary/50 transition-all duration-300 overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  <div className="relative mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl ${platform.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <PlatformIcon size={28} className="text-foreground" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Profile</p>
                        <p className="text-sm font-medium text-foreground font-mono-code">@{platform.username}</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{platform.name}</h3>
                  </div>

                  <div className="relative space-y-3">
                    {platform.stats.map((stat, statIndex) => {
                      const StatIcon = stat.icon;
                      return (
                        <div
                          key={statIndex}
                          className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-border group-hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <StatIcon size={16} className="text-primary" />
                            <span className="text-sm text-muted-foreground">{stat.label}</span>
                          </div>
                          <StatValue
                            value={stat.value}
                            className="text-sm font-bold font-mono-code text-foreground"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">View Profile</span>
                      <span className="text-primary group-hover:underline">→</span>
                    </div>
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
