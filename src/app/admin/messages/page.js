'use client';

import { useEffect, useState } from 'react';
import {
  Mail, MailOpen, Search, Trash2, Archive,
  Filter, Calendar, CheckCircle, Loader2, AlertCircle, ArchiveRestore,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { supabase } from '@/lib/supabase';

const STATUS_FILTERS = ['all', 'unread', 'read', 'archived'];

export default function AdminMessagesPage() {
  const [messages, setMessages]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('all');
  const [actionId, setActionId]     = useState(null); // tracks in-progress row
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]     = useState(false);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setActionId(id);
    try {
      const patch = { status: newStatus };
      if (newStatus === 'read') patch.responded_at = new Date().toISOString();
      const { error } = await supabase.from('contact_messages').update(patch).eq('id', id);
      if (error) throw error;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleConfirmedDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      setMessages(prev => prev.filter(m => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = messages.filter(m => {
    const matchFilter =
      filter === 'all' ||
      m.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <AlertCircle className="text-destructive" size={40} />
      <p className="text-destructive">{error}</p>
      <Button onClick={fetchMessages} variant="outline">Try Again</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Message?"
        description={deleteTarget ? `Message from "${deleteTarget.name}" will be permanently removed.` : ''}
        confirmLabel="Delete Message"
        danger
        loading={deleting}
        onConfirm={handleConfirmedDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">
            {messages.length} total &mdash; {unreadCount} unread
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, subject, message..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary capitalize"
            >
              {STATUS_FILTERS.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Messages' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {messages.length === 0 ? 'No Messages Yet' : 'No Matching Messages'}
            </h3>
            <p className="text-muted-foreground">
              {messages.length === 0
                ? 'Messages from your contact form will appear here.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(message => {
            const isUnread   = message.status === 'unread';
            const isArchived = message.status === 'archived';
            const isBusy     = actionId === message.id;

            return (
              <div
                key={message.id}
                className={`bg-card border rounded-xl p-6 transition-all ${
                  isUnread    ? 'border-primary/50 bg-primary/5' :
                  isArchived  ? 'border-border opacity-60' :
                  'border-border'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isUnread ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    {isUnread
                      ? <Mail className="text-primary" size={20} />
                      : <MailOpen className="text-muted-foreground" size={20} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className={`font-bold text-foreground ${isUnread ? 'text-primary' : ''}`}>
                            {message.name}
                          </h3>
                          {isUnread && (
                            <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">New</span>
                          )}
                          {isArchived && (
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-bold rounded-full">Archived</span>
                          )}
                          {message.subject && (
                            <span className="px-2 py-0.5 bg-accent/20 text-accent-foreground text-xs rounded-full truncate max-w-[200px]">
                              {message.subject}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{message.email}</p>
                        <p className="text-foreground leading-relaxed">{message.message}</p>
                      </div>

                      {/* Date */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          <span>{new Date(message.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border flex-wrap">
                      {isUnread && (
                        <Button variant="outline" size="sm"
                          disabled={isBusy}
                          onClick={() => updateStatus(message.id, 'read')}
                          className="border-primary text-primary hover:bg-primary/10">
                          {isBusy ? <Loader2 size={14} className="animate-spin mr-2" /> : <CheckCircle size={14} className="mr-2" />}
                          Mark as Read
                        </Button>
                      )}
                      {!isArchived ? (
                        <Button variant="outline" size="sm"
                          disabled={isBusy}
                          onClick={() => updateStatus(message.id, 'archived')}
                          className="hover:bg-muted">
                          {isBusy ? <Loader2 size={14} className="animate-spin mr-2" /> : <Archive size={14} className="mr-2" />}
                          Archive
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm"
                          disabled={isBusy}
                          onClick={() => updateStatus(message.id, 'read')}
                          className="hover:bg-muted">
                          {isBusy ? <Loader2 size={14} className="animate-spin mr-2" /> : <ArchiveRestore size={14} className="mr-2" />}
                          Unarchive
                        </Button>
                      )}
                      <Button variant="outline" size="sm"
                        onClick={() => setDeleteTarget({ id: message.id, name: message.name })}
                        className="border-red-500 text-red-500 hover:bg-red-500/10">
                        <Trash2 size={14} className="mr-2" />Delete
                      </Button>
                      <a href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || 'Your message')}`}
                        className="ml-auto"
                        onClick={() => isUnread && updateStatus(message.id, 'read')}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">Reply</Button>
                      </a>
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
