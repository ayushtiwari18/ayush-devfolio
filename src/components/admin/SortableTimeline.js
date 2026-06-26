'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import {
  Edit, Trash2, CheckCircle, XCircle,
  Star, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatDate';
import { supabase } from '@/lib/supabase';

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

// ─── Single sortable card ────────────────────────────────────────────────────
function EventCard({ event, onToggle, onDelete, deleting, isDragOverlay = false }) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: event.id, disabled: isDragOverlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity:   isDragging ? 0.35 : 1,
    cursor:    isDragOverlay ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-card border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-colors select-none ${
        isDragging
          ? 'border-primary/60 shadow-lg'
          : isDragOverlay
          ? 'border-primary shadow-2xl ring-2 ring-primary/40'
          : 'border-border hover:border-primary/40'
      }`}
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
          <span className="ml-2 opacity-40">|</span>
          <span className="ml-2 opacity-60">#{event.order}</span>
        </p>
      </div>

      {/* Actions — stop drag propagation so clicks work */}
      <div
        className="flex items-center gap-2 shrink-0 flex-wrap"
        onPointerDown={e => e.stopPropagation()}
      >
        <button
          title={event.published ? 'Click to unpublish' : 'Click to publish'}
          onClick={() => onToggle(event.id, 'published', event.published)}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
            event.published
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
          }`}
        >
          {event.published ? <CheckCircle size={12} /> : <XCircle size={12} />}
          {event.published ? 'Live' : 'Draft'}
        </button>

        <button
          title={event.featured ? 'Remove from featured' : 'Mark as featured'}
          onClick={() => onToggle(event.id, 'featured', event.featured)}
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
            event.featured
              ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20'
              : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
          }`}
        >
          <Star size={12} fill={event.featured ? 'currentColor' : 'none'} />
          {event.featured ? 'Featured' : 'Normal'}
        </button>

        <Link href={`/admin/timeline/${event.id}/edit`}>
          <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
            <Edit size={14} />
          </Button>
        </Link>

        <Button
          size="sm" variant="outline"
          disabled={deleting === event.id}
          onClick={() => onDelete(event)}
          className="border-red-500/40 text-red-500 hover:bg-red-500/10"
        >
          {deleting === event.id
            ? <Loader2 size={14} className="animate-spin" />
            : <Trash2 size={14} />}
        </Button>
      </div>
    </div>
  );
}

// ─── Save status toast ───────────────────────────────────────────────────────
function SaveToast({ status }) {
  if (!status) return null;
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all ${
      status === 'saving' ? 'bg-primary text-white' :
      status === 'saved'  ? 'bg-emerald-500 text-white' :
      'bg-red-500 text-white'
    }`}>
      {status === 'saving' && <><Loader2 size={14} className="inline animate-spin mr-2" />Saving order…</>}
      {status === 'saved'  && '✓ Order saved'}
      {status === 'error'  && '✗ Failed to save order'}
    </div>
  );
}

// ─── Main sortable list ──────────────────────────────────────────────────────
export default function SortableTimeline({ events, setEvents, onToggle, onDeleteRequest, deleting }) {
  const [activeEvent, setActiveEvent] = useState(null);
  const [saveStatus,  setSaveStatus]  = useState(null); // 'saving' | 'saved' | 'error' | null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const persistOrder = useCallback(async (reordered) => {
    setSaveStatus('saving');
    try {
      // Only update rows whose order actually changed
      const updates = reordered
        .map((e, i) => ({ id: e.id, newOrder: i }))
        .filter(({ id, newOrder }) => {
          const original = events.find(e => e.id === id);
          return original?.order !== newOrder;
        });

      await Promise.all(
        updates.map(({ id, newOrder }) =>
          supabase.from('timeline_events').update({ order: newOrder }).eq('id', id)
        )
      );

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      console.error('Failed to persist order:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
      // Revert
      setEvents(events);
    }
  }, [events, setEvents]);

  const handleDragStart = ({ active }) => {
    setActiveEvent(events.find(e => e.id === active.id) || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveEvent(null);
    if (!over || active.id === over.id) return;

    const oldIndex = events.findIndex(e => e.id === active.id);
    const newIndex = events.findIndex(e => e.id === over.id);
    const reordered = arrayMove(events, oldIndex, newIndex)
      .map((e, i) => ({ ...e, order: i }));

    setEvents(reordered);       // optimistic
    persistOrder(reordered);    // persist
  };

  return (
    <>
      <SaveToast status={saveStatus} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={events.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onToggle={onToggle}
                onDelete={onDeleteRequest}
                deleting={deleting}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeEvent && (
            <EventCard
              event={activeEvent}
              onToggle={() => {}}
              onDelete={() => {}}
              deleting={null}
              isDragOverlay
            />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}
