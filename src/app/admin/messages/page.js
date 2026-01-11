import {
  Mail,
  MailOpen,
  Search,
  Trash2,
  Archive,
  Filter,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function getMessages() {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">
            {messages.length} total messages, {unreadCount} unread
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Messages</option>
            <option>Unread</option>
            <option>Read</option>
            <option>Archived</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground">
              Messages from your contact form will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => {
            const isUnread = message.status === 'unread';
            return (
              <div
                key={message.id}
                className={`bg-card border rounded-xl p-6 card-glow hover-lift transition-all cursor-pointer ${
                  isUnread ? 'border-primary/50 bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isUnread ? 'bg-primary/20' : 'bg-muted'
                    }`}
                  >
                    {isUnread ? (
                      <Mail className="text-primary" size={20} />
                    ) : (
                      <MailOpen className="text-muted-foreground" size={20} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3
                            className={`font-bold text-foreground ${
                              isUnread ? 'text-primary' : ''
                            }`}
                          >
                            {message.name}
                          </h3>
                          {isUnread && (
                            <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{message.email}</p>
                        <p className="text-foreground leading-relaxed">{message.message}</p>
                      </div>

                      {/* Date */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} />
                          <span>
                            {new Date(message.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                      {isUnread && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          <CheckCircle size={14} className="mr-2" />
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-primary/10"
                      >
                        <Archive size={14} className="mr-2" />
                        Archive
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </Button>
                      <a href={`mailto:${message.email}`} className="ml-auto">
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          Reply
                        </Button>
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
