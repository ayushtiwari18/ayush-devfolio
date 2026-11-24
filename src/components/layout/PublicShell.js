'use client';
/**
 * PublicShell — wraps Navbar + Footer and mounts the in-context AdminDock & DrawerHost.
 * Only renders Navbar and Footer when the current path is NOT a legacy /admin route.
 * Dynamically mounts AdminDock and DrawerHost with safe error boundaries and chunk retry.
 */
import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAdminMode } from '@/context/AdminModeContext';

// Safe Error Boundary preventing any Admin Dock or DrawerHost chunk error from crashing the app
class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Admin component chunk/runtime error caught gracefully:', error?.message || error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// Resilient dynamic loader that retries chunk loading if a webpack HMR or connection error occurs
const safeDynamic = (loader) =>
  dynamic(
    () =>
      loader().catch((err) => {
        if (typeof window !== 'undefined') {
          console.warn('Admin chunk load failed, retrying once...', err?.message || err);
          return new Promise((resolve) => setTimeout(resolve, 300))
            .then(() => loader())
            .catch(() => ({ default: () => null }));
        }
        return { default: () => null };
      }),
    { ssr: false }
  );

const AdminDock = safeDynamic(() => import('@/components/admin/AdminDock'));
const DrawerHost = safeDynamic(() => import('@/components/admin/DrawerHost'));

export default function PublicShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const { isAdmin } = useAdminMode();

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div id="main-shell" className={!isAdminRoute ? 'relative z-10' : ''}>
        {children}
      </div>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && isAdmin && (
        <AdminErrorBoundary>
          <AdminDock />
          <DrawerHost />
        </AdminErrorBoundary>
      )}
    </>
  );
}
