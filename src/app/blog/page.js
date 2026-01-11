import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import BlogCard from '@/components/cards/BlogCard';

export const metadata = {
  title: 'Blog - Ayush Tiwari',
  description: 'Read articles about web development, programming, and technology',
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

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
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            <BookOpen size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Blog <span className="gradient-text">Articles</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on modern web development and technology
          </p>
        </div>

        {/* Blog Posts */}
        {posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen size={48} className="text-primary/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Articles Yet</h3>
            <p className="text-muted-foreground mb-6">Check back soon for interesting articles and tutorials!</p>
          </div>
        )}
      </div>
    </main>
  );
}
