'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';
import FallbackImage from '@/components/ui/FallbackImage';

const EMPTY = {
  title: '',
  issuer: '',
  description: '',
  image: '',
  url: '',
  date: new Date().toISOString().slice(0, 7), // YYYY-MM
  expiry_date: '',
  credential_id: '',
  verification_url: '',
  category: '',
};

export default function NewCertificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(EMPTY);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title:            formData.title,
        issuer:           formData.issuer,
        description:      formData.description || null,
        image:            formData.image || null,
        url:              formData.url || null,
        date:             formData.date || null,
        expiry_date:      formData.expiry_date || null,
        credential_id:    formData.credential_id || null,
        verification_url: formData.verification_url || null,
        category:         formData.category || null,
      };
      const { error } = await supabase.from('certifications').insert([payload]);
      if (error) throw error;
      router.push('/admin/certifications');
    } catch (err) {
      alert('Error creating certification: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <Link href="/admin/certifications">
          <Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back</Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Add Certification</h1>
        <p className="text-muted-foreground mt-1">Add a new professional certification or credential</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                placeholder="AWS Certified Solutions Architect"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Issuer *</label>
              <input type="text" name="issuer" value={formData.issuer} onChange={handleChange} required
                placeholder="Amazon Web Services"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange}
                placeholder="Cloud, Security, Programming…"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                placeholder="Brief description of what this certification covers..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date (YYYY-MM) *</label>
                <input type="month" name="date" value={formData.date} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Expiry Date <span className="text-muted-foreground">(optional)</span></label>
                <input type="month" name="expiry_date" value={formData.expiry_date} onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Credential ID <span className="text-muted-foreground">(optional)</span></label>
              <input type="text" name="credential_id" value={formData.credential_id} onChange={handleChange}
                placeholder="ABC-123-XYZ"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Certificate URL</label>
              <input type="url" name="url" value={formData.url} onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Verification URL <span className="text-muted-foreground">(optional)</span></label>
              <input type="url" name="verification_url" value={formData.verification_url} onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </section>

        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Certificate Image</h2>
          <ImageUploader
            label="Certificate Image"
            value={formData.image}
            onChange={url => setFormData(p => ({ ...p, image: url }))}
            folder="certifications"
            hint="Upload the certificate badge or thumbnail image."
          />
          {formData.image && (
            <div className="relative h-40 mt-4 rounded-xl overflow-hidden bg-muted border border-border">
              <FallbackImage src={formData.image} alt="Certificate preview" fill className="object-contain" unoptimized
                fallback={<div className="flex flex-col items-center gap-2 text-muted-foreground"><ImageIcon size={32} /><span className="text-xs">Image failed to load</span></div>}
                containerClassName="absolute inset-0 flex items-center justify-center bg-muted" />
            </div>
          )}
        </section>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
            {loading
              ? <><Loader2 size={18} className="animate-spin mr-2" />Adding…</>
              : <><Save size={18} className="mr-2" />Add Certification</>
            }
          </Button>
          <Link href="/admin/certifications"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
