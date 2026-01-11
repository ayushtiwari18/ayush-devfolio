import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Award, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getCertifications() {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
}

export default async function AdminCertificationsPage() {
  const certifications = await getCertifications();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Certifications</h1>
          <p className="text-muted-foreground">
            Manage your professional certifications ({certifications.length} total)
          </p>
        </div>
        <Link href="/admin/certifications/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />
            Add Certification
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="Search certifications..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Certifications List */}
      {certifications.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Certifications Yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your professional certifications and credentials.
            </p>
            <Link href="/admin/certifications/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2" size={18} />
                Add First Certification
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all"
            >
              {/* Image */}
              {cert.image && (
                <div className="relative h-48 bg-muted">
                  <Image src={cert.image} alt={cert.title} fill className="object-cover" />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-primary font-medium mb-3">{cert.issuer}</p>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar size={14} />
                  <span>
                    {new Date(cert.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link href={`/admin/certifications/${cert.id}/edit`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                    >
                      <Edit size={14} className="mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </Button>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer">
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
