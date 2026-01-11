'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function NewHackathonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [techInput, setTechInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    result: '',
    description: '',
    technologies: [],
    image: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTechnology = (tech) => {
    setFormData({ ...formData, technologies: formData.technologies.filter((t) => t !== tech) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('hackathons').insert([formData]);
      if (error) throw error;
      router.push('/admin/hackathons');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/hackathons"><Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back</Button></Link>
        <h1 className="text-3xl font-bold">Add Hackathon</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Hackathon Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Smart India Hackathon 2024" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Role</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Team Lead, Solo Developer, etc." />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Result/Achievement</label>
            <input type="text" name="result" value={formData.result} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Winner, 2nd Place, Finalist, etc." />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Brief description of the project..." />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Date *</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <h3 className="font-bold mb-4">Technologies Used</h3>
          <div className="flex gap-2 mb-3">
            <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())} className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="React, Node.js, etc." />
            <Button type="button" onClick={addTechnology}><Plus size={18} /></Button>
          </div>
          {formData.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-2">
                  {tech}
                  <button type="button" onClick={() => removeTechnology(tech)}><X size={14} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <h3 className="font-bold mb-4">Image</h3>
          <input type="url" value={formData.image} onChange={handleImageChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3" placeholder="https://..." />
          {imagePreview && <div className="relative h-48 rounded-lg overflow-hidden"><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /></div>}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Saving...' : 'Add Hackathon'}</Button>
          <Link href="/admin/hackathons"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
