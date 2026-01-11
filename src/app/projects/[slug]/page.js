import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProjectBySlug, getPublishedProjects } from '@/services/projects.service';
import { generateArticleMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  try {
    const projects = await getPublishedProjects();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const project = await getProjectBySlug(params.slug);
    
    if (!project) {
      return {};
    }

    return generateArticleMetadata({
      title: project.title,
      description: project.description,
      publishedTime: project.created_at,
      tags: project.technologies || [],
      path: `/projects/${project.slug}`,
    });
  } catch (error) {
    return {};
  }
}

export default async function ProjectDetailPage({ params }) {
  let project = null;

  try {
    project = await getProjectBySlug(params.slug);
  } catch (error) {
    console.error('Failed to fetch project:', error);
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/projects">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2" size={16} />
            Back to Projects
          </Button>
        </Link>

        {project.cover_image && (
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {project.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-6">
          {project.description}
        </p>

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-4 mb-12">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default">
                <Github className="mr-2" size={18} />
                View Code
              </Button>
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                <ExternalLink className="mr-2" size={18} />
                Live Demo
              </Button>
            </a>
          )}
        </div>

        {project.content && (
          <div className="prose prose-lg max-w-none">
            <div className="text-foreground whitespace-pre-wrap">
              {project.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
