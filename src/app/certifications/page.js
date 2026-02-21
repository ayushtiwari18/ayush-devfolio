import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublishedCertifications } from '@/services/certifications.service';

export const metadata = {
  title: 'Certifications - Ayush Tiwari',
  description: 'Professional certifications and courses — Oracle, Cisco, and 25+ more credentials.',
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

export default async function CertificationsPage() {
  let certifications = [];

  try {
    certifications = await getPublishedCertifications();
  } catch (err) {
    console.error('Failed to load certifications:', err);
    // Graceful degradation — show empty state, don't crash
  }

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="mr-2" size={18} />
            Back to Home
          </Button>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            My <span className="gradient-text">Certifications</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and courses completed
          </p>
        </div>

        {/* Certifications Grid */}
        {certifications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Cert Image */}
                {cert.image && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4 bg-primary/5">
                    <Image
                      src={cert.image}
                      alt={cert.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}

                {/* Icon fallback */}
                {!cert.image && (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Award size={24} className="text-primary" />
                  </div>
                )}

                <h2 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {cert.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-1">{cert.issuer}</p>
                {cert.issued_date && (
                  <p className="text-xs text-muted-foreground mb-4">{formatDate(cert.issued_date)}</p>
                )}

                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${cert.title} credential`}
                  >
                    <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:border-primary">
                      <ExternalLink size={14} className="mr-2" />
                      View Credential
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-5xl">🎓</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Certifications Coming Soon!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              I have 25+ certifications including Oracle, Cisco, and more. They'll be added to the database soon!
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
