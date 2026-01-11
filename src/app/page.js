import Hero from '@/components/sections/Hero';
import CodingStats from '@/components/sections/CodingStats';

export const metadata = {
  title: 'Ayush Tiwari - Full Stack Developer',
  description: 'Portfolio of Ayush Tiwari - Full Stack Developer specializing in React, Node.js, and modern web technologies',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CodingStats />
    </main>
  );
}
