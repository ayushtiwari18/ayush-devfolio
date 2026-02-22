/**
 * ProjectCTASection — SERVER COMPONENT
 * --------------------------------------
 * Bottom CTA: GitHub + Live Demo buttons.
 * Renders nothing if both URLs are absent.
 */
import { Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProjectCTASection({ githubUrl, liveUrl, title }) {
  if (!githubUrl && !liveUrl) return null;

  return (
    <section className="mt-12 p-8 bg-card border border-border rounded-2xl text-center">
      <h2 className="text-xl font-bold text-foreground mb-2">Explore {title}</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Check out the source code or see it live.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary hover:bg-primary/90">
              <ExternalLink className="mr-2" size={16} />
              View Live Demo
            </Button>
          </a>
        )}
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="hover:bg-primary/10 hover:border-primary">
              <Github className="mr-2" size={16} />
              View Source Code
            </Button>
          </a>
        )}
        <Link href="/projects">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            ← All Projects
          </Button>
        </Link>
      </div>
    </section>
  );
}
