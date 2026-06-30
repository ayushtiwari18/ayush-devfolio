import { Inter } from 'next/font/google';
import '../styles/globals.css';
import PublicShell from '@/components/layout/PublicShell';
import BfCacheManager from '@/components/BfCacheManager';
import AdminKeyTrigger from '@/components/AdminKeyTrigger';
import PWAInit from '@/components/pwa/PWAInit';
import { SEO_KEYWORDS } from '@/lib/constants';

// ----------------------------------------------------------------------------
// FONTS
// ----------------------------------------------------------------------------
const inter = Inter({
  subsets:  ['latin'],
  display:  'swap',
  variable: '--font-inter',
  weight:   ['400', '500', '600', '700'],
  preload:  true,
});

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
// CANONICAL BASE URL — single source of truth for the entire app
// ----------------------------------------------------------------------------
export const BASE_URL = 'https://ayush-devfolio-nine.vercel.app';

// ----------------------------------------------------------------------------
// METADATA
// ----------------------------------------------------------------------------
export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:  'Ayush Tiwari - Full Stack Developer | MERN Stack | Next.js | Node.js',
    template: '%s | Ayush Tiwari',
  },
  description:
    'Ayush Tiwari — Full Stack Developer building production-grade web systems. ' +
    'MERN Stack, Next.js, Node.js, AWS certified. Springer-published researcher. ' +
    '5,600+ GitHub commits. Based in Jabalpur, Madhya Pradesh, India.',
  keywords: SEO_KEYWORDS,
  authors:     [{ name: 'Ayush Tiwari', url: BASE_URL }],
  creator:     'Ayush Tiwari',
  publisher:   'Ayush Tiwari',
  formatDetection: { email: false, address: false, telephone: false },
  alternates:  { canonical: BASE_URL },
  verification: { google: 'LMliRi04tiYL0NYuVuXjMFxj4bNUXCzDCVOLZ8zLPa0' },
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:          BASE_URL,
    siteName:    'Ayush Tiwari Portfolio',
    title:       'Ayush Tiwari - Full Stack Developer | MERN Stack | Next.js',
    description: 'Full Stack Developer building production-grade web systems. ' +
                 'MERN Stack, Next.js, Node.js, AWS certified. Springer-published researcher. ' +
                 '5,600+ GitHub commits. Jabalpur, India.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Ayush Tiwari - Full Stack Developer' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Ayush Tiwari - Full Stack Developer | MERN Stack | Next.js',
    description: 'Full Stack Developer. AWS certified. Springer-published researcher. Jabalpur, India.',
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
  '@id':      `${BASE_URL}/#person`,
  name:       'Ayush Tiwari',
  url:         BASE_URL,
  image:       `${BASE_URL}/opengraph-image`,
  sameAs: [
    'https://github.com/ayushtiwari18',
    'https://www.linkedin.com/in/tiwariaayush',
    'https://leetcode.com/aayush03',
    'https://www.codechef.com/users/ayush_03',
    'https://twitter.com/_aayush_03__',
    'https://codeforces.com/profile/ayushtiwari18',
  ],
  jobTitle:    'Full Stack Developer',
  description: 'Full Stack Developer specialising in MERN Stack, Next.js, and cloud-native systems. Springer-published researcher on network security. AWS certified.',
  worksFor:    { '@type': 'Organization', name: 'Freelance' },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name:    'Gyan Ganga Institute of Technology and Sciences',
    address: {
      '@type':         'PostalAddress',
      addressLocality: 'Jabalpur',
      addressRegion:   'Madhya Pradesh',
      addressCountry:  'IN',
    },
  },
  address: {
    '@type':         'PostalAddress',
    addressLocality: 'Jabalpur',
    addressRegion:   'Madhya Pradesh',
    addressCountry:  'IN',
  },
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name:    'AWS Certified Cloud Practitioner',
      credentialCategory: 'Professional Certification',
      recognizedBy: { '@type': 'Organization', name: 'Amazon Web Services' },
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name:    'AWS Certified Solutions Architect',
      credentialCategory: 'Professional Certification',
      recognizedBy: { '@type': 'Organization', name: 'Amazon Web Services' },
    },
  ],
  knowsAbout: [
    'Full Stack Development', 'React.js', 'Node.js', 'Next.js',
    'JavaScript', 'TypeScript', 'MongoDB', 'Express.js', 'MERN Stack',
    'Web Development', 'API Development', 'Three.js', 'WebGL',
    'AWS', 'Cloud Computing', 'Network Security', 'WAF', 'IDS',
    'Competitive Programming', 'Data Structures', 'Algorithms',
  ],
  award: 'Springer-indexed publication on network security and WAF systems',
  nationality: { '@type': 'Country', name: 'India' },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type':    'WebSite',
  '@id':      `${BASE_URL}/#website`,
  name:       'Ayush Tiwari Portfolio',
  url:         BASE_URL,
  description: 'Portfolio of Ayush Tiwari — Full Stack Developer, Springer-published researcher, AWS certified. Based in Jabalpur, India.',
  author:     { '@type': 'Person', '@id': `${BASE_URL}/#person` },
  inLanguage: 'en-IN',
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
  name:              'Ayush Tiwari — Full Stack Development Services',
  description:       'Production-grade Full Stack Web Development, API Engineering, and Cloud Architecture services. Based in Jabalpur, India.',
  url:                BASE_URL,
  serviceType:       'Web Development',
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'AdministrativeArea', name: 'Worldwide' },
  ],
  availableLanguage: ['English', 'Hindi'],
  provider:          { '@type': 'Person', '@id': `${BASE_URL}/#person` },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type':    'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',           item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'About',          item: `${BASE_URL}/about` },
    { '@type': 'ListItem', position: 3, name: 'Projects',       item: `${BASE_URL}/projects` },
    { '@type': 'ListItem', position: 4, name: 'Blog',           item: `${BASE_URL}/blog` },
    { '@type': 'ListItem', position: 5, name: 'Certifications', item: `${BASE_URL}/certifications` },
    { '@type': 'ListItem', position: 6, name: 'Events',         item: `${BASE_URL}/events` },
    { '@type': 'ListItem', position: 7, name: 'Contact',        item: `${BASE_URL}/contact` },
  ],
};

// ----------------------------------------------------------------------------
// ROOT LAYOUT
// ----------------------------------------------------------------------------
export default function RootLayout({ children }) {
  return (
    <html
      lang="en-IN"
      className={`scroll-smooth dark ${inter.variable} ${clashDisplay.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://supabase.co" />
        <link rel="dns-prefetch" href="https://xnlndzezjfcllcwiqtbf.supabase.co" />

        <meta name="geo.region"    content="IN-MP" />
        <meta name="geo.placename" content="Jabalpur, Madhya Pradesh, India" />
        <meta name="geo.position"  content="23.1815;79.9864" />
        <meta name="ICBM"          content="23.1815, 79.9864" />
        <meta name="language"      content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating"        content="general" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </head>
      <body className={`${inter.className} relative`}>
        <AdminKeyTrigger />
        <BfCacheManager />
        {/* PWA — registers Service Worker + shows install prompt */}
        <PWAInit />
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
