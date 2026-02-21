'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import TimelineEventForm from '@/components/admin/TimelineEventForm';

export default function NewTimelineEventPage() {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError(null);
    try {
      const { error: sbError } = await supabase
        .from('timeline_events')
        .insert([formData]);
      if (sbError) throw sbError;
      router.push('/admin/timeline');
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/timeline">
          <Button variant="outline" size="sm"><ArrowLeft size={16} /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">New Timeline Event</h1>
          <p className="text-muted-foreground text-sm">Fill in the details and save.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <TimelineEventForm
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel={
          saving ? (
            <><Loader2 size={16} className="animate-spin mr-2" /> Saving…</>
          ) : (
            <><Save size={16} className="mr-2" /> Save Event</>
          )
        }
      />
    </div>
  );
}
