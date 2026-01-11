import Link from 'next/link';
import { Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import CertificationCard from '@/components/cards/CertificationCard';

export const metadata = {
  title: 'Certifications - Ayush Tiwari',
  description: 'Professional certifications and credentials earned through continuous learning',
};

export default async function CertificationsPage() {
  const { data: certifications } = await supabase
    .from('certifications')
    .select('*')
    .order('date', { ascending: false });

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
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            <Award size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Professional <span className="gradient-text">Certifications</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Credentials and certifications earned through continuous learning and skill development
          </p>
        </div>

        {/* Certifications Grid */}
        {certifications && certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {certifications.map((cert) => (
              <CertificationCard key={cert.id} certification={cert} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Award size={48} className="text-primary/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Certifications Yet</h3>
            <p className="text-muted-foreground mb-6">Check back soon for professional certifications!</p>
          </div>
        )}
      </div>
    </main>
  );
}
