'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import TimelineEventForm from '@/components/admin/TimelineEventForm';

export default function EditTimelineEventPage() {
  const router     = useRouter();
  const { id }     = useParams();
  const [event,   setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const { data, error: sbError } = await supabase
          .from('timeline_events')
          .select('*')
          .eq('id', id)
          .single();
        if (sbError) throw sbError;
        setEvent(data);
      } catch (err) {
        setError('Event not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError(null);
    try {
      const { error: sbError } = await supabase
        .from('timeline_events')
        .update(formData)
        .eq('id', id);
      if (sbError) throw sbError;
      router.push('/admin/timeline');
    } catch (err) {
      setError(err.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/timeline">
          <Button variant="outline" size="sm"><ArrowLeft size={16} /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Event</h1>
          <p className="text-muted-foreground text-sm line-clamp-1">{event?.title}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {event && (
        <TimelineEventForm
          initialData={event}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel={
            saving ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Saving…</>
            ) : (
              <><Save size={16} className="mr-2" /> Update Event</>
            )
          }
        />
      )}
    </div>
  );
}
