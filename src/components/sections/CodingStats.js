'use client';

import { motion } from 'framer-motion';
import { Code2, Trophy, Star, Award, TrendingUp } from 'lucide-react';
import { SiLeetcode, SiCodechef, SiCodeforces, SiHackerrank, SiGeeksforgeeks } from 'react-icons/si';

const codingPlatforms = [
  {
    name: 'LeetCode',
    icon: SiLeetcode,
    username: 'aayush03',
    stats: [
      { label: 'Problems Solved', value: '250+', icon: Code2 },
      { label: 'Contest Rating', value: '1657', icon: Trophy },
      { label: 'Contests', value: '12', icon: Award },
    ],
    color: 'from-orange-500 to-yellow-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    link: 'https://leetcode.com/aayush03',
  },
  {
    name: 'CodeChef',
    icon: SiCodechef,
    username: 'ayush_03',
    stats: [
      { label: 'Rating', value: '1443', icon: Star },
      { label: 'Contests', value: '10', icon: Trophy },
      { label: 'Problems', value: '150+', icon: Code2 },
    ],
    color: 'from-amber-600 to-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    link: 'https://www.codechef.com/users/ayush_03',
  },
  {
    name: 'Codeforces',
    icon: SiCodeforces,
    username: 'ayush_tiwari',
    stats: [
      { label: 'Max Rating', value: '1002', icon: TrendingUp },
      { label: 'Contests', value: '13', icon: Trophy },
      { label: 'Problems', value: '100+', icon: Code2 },
    ],
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    link: 'https://codeforces.com/profile/ayush_tiwari',
  },
  {
    name: 'HackerRank',
    icon: SiHackerrank,
    username: 'ayushtiwari10201',
    stats: [
      { label: 'Java Badge', value: '4 Star', icon: Star },
      { label: 'Certifications', value: '5+', icon: Award },
      { label: 'Problems', value: '100+', icon: Code2 },
    ],
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    link: 'https://www.hackerrank.com/ayushtiwari10201',
  },
  {
    name: 'GeeksforGeeks',
    icon: SiGeeksforgeeks,
    username: 'ayushtiwari',
    stats: [
      { label: 'Problems', value: '155+', icon: Code2 },
      { label: 'Score', value: '500+', icon: Trophy },
      { label: 'Streak', value: '15 Days', icon: TrendingUp },
    ],
    color: 'from-emerald-600 to-green-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    link: 'https://auth.geeksforgeeks.org/user/ayushtiwari',
  },
];

const overallStats = [
  {
    label: 'Total Problems',
    value: '655+',
    description: 'Across all platforms',
    icon: Code2,
    color: 'text-primary',
  },
  {
    label: 'Total Contests',
    value: '35+',
    description: 'Competitive programming',
    icon: Trophy,
    color: 'text-yellow-500',
  },
  {
    label: 'Badges & Awards',
    value: '11+',
    description: 'Achievements earned',
    icon: Award,
    color: 'text-purple-500',
  },
  {
    label: 'Max Streak',
    value: '200 Days',
    description: 'Consistent practice',
    icon: TrendingUp,
    color: 'text-green-500',
  },
];

export default function CodingStats() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            <Code2 size={32} className="text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Competitive <span className="gradient-text">Programming</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My journey across coding platforms, problem-solving stats, and competitive achievements
          </p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
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
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm font-semibold text-foreground mb-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {codingPlatforms.map((platform, index) => {
            const PlatformIcon = platform.icon;
            return (
              <motion.a
                key={index}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className={`relative h-full p-6 bg-card border ${platform.borderColor} rounded-2xl hover:border-primary/50 transition-all duration-300 overflow-hidden`}>
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Header */}
                  <div className="relative mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl ${platform.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <PlatformIcon size={28} className="text-foreground" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Profile</p>
                        <p className="text-sm font-medium text-foreground">@{platform.username}</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {platform.name}
                    </h3>
                  </div>

                  {/* Stats Grid */}
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
                          <span className="text-sm font-bold text-foreground">{stat.value}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* View Profile Link */}
                  <div className="relative mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">View Profile</span>
                      <span className="text-primary group-hover:underline">→</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
