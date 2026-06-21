'use client';
/**
 * AdminKeyTrigger — CLIENT COMPONENT (renders nothing)
 * -----------------------------------------------------------
 * Listens globally for a secret key combo.
 * On match: navigates silently to /admin/login.
 *
 * Combo: Ctrl + Shift + A  (all three held simultaneously)
 *
 * No UI, no hint, no visible button anywhere on the site.
 * Attach to root layout once.
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminKeyTrigger() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e) {
      // Ctrl + Shift + A  — change combo here if you prefer something else
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        router.push('/admin/login');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Renders nothing — purely a side-effect component
  return null;
}
