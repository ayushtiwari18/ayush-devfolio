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
        // Strip cache option if it exists to avoid conflicts
        const { cache, ...restOptions } = options;
        return fetch(url, { 
          ...restOptions, 
          next: { revalidate: 60 } 
        });
      },
    },
  }
);
