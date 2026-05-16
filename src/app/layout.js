import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/**
 * Load Inter with only the weights actually used in the design:
 * - 400 (body text)
 * - 500 (medium, UI labels)
 * - 600 (semibold, card titles)
 * - 700 (bold, headings)
 *
 * display: 'swap' ensures text is visible with a system font while
 * Inter downloads — prevents invisible text contributing to LCP.
 *
 * subsets: ['latin'] keeps the font file small (no Cyrillic/Greek/etc).
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  preload: true,
});

export const metadata = {
  metadataBase: new URL('https://ayush-devfolio.vercel.app'),
  title: {
    default: 'Ayush Tiwari - Full Stack Developer | MERN Stack | Next.js | Node.js',
    template: '%s | Ayush Tiwari',
  },
  description:
    'Ayush Tiwari — Full Stack Developer building production-grade web systems. MERN Stack, Next.js, Node.js, AWS certified. Springer-published researcher. 5,600+ GitHub commits. Based in Jabalpur, India.',
  authors: [
    {
      name: 'Ayush Tiwari',
      url: 'https://ayush-devfolio.vercel.app',
    },
  ],
  creator: 'Ayush Tiwari',
  publisher: 'Ayush Tiwari',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ayush-devfolio.vercel.app',
    siteName: 'Ayush Tiwari Portfolio',
    title: 'Ayush Tiwari - Full Stack Developer | MERN Stack | Next.js',
    description:
      'Full Stack Developer building production-grade web systems. MERN Stack, Next.js, Node.js, AWS certified. Springer-published researcher. 5,600+ GitHub commits.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ayush Tiwari - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayush Tiwari - Full Stack Developer | MERN Stack | Next.js',
    description:
      'Full Stack Developer building production-grade web systems. AWS certified. Springer-published researcher.',
    creator: '@ayushtiwari18',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
  classification: 'Web Development Portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth dark ${inter.variable}`}>
      <head>
        {/*
         * ── Resource hints — tell the browser what to connect to early ──
         *
         * preconnect: establishes TCP + TLS handshake before the browser
         * has parsed enough HTML to know it needs the resource.
         *
         * dns-prefetch: lighter fallback — just resolves DNS, no TLS.
         * Use for origins where full preconnect would waste a connection.
         */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Supabase — data fetches start here */}
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://xnlndzezjfcllcwiqtbf.supabase.co" />

        {/* Person Schema — identity + social profiles */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Ayush Tiwari',
              url: 'https://ayush-devfolio.vercel.app',
              sameAs: [
                'https://github.com/ayushtiwari18',
                'https://linkedin.com/in/ayush-tiwari',
                'https://leetcode.com/aayush03',
                'https://www.codechef.com/users/ayush_03',
              ],
              jobTitle: 'Full Stack Developer',
              worksFor: {
                '@type': 'Organization',
                name: 'Freelance',
              },
              alumniOf: {
                '@type': 'EducationalOrganization',
                name: 'Gyan Ganga Institute of Technology and Sciences',
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Jabalpur',
                addressRegion: 'Madhya Pradesh',
                addressCountry: 'IN',
              },
              knowsAbout: [
                'Full Stack Development',
                'React.js',
                'Node.js',
                'Next.js',
                'JavaScript',
                'TypeScript',
                'MongoDB',
                'Express.js',
                'MERN Stack',
                'Web Development',
                'API Development',
                'Three.js',
                'WebGL',
                'AWS',
                'Cloud Computing',
                'Network Security',
                'WAF',
                'IDS',
              ],
            }),
          }}
        />

        {/* ProfessionalService Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Ayush Tiwari - Full Stack Development Services',
              description:
                'Production-grade Full Stack Web Development, API Engineering, and Cloud Architecture services',
              url: 'https://ayush-devfolio.vercel.app',
              serviceType: 'Web Development',
              areaServed: 'Worldwide',
              availableLanguage: 'English',
            }),
          }}
        />
      </head>
      <body className={`${inter.className} relative`}>
        {/*
         * Skip to main content — WCAG 2.1 AA required.
         * Visually hidden until focused via keyboard (Tab).
         * Must be the very first focusable element in the DOM.
         */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-medium focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Solid dark background — no particle system at layout level */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5" />

        <Navbar />
        <main id="main-content" className="pt-16 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
