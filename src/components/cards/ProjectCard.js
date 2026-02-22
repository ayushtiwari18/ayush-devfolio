/**
 * ProjectCard — SERVER COMPONENT
 * --------------------------------
 * Modal fully removed. Card navigates to /projects/[slug] via Link.
 * This is a pure presentational Server Component — no useState, no Framer Motion.
 * Animation on the listing grid is handled at the page level if needed.
 */
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink, Code2, Star } from 'lucide-react';

export default function ProjectCard({ project }) {
  return (
    <article className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">

      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow">
          <Star size={10} fill="white" />
          Featured
        </div>
      )}

      {/* Cover image */}
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 size={56} className="text-primary/20" />
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-white text-xs font-medium">View Case Study →</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tech tags */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md border border-primary/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Link href={`/projects/${project.slug}`} className="flex-1">
            <span className="text-sm font-medium text-primary hover:underline">
              View Case Study →
            </span>
          </Link>

          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} GitHub`}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github size={15} />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
