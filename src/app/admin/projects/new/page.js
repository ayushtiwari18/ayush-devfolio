'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, X, Plus, Link as LinkIcon, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [techInput, setTechInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    technologies: [],
    cover_image: '',
    github_url: '',
    live_url: '',
    featured: false,
    published: true,
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
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, cover_image: url });
    setImagePreview(url);
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from('projects').insert([formData]).select();

      if (error) throw error;

      router.push('/admin/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/projects">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2" size={18} />
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground mt-2">Add a new project to your portfolio</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <h2 className="text-xl font-bold text-foreground mb-6">Basic Information</h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="My Awesome Project"
            />
          </div>

          {/* Slug */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              placeholder="my-awesome-project"
            />
            <p className="text-xs text-muted-foreground mt-1">
              URL: /projects/{formData.slug || 'your-project-slug'}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe your project..."
            />
          </div>
        </div>

        {/* Technologies Card */}
        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <h2 className="text-xl font-bold text-foreground mb-6">Technologies</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Add Technology
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="React, Node.js, etc."
              />
              <Button type="button" onClick={addTechnology} className="px-6">
                <Plus size={18} className="mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Tech Tags */}
          {formData.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 flex items-center gap-2"
                >
                  {tech}
                  <button type="button" onClick={() => removeTechnology(tech)}>
                    <X size={14} className="hover:text-red-500" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media Card */}
        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <h2 className="text-xl font-bold text-foreground mb-6">Media & Links</h2>

          {/* Cover Image */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.cover_image}
                onChange={handleImageChange}
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com/image.jpg"
              />
              <Button type="button" variant="outline">
                <Upload size={18} className="mr-2" />
                Upload
              </Button>
            </div>
            {imagePreview && (
              <div className="mt-3 relative h-48 rounded-lg overflow-hidden bg-muted">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* GitHub URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Github size={16} />
              GitHub Repository URL
            </label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <ExternalLink size={16} />
              Live Demo URL
            </label>
            <input
              type="url"
              name="live_url"
              value={formData.live_url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://myproject.com"
            />
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <h2 className="text-xl font-bold text-foreground mb-6">Settings</h2>

          <div className="space-y-4">
            {/* Featured */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <div>
                <p className="font-medium text-foreground">Featured Project</p>
                <p className="text-sm text-muted-foreground">
                  Display this project prominently on the homepage
                </p>
              </div>
            </label>

            {/* Published */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              />
              <div>
                <p className="font-medium text-foreground">Publish Project</p>
                <p className="text-sm text-muted-foreground">
                  Make this project visible to the public
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={18} />
                Create Project
              </span>
            )}
          </Button>
          <Link href="/admin/projects">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
