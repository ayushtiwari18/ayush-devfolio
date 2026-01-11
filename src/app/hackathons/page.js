import Image from 'next/image';
import { Trophy, Calendar, Users, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Hackathons',
  description: 'My hackathon participations, achievements, and team projects.',
};

export default async function HackathonsPage() {
  let hackathons = [];
  let error = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('hackathons')
      .select('*')
      .order('date', { ascending: false });

    if (fetchError) throw fetchError;
    hackathons = data || [];
  } catch (err) {
    console.error('Error loading hackathons:', err);
    error = 'Failed to load hackathons.';
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="text-primary" size={40} />
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              <span className="gradient-text">Hackathons</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Competitive coding events where I've built innovative solutions and collaborated with talented developers.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && hackathons.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="p-8 bg-card border border-border rounded-lg">
              <Trophy className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-2xl font-bold text-foreground mb-4">No Hackathons Yet</h3>
              <p className="text-muted-foreground">
                I'm currently preparing for upcoming hackathons. Stay tuned!
              </p>
            </div>
          </div>
        )}

        {/* Hackathons Timeline */}
        {!error && hackathons.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {hackathons.map((hackathon, index) => (
                <div
                  key={hackathon.id}
                  className="relative bg-card border border-border rounded-lg overflow-hidden card-glow hover-lift transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* Image Section */}
                    {hackathon.image && (
                      <div className="relative h-64 md:h-auto">
                        <Image
                          src={hackathon.image}
                          alt={hackathon.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Content Section */}
                    <div className={`p-6 ${hackathon.image ? 'md:col-span-2' : 'md:col-span-3'}`}>
                      {/* Badge */}
                      {hackathon.result && (
                        <div className="inline-block mb-3">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                            {hackathon.result}
                          </span>
                        </div>
                      )}

                      {/* Name */}
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {hackathon.name}
                      </h3>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        {hackathon.date && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar size={16} />
                            <span>
                              {new Date(hackathon.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                              })}
                            </span>
                          </div>
                        )}

                        {hackathon.role && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users size={16} />
                            <span>{hackathon.role}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {hackathon.description && (
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {hackathon.description}
                        </p>
                      )}

                      {/* Technologies */}
                      {hackathon.technologies && hackathon.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {hackathon.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-primary/5 text-foreground text-xs rounded border border-primary/10"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Achievement Badge */}
                  {(hackathon.result?.toLowerCase().includes('winner') || 
                    hackathon.result?.toLowerCase().includes('1st') ||
                    hackathon.result?.toLowerCase().includes('first')) && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-primary/20 backdrop-blur-sm p-2 rounded-full border border-primary">
                        <Award className="text-primary" size={24} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Section */}
        {!error && hackathons.length > 0 && (
          <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border rounded-lg text-center card-glow">
              <p className="text-4xl font-bold text-primary mb-2">{hackathons.length}</p>
              <p className="text-muted-foreground">Hackathons Participated</p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-lg text-center card-glow">
              <p className="text-4xl font-bold text-primary mb-2">
                {hackathons.filter(h => 
                  h.result?.toLowerCase().includes('winner') || 
                  h.result?.toLowerCase().includes('prize')
                ).length}
              </p>
              <p className="text-muted-foreground">Awards Won</p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-lg text-center card-glow">
              <p className="text-4xl font-bold text-primary mb-2">
                {new Date().getFullYear() - new Date(hackathons[hackathons.length - 1]?.date).getFullYear()}
              </p>
              <p className="text-muted-foreground">Years Active</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
