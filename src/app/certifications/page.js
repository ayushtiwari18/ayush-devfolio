import Image from 'next/image';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Certifications',
  description: 'My professional certifications and achievements in web development and technology.',
};

export default async function CertificationsPage() {
  let certifications = [];
  let error = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('certifications')
      .select('*')
      .order('date', { ascending: false });

    if (fetchError) throw fetchError;
    certifications = data || [];
  } catch (err) {
    console.error('Error loading certifications:', err);
    error = 'Failed to load certifications.';
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Award className="text-primary" size={40} />
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              <span className="gradient-text">Certifications</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Professional certifications and credentials I've earned throughout my journey.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && certifications.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="p-8 bg-card border border-border rounded-lg">
              <Award className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-2xl font-bold text-foreground mb-4">No Certifications Yet</h3>
              <p className="text-muted-foreground">
                I'm currently working on earning new certifications. Check back soon!
              </p>
            </div>
          </div>
        )}

        {/* Certifications Grid */}
        {!error && certifications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-card border border-border rounded-lg overflow-hidden card-glow hover-lift transition-all"
              >
                {/* Certificate Image */}
                {cert.image && (
                  <div className="relative w-full h-48 bg-muted">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {cert.title}
                  </h3>

                  {/* Issuer */}
                  <p className="text-primary font-medium mb-4">{cert.issuer}</p>

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

                  {/* View Certificate Button */}
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10"
                      >
                        View Certificate
                        <ExternalLink className="ml-2" size={16} />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {!error && certifications.length > 0 && (
          <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg text-center card-glow">
              <p className="text-4xl font-bold text-primary mb-2">{certifications.length}</p>
              <p className="text-muted-foreground">Total Certifications</p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-lg text-center card-glow">
              <p className="text-4xl font-bold text-primary mb-2">
                {new Set(certifications.map(c => c.issuer)).size}
              </p>
              <p className="text-muted-foreground">Issuing Organizations</p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-lg text-center card-glow">
              <p className="text-4xl font-bold text-primary mb-2">
                {new Date().getFullYear() - new Date(certifications[certifications.length - 1]?.date).getFullYear()}
              </p>
              <p className="text-muted-foreground">Years of Learning</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
