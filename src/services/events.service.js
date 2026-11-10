import { supabase } from '@/lib/supabase';

/**
 * Curated list of verified tech milestones and hackathons from Ayush's journey.
 * Enriches the /events catalog with verified podium wins, hackathon challenges,
 * and cross-links to project deep-dives (e.g. Sentinal WAF).
 */
const HACKATHON_CURATIONS = [
  {
    id: 'devpost-2025',
    title: 'Devpost Hackathon 2025',
    slug: 'devpost-hackathon-2025',
    tagline: 'Global Open Innovation & Cloud Development Challenge',
    type: 'hackathon',
    category: 'Hackathon',
    organizer: 'Devpost Global Circuit',
    location: 'Virtual / Global',
    date: '2025-01-15',
    duration: '48 hours',
    team_size: 4,
    team_name: 'Team Devpost Winners',
    role: 'Lead Architect & Full Stack Developer',
    result: '1st Place Winner',
    prize: 'Grand Prize · 1st Place',
    description: 'Developed an autonomous cloud infrastructure monitoring platform using Next.js, WebSockets, and AWS. Awarded 1st Place overall.',
    cover_image: null,
    technologies: ['Next.js', 'WebSockets', 'AWS', 'Docker', 'Node.js'],
    links: {},
    published: true,
    featured: true,
  },
  {
    id: 'istd-2025',
    title: 'ISTD Innovation Challenge 2025',
    slug: 'istd-innovation-challenge',
    tagline: 'National Level Technical Innovation & Systems Design',
    type: 'hackathon',
    category: 'Hackathon',
    organizer: 'Indian Society for Training & Development',
    location: 'National / India',
    date: '2025-01-10',
    duration: '36 hours',
    team_size: 3,
    role: 'Full Stack Systems Architect',
    result: 'Top 3 Finalist',
    prize: 'Podium Finish · Top 3',
    description: 'Designed a high-throughput secure data pipeline architecture. Finished on the national podium among top 3 teams.',
    cover_image: null,
    technologies: ['Distributed Systems', 'Security', 'Express', 'Redis'],
    links: {},
    published: true,
    featured: true,
  },
  {
    id: 'hackbyte-4',
    title: 'Hackbyte 4.0 — Sentinal WAF',
    slug: 'hackbyte-4',
    tagline: 'High-Performance Reverse Proxy & Application Firewall',
    type: 'hackathon',
    category: 'Hackathon',
    organizer: 'IIITDM Jabalpur',
    location: 'IIITDM Jabalpur, India',
    date: '2024-12-15',
    duration: '36 hours',
    team_size: 4,
    role: 'Core Architect & Security Engineer',
    result: 'Featured Showcase',
    prize: 'Sentinal WAF Architecture',
    description: 'Built Sentinal: a sub-millisecond reverse proxy and Web Application Firewall with token bucket rate limiting and IP reputation intelligence.',
    cover_image: 'https://tzsonumsxavkscaowxto.supabase.co/storage/v1/object/public/portfolio/hackathons/1782369562020-60-ayush-tiwari--pdf-io-.png',
    technologies: ['Go', 'Node.js', 'Redis', 'Docker', 'WAF', 'Token Bucket'],
    links: { live: '/projects/sentinal' },
    published: true,
    featured: true,
    caseStudyUrl: '/projects/sentinal',
  },
  {
    id: 'sih-2024',
    title: 'Smart India Hackathon (SIH) 2024',
    slug: 'sih-2024',
    tagline: 'Gamified Ocean Literacy & Environmental Data Platform',
    type: 'hackathon',
    category: 'Hackathon',
    organizer: 'Ministry of Education & AICTE, Govt. of India',
    location: 'National Finalist Center, India',
    date: '2024-12-01',
    duration: '36-hour sprint',
    team_size: 6,
    role: 'Full Stack Developer',
    result: 'National Finalist',
    prize: 'National Level Selection',
    description: 'Collaborated on building a web platform spreading ocean literacy using gamification, 3D interactive models, and real-time interactive challenges.',
    cover_image: null,
    technologies: ['MERN Stack', 'Unity WebGL', 'Blender', 'Interactive 3D'],
    links: {},
    published: true,
    featured: true,
  },
  {
    id: 'shark-tank-2025',
    title: 'Shark Tank 3.0 @ Gyanotsav 2025',
    slug: 'shark-tank-gyanotsav',
    tagline: 'Venture Pitching & Technical Product Strategy',
    type: 'competition',
    category: 'Competition',
    organizer: 'Gyanotsav Entrepreneurship Cell',
    location: 'Jabalpur, Madhya Pradesh',
    date: '2025-01-05',
    duration: '12 hours',
    team_size: 2,
    role: 'Tech Lead & Pitch Presenter',
    result: 'Top 7 Finalist',
    prize: 'Top 7 Finalist',
    description: 'Pitched scalable tech product architecture to an investor panel, ranking in the Top 7 finalists out of 80+ submissions.',
    cover_image: null,
    technologies: ['Product Strategy', 'FinTech', 'System Architecture'],
    links: {},
    published: true,
    featured: false,
  },
  {
    id: 'hackbyte-2',
    title: 'HackByte 2.0 — IIITDM Jabalpur',
    slug: 'hackbyte-2',
    tagline: 'Major League Hacking (MLH) Partner Hackathon',
    type: 'hackathon',
    category: 'Hackathon',
    organizer: 'IIITDM Jabalpur & MLH',
    location: 'IIITDM Jabalpur, Madhya Pradesh',
    date: '2024-10-15',
    duration: '36 hours',
    team_size: 4,
    role: 'Team Leader',
    result: 'Finalist',
    prize: 'MLH Official Participant',
    description: 'Led a team through fast-paced ideation and rapid prototyping under high pressure, delivering full-stack product demos.',
    cover_image: 'https://tzsonumsxavkscaowxto.supabase.co/storage/v1/object/public/portfolio/hackathons/1782369904439-hackbyte.jpg',
    technologies: ['React', 'Node.js', 'Express', 'Rapid Prototyping'],
    links: {},
    published: true,
    featured: false,
  },
  {
    id: 'ibm-hack-2023',
    title: 'IBM Hack Challenge 2023',
    slug: 'ibm-hack-challenge-2023',
    tagline: 'Enterprise Problem Solving & Corporate Innovation',
    type: 'hackathon',
    category: 'Hackathon',
    organizer: 'IBM India',
    location: 'Virtual / Regional Center',
    date: '2023-12-05',
    duration: '48 hours',
    team_size: 3,
    role: 'Backend Developer',
    result: 'Participant',
    prize: 'IBM Certification',
    description: 'Tackled industry-grade enterprise challenges, learning corporate architecture requirements, SLA constraints, and solution pitching.',
    cover_image: 'https://tzsonumsxavkscaowxto.supabase.co/storage/v1/object/public/portfolio/hackathons/1782370120600-ibm-hack.jpg',
    technologies: ['Cloud Computing', 'APIs', 'Node.js', 'Data Pipeline'],
    links: {},
    published: true,
    featured: false,
  },
  {
    id: 'techutsav-2024',
    title: 'Web-a-Thon — TechUtsav, GGITS',
    slug: 'web-a-thon-techutsav',
    tagline: 'Timed Web Engineering & UI Speed Challenge',
    type: 'hackathon',
    category: 'Hackathon',
    organizer: 'TechUtsav, GGITS',
    location: 'Jabalpur, Madhya Pradesh',
    date: '2024-03-10',
    duration: '12 hours',
    team_size: 2,
    role: 'Lead Web Developer',
    result: 'Participant',
    prize: 'Speed Challenge',
    description: 'Showcased front-end and back-end rapid implementation in a timed sprint, delivering a responsive web application.',
    cover_image: null,
    technologies: ['JavaScript', 'Tailwind CSS', 'Next.js', 'REST APIs'],
    links: {},
    published: true,
    featured: false,
  }
];

