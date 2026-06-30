'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/admin/ImageUploader';
import { getEventById, updateEvent } from '@/services/events.service';

const TYPE_OPTIONS = [
  { value: 'hackathon',   label: 'Hackathon'   },
  { value: 'conference',  label: 'Conference'  },
  { value: 'workshop',    label: 'Workshop'    },
  { value: 'fest',        label: 'Fest'        },
  { value: 'competition', label: 'Competition' },
  { value: 'other',       label: 'Other'       },
];

const INPUT   = 'w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm';
const LABEL   = 'block text-sm font-medium text-foreground mb-1.5';
const HINT    = 'text-xs text-muted-foreground mt-1';
const SECTION = 'bg-card border border-border rounded-xl p-6 space-y-4';

export default function EditEventPage() {
  const router  = useRouter();
  const { id }  = useParams();
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [form,    setForm]    = useState(null);

  useEffect(() => {
    if (!id) return;
    getEventById(id)
      .then(ev => {
        const links = ev.links || {};
        setForm({
          title:             ev.title             || '',
          slug:              ev.slug              || '',
          tagline:           ev.tagline           || '',
          type:              ev.type              || 'hackathon',
          category:          ev.category          || '',
          organizer:         ev.organizer         || '',
          location:          ev.location          || '',
          date:              ev.date              || '',
          end_date:          ev.end_date          || '',
          duration:          ev.duration          || '',
          team_size:         ev.team_size         || 1,
          team_name:         ev.team_name         || '',
          role:              ev.role              || '',
          result:            ev.result            || '',
          prize:             ev.prize             || '',
          description:       ev.description       || '',
          story:             ev.story             || '',
          cover_image:       ev.cover_image       || '',
          certificate_image: ev.certificate_image || '',
          images:            Array.isArray(ev.images) ? ev.images : [],
          technologies:      (ev.technologies || []).join(', '),
          links_github:      links.github      || '',
          links_devpost:     links.devpost     || '',
          links_certificate: links.certificate || '',
          links_live:        links.live        || '',
          links_article:     links.article     || '',
          published:         ev.published  ?? true,
          featured:          ev.featured   ?? false,
        });
      })
      .catch(() => setError('Failed to load event.'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      const links = {};
      if (form.links_github)      links.github      = form.links_github;
      if (form.links_devpost)     links.devpost     = form.links_devpost;
      if (form.links_certificate) links.certificate = form.links_certificate;
      if (form.links_live)        links.live        = form.links_live;
      if (form.links_article)     links.article     = form.links_article;

      await updateEvent(id, {
        title:             form.title.trim(),
        slug:              form.slug.trim(),
        tagline:           form.tagline.trim()           || null,
        type:              form.type,
        category:          form.category.trim()          || null,
        organizer:         form.organizer.trim()         || null,
        location:          form.location.trim()          || null,
        date:              form.date                     || null,
        end_date:          form.end_date                 || null,
        duration:          form.duration.trim()          || null,
        team_size:         Number(form.team_size)        || 1,
        team_name:         form.team_name.trim()         || null,
        role:              form.role.trim()              || null,
        result:            form.result.trim()            || null,
        prize:             form.prize.trim()             || null,
        description:       form.description.trim()       || null,
        story:             form.story.trim()             || null,
        cover_image:       form.cover_image.trim()       || null,
        certificate_image: form.certificate_image.trim() || null,
        images:            form.images.filter(Boolean).slice(0, 10),
        technologies:      form.technologies
          ? form.technologies.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        links:   Object.keys(links).length ? links : {},
        published: form.published,
        featured:  form.featured,
      });
      router.push('/admin/events');
    } catch (err) {
      setError(err.message || 'Failed to update event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );

  if (!form) return (
    <div className="text-center py-24">
      <p className="text-destructive mb-4">{error || 'Event not found.'}</p>
      <Link href="/admin/events"><Button variant="outline">Back to Events</Button></Link>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button type="button" variant="outline" size="sm"><ArrowLeft size={16} className="mr-1" />Back</Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Event</h1>
          <p className="text-sm text-muted-foreground">{form.title}</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      {/* Core */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Core Info</h2>
        <div><label className={LABEL}>Title *</label><input className={INPUT} value={form.title} onChange={e => set('title', e.target.value)} required /></div>
        <div>
          <label className={LABEL}>Slug *</label>
          <input className={INPUT} value={form.slug} onChange={e => set('slug', e.target.value)} required />
          <p className={HINT}>URL: /events/{form.slug}</p>
        </div>
        <div><label className={LABEL}>Tagline</label><input className={INPUT} value={form.tagline} onChange={e => set('tagline', e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Type</label>
            <select className={INPUT} value={form.type} onChange={e => set('type', e.target.value)}>
              {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div><label className={LABEL}>Category</label><input className={INPUT} value={form.category} onChange={e => set('category', e.target.value)} /></div>
        </div>
      </div>

      {/* When / Where */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">When &amp; Where</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Start Date</label><input type="date" className={INPUT} value={form.date} onChange={e => set('date', e.target.value)} /></div>
          <div><label className={LABEL}>End Date</label><input type="date" className={INPUT} value={form.end_date} onChange={e => set('end_date', e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Location</label><input className={INPUT} value={form.location} onChange={e => set('location', e.target.value)} /></div>
          <div><label className={LABEL}>Duration</label><input className={INPUT} value={form.duration} onChange={e => set('duration', e.target.value)} /></div>
        </div>
        <div><label className={LABEL}>Organizer</label><input className={INPUT} value={form.organizer} onChange={e => set('organizer', e.target.value)} /></div>
      </div>

      {/* Team & Outcome */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Team &amp; Outcome</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Team Size</label><input type="number" min="1" className={INPUT} value={form.team_size} onChange={e => set('team_size', e.target.value)} /></div>
          <div><label className={LABEL}>Team Name</label><input className={INPUT} value={form.team_name} onChange={e => set('team_name', e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Your Role</label><input className={INPUT} value={form.role} onChange={e => set('role', e.target.value)} /></div>
          <div><label className={LABEL}>Result</label><input className={INPUT} value={form.result} onChange={e => set('result', e.target.value)} /></div>
        </div>
        <div><label className={LABEL}>Prize</label><input className={INPUT} value={form.prize} onChange={e => set('prize', e.target.value)} /></div>
      </div>

      {/* Content */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Content</h2>
        <div><label className={LABEL}>Description</label><textarea rows={2} className={INPUT} value={form.description} onChange={e => set('description', e.target.value)} /></div>
        <div>
          <label className={LABEL}>Story</label>
          <textarea rows={8} className={INPUT} value={form.story} onChange={e => set('story', e.target.value)} />
          <p className={HINT}>Plain text. Blank line = new paragraph.</p>
        </div>
        <div><label className={LABEL}>Technologies (comma-separated)</label><input className={INPUT} value={form.technologies} onChange={e => set('technologies', e.target.value)} /></div>
      </div>

      {/* Media */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Media</h2>

        <ImageUploader
          label="Cover Image"
          value={form.cover_image}
          onChange={url => set('cover_image', url)}
          folder="events"
          hint="Shown as hero on the event detail page and thumbnail on listing"
        />

        <ImageUploader
          label="Gallery Images"
          hint={`Upload up to 10 photos — shown as carousel on event page (${form.images.length}/10 uploaded)`}
          multiple
          existingUrls={form.images}
          onChange={urls => set('images', urls.slice(0, 10))}
          folder="events/gallery"
        />

        <ImageUploader
          label="Certificate Image"
          value={form.certificate_image}
          onChange={url => set('certificate_image', url)}
          folder="events/certificates"
          hint="Certificate or award image shown at the bottom of the event page"
        />
      </div>

      {/* Links */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Links</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>GitHub</label><input className={INPUT} value={form.links_github} onChange={e => set('links_github', e.target.value)} /></div>
          <div><label className={LABEL}>Devpost</label><input className={INPUT} value={form.links_devpost} onChange={e => set('links_devpost', e.target.value)} /></div>
          <div><label className={LABEL}>Certificate URL</label><input className={INPUT} value={form.links_certificate} onChange={e => set('links_certificate', e.target.value)} /></div>
          <div><label className={LABEL}>Live Demo</label><input className={INPUT} value={form.links_live} onChange={e => set('links_live', e.target.value)} /></div>
          <div><label className={LABEL}>Article / Blog</label><input className={INPUT} value={form.links_article} onChange={e => set('links_article', e.target.value)} /></div>
        </div>
      </div>

      {/* Visibility */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Visibility</h2>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm">Featured</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">
          {saving
            ? <><Loader2 size={16} className="mr-2 animate-spin" />Saving...</>
            : <><Save size={16} className="mr-2" />Save Changes</>
          }
        </Button>
        <Link href="/admin/events"><Button type="button" variant="outline">Cancel</Button></Link>
      </div>
    </form>
  );
}
