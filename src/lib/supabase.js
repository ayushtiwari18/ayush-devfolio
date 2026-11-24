import { createClient } from '@supabase/supabase-js';

// Fix for Node.js 18+ Undici IPv6 timeout bug with Supabase
if (typeof window === 'undefined') {
  try {
    const dns = require('node:dns');
    dns.setDefaultResultOrder('ipv4first');
  } catch (err) {
    // ignore
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '⚠️ Supabase env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
  );
}

/**
 * Supabase client with Next.js ISR cache enabled.
 *
 * We use `next: { revalidate: 60 }` so Next.js caches the database
 * responses for 60 seconds. This makes the website load instantly (50ms)
 * and prevents the site from crashing if Supabase times out.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    global: {
      fetch: (url, options = {}) => {
        const isServer = typeof window === 'undefined' || Boolean(globalThis.__FORCE_SERVER_FETCH__);
        const method = (options.method || 'GET').toUpperCase();
        const isRead = method === 'GET' || method === 'HEAD';

        // Client-side execution or mutations (POST, PATCH, DELETE) bypass Next.js ISR cache
        if (!isServer || !isRead) {
          return fetch(url, options);
        }

        // In local development, bypass caching so database updates reflect immediately without hard refresh
        if (process.env.NODE_ENV === 'development') {
          return fetch(url, {
            ...options,
            cache: 'no-store',
          });
        }

        // Caller opted out of cache
        if (options.cache === 'no-store' || options.next?.revalidate === 0) {
          return fetch(url, options);
        }

        const { cache, ...restOptions } = options;
        return fetch(url, {
          ...restOptions,
          next: { revalidate: 60, ...(options.next || {}) },
        });
      },
    },
  }
);
