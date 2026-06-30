import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Calendar, MapPin, Clock,
  Users, Trophy, Github, ExternalLink,
  FileText, Award, Tag,
} from 'lucide-react';
import { getEventBySlug, getAllEventSlugs } from '@/services/events.service';
import EventGallery from '@/components/events/EventGallery';

export const revalidate    = 0;  // 🔧 DEBUG: disable cache so every request is fresh
export const dynamicParams = true;

function parseLinks(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch { return {}; }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllEventSlugs();
    return slugs.map(slug => ({ slug }));
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let event;
  try { event = await getEventBySlug(slug); } catch { return { title: 'Event Not Found' }; }
  if (!event) return { title: 'Event Not Found' };

  const baseUrl = 'https://ayush-devfolio.vercel.app';
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

const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  : null;

const fmtShort = (d) => d
  ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  : null;

const TYPE_CONFIG = {
  hackathon:   { label: 'Hackathon',   color: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  conference:  { label: 'Conference',  color: 'bg-blue-500/15   text-blue-400   border-blue-500/30'   },
  workshop:    { label: 'Workshop',    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  fest:        { label: 'Fest',        color: 'bg-pink-500/15   text-pink-400   border-pink-500/30'   },
  competition: { label: 'Competition', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  other:       { label: 'Event',       color: 'bg-primary/15    text-primary    border-primary/30'    },
};

function resultStyle(result) {
  if (!result) return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
  const r = result.toLowerCase();
  if (r.includes('win') || r.includes('1st') || r.includes('first'))
    return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
  if (r.includes('final') || r.includes('2nd') || r.includes('top'))
    return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
}

function Sidebar({ event, links }) {
  const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.other;
  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-28 space-y-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Event Info</p>
          <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-full border ${cfg.color}`}>
            {cfg.label}
          </span>
          {event.result && (
            <div className="flex items-start gap-2 text-xs">
              <Trophy size={12} className="text-primary shrink-0 mt-0.5" />
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${resultStyle(event.result)}`}>{event.result}</span>
            </div>
          )}
          {fmtShort(event.date) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar size={12} className="text-primary shrink-0" />
              <span>{fmtShort(event.date)}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin size={12} className="text-primary shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          {event.duration && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} className="text-primary shrink-0" />
              <span>{event.duration}</span>
            </div>
          )}
          {event.organizer && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tag size={12} className="text-primary shrink-0" />
              <span>{event.organizer}</span>
            </div>
          )}
          {event.team_size > 1 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users size={12} className="text-primary shrink-0" />
              <span>Team of {event.team_size}{event.team_name ? ` · ${event.team_name}` : ''}</span>
            </div>
          )}
          {event.role && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Award size={12} className="text-primary shrink-0" />
              <span>{event.role}</span>
            </div>
          )}
          {event.prize && (
            <div className="flex items-center gap-2 text-xs text-yellow-400">
              <Trophy size={12} className="shrink-0" />
              <span>{event.prize}</span>
            </div>
          )}
        </div>
        {Object.keys(links).length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Links</p>
            {links.github && (<a href={links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline"><Github size={12} /><span>GitHub Repo</span></a>)}
            {links.devpost && (<a href={links.devpost} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline"><ExternalLink size={12} /><span>Devpost</span></a>)}
            {links.certificate && (<a href={links.certificate} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline"><FileText size={12} /><span>Certificate</span></a>)}
            {links.article && (<a href={links.article} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline"><FileText size={12} /><span>Article</span></a>)}
            {links.live && (<a href={links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline"><ExternalLink size={12} /><span>Live Demo</span></a>)}
          </div>
        )}
        {event.technologies?.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {event.technologies.map((t, i) => (
                <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full border border-primary/20">{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function EventHero({ event }) {
  const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.other;
  if (!event.cover_image) {
    return (
      <div className="w-full h-64 sm:h-80 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-zinc-900 border border-border">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
            <Trophy size={32} className="text-primary/50" />
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={event.cover_image}
      alt={event.title}
      className="w-full max-h-[480px] object-contain rounded-2xl border border-border bg-muted"
    />
  );
}

function StorySection({ story }) {
  if (!story?.trim()) return null;
  const paragraphs = story.split(/\n\n+/).filter(Boolean);
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
        <span className="w-1 h-5 bg-primary rounded-full inline-block" />
        The Story
      </h2>
      <div className="space-y-4">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed text-[15px]">{para.trim()}</p>
        ))}
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────
export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  let event;
  try { event = await getEventBySlug(slug); } catch { notFound(); }
  if (!event) notFound();

  const links  = parseLinks(event.links);
  const images = Array.isArray(event.images) ? event.images.filter(Boolean) : [];
  const baseUrl = 'https://ayush-devfolio.vercel.app';

  // ── SERVER-SIDE DEBUG LOGS (visible in `npm run dev` terminal) ──
  console.log('\n===== [EventDetailPage] DEBUG ===========================');
  console.log('slug              :', slug);
  console.log('event.images raw  :', event.images);
  console.log('event.images type :', typeof event.images, Array.isArray(event.images));
  console.log('images (filtered) :', images);
  console.log('images.length     :', images.length);
  console.log('links raw         :', event.links);
  console.log('links parsed      :', links);
  console.log('cover_image       :', event.cover_image);
  console.log('=========================================================\n');

  const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.other;

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

      <main className="min-h-screen pt-20 pb-24 px-4 sm:px-6 lg:px-8">

        {/* ── VISIBLE DEBUG PANEL (remove after fixing) ── */}
        <div className="max-w-7xl mx-auto mb-4 p-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-xs font-mono text-yellow-300 space-y-1">
          <p className="font-bold text-yellow-400">🐛 DEBUG PANEL — remove after fix</p>
          <p>images.length: <strong>{images.length}</strong></p>
          <p>images raw type: <strong>{Array.isArray(event.images) ? 'array' : typeof event.images}</strong></p>
          {images.map((url, i) => (
            <p key={i} className="truncate">img[{i}]: {url}</p>
          ))}
          {images.length === 0 && <p className="text-red-400">⚠️ images array is EMPTY — gallery will not render</p>}
          <p>links type: <strong>{typeof event.links}</strong> → parsed keys: <strong>{Object.keys(links).join(', ') || '(none)'}</strong></p>
        </div>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto mb-8">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={15} />
            <span>All Events</span>
          </Link>
        </div>

        {/* 2-col layout */}
        <div className="max-w-7xl mx-auto flex gap-10 items-start">

          <article className="flex-1 min-w-0">

            <div className="mb-8"><EventHero event={event} /></div>

            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${cfg.color}`}>{cfg.label}</span>
                {event.result && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full border ${resultStyle(event.result)}`}>
                    <Trophy size={9} />{event.result}
                  </span>
                )}
                {event.category && (
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full border bg-muted text-muted-foreground border-border">{event.category}</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 leading-tight">{event.title}</h1>

              {event.tagline && <p className="text-lg text-muted-foreground mb-4 leading-relaxed">{event.tagline}</p>}

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
                {fmtDate(event.date) && (
                  <span className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-lg text-xs">
                    <Calendar size={12} className="text-primary" />{fmtDate(event.date)}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-lg text-xs">
                    <MapPin size={12} className="text-primary" />{event.location}
                  </span>
                )}
                {event.duration && (
                  <span className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-lg text-xs">
                    <Clock size={12} className="text-primary" />{event.duration}
                  </span>
                )}
                {event.team_size > 1 && (
                  <span className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-lg text-xs">
                    <Users size={12} className="text-primary" />Team of {event.team_size}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {links.github && (
                  <a href={links.github} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-sm font-semibold text-foreground rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <Github size={16} /> GitHub
                  </a>
                )}
                {links.devpost && (
                  <a href={links.devpost} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all">
                    <ExternalLink size={16} /> Devpost
                  </a>
                )}
                {links.live && (
                  <a href={links.live} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all">
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            </div>

            {event.description && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                  About the Event
                </h2>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{event.description}</p>
              </section>
            )}

            <StorySection story={event.story} />

            {/* Gallery */}
            {images.length > 0 ? (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                  Gallery
                  <span className="text-sm font-normal text-muted-foreground ml-1">({images.length} photo{images.length !== 1 ? 's' : ''})</span>
                </h2>
                <EventGallery images={images} title={event.title} />
              </section>
            ) : (
              <div className="mb-10 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                ⚠️ Gallery section skipped — <code>images.length</code> is 0
              </div>
            )}

            {event.certificate_image && (
              <section className="mb-10">
                <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full inline-block" />
                  Certificate
                </h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.certificate_image}
                  alt={`${event.title} certificate`}
                  className="w-full max-w-lg max-h-[480px] object-contain rounded-2xl border border-border shadow-lg bg-muted"
                />
              </section>
            )}

            <div className="mt-12 pt-8 border-t border-border">
              <Link href="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
                <ArrowLeft size={16} /> Back to all events
              </Link>
            </div>
          </article>

          <Sidebar event={event} links={links} />
        </div>
      </main>
    </>
  );
}
