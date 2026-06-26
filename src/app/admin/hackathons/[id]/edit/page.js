'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ImageUploader from '@/components/admin/ImageUploader';
import FallbackImage from '@/components/ui/FallbackImage';
import { supabase } from '@/lib/supabase';

export default function EditHackathonPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading]             = useState(false);
  const [fetching, setFetching]           = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting]           = useState(false);
  const [learningInput, setLearningInput] = useState('');
  const [formData, setFormData] = useState({
    name: '', role: '', result: '', learnings: [], image: '', date: '',
  });

  useEffect(() => { fetchHackathon(); }, [params.id]);

  const parseLearnings = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); } catch { return []; }
    }
    return [];
  };

  const fetchHackathon = async () => {
    try {
      const { data, error } = await supabase
        .from('hackathons').select('*').eq('id', params.id).single();
      if (error) throw error;
      setFormData({
        name:      data.name      ?? '',
        role:      data.role      ?? '',
        result:    data.result    ?? '',
        learnings: parseLearnings(data.learnings),
        image:     data.image     ?? '',
        date:      data.date      ?? '',
      });
    } catch (err) {
      alert('Error loading hackathon: ' + err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const addLearning = () => {
    const val = learningInput.trim();
    if (val && !formData.learnings.includes(val)) {
      setFormData(p => ({ ...p, learnings: [...p.learnings, val] }));
      setLearningInput('');
    }
  };

  const removeLearning = (item) => {
    setFormData(p => ({ ...p, learnings: p.learnings.filter(l => l !== item) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name:      formData.name,
        role:      formData.role   || null,
        result:    formData.result || null,
        learnings: formData.learnings,   // always array, never null
        image:     formData.image  || null,
        date:      formData.date   || null,
      };
      const { error } = await supabase.from('hackathons').update(payload).eq('id', params.id);
      if (error) throw error;
      router.push('/admin/hackathons');
    } catch (err) {
      alert('Error updating: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmedDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.from('hackathons').delete().eq('id', params.id);
      if (error) throw error;
      router.push('/admin/hackathons');
    } catch (err) {
      alert('Error deleting: ' + err.message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Hackathon?"
        description={`"${formData.name}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete Hackathon"
        danger
        loading={deleting}
        onConfirm={handleConfirmedDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <div className="mb-8">
        <Link href="/admin/hackathons">
          <Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back</Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Hackathon</h1>
            <p className="text-muted-foreground mt-1">Update hackathon details</p>
          </div>
          <Button variant="outline" onClick={() => setShowDeleteModal(true)}
            className="border-red-500 text-red-500 hover:bg-red-500/10">
            <Trash2 size={18} className="mr-2" />Delete
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Hackathon Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Your Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Result / Achievement</label>
              <input type="text" name="result" value={formData.result} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Key Learnings <span className="text-sm font-normal text-muted-foreground">(optional)</span></h2>
          <div className="flex gap-2 mb-3">
            <input type="text" value={learningInput} onChange={e => setLearningInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLearning())}
              placeholder="What did you learn or build?"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            <Button type="button" onClick={addLearning}><Plus size={18} /></Button>
          </div>
          {formData.learnings.length > 0 && (
            <div className="space-y-2">
              {formData.learnings.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
                  <span className="flex-1 text-sm text-foreground">{item}</span>
                  <button type="button" onClick={() => removeLearning(item)} className="text-muted-foreground hover:text-red-500 transition-colors"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Hackathon Image</h2>
          <ImageUploader
            label="Hackathon Image"
            value={formData.image}
            onChange={url => setFormData(p => ({ ...p, image: url }))}
            folder="hackathons"
            hint="Upload a banner, certificate, or project screenshot."
          />
          {formData.image && (
            <div className="relative h-40 mt-4 rounded-xl overflow-hidden bg-muted border border-border">
              <FallbackImage src={formData.image} alt="Preview" fill className="object-cover" unoptimized
                fallback={<div className="flex items-center justify-center text-muted-foreground text-xs">Image failed to load</div>}
                containerClassName="absolute inset-0 flex items-center justify-center bg-muted" />
            </div>
          )}
        </section>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
            {loading
              ? <><Loader2 size={18} className="animate-spin mr-2" />Saving…</>
              : <><Save size={18} className="mr-2" />Save Changes</>
            }
          </Button>
          <Link href="/admin/hackathons"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
