import { BlogCard } from '@/components/cards/BlogCard';
import { getPublishedBlogPosts } from '@/services/blog.service';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Blog',
  description: 'Read my thoughts on web development, software engineering, and technology trends.',
  path: '/blog',
});

export default async function BlogPage() {
  let posts = [];

  try {
    posts = await getPublishedBlogPosts();
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Thoughts, tutorials, and insights on web development, software engineering,
            and the ever-evolving tech landscape.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No blog posts available yet. Check back soon for new content!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
