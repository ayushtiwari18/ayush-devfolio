'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Plus, Github, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading,   setLoading]   = useState(false);
  const [techInput, setTechInput] = useState('');
  const [formData,  setFormData]  = useState({
    title:        '',
    slug:         '',
    description:  '',
    technologies: [],
    cover_image:  '',
    github_url:   '',
    live_url:     '',
    featured:     false,
    published:    true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = { ...formData, [name]: type === 'checkbox' ? checked : value };
    if (name === 'title') {
      next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    setFormData(next);
  };

  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };
  const removeTech = (t) =>
    setFormData(prev => ({ ...prev, technologies: prev.technologies.filter(x => x !== t) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('projects').insert([formData]);
      if (error) throw error;
      router.push('/admin/projects');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/projects">
          <Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back</Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground mt-1">Add a new project to your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Project Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="My Awesome Project" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">URL Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="my-awesome-project" />
              <p className="text-xs text-muted-foreground mt-1">/projects/{formData.slug || 'slug'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Describe your project…" />
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Technologies</h2>
          <div className="flex gap-2 mb-4">
            <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="React, Node.js…" />
            <Button type="button" onClick={addTech} className="px-6"><Plus size={18} className="mr-2" />Add</Button>
          </div>
          {formData.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map(t => (
                <span key={t} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 flex items-center gap-2">
                  {t}
                  <button type="button" onClick={() => removeTech(t)}><X size={14} className="hover:text-red-500" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Media & Links</h2>
          <div className="space-y-5">
            {/* Cover image — real upload */}
            <ImageUploader
              label="Cover Image"
              value={formData.cover_image}
              onChange={url => setFormData(prev => ({ ...prev, cover_image: url }))}
              folder="projects"
              hint="Shown as the project thumbnail. Recommended: 1280×720px."
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Github size={16} /> GitHub Repository URL
              </label>
              <input type="url" name="github_url" value={formData.github_url} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://github.com/username/repo" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <ExternalLink size={16} /> Live Demo URL
              </label>
              <input type="url" name="live_url" value={formData.live_url} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://myproject.com" />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}
                className="w-5 h-5 accent-primary" />
              <div>
                <p className="font-medium text-foreground">Featured Project</p>
                <p className="text-sm text-muted-foreground">Show prominently on the homepage</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="published" checked={formData.published} onChange={handleChange}
                className="w-5 h-5 accent-primary" />
              <div>
                <p className="font-medium text-foreground">Publish Project</p>
                <p className="text-sm text-muted-foreground">Make visible to the public</p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
            {loading
              ? <><Loader2 size={18} className="animate-spin mr-2" />Creating…</>
              : <><Save size={18} className="mr-2" />Create Project</>
            }
          </Button>
          <Link href="/admin/projects">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
