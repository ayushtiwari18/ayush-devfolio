import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Calendar, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Hackathons - Ayush Tiwari',
  description: 'Hackathon participations and achievements by Ayush Tiwari',
};

export default async function HackathonsPage() {
  const { data: hackathons } = await supabase
    .from('hackathons')
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-6">
            <Trophy className="text-yellow-500" size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Hackathon <span className="gradient-text">Achievements</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Competitive programming events and hackathon participations
          </p>
        </div>

        {/* Hackathons List */}
        {hackathons && hackathons.length > 0 ? (
          <div className="space-y-8">
            {hackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Hackathon Image */}
                  {hackathon.image && (
                    <div className="relative w-full md:w-80 h-64 bg-muted flex-shrink-0">
                      <Image
                        src={hackathon.image}
                        alt={hackathon.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Hackathon Content */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                          <Trophy className="text-yellow-500" size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">{hackathon.name}</h2>
                          {hackathon.date && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Calendar size={14} />
                              <span>{formatDate(hackathon.date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Result Badge */}
                    {hackathon.result && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-medium mb-4 border border-yellow-500/20">
                        <Trophy size={14} />
                        {hackathon.result}
                      </div>
                    )}

                    {/* Role */}
                    {hackathon.role && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Users size={16} />
                        <span>{hackathon.role}</span>
                      </div>
                    )}

                    {/* Description */}
                    {hackathon.description && (
                      <p className="text-muted-foreground mb-4">{hackathon.description}</p>
                    )}

                    {/* Technologies */}
                    {hackathon.technologies && hackathon.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {hackathon.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-yellow-500" size={32} />
            </div>
            <p className="text-muted-foreground">No hackathon participations available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
