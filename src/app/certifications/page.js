import Image from 'next/image';
import Link from 'next/link';
import { Award, ExternalLink, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Certifications - Ayush Tiwari',
  description: 'Professional certifications and credentials earned by Ayush Tiwari',
};

export default async function CertificationsPage() {
  const { data: certifications } = await supabase
    .from('certifications')
    .select('*')
    .order('date', { ascending: false });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Button>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Award className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Professional <span className="gradient-text">Certifications</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Credentials and certifications earned through continuous learning and skill development
          </p>
        </div>

        {/* Certifications Grid */}
        {certifications && certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all"
              >
                {/* Certificate Image */}
                {cert.image && (
                  <div className="relative h-48 bg-muted">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Certificate Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="text-primary" size={20} />
                    </div>
                    {cert.date && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={14} />
                        <span>{formatDate(cert.date)}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cert.issuer}</p>

                  {/* View Certificate Button */}
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      View Certificate
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-primary" size={32} />
            </div>
            <p className="text-muted-foreground">No certifications available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
