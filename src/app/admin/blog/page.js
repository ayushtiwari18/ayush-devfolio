import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog articles ({posts.length} total)
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />
            Write New Post
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
          <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Tags</option>
            <option>JavaScript</option>
            <option>React</option>
            <option>Next.js</option>
          </select>
        </div>
      </div>

      {/* Blog Posts List */}
      {posts.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Blog Posts Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start sharing your knowledge by writing your first blog post.
            </p>
            <Link href="/admin/blog/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2" size={18} />
                Write First Post
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                {post.cover_image && (
                  <div className="relative w-full md:w-64 h-48 bg-muted flex-shrink-0">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {post.published ? (
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full flex items-center gap-1 border border-green-500/20">
                          <CheckCircle size={12} />
                          Published
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-500/10 text-gray-500 text-xs font-bold rounded-full flex items-center gap-1 border border-gray-500/20">
                          <XCircle size={12} />
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Tag size={14} className="text-muted-foreground" />
                      {post.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 4 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{post.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta Info & Actions */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {post.reading_time && (
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{post.reading_time} min read</span>
                        </div>
                      )}
                      {post.views !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye size={14} />
                          <span>{post.views} views</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="hover:bg-primary/10">
                          <Eye size={16} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
