'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Clock, Search, AlertCircle, GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import SortableTimeline from '@/components/admin/SortableTimeline';
import { supabase } from '@/lib/supabase';

export default function AdminTimelinePage() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all');
  const [deleting,     setDeleting]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('order', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching timeline events:', err);
      setError('Failed to load timeline events.');
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
      setEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: !current } : e));
    } catch (err) {
      console.error(`Error toggling ${field}:`, err);
    }
  };

  const handleConfirmedDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      const { error } = await supabase
        .from('timeline_events').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete event: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const isFiltering = search.trim() !== '' || filter !== 'all';

  const filtered = events.filter(e => {
    const matchesType   = filter === 'all' || e.type === filter;
    const matchesSearch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.description || '').toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <AlertCircle className="text-destructive" size={40} />
      <p className="text-destructive text-center">{error}</p>
      <Button onClick={fetchEvents} variant="outline">Try Again</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Timeline Event?"
        description={deleteTarget ? `"${deleteTarget.title}" will be permanently removed. This cannot be undone.` : ''}
        confirmLabel="Delete Event"
        danger
        loading={!!deleting}
        onConfirm={handleConfirmedDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timeline Events</h1>
          <p className="text-muted-foreground">
            {events.length} total &middot; {events.filter(e => e.published).length} published
          </p>
        </div>
        <Link href="/admin/timeline/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />Add Event
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

      {/* DnD disabled notice when filtering */}
      {isFiltering && events.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500 text-sm">
          <GripVertical size={16} />
          Drag-to-reorder is disabled while search or filter is active. Clear them to reorder.
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Clock size={40} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">Try a different filter or add your first event.</p>
          {events.length === 0 && (
            <Link href="/admin/timeline/new">
              <Button className="bg-primary hover:bg-primary/90"><Plus className="mr-2" size={18} />Add First Event</Button>
            </Link>
          )}
        </div>
      )}

      {/* Sortable list — DnD disabled when filtering */}
      {filtered.length > 0 && (
        isFiltering ? (
          // Plain static list when search/filter active
          <div className="space-y-3">
            {filtered.map(event => (
              <div key={event.id}
                className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/40 transition-colors opacity-90"
              >
                <span className="text-xs text-muted-foreground shrink-0">#{event.order}</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                  {'hackathon':'bg-violet-500/10 text-violet-400 border-violet-500/30','work':'bg-blue-500/10 text-blue-400 border-blue-500/30','freelancing':'bg-emerald-500/10 text-emerald-400 border-emerald-500/30','college':'bg-amber-500/10 text-amber-400 border-amber-500/30','project':'bg-pink-500/10 text-pink-400 border-pink-500/30','enjoyment':'bg-orange-500/10 text-orange-400 border-orange-500/30'}[event.type] || 'bg-pink-500/10 text-pink-400 border-pink-500/30'
                }`}>
                  {({'hackathon':'Hackathon','work':'Work','freelancing':'Freelance','college':'Education','project':'Project','enjoyment':'Life'})[event.type] || event.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{event.title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0" onPointerDown={e => e.stopPropagation()}>
                  <Link href={`/admin/timeline/${event.id}/edit`}>
                    <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SortableTimeline
            events={events}
            setEvents={setEvents}
            onToggle={toggleField}
            onDeleteRequest={setDeleteTarget}
            deleting={deleting}
          />
        )
      )}
    </div>
  );
}
