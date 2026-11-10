import { getPublishedEvents, getEventBySlug, getAllEventSlugs } from '../events.service';

// Mock Supabase
jest.mock('@/lib/supabase', () => {
  let currentSlug = null;

  const samplePehel = {
    id: 'db-pehel-id',
    title: 'Pehel – Ek Nayi Subha | 8th Edition',
    slug: 'pehel',
    tagline: 'Celebrating the Unsung Heroes of Our Campus',
    type: 'other',
    category: 'College Event',
    published: true,
    date: '2024-08-01',
    story: 'Pehel story content...',
  };

  const chainable = {
    select: jest.fn(() => chainable),
    eq: jest.fn((field, val) => {
      if (field === 'slug') currentSlug = val;
      return chainable;
    }),
    order: jest.fn().mockImplementation(() => Promise.resolve({
      data: [samplePehel],
      error: null,
    })),
    maybeSingle: jest.fn().mockImplementation(() => {
      const match = currentSlug === 'pehel' ? samplePehel : null;
      return Promise.resolve({
        data: match,
        error: null,
      });
    }),
    then: jest.fn((callback) => callback({ data: [{ slug: 'pehel' }], error: null })),
  };

  return {
    supabase: {
      from: jest.fn(() => chainable),
    },
  };
});

describe('events.service', () => {
  it('fetches published events and merges database entries with curated hackathons', async () => {
    const events = await getPublishedEvents();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(1);

    // Verify Pehel is present with case study flag
    const pehel = events.find(e => e.slug === 'pehel');
    expect(pehel).toBeDefined();
    expect(pehel.hasCaseStudy).toBe(true);
    expect(pehel.caseStudyUrl).toBe('/events/pehel');

    // Verify Devpost Hackathon is included
    const devpost = events.find(e => e.slug === 'devpost-hackathon-2025');
    expect(devpost).toBeDefined();
    expect(devpost.result).toBe('1st Place Winner');
  });

  it('fetches single event by slug (pehel from DB, hackathon from curations)', async () => {
    const pehel = await getEventBySlug('pehel');
    expect(pehel).toBeDefined();
    expect(pehel.title).toContain('Pehel');

    const hackbyte = await getEventBySlug('hackbyte-4');
    expect(hackbyte).toBeDefined();
    expect(hackbyte.caseStudyUrl).toBe('/projects/sentinal');
  });

  it('returns null for unknown event slugs', async () => {
    const unknown = await getEventBySlug('non-existent-event-xyz');
    expect(unknown).toBeNull();
  });

  it('retrieves all event slugs including pehel and curated hackathons', async () => {
    const slugs = await getAllEventSlugs();
    expect(slugs).toContain('pehel');
    expect(slugs).toContain('hackbyte-4');
    expect(slugs).toContain('sih-2024');
  });
});
