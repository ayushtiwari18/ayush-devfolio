'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const AdminModeContext = createContext(null);

export function AdminModeProvider({ children }) {
  const [user, setUser] = useState(null);
  const [editMode, setEditModeState] = useState(true);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [toastTimer, setToastTimer] = useState(null);

  const isAdmin = Boolean(user);

  // In-context toast notification
  const showToast = useCallback((message, type = 'info', duration = 3200) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, duration);
    setToastTimer(timer);
  }, [toastTimer]);

  // Fetch unread count for contact submissions
  const refreshUnreadCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      if (!error && typeof count === 'number') {
        setUnreadCount(count);
      }
    } catch (err) {
      // Non-fatal, unread counter remains unchanged
      console.warn('Failed to fetch unread messages count:', err?.message);
    }
  }, []);

  // Sync edit mode with localStorage preference
  const setEditMode = useCallback((val) => {
    const nextVal = Boolean(val);
    setEditModeState(nextVal);
    try {
      localStorage.setItem('admin_edit_mode', nextVal ? 'true' : 'false');
    } catch (_) {}
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditModeState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_edit_mode', next ? 'true' : 'false');
      } catch (_) {}
      return next;
    });
  }, []);

  const openDrawer = useCallback((id, data = null) => {
    setActiveDrawer({ id, data });
  }, []);

  const closeDrawer = useCallback(() => {
    setActiveDrawer(null);
  }, []);

  const openLoginModal = useCallback(() => {
    setLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setLoginModalOpen(false);
  }, []);

  // Supabase Auth listener
  useEffect(() => {
    let mounted = true;

    // Load initial stored editMode preference
    try {
      const stored = localStorage.getItem('admin_edit_mode');
      if (stored !== null) {
        setEditModeState(stored === 'true');
      }
    } catch (_) {}

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        refreshUnreadCount();
      } else {
        setUser(null);
      }
    }).catch(() => {
      if (mounted) setUser(null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        if (event === 'SIGNED_IN') {
          showToast('Authenticated as Admin — In-Context CMS Ready', 'success');
          refreshUnreadCount();
        }
      } else {
        setUser(null);
        setActiveDrawer(null);
        if (event === 'SIGNED_OUT') {
          showToast('Signed out from Admin Mode', 'info');
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [refreshUnreadCount, showToast]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setActiveDrawer(null);
      setEditModeState(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  const value = {
    user,
    isAdmin,
    editMode: isAdmin && editMode,
    activeDrawer,
    unreadCount,
    loginModalOpen,
    toast,
    toggleEditMode,
    setEditMode,
    openDrawer,
    closeDrawer,
    openLoginModal,
    closeLoginModal,
    showToast,
    logout,
    refreshUnreadCount,
  };

  return (
    <AdminModeContext.Provider value={value}>
      {children}
      {/* Lightweight in-context toast container */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[10000] pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-black/85 backdrop-blur-md shadow-2xl shadow-primary/20 text-sm font-medium text-white transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-primary animate-pulse'}`} />
          <span>{toast.message}</span>
        </div>
      )}
    </AdminModeContext.Provider>
  );
}

export function useAdminMode() {
  const context = useContext(AdminModeContext);
  if (!context) {
    throw new Error('useAdminMode must be used within an AdminModeProvider');
  }
  return context;
}
