'use client';

/**
 * M3 FIX: Branded error boundary for all uncaught runtime errors.
 * Next.js App Router automatically uses this file as the error UI
 * when a Server Component throws or a Client Component crashes.
 */

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">⚠️</div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          An unexpected error occurred. This has been logged and we&apos;ll look into it.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-border text-foreground font-semibold rounded-xl hover:bg-primary/10 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
