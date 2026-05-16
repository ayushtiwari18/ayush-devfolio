/**
 * /api/admin/profile
 * GET  — return current profile_settings row (public anon read)
 * PATCH — update profile_settings row (requires ADMIN_SECRET header)
 *
 * This route uses the service-role key only for writes so RLS cannot block us.
 * The service-role key must be set as SUPABASE_SERVICE_ROLE_KEY in .env.local
 * and in Vercel project environment variables (server-only, not NEXT_PUBLIC_).
 */
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminSecret = process.env.ADMIN_SECRET || 'change-me-in-env';

export async function GET() {
  try {
    const client = createClient(supabaseUrl, anonKey);
    const { data, error } = await client
      .from('profile_settings')
      .select('*')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(request) {
  // Auth check
  const authHeader = request.headers.get('x-admin-secret');
  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, title, description, image_url } = body;

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const client = createClient(supabaseUrl, serviceKey || anonKey);
    const updates = {};
    if (name        !== undefined) updates.name        = name;
    if (title       !== undefined) updates.title       = title;
    if (description !== undefined) updates.description = description;
    if (image_url   !== undefined) updates.image_url   = image_url;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await client
      .from('profile_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Bust Next.js cache so hero reflects new content on next page load
    revalidatePath('/');
    revalidatePath('/about');

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
