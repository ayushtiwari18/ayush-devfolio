'use client';

import { useEffect } from 'react';
import PWAInstallPrompt from './PWAInstallPrompt';

export default function PWAInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(reg => {
          // Check for updates every 60 s while page is open
          setInterval(() => reg.update(), 60_000);
        })
        .catch(err => console.warn('[SW] Registration failed:', err));
    }
  }, []);

  return <PWAInstallPrompt />;
}
