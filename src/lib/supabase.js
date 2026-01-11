// Supabase client configuration
// This will be properly configured when you add environment variables

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Export a dummy client for now to prevent build errors
export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  }),
};

// TODO: Replace with actual Supabase client when environment variables are added
// import { createClient } from '@supabase/supabase-js';
// export const supabase = createClient(supabaseUrl, supabaseKey);
