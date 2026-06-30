import { BASE_URL } from '@/app/layout';

const TODAY = new Date().toISOString().split('T')[0];

export default function sitemap() {
  return [
    { url: `${BASE_URL}/`,               lastModified: TODAY, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/about`,          lastModified: TODAY, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/projects`,       lastModified: TODAY, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/blog`,           lastModified: TODAY, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/certifications`, lastModified: TODAY, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/events`,         lastModified: TODAY, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/hackathons`,     lastModified: TODAY, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`,        lastModified: TODAY, changeFrequency: 'yearly',  priority: 0.5 },
  ];
}
