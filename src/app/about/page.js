import { getProfileSettings } from '@/services/profile.service';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'About',
  description: 'Learn more about my background, skills, and experience as a full-stack developer.',
  path: '/about',
});

export default async function AboutPage() {
  let profile = null;
  
  try {
    profile = await getProfileSettings();
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          About Me
        </h1>
        
        {profile ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {profile.name}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                {profile.title}
              </p>
            </div>

            {profile.bio && (
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            {profile.description && (
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-muted-foreground">
                  {profile.description}
                </p>
              </div>
            )}

            {/* Skills Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Technical Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    Frontend
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• React.js / Next.js</li>
                    <li>• JavaScript / TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Three.js / WebGL</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    Backend
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Node.js / Express</li>
                    <li>• PostgreSQL / MongoDB</li>
                    <li>• Supabase / Firebase</li>
                    <li>• REST APIs / GraphQL</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Profile information is being loaded...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
