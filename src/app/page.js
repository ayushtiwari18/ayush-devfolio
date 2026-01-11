import Hero from '@/components/sections/Hero';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Ayush Tiwari - Full Stack Developer',
  description: 'Portfolio of Ayush Tiwari - Full Stack Developer specializing in Next.js, React, and modern web technologies.',
  keywords: ['Full Stack Developer', 'Next.js', 'React', 'Portfolio', 'Web Development'],
  authors: [{ name: 'Ayush Tiwari' }],
  openGraph: {
    title: 'Ayush Tiwari - Full Stack Developer',
    description: 'Portfolio showcasing projects, blog posts, and achievements',
    type: 'website',
  },
};

export default async function HomePage() {
  // Fetch profile settings
  const { data: profile } = await supabase
    .from('profile_settings')
    .select('*')
    .single();

  return (
    <main className="min-h-screen">
      <Hero profile={profile} />
    </main>
  );
}
