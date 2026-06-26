'use client';
/**
 * AdminKeyTrigger
 * ---------------------------------------------------------------
 * Secret combo: Ctrl + Shift + A  (change below if you want)
 * → Opens a floating login modal ON TOP of the current page.
 * → No navigation, no visible hint, no button anywhere.
 * → On success → redirects to /admin/dashboard
 * ---------------------------------------------------------------
 */
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, X, Eye, EyeOff } from 'lucide-react';

export default function AdminKeyTrigger() {
  const router = useRouter();
  const [open,      setOpen]      = useState(false);
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const emailRef = useRef(null);

  // ── Secret key combo listener ────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setOpen(true);
        setError('');
        setEmail('');
        setPassword('');
      }
      // Escape closes
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus email input when modal opens
  useEffect(() => {
    if (open) setTimeout(() => emailRef.current?.focus(), 80);
  }, [open]);

  // ── Login handler ────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      setOpen(false);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="fixed z-[9999] inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 p-8 relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X size={16} />
          </button>

          {/* Icon + heading */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Lock size={26} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Admin Access</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage your portfolio</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 mt-1"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" />Signing in…</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
