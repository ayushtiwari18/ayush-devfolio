import Link from 'next/link';
import { ArrowLeft, Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublishedCertifications } from '@/services/certifications.service';
import CertificationsClient from '@/components/certifications/CertificationsClient';
import { BASE_URL } from '@/app/layout';

// Always fetch fresh from Supabase on every request
export const revalidate = 0;

export const metadata = {
  title: 'Certifications - Ayush Tiwari | AWS, Oracle, Cisco',
  description:
    'Professional certifications earned by Ayush Tiwari - AWS Cloud Practitioner, ' +
    'AWS Solutions Architect, Oracle, Cisco, and 25+ industry credentials. ' +
    'Full Stack Developer from Jabalpur, Madhya Pradesh, India.',
  keywords: [
    'Ayush Tiwari certifications', 'AWS certified Ayush Tiwari',
    'AWS Cloud Practitioner India', 'Oracle certification', 'Cisco certification',
    'developer certifications India', 'cloud certifications Jabalpur',
  ],
  alternates: { canonical: `${BASE_URL}/certifications` },
  openGraph: {
    title:       'Certifications - Ayush Tiwari | AWS, Oracle, Cisco',
    description: 'AWS, Oracle, Cisco and 25+ certifications by Ayush Tiwari.',
    url:          `${BASE_URL}/certifications`,
    type:        'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card:    'summary_large_image',
    title:   'Certifications - Ayush Tiwari',
    creator: '@ayushtiwari18',
  },
};

export default async function CertificationsPage() {
  let certifications = [];
  try {
    certifications = await getPublishedCertifications();
  } catch (err) {
    console.error('Failed to load certifications:', err);
  }

  const total = certifications.length;
  const issuers = [...new Set(certifications.map(c => c.issuer).filter(Boolean))];

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-8 hover:bg-primary/10 hover:border-primary">
            <ArrowLeft className="mr-2" size={16} />Back to Home
          </Button>
        </Link>
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
              <ShieldCheck size={17} className="text-primary" />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Credentials</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 leading-tight">
            Certifications &amp; <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Verified credentials from industry-leading platforms.
            {total > 0 && (
              <span className="ml-2 text-sm text-muted-foreground/60">
                {total} {total === 1 ? 'credential' : 'credentials'}
                {issuers.length > 0 && ` - ${issuers.slice(0, 3).join(', ')}${issuers.length > 3 ? ` +${issuers.length - 3} more` : ''}`}
              </span>
            )}
          </p>
        </div>
        {certifications.length > 0 ? (
          <CertificationsClient certifications={certifications} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Award size={36} className="text-primary/60" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Certifications Coming Soon!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              25+ credentials including Oracle, Cisco, and more will be listed here shortly.
            </p>
            <Link href="/"><Button>Back to Home</Button></Link>
          </div>
        )}
      </div>
    </main>
  );
}
