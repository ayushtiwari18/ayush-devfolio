'use client';
/**
 * AdminKeyTrigger
 * ---------------------------------------------------------------
 * Secret combo: Ctrl + Shift + A
 * → Opens a floating login modal ON TOP of the current page.
 * → On success → activates Admin Mode in-place without page redirect.
 * ---------------------------------------------------------------
 */
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAdminMode } from '@/context/AdminModeContext';
import { Loader2, Lock, X, Eye, EyeOff } from 'lucide-react';

export default function AdminKeyTrigger() {
  const router = useRouter();
  const pathname = usePathname();
  const { loginModalOpen, openLoginModal, closeLoginModal, setEditMode, showToast } = useAdminMode();

  const [localOpen, setLocalOpen] = useState(false);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const emailRef = useRef(null);

  const isOpen = loginModalOpen || localOpen;

  const handleClose = () => {
    setLocalOpen(false);
    closeLoginModal();
    setError('');
  };

  // ── Secret key combo listener (Ctrl + Shift + A) ─────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        openLoginModal();
        setLocalOpen(true);
        setError('');
        setEmail('');
        setPassword('');
      }
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openLoginModal]);

  // Focus email input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => emailRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // ── Login handler ────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;

      handleClose();
      setEditMode(true);
      showToast('Admin Mode Active — In-Context CMS Ready', 'success');

      // If user logged in while on legacy /admin/login, redirect to public home
      if (pathname === '/admin/login') {
        router.push('/');
      }
    } catch (err) {
      setError(err?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/75 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed z-[9999] inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-sm bg-card border border-border/70 rounded-2xl shadow-2xl shadow-black/60 p-8 relative animate-in fade-in zoom-in-95 duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
            aria-label="Close admin login modal"
          >
            <X size={16} />
          </button>

          {/* Icon + heading */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center mb-4 ring-8 ring-primary/5">
              <Lock size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Admin Authentication</h2>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Sign in to enable in-context editing & site controls
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5">
                Admin Email
              </label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
                className="w-full px-3.5 py-2.5 bg-background/80 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full px-3.5 py-2.5 bg-background/80 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition p-1"
                  tabIndex={-1}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg font-mono-code">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating…</span>
                </>
              ) : (
                'Enable Admin Mode'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
