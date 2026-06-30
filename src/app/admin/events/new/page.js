'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUrlList from '@/components/admin/ImageUrlList';
import { createEvent } from '@/services/events.service';

const TYPE_OPTIONS = [
  { value: 'hackathon',   label: 'Hackathon'   },
  { value: 'conference',  label: 'Conference'  },
  { value: 'workshop',    label: 'Workshop'    },
  { value: 'fest',        label: 'Fest'        },
  { value: 'competition', label: 'Competition' },
  { value: 'other',       label: 'Other'       },
];

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const INPUT   = 'w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm';
const LABEL   = 'block text-sm font-medium text-foreground mb-1.5';
const HINT    = 'text-xs text-muted-foreground mt-1';
const SECTION = 'bg-card border border-border rounded-xl p-6 space-y-4';

export default function NewEventPage() {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const [form, setForm] = useState({
    title: '', slug: '', tagline: '', type: 'hackathon', category: '',
    organizer: '', location: '', date: '', end_date: '', duration: '',
    team_size: 1, team_name: '', role: '',
    result: '', prize: '',
    description: '', story: '',
    cover_image: '', certificate_image: '',
    images: [],           // string[]
    technologies: '',
    links_github: '', links_devpost: '', links_certificate: '', links_live: '', links_article: '',
    published: true, featured: false,
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const handleTitleChange = (val) => setForm(f => ({ ...f, title: val, slug: slugify(val) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.slug.trim())  { setError('Slug is required.');  return; }
    setSaving(true); setError(null);
    try {
      const links = {};
      if (form.links_github)      links.github      = form.links_github;
      if (form.links_devpost)     links.devpost     = form.links_devpost;
      if (form.links_certificate) links.certificate = form.links_certificate;
      if (form.links_live)        links.live        = form.links_live;
      if (form.links_article)     links.article     = form.links_article;

      await createEvent({
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
        images:            form.images.filter(Boolean),
        technologies:      form.technologies ? form.technologies.split(',').map(s => s.trim()).filter(Boolean) : [],
        links:             Object.keys(links).length ? links : {},
        published:         form.published,
        featured:          form.featured,
      });
      router.push('/admin/events');
    } catch (err) {
      setError(err.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/events"><Button type="button" variant="outline" size="sm"><ArrowLeft size={16} className="mr-1" />Back</Button></Link>
        <div>
          <h1 className="text-2xl font-bold">Add Event</h1>
          <p className="text-sm text-muted-foreground">Create a new hackathon, conference, or tech event entry</p>
        </div>
      </div>

      {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-3">{error}</div>}

      {/* Core */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Core Info</h2>
        <div><label className={LABEL}>Title *</label><input className={INPUT} value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Smart India Hackathon 2024" required /></div>
        <div>
          <label className={LABEL}>Slug *</label>
          <input className={INPUT} value={form.slug} onChange={e => set('slug', e.target.value)} required />
          <p className={HINT}>URL: /events/{form.slug || 'slug'}</p>
        </div>
        <div><label className={LABEL}>Tagline</label><input className={INPUT} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Built a real-time disaster relief platform in 36 hours" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Type</label><select className={INPUT} value={form.type} onChange={e => set('type', e.target.value)}>{TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
          <div><label className={LABEL}>Category</label><input className={INPUT} value={form.category} onChange={e => set('category', e.target.value)} placeholder="National Level" /></div>
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
          <div><label className={LABEL}>Location</label><input className={INPUT} value={form.location} onChange={e => set('location', e.target.value)} placeholder="New Delhi, India" /></div>
          <div><label className={LABEL}>Duration</label><input className={INPUT} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="36 hours" /></div>
        </div>
        <div><label className={LABEL}>Organizer</label><input className={INPUT} value={form.organizer} onChange={e => set('organizer', e.target.value)} placeholder="Ministry of Education, Govt. of India" /></div>
      </div>

      {/* Team & Outcome */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Team &amp; Outcome</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Team Size</label><input type="number" min="1" className={INPUT} value={form.team_size} onChange={e => set('team_size', e.target.value)} /></div>
          <div><label className={LABEL}>Team Name</label><input className={INPUT} value={form.team_name} onChange={e => set('team_name', e.target.value)} placeholder="Team Nexus" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>Your Role</label><input className={INPUT} value={form.role} onChange={e => set('role', e.target.value)} placeholder="Team Lead & Backend Developer" /></div>
          <div><label className={LABEL}>Result</label><input className={INPUT} value={form.result} onChange={e => set('result', e.target.value)} placeholder="Winner 🏆 / Finalist / Participant" /></div>
        </div>
        <div><label className={LABEL}>Prize</label><input className={INPUT} value={form.prize} onChange={e => set('prize', e.target.value)} placeholder="₹1,00,000 cash prize" /></div>
      </div>

      {/* Content */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Content</h2>
        <div><label className={LABEL}>Description <span className="text-muted-foreground font-normal">(shown on card)</span></label><textarea rows={2} className={INPUT} value={form.description} onChange={e => set('description', e.target.value)} placeholder="1–2 sentence summary" /></div>
        <div>
          <label className={LABEL}>Story <span className="text-muted-foreground font-normal">(full narrative on detail page)</span></label>
          <textarea rows={8} className={INPUT} value={form.story} onChange={e => set('story', e.target.value)} placeholder="Tell the full story...\n\nUse blank lines to separate paragraphs." />
          <p className={HINT}>Plain text. Blank line = new paragraph.</p>
        </div>
        <div><label className={LABEL}>Technologies <span className="text-muted-foreground font-normal">(comma-separated)</span></label><input className={INPUT} value={form.technologies} onChange={e => set('technologies', e.target.value)} placeholder="React, Node.js, MongoDB" /></div>
      </div>

      {/* Media */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Media</h2>
        <div><label className={LABEL}>Cover Image URL</label><input className={INPUT} value={form.cover_image} onChange={e => set('cover_image', e.target.value)} placeholder="https://..." /></div>
        <div>
          <label className={LABEL}>
            Gallery Images
            <span className="ml-2 text-xs text-muted-foreground font-normal">max 10 — shown as carousel on event page</span>
          </label>
          <ImageUrlList value={form.images} onChange={val => set('images', val)} />
        </div>
        <div><label className={LABEL}>Certificate Image URL</label><input className={INPUT} value={form.certificate_image} onChange={e => set('certificate_image', e.target.value)} placeholder="https://..." /></div>
      </div>

      {/* Links */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Links</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={LABEL}>GitHub</label><input className={INPUT} value={form.links_github} onChange={e => set('links_github', e.target.value)} placeholder="https://github.com/..." /></div>
          <div><label className={LABEL}>Devpost</label><input className={INPUT} value={form.links_devpost} onChange={e => set('links_devpost', e.target.value)} placeholder="https://devpost.com/..." /></div>
          <div><label className={LABEL}>Certificate URL</label><input className={INPUT} value={form.links_certificate} onChange={e => set('links_certificate', e.target.value)} placeholder="https://..." /></div>
          <div><label className={LABEL}>Live Demo</label><input className={INPUT} value={form.links_live} onChange={e => set('links_live', e.target.value)} placeholder="https://..." /></div>
          <div><label className={LABEL}>Article / Blog</label><input className={INPUT} value={form.links_article} onChange={e => set('links_article', e.target.value)} placeholder="https://..." /></div>
        </div>
      </div>

      {/* Visibility */}
      <div className={SECTION}>
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Visibility</h2>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="w-4 h-4 accent-primary" /><span className="text-sm">Published</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-primary" /><span className="text-sm">Featured</span></label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">
          {saving ? <><Loader2 size={16} className="mr-2 animate-spin" />Saving...</> : <><Save size={16} className="mr-2" />Save Event</>}
        </Button>
        <Link href="/admin/events"><Button type="button" variant="outline">Cancel</Button></Link>
      </div>
    </form>
  );
}
