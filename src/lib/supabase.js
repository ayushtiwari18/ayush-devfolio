import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '⚠️ Supabase env vars missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
  );
}

/**
 * Supabase client with Next.js fetch cache disabled.
 *
 * WHY: Next.js App Router intercepts ALL fetch() calls and caches them
 * with cache: 'force-cache' by default — even when revalidate=0 is set
 * on the page. This means Supabase queries were being served from
 * Next.js's Data Cache instead of hitting the live DB.
 *
 * FIX: cache: 'no-store' tells Next.js to always bypass its fetch
 * cache for every Supabase request, so new DB content is always live.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    global: {
      fetch: (url, options = {}) =>
        fetch(url, { ...options, cache: 'no-store' }),
    },
  }
);
