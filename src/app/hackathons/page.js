import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Calendar, Users, ArrowLeft, Medal, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPublishedHackathons } from '@/services/hackathons.service';

export const metadata = {
  title: 'Hackathons - Ayush Tiwari',
  description: 'My hackathon participations, achievements, and competitive programming events',
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

export default async function HackathonsPage() {
  let hackathons = [];

  try {
    hackathons = await getPublishedHackathons();
  } catch (err) {
    console.error('Failed to load hackathons:', err);
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
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
            <Trophy size={32} className="text-yellow-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
            Hackathon <span className="gradient-text">Achievements</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Competitive programming events and hackathon participations
          </p>
        </div>

        {/* Hackathons List */}
        {hackathons.length > 0 ? (
          <div className="space-y-6">
            {hackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Hackathon Image */}
                  <div className="relative w-full md:w-80 h-64 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 overflow-hidden flex-shrink-0">
                    {hackathon.image ? (
                      <Image
                        src={hackathon.image}
                        alt={hackathon.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Trophy size={80} className="text-yellow-500/30" />
                      </div>
                    )}

                    {/* Date Badge */}
                    {hackathon.date && (
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(hackathon.date)}
                      </div>
                    )}

                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Hackathon Content */}
                  <div className="flex-1 p-6 lg:p-8">
                    {/* Trophy Icon & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Trophy className="text-yellow-500" size={28} />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-yellow-500 transition-colors">
                          {hackathon.name}
                        </h2>
                      </div>
                    </div>

                    {/* Result Badge */}
                    {hackathon.result && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full text-sm font-bold border-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-500">
                        <Medal size={18} />
                        {hackathon.result}
                      </div>
                    )}

                    {/* Role */}
                    {hackathon.role && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 p-3 bg-primary/5 rounded-lg border border-border">
                        <Users size={18} className="text-primary" />
                        <span className="font-medium">{hackathon.role}</span>
                      </div>
                    )}

                    {/* Description */}
                    {hackathon.description && (
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {hackathon.description}
                      </p>
                    )}

                    {/* Technologies */}
                    {hackathon.technologies && hackathon.technologies.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Zap size={16} className="text-primary" />
                          <span className="text-sm font-semibold text-foreground">Tech Stack</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {hackathon.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-500/10 to-transparent rounded-bl-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <Trophy size={48} className="text-yellow-500/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Hackathons Yet</h3>
            <p className="text-muted-foreground">Check back soon for hackathon achievements!</p>
          </div>
        )}
      </div>
    </main>
  );
}
