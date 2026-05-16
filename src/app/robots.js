import { SITE_CONFIG } from '@/lib/constants';

/**
 * robots.js — Next.js App Router metadata route
 *
 * Rules:
 * - Public portfolio pages: fully crawlable
 * - /admin/*  : CMS panel — never index (security + relevance)
 * - /api/*    : REST endpoints — no SEO value, wastes crawl budget
 * - /_next/*  : Next.js build internals — irrelevant to crawlers
 * - /404, /500: Error pages — no indexing value
 * - AI scrapers (GPTBot, ChatGPT-User): explicit opt-out
 */
export default function robots() {
  return {
    rules: [
      // Standard crawlers — allow all public pages, block private routes
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/api',
          '/_next/',
          '/404',
          '/500',
        ],
      },
      // Opt-out AI training scrapers
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
