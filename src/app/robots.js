/**
 * robots.js — Next.js App Router metadata file
 *
 * Returns the standard robots.txt rules via Next.js's built-in robots
 * metadata API. This produces a proper text/plain response at /robots.txt.
 *
 * Rules:
 * - Allow all bots to crawl everything (public portfolio)
 * - Point to the sitemap so Google indexes all routes on first crawl
 * - Disallow /admin to keep the CMS out of search results
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: 'https://ayush-devfolio-nine.vercel.app/sitemap.xml',
    host: 'https://ayush-devfolio-nine.vercel.app',
  };
}
