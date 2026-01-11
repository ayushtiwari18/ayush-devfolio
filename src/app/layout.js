import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { SITE_CONFIG } from '@/lib/constants';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ThreeBackground } from '@/components/layout/ThreeBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Full Stack Developer',
    'Web Developer',
    'React',
    'Next.js',
    'JavaScript',
    'Portfolio',
    'Three.js',
    'Ayush Tiwari',
  ],
  authors: [{ name: 'Ayush Tiwari' }],
  creator: 'Ayush Tiwari',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: ['/og-image.jpg'],
    creator: '@ayushtiwari',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} dark bg-background text-foreground`}>
        <ThreeBackground />
        <Navbar />
        <main className="pt-16 min-h-screen relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
