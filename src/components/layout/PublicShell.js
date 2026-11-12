'use client';
/**
 * PublicShell — wraps Navbar + Footer and mounts the in-context AdminDock & DrawerHost.
 * Only renders Navbar and Footer when the current path is NOT a legacy /admin route.
 * Dynamically mounts AdminDock and DrawerHost only when authenticated as admin.
 */
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAdminMode } from '@/context/AdminModeContext';

const AdminDock = dynamic(() => import('@/components/admin/AdminDock'), {
  ssr: false,
});
const DrawerHost = dynamic(() => import('@/components/admin/DrawerHost'), {
  ssr: false,
});

export default function PublicShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isHome = pathname === '/';
  const { isAdmin } = useAdminMode();

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main
        id="main-content"
        className={!isAdminRoute ? (isHome ? 'relative z-10' : 'pt-24 sm:pt-28 relative z-10') : ''}
      >
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && isAdmin && (
        <>
          <AdminDock />
          <DrawerHost />
        </>
      )}
    </>
  );
}
