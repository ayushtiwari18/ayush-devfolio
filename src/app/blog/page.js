import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Blog - Ayush Tiwari',
  description: 'Read my thoughts and insights on web development, programming, and technology',
};

export default function BlogPage() {
  // Temporary: No blog posts until Supabase is connected
  const posts = [];

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
            My <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on web development and technology
          </p>
        </div>

        {/* Blog Grid */}
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-5xl">✍️</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Blog Coming Soon!</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            I'm working on creating valuable content about web development, MERN stack, and my learning journey. Stay tuned!
          </p>
          <Link href="/">
            <Button>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
