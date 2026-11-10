import { notFound } from 'next/navigation';
import { getEventBySlug, getAllEventSlugs } from '@/services/events.service';
import PehelStoryView from '@/components/events/PehelStoryView';
import { BASE_URL } from '@/lib/config';

export const revalidate    = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getAllEventSlugs();
    return slugs.map(slug => ({ slug }));
  } catch {
    return [{ slug: 'pehel' }];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let event;
  try {
    event = await getEventBySlug(slug);
  } catch {
    return { title: 'Event Not Found — Ayush Tiwari' };
  }
  if (!event) return { title: 'Event Not Found — Ayush Tiwari' };

  const baseUrl = BASE_URL;
  const desc    = event.description?.slice(0, 160) ?? `${event.title} — Ayush Tiwari`;
  const ogImg   = event.cover_image;

  return {
    title: `${event.title} — Ayush Tiwari`,
    description: desc,
    alternates: { canonical: `${baseUrl}/events/${slug}` },
    openGraph: {
      title: `${event.title} — Ayush Tiwari`,
      description: desc,
      url: `${baseUrl}/events/${slug}`,
      type: 'article',
      ...(ogImg && { images: [{ url: ogImg, width: 1200, height: 630, alt: event.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${event.title} — Ayush Tiwari`,
      description: desc,
      ...(ogImg && { images: [ogImg] }),
    },
  };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  let event;
  try {
    event = await getEventBySlug(slug);
  } catch {
    notFound();
  }
  if (!event) notFound();

  const baseUrl = BASE_URL;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.date,
    endDate: event.end_date || event.date,
    location: event.location ? { '@type': 'Place', name: event.location } : undefined,
    organizer: event.organizer ? { '@type': 'Organization', name: event.organizer } : undefined,
    url: `${baseUrl}/events/${slug}`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',   item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Events', item: `${baseUrl}/events` },
      { '@type': 'ListItem', position: 3, name: event.title, item: `${baseUrl}/events/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <PehelStoryView event={event} />
    </>
  );
}
