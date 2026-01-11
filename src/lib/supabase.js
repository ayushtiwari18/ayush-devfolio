import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Detailed error logging
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Log configuration status (without exposing sensitive data)
console.log('✅ Supabase URL configured:', supabaseUrl);
console.log('✅ Supabase Anon Key configured:', supabaseAnonKey ? 'Yes' : 'No');
console.log('✅ Supabase Service Key configured:', supabaseServiceKey ? 'Yes' : 'No');

// Public client for browser and server-side rendering
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      'x-application-name': 'ayush-devfolio',
    },
  },
});

// Admin client for server-side operations (uses service role key if available)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-application-name': 'ayush-devfolio-admin',
      },
    },
  }
);

// Test connection helper
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('profile_settings')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Supabase connection successful');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    return { success: false, error: err.message };
  }
}
