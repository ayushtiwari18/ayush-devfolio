import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, Calendar, Eye } from 'lucide-react';
import { getProjectBySlug, incrementProjectViews } from '@/services/projects.service';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }) {
  try {
    const project = await getProjectBySlug(params.slug);
    
    return {
      title: project.title,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.cover_image ? [project.cover_image] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Project Not Found',
    };
  }
}

export default async function ProjectDetailPage({ params }) {
  let project;

  try {
    project = await getProjectBySlug(params.slug);
    
    // Increment views in background (non-blocking)
    incrementProjectViews(params.slug).catch(console.error);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href="/projects">
          <Button variant="ghost" className="mb-8 hover:text-primary">
            <ArrowLeft className="mr-2" size={18} />
            Back to Projects
          </Button>
        </Link>

        {/* Project Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 gradient-text">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(project.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            {project.views && (
              <div className="flex items-center gap-2">
                <Eye size={16} />
                <span>{project.views} views</span>
              </div>
            )}
          </div>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {project.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90">
                  <ExternalLink className="mr-2" size={18} />
                  Live Demo
                </Button>
              </a>
            )}
            
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Github className="mr-2" size={18} />
                  View Code
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Project Image */}
        {project.cover_image && (
          <div className="mb-12 rounded-lg overflow-hidden border border-border shadow-lg card-glow">
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image
                src={project.cover_image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Technologies Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies?.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Details */}
            {project.content && (
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-foreground mb-4">Project Details</h2>
                <div className="text-muted-foreground leading-relaxed">
                  {project.content}
                </div>
              </div>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Key Features</h2>
                <ul className="space-y-3">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary text-xl">•</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Project Info Card */}
              <div className="p-6 bg-card border border-border rounded-lg card-glow">
                <h3 className="text-xl font-bold text-foreground mb-4">Project Info</h3>
                
                <div className="space-y-4">
                  {project.category && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <p className="text-foreground font-medium capitalize">{project.category}</p>
                    </div>
                  )}
                  
                  {project.status && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
                        {project.status}
                      </span>
                    </div>
                  )}
                  
                  {project.date && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Completion Date</p>
                      <p className="text-foreground font-medium">
                        {new Date(project.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Card */}
              <div className="p-6 bg-card border border-border rounded-lg card-glow">
                <h3 className="text-xl font-bold text-foreground mb-4">Share Project</h3>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=Check out ${project.title}&url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-lg text-center hover:bg-primary/20 transition-colors border border-primary/20"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-lg text-center hover:bg-primary/20 transition-colors border border-primary/20"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
