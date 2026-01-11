import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Github, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { data: project } = await supabase
    .from('projects')
    .select('title, description')
    .eq('slug', params.slug)
    .single();

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} - Ayush Tiwari`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!project) {
    notFound();
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/projects">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2" size={18} />
            Back to Projects
          </Button>
        </Link>

        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">{project.description}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} />
              <span>{formatDate(project.created_at)}</span>
            </div>
            {project.featured && (
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20">
                Featured Project
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90">
                  <ExternalLink className="mr-2" size={18} />
                  View Live Demo
                </Button>
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Github className="mr-2" size={18} />
                  View Source Code
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {project.cover_image && (
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12 bg-muted">
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project Details */}
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-foreground mb-4">About This Project</h2>
          <p className="text-muted-foreground leading-relaxed">{project.description}</p>
        </div>
      </article>
    </main>
  );
}
