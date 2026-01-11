export const SITE_CONFIG = {
  name: 'Ayush Tiwari',
  title: 'Full Stack Developer',
  description: 'Production-ready developer portfolio showcasing projects, blog posts, certifications, and hackathon achievements.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: {
    name: 'Ayush Tiwari',
    email: 'ayush@example.com',
  },
  social: {
    github: 'https://github.com/ayushtiwari18',
    linkedin: 'https://linkedin.com/in/ayushtiwari',
    twitter: 'https://twitter.com/ayushtiwari',
  },
};

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
