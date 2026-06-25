'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Edit, Trash2, Award,
  Calendar, ExternalLink, Loader2, AlertCircle,
  CheckCircle, XCircle, ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import FallbackImage from '@/components/ui/FallbackImage';
import { supabase } from '@/lib/supabase';

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchCerts(); }, []);

  const fetchCerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('issued_date', { ascending: false });
      if (error) throw error;
      setCerts(data || []);
    } catch (err) {
      console.error('Error fetching certifications:', err);
      setError('Failed to load certifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmedDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      const { error } = await supabase.from('certifications').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      setCerts(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = certs.filter(c =>
    !search ||
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer?.toLowerCase().includes(search.toLowerCase()) ||
    c.credential_id?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <AlertCircle className="text-destructive" size={40} />
      <p className="text-destructive text-center">{error}</p>
      <Button onClick={fetchCerts} variant="outline">Try Again</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Certification?"
        description={deleteTarget ? `"${deleteTarget.title}" will be permanently removed. This cannot be undone.` : ''}
        confirmLabel="Delete Certification"
        danger
        loading={!!deletingId}
        onConfirm={handleConfirmedDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Certifications</h1>
          <p className="text-muted-foreground">{filtered.length} of {certs.length} certifications</p>
        </div>
        <Link href="/admin/certifications/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />Add Certification
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, issuer, or credential ID..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {certs.length === 0 ? 'No Certifications Yet' : 'No Matching Certifications'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {certs.length === 0 ? 'Add your professional certifications and credentials.' : 'Try adjusting your search.'}
            </p>
            {certs.length === 0 && (
              <Link href="/admin/certifications/new">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2" size={18} />Add First Certification
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(cert => (
            <div key={cert.id} className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all">

              {/* Image with FallbackImage */}
              <div className="relative h-48 bg-muted">
                {cert.image_url ? (
                  <FallbackImage
                    src={cert.image_url}
                    alt={cert.title}
                    fill
                    className="object-cover"
                    unoptimized
                    fallback={
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Award size={40} />
                        <span className="text-xs text-center px-4">{cert.issuer}</span>
                      </div>
                    }
                    containerClassName="absolute inset-0 flex items-center justify-center bg-muted"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Award size={40} />
                    <span className="text-xs text-center px-4">{cert.issuer}</span>
                  </div>
                )}
                {/* Published badge */}
                <div className="absolute top-3 right-3">
                  {cert.published
                    ? <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1"><CheckCircle size={10} />Live</span>
                    : <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded-full flex items-center gap-1"><XCircle size={10} />Hidden</span>
                  }
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-foreground mb-1 line-clamp-2">{cert.title}</h3>
                <p className="text-primary font-medium text-sm mb-3">{cert.issuer}</p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar size={12} />
                  <span>Issued: {cert.issued_date ? new Date(cert.issued_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—'}</span>
                </div>
                {cert.expiry_date && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Calendar size={12} />
                    <span>Expires: {new Date(cert.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                  </div>
                )}
                {cert.credential_id && (
                  <p className="text-xs text-muted-foreground mb-3 font-mono">ID: {cert.credential_id}</p>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <Link href={`/admin/certifications/${cert.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/10">
                      <Edit size={14} className="mr-2" />Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm"
                    disabled={deletingId === cert.id}
                    onClick={() => setDeleteTarget({ id: cert.id, title: cert.title })}
                    className="border-red-500 text-red-500 hover:bg-red-500/10 disabled:opacity-50">
                    {deletingId === cert.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </Button>
                  {cert.certificate_url && (
                    <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="hover:bg-primary/10">
                        <ExternalLink size={14} />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
