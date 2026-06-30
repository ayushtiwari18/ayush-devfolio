'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const DISMISSED_KEY = 'pwa-install-dismissed';

export default function PWAInstallPrompt() {
  const [prompt, setPrompt]     = useState(null);
  const [visible, setVisible]   = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed as PWA — never show
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }
    // User already dismissed — never show again
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      // Small delay so it doesn't pop up instantly on page load
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  };

  if (!visible || installed) return null;

  return (
    <div
      role="dialog"
      aria-label="Install Ayush Tiwari Portfolio app"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] w-[calc(100%-2rem)] max-w-sm"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 p-4 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-300">
        {/* App icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
          <span className="text-2xl">🚀</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground leading-tight">Install App</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Add to home screen for instant access
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-lg transition-colors"
          >
            <Download size={13} /> Install
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss install prompt"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
