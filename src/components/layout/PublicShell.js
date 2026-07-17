'use client';
/**
 * PublicShell — wraps Navbar + Footer.
 * Only renders them when the current path is NOT /admin.
 */
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PublicShell({ children }) {
  const pathname = usePathname();
  const isAdmin  = pathname?.startsWith('/admin');
  
  // Remove top padding and footer for cinematic full-bleed routes
  const isFullBleed = pathname?.startsWith('/events/') && pathname !== '/events';

  return (
    <>
      {!isAdmin && <Navbar />}
      <main
        id="main-content"
        className={!isAdmin ? (isFullBleed ? 'relative z-10' : 'pt-16 relative z-10') : ''}
      >
        {children}
      </main>
      {!isAdmin && !isFullBleed && <Footer />}
    </>
  );
}
