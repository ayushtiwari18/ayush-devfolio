/**
 * ProjectOverview — SERVER COMPONENT
 * ------------------------------------
 * Renders title, description, tags, duration, and action buttons.
 * No client state — pure HTML output for SEO.
 */
import Link from 'next/link';
import { Github, ExternalLink, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectOverview({ project }) {
  const { title, description, technologies, tags, duration, github_url, live_url, created_at, featured } = project;

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  return (
    <header className="mb-10">
      {/* Back navigation */}
      <Link href="/projects">
        <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
          <ArrowLeft className="mr-2" size={16} />
          All Projects
        </Button>
      </Link>

      {/* Featured badge */}
      {featured && (
        <span className="inline-flex items-center gap-1 px-3 py-1 mb-4 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20">
          ⭐ Featured Project
        </span>
      )}

      <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 gradient-text">
        {title}
      </h1>

      <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
        {formattedDate && (
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formattedDate}
          </span>
        )}
        {duration && (
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {duration}
          </span>
        )}
      </div>

      {/* Technology tags */}
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Topic tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {live_url && (
          <a href={live_url} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary hover:bg-primary/90">
              <ExternalLink className="mr-2" size={16} />
              Live Demo
            </Button>
          </a>
        )}
        {github_url && (
          <a href={github_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="hover:bg-primary/10 hover:border-primary">
              <Github className="mr-2" size={16} />
              Source Code
            </Button>
          </a>
        )}
      </div>
    </header>
  );
}
