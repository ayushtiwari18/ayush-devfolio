import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Projects - Ayush Tiwari',
  description: 'Browse all my projects and work samples',
};

export default function ProjectsPage() {
  // Temporary: No projects until Supabase is connected
  const projects = [];

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Button>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my work, featuring innovative solutions and creative implementations
          </p>
        </div>

        {/* Projects Grid */}
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-5xl">🚀</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Projects Coming Soon!</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            I'm currently adding my projects to the database. Check back soon for exciting work including GameON, Marine Minds, and more!
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="https://github.com/ayushtiwari18" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                View GitHub
              </Button>
            </Link>
            <Link href="/">
              <Button>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
