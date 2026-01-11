import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleField from '@/components/animations/ParticleField';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Ayush Tiwari - Full Stack Developer',
  description: 'Portfolio of Ayush Tiwari - Full Stack Developer specializing in Next.js, React, and modern web technologies.',
  keywords: ['Full Stack Developer', 'Next.js', 'React', 'Portfolio', 'Web Development', 'Ayush Tiwari'],
  authors: [{ name: 'Ayush Tiwari' }],
  openGraph: {
    title: 'Ayush Tiwari - Full Stack Developer',
    description: 'Portfolio showcasing projects, blog posts, and achievements',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayush Tiwari - Full Stack Developer',
    description: 'Portfolio showcasing projects, blog posts, and achievements',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className={`${inter.className} relative`}>
        {/* Animated background throughout the site */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <ParticleField />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        </div>
        
        <Navbar />
        <div className="pt-16 relative z-10">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
