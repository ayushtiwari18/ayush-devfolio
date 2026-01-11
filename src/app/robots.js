import { SITE_CONFIG } from '@/lib/constants';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
