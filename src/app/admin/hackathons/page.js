'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Edit, Trash2, Trophy,
  Calendar, Users, Award, Loader2, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import FallbackImage from '@/components/ui/FallbackImage';
import { supabase } from '@/lib/supabase';

export default function AdminHackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchHackathons(); }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      setHackathons(data || []);
    } catch (err) {
      console.error('Error fetching hackathons:', err);
      setError('Failed to load hackathons.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmedDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      const { error } = await supabase.from('hackathons').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      setHackathons(prev => prev.filter(h => h.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = hackathons.filter(h =>
    !search ||
    h.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.role?.toLowerCase().includes(search.toLowerCase()) ||
    h.result?.toLowerCase().includes(search.toLowerCase())
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
      <Button onClick={fetchHackathons} variant="outline">Try Again</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Hackathon?"
        description={deleteTarget ? `"${deleteTarget.name}" will be permanently removed. This cannot be undone.` : ''}
        confirmLabel="Delete Hackathon"
        danger
        loading={!!deletingId}
        onConfirm={handleConfirmedDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hackathons</h1>
          <p className="text-muted-foreground">{filtered.length} of {hackathons.length} hackathons</p>
        </div>
        <Link href="/admin/hackathons/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2" size={18} />Add Hackathon
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
            placeholder="Search by name, role, or result..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {hackathons.length === 0 ? 'No Hackathons Yet' : 'No Matching Hackathons'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {hackathons.length === 0 ? 'Add your hackathon participations and achievements.' : 'Try adjusting your search.'}
            </p>
            {hackathons.length === 0 && (
              <Link href="/admin/hackathons/new">
                <Button className="bg-primary hover:bg-primary/90"><Plus className="mr-2" size={18} />Add First Hackathon</Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(hackathon => {
            const isWinner =
              hackathon.result?.toLowerCase().includes('winner') ||
              hackathon.result?.toLowerCase().includes('1st') ||
              hackathon.result?.toLowerCase().includes('first');
            const learnings = Array.isArray(hackathon.learnings)
              ? hackathon.learnings
              : (typeof hackathon.learnings === 'string'
                  ? (() => { try { return JSON.parse(hackathon.learnings); } catch { return []; } })()
                  : []);

            return (
              <div key={hackathon.id} className="bg-card border border-border rounded-xl overflow-hidden card-glow hover-lift transition-all">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative w-full md:w-64 h-48 bg-muted flex-shrink-0">
                    {hackathon.image ? (
                      <FallbackImage
                        src={hackathon.image}
                        alt={hackathon.name}
                        fill
                        className="object-cover"
                        unoptimized
                        fallback={
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Trophy size={40} />
                            <span className="text-xs text-center px-4">{hackathon.name}</span>
                          </div>
                        }
                        containerClassName="absolute inset-0 flex items-center justify-center bg-muted"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Trophy size={40} />
                        <span className="text-xs text-center px-4">{hackathon.name}</span>
                      </div>
                    )}
                    {isWinner && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-yellow-500 p-2 rounded-full"><Award className="text-white" size={20} /></div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-foreground">{hackathon.name}</h3>
                      {hackathon.result && (
                        <span className={`px-3 py-1 text-xs font-bold rounded-full flex-shrink-0 ${
                          isWinner
                            ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                            : 'bg-primary/10 text-primary border border-primary/20'
                        }`}>{hackathon.result}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {hackathon.date && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(hackathon.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                        </div>
                      )}
                      {hackathon.role && (
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{hackathon.role}</span>
                        </div>
                      )}
                    </div>

                    {learnings.length > 0 && (
                      <ul className="text-sm text-muted-foreground mb-4 space-y-1">
                        {learnings.slice(0, 2).map((l, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>{l}
                          </li>
                        ))}
                        {learnings.length > 2 && <li className="text-xs text-muted-foreground">+{learnings.length - 2} more</li>}
                      </ul>
                    )}

                    <div className="flex items-center gap-2">
                      <Link href={`/admin/hackathons/${hackathon.id}/edit`}>
                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                          <Edit size={14} className="mr-2" />Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline" size="sm"
                        disabled={deletingId === hackathon.id}
                        onClick={() => setDeleteTarget({ id: hackathon.id, name: hackathon.name })}
                        className="border-red-500 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deletingId === hackathon.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </Button>
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
