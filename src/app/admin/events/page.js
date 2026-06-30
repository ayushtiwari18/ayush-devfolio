'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Edit, Trash2, Zap,
  Calendar, MapPin, Trophy, Loader2, AlertCircle, Eye, EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { getAllEvents, deleteEvent, toggleEventPublished } from '@/services/events.service';

const TYPE_CONFIG = {
  hackathon:   { label: 'Hackathon',   color: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  conference:  { label: 'Conference',  color: 'bg-blue-500/15   text-blue-400   border-blue-500/30'   },
  workshop:    { label: 'Workshop',    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  fest:        { label: 'Fest',        color: 'bg-pink-500/15   text-pink-400   border-pink-500/30'   },
  competition: { label: 'Competition', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  other:       { label: 'Event',       color: 'bg-primary/15    text-primary    border-primary/30'    },
};

export default function AdminEventsPage() {
  const [events,      setEvents]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState('');
  const [deletingId,  setDeletingId]  = useState(null);
  const [togglingId,  setTogglingId]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true); setError(null);
    try {
      setEvents(await getAllEvents());
    } catch (err) {
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteEvent(deleteTarget.id);
      setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch { alert('Failed to delete. Please try again.'); }
    finally { setDeletingId(null); }
  };

  const handleTogglePublish = async (event) => {
    setTogglingId(event.id);
    try {
      const updated = await toggleEventPublished(event.id, !event.published);
      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, published: updated.published } : e));
    } catch { alert('Failed to update.'); }
    finally { setTogglingId(null); }
  };

  const filtered = events.filter(e =>
    !search ||
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.organizer?.toLowerCase().includes(search.toLowerCase()) ||
    e.result?.toLowerCase().includes(search.toLowerCase()) ||
    e.type?.toLowerCase().includes(search.toLowerCase())
  );

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
        title="Delete Event?"
        description={deleteTarget ? `"${deleteTarget.title}" will be permanently removed. This cannot be undone.` : ''}
        confirmLabel="Delete Event"
        danger
        loading={!!deletingId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground">{filtered.length} of {events.length} events</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />Add Event
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, organizer, result, or type..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {events.length === 0 ? 'No Events Yet' : 'No Matching Events'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {events.length === 0 ? 'Add your hackathons, conferences, and tech events.' : 'Try adjusting your search.'}
            </p>
            {events.length === 0 && (
              <Link href="/admin/events/new">
                <Button className="bg-primary hover:bg-primary/90"><Plus className="mr-2" size={18} />Add First Event</Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(event => {
            const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.other;
            const isWinner = event.result?.toLowerCase().includes('win') ||
              event.result?.toLowerCase().includes('1st') ||
              event.result?.toLowerCase().includes('first');

            return (
              <div key={event.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all">
                <div className="flex flex-col md:flex-row">

                  {/* Cover image */}
                  <div className="relative w-full md:w-56 h-40 bg-muted flex-shrink-0">
                    {event.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.cover_image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={e => { e.currentTarget.style.display='none'; }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Zap size={32} className="text-primary/40" />
                      </div>
                    )}
                    {isWinner && (
                      <div className="absolute top-2 right-2 bg-yellow-500 p-1.5 rounded-full">
                        <Trophy className="text-white" size={14} />
                      </div>
                    )}
                    {/* Published indicator */}
                    <div className={`absolute bottom-2 left-2 w-2 h-2 rounded-full ${
                      event.published ? 'bg-emerald-500' : 'bg-zinc-500'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${cfg.color}`}>{cfg.label}</span>
                        {event.result && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            isWinner ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
                                     : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                          }`}>{event.result}</span>
                        )}
                        {!event.published && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full border bg-zinc-500/15 text-zinc-400 border-zinc-500/30">Draft</span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-1">{event.title}</h3>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      {event.date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1"><MapPin size={11} />{event.location}</span>
                      )}
                      {event.organizer && (
                        <span className="text-muted-foreground/70">{event.organizer}</span>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{event.description}</p>
                    )}

                    {/* Tech chips */}
                    {event.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {event.technologies.slice(0, 5).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full border border-primary/20">{t}</span>
                        ))}
                        {event.technologies.length > 5 && (
                          <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-full">+{event.technologies.length - 5}</span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                          <Edit size={14} className="mr-1.5" />Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline" size="sm"
                        disabled={togglingId === event.id}
                        onClick={() => handleTogglePublish(event)}
                        className={event.published
                          ? 'border-zinc-500 text-zinc-400 hover:bg-zinc-500/10'
                          : 'border-emerald-500 text-emerald-500 hover:bg-emerald-500/10'}
                      >
                        {togglingId === event.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : event.published
                            ? <><EyeOff size={14} className="mr-1" />Unpublish</>
                            : <><Eye size={14} className="mr-1" />Publish</>
                        }
                      </Button>
                      <Button
                        variant="outline" size="sm"
                        disabled={deletingId === event.id}
                        onClick={() => setDeleteTarget({ id: event.id, title: event.title })}
                        className="border-red-500 text-red-500 hover:bg-red-500/10"
                      >
                        {deletingId === event.id
                          ? <Loader2 size={14} className="animate-spin" />
                          : <Trash2 size={14} />
                        }
                      </Button>
                      <Link href={`/events/${event.slug}`} target="_blank">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs">
                          Preview ↗
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
