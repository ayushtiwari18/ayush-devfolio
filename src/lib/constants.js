/**
 * constants.js — Single source of truth for all site-wide copy,
 * config, routes, and profile data.
 *
 * Update this file to change content across the entire portfolio.
 * Never hardcode copy directly in components.
 */

// ---------------------------------------------------------------------------
// SITE CONFIG — core identity + deployment URL
// ---------------------------------------------------------------------------
export const SITE_CONFIG = {
  name: 'Ayush Tiwari',

  // Page <title> default — keyword-rich, under 60 chars
  title: 'Ayush Tiwari — Full Stack Developer',

  // Meta description — under 155 chars, used by Google snippet
  description:
    'Full Stack Developer specialising in MERN Stack, Next.js, and cloud-native systems. Springer-published researcher. AWS certified. 5,600+ GitHub commits. Based in Jabalpur, India.',

  // Production URL — used by sitemap, canonical, and OG tags
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ayush-devfolio.vercel.app',

  author: {
    name: 'Ayush Tiwari',
    // Update with your real contact email
    email: 'ayushtiwari.dev@gmail.com',
    location: 'Jabalpur, Madhya Pradesh, India',
  },

  social: {
    github: 'https://github.com/ayushtiwari18',
    linkedin: 'https://linkedin.com/in/ayush-tiwari',
    twitter: 'https://twitter.com/ayushtiwari18',
  },
};

// ---------------------------------------------------------------------------
// HERO COPY — the first thing every recruiter reads.
// Every word here must earn its place.
// ---------------------------------------------------------------------------
export const HERO_COPY = {
  // Rendered as <h1> gradient text on the homepage
  name: 'Ayush Tiwari',

  // Rendered as <h2> subtitle below the name
  title: 'Full Stack Developer',

  // ONE punchy tagline — shown in the availability badge or hero sub-copy
  tagline: 'Available for opportunities',

  // 2-3 sentence hero description.
  // Rules: specific > generic. Metrics > adjectives. Real > aspirational.
  // This replaces the old filler: "Building innovative solutions..."
  description:
    'I build production-grade web systems using MERN Stack, Next.js, Three.js, and AWS. My research on network security is published in Springer. AWS certified — 5,600+ GitHub commits, 885+ DSA problems solved.',

  // Short version used in OG / Twitter card descriptions
  shortDescription:
    'Full Stack Developer. Springer-published researcher. AWS certified. MERN · Next.js · Three.js · Node.js.',
};

// ---------------------------------------------------------------------------
// ACHIEVEMENTS — quantified metrics for stat cards (About page / Hero)
// ---------------------------------------------------------------------------
export const ACHIEVEMENTS = [
  {
    label: 'GitHub Commits',
    value: '5,600+',
    description: 'Consistent open-source contributions',
    icon: 'github',
  },
  {
    label: 'DSA Problems',
    value: '885+',
    description: 'Solved across LeetCode, CodeChef, Codeforces',
    icon: 'code',
  },
  {
    label: 'Production Projects',
    value: '10+',
    description: 'Deployed and maintained live systems',
    icon: 'rocket',
  },
  {
    label: 'Research Published',
    value: '1',
    description: 'Springer-indexed security research paper',
    icon: 'book-open',
  },
  {
    label: 'AWS Certifications',
    value: '2',
    description: 'AWS Cloud Practitioner + Solutions Architect',
    icon: 'cloud',
  },
  {
    label: 'Hackathons',
    value: '5+',
    description: 'Competed and won at national-level events',
    icon: 'trophy',
  },
];

// ---------------------------------------------------------------------------
// TECH STACK — categorized for Skills section + structured data
// ---------------------------------------------------------------------------
export const TECH_STACK = {
  frontend: [
    'React.js',
    'Next.js',
    'Three.js',
    'TypeScript',
    'JavaScript (ES2024)',
    'Tailwind CSS',
    'Framer Motion',
    'HTML5',
    'CSS3',
  ],
  backend: [
    'Node.js',
    'Express.js',
    'REST APIs',
    'GraphQL',
    'WebSockets',
    'JWT Auth',
    'Supabase',
  ],
  databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
  devops: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'Docker', 'GitHub Actions', 'Vercel', 'Nginx'],
  security: ['WAF', 'IDS', 'Network Security', 'OWASP Top 10', 'Rate Limiting'],
  languages: ['JavaScript', 'TypeScript', 'Python', 'C++', 'Java', 'SQL'],
  tools: ['Git', 'Postman', 'Figma', 'VS Code', 'Linux', 'Webpack'],
};

// ---------------------------------------------------------------------------
// SOCIAL + CODING PROFILES — full set including competitive programming
// ---------------------------------------------------------------------------
export const SOCIAL_LINKS = {
  github: 'https://github.com/ayushtiwari18',
  linkedin: 'https://linkedin.com/in/ayush-tiwari',
  twitter: 'https://twitter.com/ayushtiwari18',
  leetcode: 'https://leetcode.com/aayush03',
  codechef: 'https://www.codechef.com/users/ayush_03',
  codeforces: 'https://codeforces.com/profile/ayushtiwari18',
  email: 'mailto:ayushtiwari.dev@gmail.com',
};

// ---------------------------------------------------------------------------
// NAVIGATION — ordered nav links used by Navbar and Footer
// ---------------------------------------------------------------------------
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Hackathons', href: '/hackathons' },
  { label: 'Contact', href: '/contact' },
];

// ---------------------------------------------------------------------------
// ROUTES — typed constants to prevent hardcoded strings in components
// ---------------------------------------------------------------------------
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROJECTS: '/projects',
  BLOG: '/blog',
  CERTIFICATIONS: '/certifications',
  HACKATHONS: '/hackathons',
  CONTACT: '/contact',
  ADMIN: '/admin',
};

// ---------------------------------------------------------------------------
// SEO KEYWORDS — used by metadata helpers and structured data
// ---------------------------------------------------------------------------
export const SEO_KEYWORDS = [
  'Ayush Tiwari',
  'Full Stack Developer',
  'MERN Stack Developer',
  'Next.js Developer',
  'React Developer',
  'Node.js Developer',
  'Three.js Developer',
  'Web Developer India',
  'Full Stack Developer Jabalpur',
  'AWS Certified Developer',
  'Network Security Research',
  'Springer Publication',
  'JavaScript Developer',
  'TypeScript Developer',
  'MongoDB Developer',
  'Backend Engineer',
  'Frontend Developer',
  'Open Source Contributor',
  'Competitive Programmer',
  'Software Engineer India',
];
