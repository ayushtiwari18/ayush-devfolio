import { CertificationCard } from '@/components/cards/CertificationCard';
import { getPublishedCertifications } from '@/services/certifications.service';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Certifications',
  description: 'Professional certifications and courses showcasing my continuous learning and expertise.',
  path: '/certifications',
});

export default async function CertificationsPage() {
  let certifications = [];

  try {
    certifications = await getPublishedCertifications();
  } catch (error) {
    console.error('Failed to fetch certifications:', error);
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Certifications
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Professional certifications and courses that demonstrate my commitment to
            continuous learning and technical excellence.
          </p>
        </div>

        {certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((certification) => (
              <CertificationCard key={certification.id} certification={certification} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No certifications available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
