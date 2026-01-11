'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function EditCertificationPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    image: '',
    url: '',
    date: '',
  });

  useEffect(() => {
    fetchCertification();
  }, [params.id]);

  const fetchCertification = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('id', params.id)
        .single();
      if (error) throw error;
      setFormData(data);
      setImagePreview(data.image);
    } catch (error) {
      alert('Error loading');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('certifications')
        .update(formData)
        .eq('id', params.id);
      if (error) throw error;
      router.push('/admin/certifications');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this certification?')) return;
    try {
      await supabase.from('certifications').delete().eq('id', params.id);
      router.push('/admin/certifications');
    } catch (error) {
      alert('Error deleting');
    }
  };

  if (fetching) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/certifications">
          <Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back</Button>
        </Link>
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">Edit Certification</h1>
          <Button variant="outline" onClick={handleDelete} className="border-red-500 text-red-500">
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 card-glow">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Issuer *</label>
            <input type="text" name="issuer" value={formData.issuer} onChange={handleChange} required className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Date *</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">URL</label>
            <input type="url" name="url" value={formData.url} onChange={handleChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <input type="url" value={formData.image} onChange={handleImageChange} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3" />
            {imagePreview && <div className="relative h-48 rounded-lg overflow-hidden"><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /></div>}
          </div>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Saving...' : 'Save'}</Button>
          <Link href="/admin/certifications"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
