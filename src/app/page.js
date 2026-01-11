import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Hero } from '@/components/sections/Hero';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { BlogCard } from '@/components/cards/BlogCard';
import { Button } from '@/components/ui/button';
import { getFeaturedProjects } from '@/services/projects.service';
import { getRecentBlogPosts } from '@/services/blog.service';

export default async function Home() {
  // Fetch data with error handling
  let featuredProjects = [];
  let recentPosts = [];

  try {
    featuredProjects = await getFeaturedProjects();
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
  }

  try {
    recentPosts = await getRecentBlogPosts(3);
  } catch (error) {
    console.error('Failed to fetch recent blog posts:', error);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Featured Projects
                </h2>
                <p className="text-muted-foreground">
                  Showcasing my best work in web development
                </p>
              </div>
              <Link href="/projects">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Blog Posts Section */}
      {recentPosts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Latest Blog Posts
                </h2>
                <p className="text-muted-foreground">
                  Thoughts on development, design, and technology
                </p>
              </div>
              <Link href="/blog">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let's Work Together
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and opportunities.
            Whether you have a question or just want to say hi, feel free to reach out.
          </p>
          <Link href="/contact">
            <Button size="lg">
              Get In Touch
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
