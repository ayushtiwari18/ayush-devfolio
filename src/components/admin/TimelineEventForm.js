'use client';

/**
 * TimelineEventForm — shared form for create + edit
 * Order is now managed exclusively via drag-and-drop on the list page.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ImageUploader from './ImageUploader';

const TYPE_OPTIONS = [
  { value: 'hackathon',   label: 'Hackathon'  },
  { value: 'project',     label: 'Project'    },
  { value: 'work',        label: 'Work'       },
  { value: 'college',     label: 'Education'  },
  { value: 'freelancing', label: 'Freelance'  },
  { value: 'enjoyment',   label: 'Life'       },
];

const EMPTY = {
  type:        'project',
  title:       '',
  description: '',
  start_date:  '',
  end_date:    '',
  video_url:   '',
  featured:    false,
  published:   false,
};

const extractUrls = (media) => {
  if (!Array.isArray(media)) return [];
  return media.map(m => (typeof m === 'string' ? m : m?.url)).filter(Boolean);
};

export default function TimelineEventForm({ initialData, onSubmit, saving, submitLabel }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(initialData ? {
      ...initialData,
      start_date: initialData.start_date?.slice(0, 10) || '',
      end_date:   initialData.end_date?.slice(0, 10)   || '',
      video_url:  initialData.video_url || '',
    } : {}),
  }));

  const [mediaUrls, setMediaUrls] = useState(() => extractUrls(initialData?.media));

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const mediaJsonb = mediaUrls.map((url, i) => ({
      url,
      alt:    `${form.title} image ${i + 1}`,
      width:  1280,
      height: 720,
    }));
    const payload = {
      type:        form.type,
      title:       form.title.trim(),
      description: form.description.trim(),
      start_date:  form.start_date,
      end_date:    form.end_date || null,
      video_url:   form.video_url.trim() || null,
      featured:    form.featured,
      published:   form.published,
      media:       mediaJsonb,
    };
    onSubmit(payload);
  };

  const inputClass = 'w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors';
  const labelClass = 'block text-sm font-semibold text-foreground mb-1.5';
  const hintClass  = 'text-xs text-muted-foreground mt-1';

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-5">

      <div>
        <label className={labelClass}>Event Type</label>
        <select value={form.type} onChange={e => set('type', e.target.value)} required className={inputClass}>
          {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Title <span className="text-red-500">*</span></label>
        <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="e.g. Won 1st Place at HackX 2025"
          required maxLength={120} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description <span className="text-red-500">*</span></label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="What happened? Key achievement, impact, tech used…"
          required rows={4} maxLength={600}
          className={`${inputClass} resize-none`} />
        <p className={hintClass}>{form.description.length}/600</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Start Date <span className="text-red-500">*</span></label>
          <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)}
            required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)}
            className={inputClass} />
          <p className={hintClass}>Leave blank if ongoing</p>
        </div>
      </div>

      <ImageUploader
        label="Media Images"
        multiple
        existingUrls={mediaUrls}
        onChange={urls => setMediaUrls(urls)}
        folder="timeline"
        hint="These appear in the media column of the timeline card. Upload up to 6 images."
      />

      <div>
        <label className={labelClass}>Video URL</label>
        <input type="url" value={form.video_url} onChange={e => set('video_url', e.target.value)}
          placeholder="https://youtube.com/… or direct .mp4 link"
          className={inputClass} />
        <p className={hintClass}>Optional. If provided, shows a video preview instead of images.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
            className="w-4 h-4 accent-primary" />
          <span className="text-sm font-medium text-foreground">
            Featured
            <span className="block text-xs text-muted-foreground font-normal">Shows ping dot + achievement badge</span>
          </span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)}
            className="w-4 h-4 accent-primary" />
          <span className="text-sm font-medium text-foreground">
            Published
            <span className="block text-xs text-muted-foreground font-normal">Visible on public /about page</span>
          </span>
        </label>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={saving}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 flex items-center justify-center">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
