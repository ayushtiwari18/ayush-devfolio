import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ProjectCard({ project }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {project.cover_image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-foreground">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
          {project.technologies?.length > 3 && (
            <Badge variant="outline">+{project.technologies.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Link href={`/projects/${project.slug}`} className="flex-1">
          <Button variant="default" className="w-full">
            View Details
          </Button>
        </Link>
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon">
              <Github size={18} />
            </Button>
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon">
              <ExternalLink size={18} />
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
