'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Loader2, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ImageUploader from '@/components/admin/ImageUploader';
import FallbackImage from '@/components/ui/FallbackImage';
import { supabase } from '@/lib/supabase';

export default function EditCertificationPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', issuer: '', description: '',
    image_url: '', certificate_url: '',
    issued_date: '', expiry_date: '',
    credential_id: '', published: true,
  });

  useEffect(() => { fetchCert(); }, [params.id]);

  const fetchCert = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications').select('*').eq('id', params.id).single();
      if (error) throw error;
      setFormData({
        ...data,
        issued_date: data.issued_date ? data.issued_date.split('T')[0] : '',
        expiry_date: data.expiry_date ? data.expiry_date.split('T')[0] : '',
        description:   data.description   ?? '',
        image_url:     data.image_url      ?? '',
        certificate_url: data.certificate_url ?? '',
        credential_id: data.credential_id  ?? '',
      });
    } catch (err) {
      alert('Error loading certification: ' + err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title:           formData.title,
        issuer:          formData.issuer,
        description:     formData.description || null,
        image_url:       formData.image_url || null,
        certificate_url: formData.certificate_url || null,
        issued_date:     formData.issued_date,
        expiry_date:     formData.expiry_date || null,
        credential_id:   formData.credential_id || null,
        published:       formData.published,
      };
      const { error } = await supabase.from('certifications').update(payload).eq('id', params.id);
      if (error) throw error;
      router.push('/admin/certifications');
    } catch (err) {
      alert('Error updating certification: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmedDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.from('certifications').delete().eq('id', params.id);
      if (error) throw error;
      router.push('/admin/certifications');
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
        title="Delete Certification?"
        description={`"${formData.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete Certification"
        danger
        loading={deleting}
        onConfirm={handleConfirmedDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <div className="mb-8">
        <Link href="/admin/certifications">
          <Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back</Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Certification</h1>
            <p className="text-muted-foreground mt-1">Update certification details</p>
          </div>
          <Button variant="outline" onClick={() => setShowDeleteModal(true)}
            className="border-red-500 text-red-500 hover:bg-red-500/10">
            <Trash2 size={18} className="mr-2" />Delete
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Core Details */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Issuer *</label>
              <input type="text" name="issuer" value={formData.issuer} onChange={handleChange} required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Issued Date *</label>
                <input type="date" name="issued_date" value={formData.issued_date} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Expiry Date <span className="text-muted-foreground">(optional)</span></label>
                <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Credential ID <span className="text-muted-foreground">(optional)</span></label>
              <input type="text" name="credential_id" value={formData.credential_id} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Certificate URL <span className="text-muted-foreground">(optional)</span></label>
              <input type="url" name="certificate_url" value={formData.certificate_url} onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        </section>

        {/* Image */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Certificate Image</h2>
          <ImageUploader
            label="Certificate Image"
            value={formData.image_url}
            onChange={url => setFormData(p => ({ ...p, image_url: url }))}
            folder="certifications"
            hint="Upload the certificate badge or thumbnail image."
          />
          {formData.image_url && (
            <div className="relative h-40 mt-4 rounded-xl overflow-hidden bg-muted border border-border">
              <FallbackImage src={formData.image_url} alt="Certificate preview" fill className="object-contain" unoptimized
                fallback={<div className="flex flex-col items-center gap-2 text-muted-foreground"><ImageIcon size={32} /><span className="text-xs">Image failed to load</span></div>}
                containerClassName="absolute inset-0 flex items-center justify-center bg-muted" />
            </div>
          )}
        </section>

        {/* Settings */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Settings</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="published" checked={formData.published ?? true} onChange={handleChange} className="w-5 h-5 accent-primary" />
            <div>
              <p className="font-medium text-foreground">Publish Certification</p>
              <p className="text-sm text-muted-foreground">Make visible on your public portfolio</p>
            </div>
          </label>
        </section>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
            {loading
              ? <><Loader2 size={18} className="animate-spin mr-2" />Saving…</>
              : <><Save size={18} className="mr-2" />Save Changes</>
            }
          </Button>
          <Link href="/admin/certifications">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