/**
 * Fetch all published events ordered by date descending.
 * Merges primary events table records (e.g. Pehel) with curated verified hackathon milestones.
 */
export async function getPublishedEvents() {
  let dbEvents = [];
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('published', true)
      .order('date', { ascending: false });

    if (!error && data) {
      dbEvents = data.map(item => {
        let cover = item.cover_image;
        // For Pehel, prefer the authentic event photograph over the uncropped desktop screenshot
        if (item.slug === 'pehel' && Array.isArray(item.images) && item.images.length > 0) {
          const realPhoto = item.images.find(img => (typeof img === 'string' ? img : img.url)?.includes('1730015367035'));
          if (realPhoto) cover = typeof realPhoto === 'string' ? realPhoto : realPhoto.url;
        }
        return {
          ...item,
          cover_image: cover,
          hasCaseStudy: Boolean(item.story || item.slug === 'pehel'),
          caseStudyUrl: `/events/${item.slug}`,
        };
      });
    }
  } catch (err) {
    console.warn('[events.service] Supabase events query error:', err?.message);
  }

  // Combine DB events with curated hackathons (avoid duplicate slugs)
  const existingSlugs = new Set(dbEvents.map(e => e.slug));
  const combined = [...dbEvents];

  for (const curation of HACKATHON_CURATIONS) {
    if (!existingSlugs.has(curation.slug)) {
      combined.push({
        ...curation,
        hasCaseStudy: Boolean(curation.caseStudyUrl),
        caseStudyUrl: curation.caseStudyUrl || null,
      });
      existingSlugs.add(curation.slug);
    }
  }

  // Sort descending by date
  return combined.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

/**
 * Fetch a single event by slug.
 */
export async function getEventBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (!error && data) {
      if (data.slug === 'pehel' && Array.isArray(data.images) && data.images.length > 0) {
        const realPhoto = data.images.find(img => (typeof img === 'string' ? img : img.url)?.includes('1730015367035'));
        if (realPhoto) data.cover_image = typeof realPhoto === 'string' ? realPhoto : realPhoto.url;
      }
      return data;
    }
  } catch (err) {
    console.warn('[events.service] getEventBySlug DB error:', err?.message);
  }

  // Fallback to curated events
  const curated = HACKATHON_CURATIONS.find(e => e.slug === slug);
  return curated || null;
}

/**
 * Fetch all published events of a specific type.
 * @param {'hackathon'|'conference'|'workshop'|'fest'|'competition'|'other'|'leadership'} type
 */
export async function getEventsByType(type) {
  const all = await getPublishedEvents();
  return all.filter(e => e.type === type);
}

/**
 * Fetch all event slugs — used for generateStaticParams in /events/[slug].
 */
export async function getAllEventSlugs() {
  try {
    const { data } = await supabase
      .from('events')
      .select('slug')
      .eq('published', true);

    const dbSlugs = (data || []).map(e => e.slug);
    const set = new Set([...dbSlugs, ...HACKATHON_CURATIONS.map(c => c.slug)]);
    return Array.from(set);
  } catch {
    return ['pehel', ...HACKATHON_CURATIONS.map(c => c.slug)];
  }
}

// ── Admin ──────────────────────────────────────────────────────────

export async function getAllEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getEventById(id) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createEvent(payload) {
  const { data, error } = await supabase
    .from('events')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(id, payload) {
  const { data, error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function toggleEventPublished(id, published) {
  return updateEvent(id, { published });
}
