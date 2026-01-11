import { HackathonCard } from '@/components/cards/HackathonCard';
import { getPublishedHackathons } from '@/services/hackathons.service';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Hackathons',
  description: 'Hackathon participations and achievements showcasing rapid prototyping and problem-solving skills.',
  path: '/hackathons',
});

export default async function HackathonsPage() {
  let hackathons = [];

  try {
    hackathons = await getPublishedHackathons();
  } catch (error) {
    console.error('Failed to fetch hackathons:', error);
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hackathons
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Rapid prototyping challenges where I've built innovative solutions under
            time constraints, collaborated with teams, and pushed creative boundaries.
          </p>
        </div>

        {hackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No hackathon entries available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
