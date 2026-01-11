import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleField from '@/components/animations/ParticleField';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://ayush-devfolio.vercel.app'),
  title: {
    default: 'Ayush Tiwari - Full Stack Developer | Freelance Web Developer | MERN Stack Expert',
    template: '%s | Ayush Tiwari',
  },
  description: 'Ayush Tiwari - Professional Full Stack Developer & Freelance Web Developer specializing in MERN Stack, React.js, Node.js, Next.js. Available for freelance projects. Based in Jabalpur, India. 655+ DSA problems solved, LeetCode 1657 rating.',
  keywords: [
    // Primary Keywords
    'Ayush Tiwari',
    'Ayush Tiwari Developer',
    'Ayush Tiwari Full Stack Developer',
    'Ayush Tiwari Freelance Developer',
    
    // Job Titles
    'Full Stack Developer',
    'Freelance Developer',
    'Freelance Web Developer',
    'MERN Stack Developer',
    'React Developer',
    'Node.js Developer',
    'Next.js Developer',
    'JavaScript Developer',
    
    // Skills
    'React.js Expert',
    'Node.js Expert',
    'MongoDB Developer',
    'Express.js Developer',
    'TypeScript Developer',
    'Tailwind CSS Developer',
    
    // Services
    'Web Development',
    'Full Stack Development',
    'Frontend Development',
    'Backend Development',
    'API Development',
    'Freelance Web Development',
    
    // Location
    'Developer Jabalpur',
    'Freelance Developer India',
    'Web Developer India',
    
    // Specific
    'LeetCode 1657',
    'Competitive Programmer',
    'GGITS Student',
    'Gyan Ganga Institute',
  ],
  authors: [
    { 
      name: 'Ayush Tiwari',
      url: 'https://ayush-devfolio.vercel.app',
    }
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
    title: 'Ayush Tiwari - Full Stack Developer | Freelance Web Developer',
    description: 'Professional Full Stack Developer specializing in MERN Stack, React.js, Node.js, Next.js. Available for freelance projects. LeetCode 1657 rating, 655+ problems solved.',
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
    title: 'Ayush Tiwari - Full Stack Developer | Freelance Web Developer',
    description: 'Professional Full Stack Developer specializing in MERN Stack. Available for freelance projects.',
    creator: '@ayushtiwari',
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
  alternates: {
    canonical: 'https://ayush-devfolio.vercel.app',
  },
  category: 'technology',
  classification: 'Web Development Portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        {/* Additional SEO Meta Tags */}
        <meta name="author" content="Ayush Tiwari" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <link rel="canonical" href="https://ayush-devfolio.vercel.app" />
        
        {/* Structured Data - Person Schema */}
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
              ],
            }),
          }}
        />
        
        {/* Structured Data - Professional Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Ayush Tiwari - Full Stack Development Services',
              description: 'Professional Full Stack Web Development and Freelance Development Services',
              url: 'https://ayush-devfolio.vercel.app',
              serviceType: 'Web Development',
              areaServed: 'Worldwide',
              availableLanguage: 'English',
            }),
          }}
        />
      </head>
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
