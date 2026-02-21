'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/utils/formatDate';

const TYPE_COLORS = {
  hackathon:   'bg-violet-500/10 text-violet-400 border-violet-500/30',
  work:        'bg-blue-500/10   text-blue-400   border-blue-500/30',
  freelancing: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  college:     'bg-amber-500/10  text-amber-400  border-amber-500/30',
  project:     'bg-pink-500/10   text-pink-400   border-pink-500/30',
  enjoyment:   'bg-orange-500/10 text-orange-400 border-orange-500/30',
};

const TYPE_LABELS = {
  hackathon: 'Hackathon', work: 'Work', freelancing: 'Freelance',
  college: 'Education', project: 'Project', enjoyment: 'Life',
};

export default function AdminTimelinePage() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('start_date', { ascending: false })
        .order('order',      { ascending: true  });
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching timeline events:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleField = async (id, field, current) => {
    try {
      const { error } = await supabase
        .from('timeline_events')
        .update({ [field]: !current })
        .eq('id', id);
      if (error) throw error;
      setEvents(prev =>
        prev.map(e => e.id === id ? { ...e, [field]: !current } : e)
      );
    } catch (err) {
      console.error(`Error toggling ${field}:`, err);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this timeline event? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = events.filter(e => {
    const matchesType   = filter === 'all' || e.type === filter;
    const matchesSearch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.description || '').toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timeline Events</h1>
          <p className="text-muted-foreground">
            {events.length} total · {events.filter(e => e.published).length} published
          </p>
        </div>
        <Link href="/admin/timeline/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />
            Add Event
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events…"
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Types</option>
          <option value="hackathon">Hackathon</option>
          <option value="project">Project</option>
          <option value="work">Work</option>
          <option value="college">Education</option>
          <option value="freelancing">Freelance</option>
          <option value="enjoyment">Life</option>
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Clock size={40} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">Try a different filter or add your first event.</p>
          <Link href="/admin/timeline/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2" size={18} /> Add First Event
            </Button>
          </Link>
        </div>
      )}

      {/* Event list */}
      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(event => (
            <div
              key={event.id}
              className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/40 transition-colors"
            >
              {/* Type badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                TYPE_COLORS[event.type] || TYPE_COLORS.project
              }`}>
                {TYPE_LABELS[event.type] || event.type}
              </span>

              {/* Title + date */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(event.start_date)}
                  {event.end_date ? ` – ${formatDate(event.end_date)}` : ' – Present'}
                  <span className="ml-2 text-border">|</span>
                  <span className="ml-2">Order: {event.order}</span>
                </p>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Published toggle */}
                <button
                  title={event.published ? 'Click to unpublish' : 'Click to publish'}
                  onClick={() => toggleField(event.id, 'published', event.published)}
                  className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                    event.published
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
                  }`}
                >
                  {event.published ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {event.published ? 'Live' : 'Draft'}
                </button>

                {/* Featured toggle */}
                <button
                  title={event.featured ? 'Remove from featured' : 'Mark as featured'}
                  onClick={() => toggleField(event.id, 'featured', event.featured)}
                  className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                    event.featured
                      ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20'
                      : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
                  }`}
                >
                  <Star size={12} fill={event.featured ? 'currentColor' : 'none'} />
                  {event.featured ? 'Featured' : 'Normal'}
                </button>

                {/* Edit */}
                <Link href={`/admin/timeline/${event.id}/edit`}>
                  <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                    <Edit size={14} />
                  </Button>
                </Link>

                {/* Delete */}
                <Button
                  size="sm"
                  variant="outline"
                  disabled={deleting === event.id}
                  onClick={() => deleteEvent(event.id)}
                  className="border-red-500/40 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
