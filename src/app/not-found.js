/**
 * M3 FIX: Branded 404 page.
 * Next.js App Router uses this automatically for any unmatched route.
 * No 'use client' needed — this is a Server Component by default.
 */

import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found | Ayush Tiwari',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-primary/10 transition-colors"
          >
            View Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
