import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Trophy, Calendar, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getHackathons() {
  try {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return [];
  }
}

export default async function AdminHackathonsPage() {
  const hackathons = await getHackathons();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hackathons</h1>
          <p className="text-muted-foreground">
            Manage your hackathon participations ({hackathons.length} total)
          </p>
        </div>
        <Link href="/admin/hackathons/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />
            Add Hackathon
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
            placeholder="Search hackathons..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Hackathons List */}
      {hackathons.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Hackathons Yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your hackathon participations and achievements.
            </p>
            <Link href="/admin/hackathons/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2" size={18} />
                Add First Hackathon
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {hackathons.map((hackathon) => {
            const isWinner =
              hackathon.result?.toLowerCase().includes('winner') ||
              hackathon.result?.toLowerCase().includes('1st') ||
              hackathon.result?.toLowerCase().includes('first');

            return (
              <div
                key={hackathon.id}
                className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  {hackathon.image && (
                    <div className="relative w-full md:w-64 h-48 bg-muted flex-shrink-0">
                      <Image
                        src={hackathon.image}
                        alt={hackathon.name}
                        fill
                        className="object-cover"
                      />
                      {isWinner && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-yellow-500 p-2 rounded-full">
                            <Award className="text-white" size={20} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {hackathon.name}
                        </h3>
                        {hackathon.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {hackathon.description}
                          </p>
                        )}
                      </div>
                      {hackathon.result && (
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
                            isWinner
                              ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                              : 'bg-primary/10 text-primary border border-primary/20'
                          }`}
                        >
                          {hackathon.result}
                        </span>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {hackathon.date && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {new Date(hackathon.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                            })}
                          </span>
                        </div>
                      )}
                      {hackathon.role && (
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{hackathon.role}</span>
                        </div>
                      )}
                    </div>

                    {/* Technologies */}
                    {hackathon.technologies && hackathon.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hackathon.technologies.slice(0, 5).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {hackathon.technologies.length > 5 && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                            +{hackathon.technologies.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/hackathons/${hackathon.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary hover:bg-primary/10"
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
