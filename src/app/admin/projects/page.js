'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Edit, Trash2, Eye,
  ExternalLink, CheckCircle, XCircle,
  Star, Loader2, AlertCircle, ImageIcon,
} from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import FallbackImage from '@/components/ui/FallbackImage';
import { supabase } from '@/lib/supabase';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  useEffect(() => { getProjects(); }, []);

  const getProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmedDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = projects.filter(p => {
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      (p.technologies || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && p.published) ||
      (statusFilter === 'draft' && !p.published);
    const matchesFeatured =
      featuredFilter === 'all' ||
      (featuredFilter === 'featured' && p.featured) ||
      (featuredFilter === 'regular' && !p.featured);
    return matchesSearch && matchesStatus && matchesFeatured;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <AlertCircle className="text-destructive" size={40} />
      <p className="text-destructive text-center">{error}</p>
      <Button onClick={getProjects} variant="outline">Try Again</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Project?"
        description={deleteTarget ? `"${deleteTarget.title}" will be permanently removed from your portfolio. This cannot be undone.` : ''}
        confirmLabel="Delete Project"
        danger
        loading={!!deletingId}
        onConfirm={handleConfirmedDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">{filtered.length} of {projects.length} projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-primary hover:bg-primary/90"><Plus className="mr-2" size={18} />Add New Project</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, description, or tech..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select value={featuredFilter} onChange={e => setFeaturedFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">All Projects</option>
            <option value="featured">Featured</option>
            <option value="regular">Regular</option>
          </select>
          {(search || statusFilter !== 'all' || featuredFilter !== 'all') && (
            <Button variant="outline" size="sm"
              onClick={() => { setSearch(''); setStatusFilter('all'); setFeaturedFilter('all'); }}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {projects.length === 0 ? 'No Projects Yet' : 'No Matching Projects'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {projects.length === 0 ? 'Get started by creating your first project.' : 'Try adjusting your search or filters.'}
            </p>
            {projects.length === 0 && (
              <Link href="/admin/projects/new">
                <Button className="bg-primary hover:bg-primary/90"><Plus className="mr-2" size={18} />Create First Project</Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map(project => (
            <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all">

              {/* Cover image with FallbackImage */}
              {project.cover_image && (
                <div className="relative h-48 bg-muted">
                  <FallbackImage
                    src={project.cover_image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized
                    fallback={
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon size={32} />
                        <span className="text-xs">No image</span>
                      </div>
                    }
                    containerClassName="absolute inset-0 flex items-center justify-center bg-muted"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {project.featured && (
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Star size={12} fill="white" />Featured
                      </span>
                    )}
                    {project.published
                      ? <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1"><CheckCircle size={12} />Published</span>
                      : <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-full flex items-center gap-1"><XCircle size={12} />Draft</span>
                    }
                  </div>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">{tech}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">+{project.technologies.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {project.view_count > 0 && (
                    <div className="flex items-center gap-1"><Eye size={14} /><span>{project.view_count} views</span></div>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors">
                      <GitHubIcon size={14} /><span>GitHub</span>
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ExternalLink size={14} /><span>Live</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/projects/${project.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      <Edit size={16} className="mr-2" />Edit
                    </Button>
                  </Link>
                  <Button variant="outline"
                    disabled={deletingId === project.id}
                    onClick={() => setDeleteTarget({ id: project.id, title: project.title })}
                    className="border-red-500 text-red-500 hover:bg-red-500/10 disabled:opacity-50">
                    {deletingId === project.id
                      ? <Loader2 size={16} className="animate-spin" />
                      : <Trash2 size={16} />}
                  </Button>
                  {project.slug && (
                    <Link href={`/projects/${project.slug}`} target="_blank">
                      <Button variant="outline" className="hover:bg-primary/10"><Eye size={16} /></Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
