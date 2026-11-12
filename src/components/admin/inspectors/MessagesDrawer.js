'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import InspectorDrawer from '../InspectorDrawer';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import {
  MessageSquare,
  Mail,
  MailOpen,
  Calendar,
  Trash2,
  Archive,
  Reply,
  CheckCircle,
  Loader2,
  Search,
  Filter,
} from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function MessagesDrawer({ onClose }) {
  const { refreshUnreadCount, showToast } = useAdminMode();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all'); // 'all', 'unread', 'read', 'archived'
  const [search, setSearch]     = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.warn('Failed to load contact messages:', err);
      showToast('Failed to load contact inquiries', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleToggleRead = async (msg) => {
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m))
    );

    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', msg.id);

      if (error) throw error;
      refreshUnreadCount();
      showToast(nextStatus === 'read' ? 'Marked as read' : 'Marked as unread', 'info');
    } catch (err) {
      // rollback
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: msg.status } : m))
      );
      showToast('Failed to update status', 'error');
    }
  };

  const handleArchive = async (msg) => {
    const nextStatus = msg.status === 'archived' ? 'read' : 'archived';
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m))
    );

    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', msg.id);

      if (error) throw error;
      refreshUnreadCount();
      showToast(nextStatus === 'archived' ? 'Message archived' : 'Message unarchived', 'info');
    } catch (err) {
      // rollback
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: msg.status } : m))
      );
      showToast('Failed to archive', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
      refreshUnreadCount();
      showToast('Message deleted', 'info');
    } catch (err) {
      showToast('Failed to delete message', 'error');
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filter === 'unread' && m.status !== 'unread') return false;
      if (filter === 'read' && m.status !== 'read') return false;
      if (filter === 'archived' && m.status !== 'archived') return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q)
      );
    });
  }, [messages, filter, search]);

  const unreadTotal = useMemo(() => {
    return messages.filter((m) => m.status === 'unread').length;
  }, [messages]);

  return (
    <InspectorDrawer
      title="Contact Inquiries Inbox"
      description="Review and respond to client inquiries and recruiters in-context."
      icon={MessageSquare}
      isOpen={true}
      onClose={onClose}
    >
      {/* Subheader: Filter pills + Search */}
      <div className="space-y-3 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10">
            {['all', 'unread', 'read', 'archived'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-code uppercase transition-all ${
                  filter === f
                    ? 'bg-primary text-black font-bold'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {f}
                {f === 'unread' && unreadTotal > 0 && (
                  <span className="ml-1 px-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                    {unreadTotal}
                  </span>
                )}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono-code text-muted-foreground">
            {filteredMessages.length} {filteredMessages.length === 1 ? 'Message' : 'Messages'}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or message keyword..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0f0f15] border border-white/10 text-white text-xs font-mono-code focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Messages Feed */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Loader2 size={20} className="animate-spin text-primary" />
          <span className="text-xs font-mono-code">Loading inbox…</span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-16 text-center text-xs font-mono-code text-muted-foreground border border-dashed border-white/10 rounded-2xl p-6">
          No inquiries found matching current filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const isUnread = msg.status === 'unread';
            const isArchived = msg.status === 'archived';

            return (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUnread
                    ? 'bg-[#0f111a] border-primary/30 shadow-lg shadow-primary/5'
                    : 'bg-[#0a0a0e] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white tracking-tight">{msg.name}</span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Unread" />
                      )}
                      {isArchived && (
                        <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] font-mono-code text-zinc-400">
                          Archived
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-primary hover:underline font-mono-code flex items-center gap-1 mt-0.5"
                    >
                      <Mail size={11} />
                      <span>{msg.email}</span>
                    </a>
                  </div>

                  <span className="text-[10px] font-mono-code text-muted-foreground whitespace-nowrap">
                    {formatDate(msg.created_at)}
                  </span>
                </div>

                {/* Message Body */}
                <p className="text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap bg-black/40 p-3 rounded-lg border border-white/5 my-3">
                  {msg.message}
                </p>

                {/* Quick Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleRead(msg)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-[11px] font-mono-code transition-colors"
                      title={isUnread ? 'Mark as read' : 'Mark as unread'}
                    >
                      {isUnread ? <MailOpen size={12} /> : <Mail size={12} />}
                      <span>{isUnread ? 'Mark Read' : 'Mark Unread'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleArchive(msg)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-[11px] font-mono-code transition-colors"
                      title={isArchived ? 'Move to inbox' : 'Archive message'}
                    >
                      <Archive size={12} />
                      <span>{isArchived ? 'Unarchive' : 'Archive'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=${encodeURIComponent(
                        'Re: Portfolio Inquiry'
                      )}`}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-mono-code font-bold transition-colors"
                      title="Reply via Email"
                    >
                      <Reply size={12} />
                      <span>Reply</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDelete(msg.id)}
                      className="p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </InspectorDrawer>
  );
}
