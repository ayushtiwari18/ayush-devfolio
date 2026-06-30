import { SITE_CONFIG } from '@/lib/constants';

const baseUrl = SITE_CONFIG.url;

const LAST_UPDATED = {
  home:           '2026-06-30',
  about:          '2026-06-30',
  projects:       '2026-06-30',
  blog:           '2026-06-30',
  certifications: '2026-06-30',
  events:         '2026-06-30',
  contact:        '2026-01-01',
};

export default function sitemap() {
  return [
    { url: `${baseUrl}/`,               lastModified: LAST_UPDATED.home,           changeFrequency: 'monthly', priority: 1.0 },
    { url: `${baseUrl}/about`,          lastModified: LAST_UPDATED.about,          changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/projects`,       lastModified: LAST_UPDATED.projects,       changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/blog`,           lastModified: LAST_UPDATED.blog,           changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/certifications`, lastModified: LAST_UPDATED.certifications, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/events`,         lastModified: LAST_UPDATED.events,         changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`,        lastModified: LAST_UPDATED.contact,        changeFrequency: 'yearly',  priority: 0.6 },
  ];
}
