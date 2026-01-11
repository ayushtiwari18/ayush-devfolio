'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, X, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image: '',
    tags: [],
    published: true,
    reading_time: 5,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }

    // Auto-calculate reading time from content
    if (name === 'content') {
      const words = value.trim().split(/\s+/).length;
      const readingTime = Math.ceil(words / 200); // 200 words per minute
      setFormData((prev) => ({ ...prev, reading_time: readingTime }));
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, cover_image: url });
    setImagePreview(url);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from('blog_posts').insert([formData]).select();

      if (error) throw error;

      router.push('/admin/blog');
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('Error creating blog post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/blog">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2" size={18} />
            Back to Blog
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Write New Post</h1>
            <p className="text-muted-foreground mt-2">Create a new blog article</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Eye className="mr-2" size={18} />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <div className="bg-card border border-border rounded-xl p-6 card-glow">
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="My Awesome Blog Post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="my-awesome-blog-post"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL: /blog/{formData.slug || 'your-post-slug'}
                </p>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-card border border-border rounded-xl p-6 card-glow">
              <label className="block text-sm font-medium text-foreground mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="A brief summary of your post..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Shown in blog listing and social media previews
              </p>
            </div>

            {/* Content Editor */}
            <div className="bg-card border border-border rounded-xl p-6 card-glow">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-foreground">
                  Content (Markdown) *
                </label>
                <span className="text-xs text-muted-foreground">
                  {formData.reading_time} min read
                </span>
              </div>

              {!showPreview ? (
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={20}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="# Your blog post content here...\n\nWrite in **Markdown** format."
                />
              ) : (
                <div className="w-full px-4 py-3 bg-background border border-border rounded-lg min-h-[500px] prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br />') }} />
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2">
                Supports Markdown: **bold**, *italic*, [links](url), # headings, etc.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cover Image */}
            <div className="bg-card border border-border rounded-xl p-6 card-glow">
              <h3 className="font-bold text-foreground mb-4">Cover Image</h3>
              <input
                type="url"
                value={formData.cover_image}
                onChange={handleImageChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                placeholder="Image URL"
              />
              <Button type="button" variant="outline" className="w-full mb-3">
                <Upload size={16} className="mr-2" />
                Upload Image
              </Button>
              {imagePreview && (
                <div className="relative h-40 rounded-lg overflow-hidden bg-muted">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-card border border-border rounded-xl p-6 card-glow">
              <h3 className="font-bold text-foreground mb-4">Tags</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add tag"
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus size={16} />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 flex items-center gap-1"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X size={12} className="hover:text-red-500" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="bg-card border border-border rounded-xl p-6 card-glow">
              <h3 className="font-bold text-foreground mb-4">Settings</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Publish Post</p>
                  <p className="text-xs text-muted-foreground">Make visible to public</p>
                </div>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                  Publishing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={18} />
                  Publish Post
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
