import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Navbar />
        <div className="pt-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
