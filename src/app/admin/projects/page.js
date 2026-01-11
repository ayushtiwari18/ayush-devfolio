import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Github,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects ({projects.length} total)
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />
            Add New Project
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
          <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Projects</option>
            <option>Featured</option>
            <option>Regular</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first project.
            </p>
            <Link href="/admin/projects/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2" size={18} />
                Create First Project
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all"
            >
              {/* Image */}
              {project.cover_image && (
                <div className="relative h-48 bg-muted">
                  <Image
                    src={project.cover_image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {project.featured && (
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Star size={12} fill="white" />
                        Featured
                      </span>
                    )}
                    {project.published ? (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle size={12} />
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <XCircle size={12} />
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {project.views !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>{project.views} views</span>
                    </div>
                  )}
                  {project.github_url && (
                    <div className="flex items-center gap-1">
                      <Github size={14} />
                      <span>GitHub</span>
                    </div>
                  )}
                  {project.live_url && (
                    <div className="flex items-center gap-1">
                      <ExternalLink size={14} />
                      <span>Live</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link href={`/admin/projects/${project.id}/edit`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                  <Link href={`/projects/${project.slug}`} target="_blank">
                    <Button variant="outline" className="hover:bg-primary/10">
                      <Eye size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
