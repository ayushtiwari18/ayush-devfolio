import { ProjectCard } from '@/components/cards/ProjectCard';
import { getPublishedProjects } from '@/services/projects.service';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Projects',
  description: 'Explore my portfolio of web development projects, from full-stack applications to creative experiments.',
  path: '/projects',
});

export default async function ProjectsPage() {
  let projects = [];

  try {
    projects = await getPublishedProjects();
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            My Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A collection of my work spanning web development, creative coding, and more.
            Each project represents a unique challenge and learning experience.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No projects available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
