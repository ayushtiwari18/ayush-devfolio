/**
 * config.js — single source of truth for the canonical site URL.
 *
 * Imported by:
 *   - src/app/layout.js       (metadata, JSON-LD)
 *   - src/app/sitemap.js      (sitemap generation)
 *   - src/app/robots.js       (robots.txt)
 *   - anywhere else that needs the base URL
 *
 * Kept as a plain JS module with NO React, NO Supabase, NO fonts
 * so sitemap.xml can be statically generated without any heavy deps.
 */
export const BASE_URL = 'https://ayush-devfolio-nine.vercel.app';
