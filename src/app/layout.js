import { Inter } from 'next/font/google';
import '../styles/globals.css';
import PublicShell from '@/components/layout/PublicShell';
import BfCacheManager from '@/components/BfCacheManager';
import AdminKeyTrigger from '@/components/AdminKeyTrigger';

// ----------------------------------------------------------------------------
// FONTS — loaded via next/font for zero layout shift + automatic subset
// ----------------------------------------------------------------------------

const inter = Inter({
  subsets:  ['latin'],
  display:  'swap',
  variable: '--font-inter',
  weight:   ['400', '500', '600', '700'],
  preload:  true,
});

/**
 * Clash Display is not in Google Fonts — load via @fontsource or CSS @font-face.
 * We use next/font/local with a CDN fallback via @fontsource package.
 * The variable --font-display is exposed to Tailwind.
 *
 * If @fontsource/clash-display is not installed yet, this falls back to
 * a CSS variable pointing at Inter (same variable name, safe degradation).
 * Run: npm install @fontsource/clash-display
 */
import localFont from 'next/font/local';

const clashDisplay = localFont({
  src: [
    { path: '../../public/fonts/ClashDisplay-Medium.woff2',  weight: '500', style: 'normal' },
    { path: '../../public/fonts/ClashDisplay-Semibold.woff2',weight: '600', style: 'normal' },
    { path: '../../public/fonts/ClashDisplay-Bold.woff2',    weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display:  'swap',
  fallback: ['Inter', 'ui-sans-serif', 'system-ui'],
  // If font files are missing, Next.js falls back silently — no crash
  preload:  false,
});

const jetbrainsMono = localFont({
  src: [
    { path: '../../public/fonts/JetBrainsMono-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/JetBrainsMono-Medium.woff2',  weight: '500', style: 'normal' },
  ],
  variable: '--font-mono',
  display:  'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  preload:  false,
});

// ----------------------------------------------------------------------------
// METADATA
// ----------------------------------------------------------------------------

const BASE_URL = 'https://ayush-devfolio-nine.vercel.app';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:  'Ayush Tiwari - Full Stack Developer | MERN Stack | Next.js | Node.js',
    template: '%s | Ayush Tiwari',
  },
  description:
    'Ayush Tiwari — Full Stack Developer building production-grade web systems. MERN Stack, Next.js, Node.js, AWS certified. Springer-published researcher. 5,600+ GitHub commits. Based in Jabalpur, India.',
  authors:     [{ name: 'Ayush Tiwari', url: BASE_URL }],
  creator:     'Ayush Tiwari',
  publisher:   'Ayush Tiwari',
  formatDetection: { email: false, address: false, telephone: false },
  alternates:  { canonical: BASE_URL },
  verification: { google: 'LMliRi04tiYL0NYuVuXjMFxj4bNUXCzDCVOLZ8zLPa0' },
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:          BASE_URL,
    siteName:    'Ayush Tiwari Portfolio',
    title:       'Ayush Tiwari - Full Stack Developer | MERN Stack | Next.js',
    description: 'Full Stack Developer building production-grade web systems. MERN Stack, Next.js, Node.js, AWS certified. Springer-published researcher. 5,600+ GitHub commits.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Ayush Tiwari - Full Stack Developer' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Ayush Tiwari - Full Stack Developer | MERN Stack | Next.js',
    description: 'Full Stack Developer building production-grade web systems. AWS certified. Springer-published researcher.',
    creator:     '@ayushtiwari18',
    images:      ['/opengraph-image'],
  },
  robots: {
    index: true, follow: true, nocache: false,
    googleBot: {
      index: true, follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
  category:       'technology',
  classification: 'Web Development Portfolio',
};

// ----------------------------------------------------------------------------
// JSON-LD STRUCTURED DATA
// ----------------------------------------------------------------------------

const personSchema = {
  '@context': 'https://schema.org',
  '@type':    'Person',
  name:       'Ayush Tiwari',
  url:         BASE_URL,
  sameAs: [
    'https://github.com/ayushtiwari18',
    'https://www.linkedin.com/in/ayushtiwari18',
    'https://leetcode.com/aayush03',
    'https://www.codechef.com/users/ayush_03',
    'https://twitter.com/ayushtiwari18',
  ],
  jobTitle:  'Full Stack Developer',
  worksFor:  { '@type': 'Organization', name: 'Freelance' },
  alumniOf:  { '@type': 'EducationalOrganization', name: 'Gyan Ganga Institute of Technology and Sciences' },
  address: {
    '@type':         'PostalAddress',
    addressLocality: 'Jabalpur',
    addressRegion:   'Madhya Pradesh',
    addressCountry:  'IN',
  },
  knowsAbout: [
    'Full Stack Development','React.js','Node.js','Next.js','JavaScript','TypeScript',
    'MongoDB','Express.js','MERN Stack','Web Development','API Development',
    'Three.js','WebGL','AWS','Cloud Computing','Network Security','WAF','IDS',
  ],
};

// NEW — WebSite schema with SearchAction (enables Google Sitelinks search box)
const websiteSchema = {
  '@context':    'https://schema.org',
  '@type':       'WebSite',
  name:          'Ayush Tiwari Portfolio',
  url:            BASE_URL,
  description:   'Portfolio of Ayush Tiwari — Full Stack Developer, Springer-published researcher, AWS certified.',
  author:        { '@type': 'Person', name: 'Ayush Tiwari' },
  potentialAction: {
    '@type':       'SearchAction',
    target: {
      '@type':      'EntryPoint',
      urlTemplate: `${BASE_URL}/projects?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const professionalServiceSchema = {
  '@context':        'https://schema.org',
  '@type':           'ProfessionalService',
  name:              'Ayush Tiwari - Full Stack Development Services',
  description:       'Production-grade Full Stack Web Development, API Engineering, and Cloud Architecture services',
  url:                BASE_URL,
  serviceType:       'Web Development',
  areaServed:        'Worldwide',
  availableLanguage: 'English',
};

// ----------------------------------------------------------------------------
// ROOT LAYOUT
// ----------------------------------------------------------------------------

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth dark ${inter.variable} ${clashDisplay.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://xnlndzezjfcllcwiqtbf.supabase.co" />

        {/* Person schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {/* WebSite schema + SearchAction (NEW) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* ProfessionalService schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
      </head>
      <body className={`${inter.className} relative`}>
        <AdminKeyTrigger />
        <BfCacheManager />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-medium focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5" />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
