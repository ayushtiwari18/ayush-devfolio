'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Plus, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function EditHackathonPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState('');
  const [techInput, setTechInput] = useState('');
  const [formData, setFormData] = useState({ name: '', role: '', result: '', description: '', technologies: [], image: '', date: '' });

  useEffect(() => { fetchHackathon(); }, [params.id]);

  const fetchHackathon = async () => {
    try {
      const { data, error } = await supabase.from('hackathons').select('*').eq('id', params.id).single();
      if (error) throw error;
      setFormData(data);
      setImagePreview(data.image);
    } catch (error) {
      alert('Error loading');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  const handleImageChange = (e) => { const url = e.target.value; setFormData({ ...formData, image: url }); setImagePreview(url); };
  const addTechnology = () => { if (techInput.trim() && !formData.technologies.includes(techInput.trim())) { setFormData({ ...formData, technologies: [...formData.technologies, techInput.trim()] }); setTechInput(''); } };
  const removeTechnology = (tech) => { setFormData({ ...formData, technologies: formData.technologies.filter((t) => t !== tech) }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('hackathons').update(formData).eq('id', params.id);
      if (error) throw error;
      router.push('/admin/hackathons');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this hackathon?')) return;
    try {
      await supabase.from('hackathons').delete().eq('id', params.id);
      router.push('/admin/hackathons');
    } catch (error) {
      alert('Error deleting');
    }
  };

  if (fetching) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/hackathons"><Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back</Button></Link>
        <div className="flex justify-between"><h1 className="text-3xl font-bold">Edit Hackathon</h1><Button variant="outline" onClick={handleDelete} className="border-red-500 text-red-500"><Trash2 size={18} /></Button></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <div className="mb-4"><label className="block text-sm font-medium mb-2">Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="mb-4"><label className="block text-sm font-medium mb-2">Role</label><input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="mb-4"><label className="block text-sm font-medium mb-2">Result</label><input type="text" name="result" value={formData.result} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div className="mb-4"><label className="block text-sm font-medium mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none" /></div>
          <div className="mb-4"><label className="block text-sm font-medium mb-2">Date *</label><input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /></div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <h3 className="font-bold mb-4">Technologies</h3>
          <div className="flex gap-2 mb-3"><input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())} className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /><Button type="button" onClick={addTechnology}><Plus size={18} /></Button></div>
          {formData.technologies?.length > 0 && <div className="flex flex-wrap gap-2">{formData.technologies.map((tech) => <span key={tech} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-2">{tech}<button type="button" onClick={() => removeTechnology(tech)}><X size={14} /></button></span>)}</div>}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <h3 className="font-bold mb-4">Image</h3>
          <input type="url" value={formData.image} onChange={handleImageChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3" />
          {imagePreview && <div className="relative h-48 rounded-lg overflow-hidden"><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /></div>}
        </div>

        <div className="flex gap-4"><Button type="submit" disabled={loading} className="flex-1">{loading ? 'Saving...' : 'Save'}</Button><Link href="/admin/hackathons"><Button type="button" variant="outline">Cancel</Button></Link></div>
      </form>
    </div>
  );
}
