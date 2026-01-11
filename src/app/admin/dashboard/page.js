'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  FileText,
  Award,
  Trophy,
  MessageSquare,
  Eye,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: { total: 0, published: 0, views: 0 },
    blogPosts: { total: 0, published: 0, views: 0 },
    certifications: 0,
    hackathons: 0,
    messages: { total: 0, unread: 0 },
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats();
  }, []);

  const getDashboardStats = async () => {
    try {
      const [projects, blogPosts, certifications, hackathons, messages] = await Promise.all([
        supabase.from('projects').select('id, views, published', { count: 'exact' }),
        supabase.from('blog_posts').select('id, views, published', { count: 'exact' }),
        supabase.from('certifications').select('id', { count: 'exact' }),
        supabase.from('hackathons').select('id', { count: 'exact' }),
        supabase.from('contact_messages').select('id, status', { count: 'exact' }),
      ]);

      const totalProjectViews = projects.data?.reduce((acc, p) => acc + (p.views || 0), 0) || 0;
      const totalBlogViews = blogPosts.data?.reduce((acc, b) => acc + (b.views || 0), 0) || 0;
      const unreadMessages = messages.data?.filter((m) => m.status === 'unread').length || 0;

      setStats({
        projects: {
          total: projects.count || 0,
          published: projects.data?.filter((p) => p.published).length || 0,
          views: totalProjectViews,
        },
        blogPosts: {
          total: blogPosts.count || 0,
          published: blogPosts.data?.filter((b) => b.published).length || 0,
          views: totalBlogViews,
        },
        certifications: certifications.count || 0,
        hackathons: hackathons.count || 0,
        messages: {
          total: messages.count || 0,
          unread: unreadMessages,
        },
        totalViews: totalProjectViews + totalBlogViews,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Projects',
      value: stats.projects.total,
      subtitle: `${stats.projects.published} published`,
      icon: FolderGit2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      href: '/admin/projects',
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts.total,
      subtitle: `${stats.blogPosts.published} published`,
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      href: '/admin/blog',
    },
    {
      title: 'Certifications',
      value: stats.certifications,
      subtitle: 'Professional credentials',
      icon: Award,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      href: '/admin/certifications',
    },
    {
      title: 'Hackathons',
      value: stats.hackathons,
      subtitle: 'Competitions participated',
      icon: Trophy,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      href: '/admin/hackathons',
    },
    {
      title: 'Messages',
      value: stats.messages.total,
      subtitle: `${stats.messages.unread} unread`,
      icon: MessageSquare,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      href: '/admin/messages',
      badge: stats.messages.unread > 0 ? stats.messages.unread : null,
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      subtitle: 'All content',
      icon: Eye,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
  ];

  const quickActions = [
    {
      title: 'New Project',
      description: 'Add a new project to your portfolio',
      icon: FolderGit2,
      href: '/admin/projects/new',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'New Blog Post',
      description: 'Write a new blog article',
      icon: FileText,
      href: '/admin/blog/new',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Add Certificate',
      description: 'Add a new certification',
      icon: Award,
      href: '/admin/certifications/new',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Add Hackathon',
      description: 'Record hackathon participation',
      icon: Trophy,
      href: '/admin/hackathons/new',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your portfolio today.
            </p>
          </div>
          <Link href="/" target="_blank">
            <Button className="bg-primary hover:bg-primary/90">
              <Eye className="mr-2" size={18} />
              View Live Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-primary" />
          Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat) => (
            <Link key={stat.title} href={stat.href || '#'}>
              <div className="bg-card border border-border rounded-xl p-6 card-glow hover-lift transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <stat.icon className={stat.color} size={24} />
                  </div>
                  {stat.badge && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {stat.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Plus size={24} className="text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <div className="bg-card border border-border rounded-xl p-6 card-glow hover-lift transition-all group">
                <div className={`inline-flex p-3 ${action.bgColor} rounded-lg mb-4`}>
                  <action.icon className={action.color} size={24} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Create now
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
