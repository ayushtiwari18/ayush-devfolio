/**
 * supabase-admin.js — SERVER ONLY. Never import in 'use client' files.
 *
 * B7 FIX: Admin mutations (create/update/delete rows) should use the
 * service role key, NOT the public anon key. The anon key is governed
 * by Supabase RLS policies — the service role key bypasses RLS entirely,
 * which is correct for trusted server-side admin operations.
 *
 * Setup:
 *   1. Go to Supabase Dashboard → Project Settings → API
 *   2. Copy the "service_role" secret key
 *   3. Add to Vercel: SUPABASE_SERVICE_ROLE_KEY=<your-key>
 *      !! Do NOT prefix with NEXT_PUBLIC_ — this must stay server-only
 *
 * Usage (in Server Components and API routes ONLY):
 *   import { supabaseAdmin } from '@/lib/supabase-admin';
 *   await supabaseAdmin.from('projects').insert({ ... });
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey && process.env.NODE_ENV === 'production') {
  console.error(
    '🚨 SUPABASE_SERVICE_ROLE_KEY is not set. Admin mutations will fail or fall back to anon key.'
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
