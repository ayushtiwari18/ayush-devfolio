/**
 * RelatedContentSection — SERVER COMPONENT
 * -----------------------------------------
 * Fetches and renders related projects + related blog posts.
 * Renders nothing if both arrays are empty.
 */
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function RelatedContentSection({ relatedProjects, relatedBlogs }) {
  const hasProjects = relatedProjects && relatedProjects.length > 0;
  const hasBlogs = relatedBlogs && relatedBlogs.length > 0;

  if (!hasProjects && !hasBlogs) return null;

  return (
    <aside className="mt-20 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-8">Related Content</h2>

      {hasProjects && (
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Related Projects
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                {project.cover_image && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={project.cover_image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {project.description}
                  </p>
                </div>
                <ArrowRight size={14} className="text-muted-foreground shrink-0 ml-auto group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {hasBlogs && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedBlogs.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                {post.cover_image && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {post.title}
                  </p>
                  {post.reading_time && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {post.reading_time} min read
                    </p>
                  )}
                </div>
                <ArrowRight size={14} className="text-muted-foreground shrink-0 ml-auto group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
