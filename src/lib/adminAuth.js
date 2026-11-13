import { createClient } from '@supabase/supabase-js';

/**
 * Verifies admin authorization from incoming request:
 * 1. Checks Supabase JWT session (Authorization: Bearer <jwt> or auth cookie)
 * 2. Checks server-side x-admin-secret header against process.env.ADMIN_SECRET
 */
export async function verifyAdminAuth(request) {
  // 1. Check server secret (for CLI/scripts)
  const serverSecret = process.env.ADMIN_SECRET;
  const headerSecret = request.headers.get('x-admin-secret');
  if (serverSecret && headerSecret === serverSecret) {
    return true;
  }

  // 2. Extract Bearer token
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 3. Fallback to Supabase auth cookie
  if (!token) {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = /sb-[a-zA-Z0-9]+-auth-token=([^;]+)/.exec(cookieHeader);
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        token = Array.isArray(parsed) ? parsed[0] : parsed?.access_token;
      } catch {
        // invalid cookie format
      }
    }
  }

  if (!token) {
    return false;
  }

  // 4. Validate JWT with Supabase Auth
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonOrServiceKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !anonOrServiceKey) return false;

    const supabase = createClient(supabaseUrl, anonOrServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return !error && Boolean(user);
  } catch (err) {
    console.error('verifyAdminAuth exception:', err);
    return false;
  }
}
