/**
 * /api/admin/profile
 * GET   — return current profile_settings row
 * PATCH — update profile_settings row (requires x-admin-secret header)
 */
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminSecret = process.env.ADMIN_SECRET || 'change-me-in-env';

function serviceClient() {
  return createClient(supabaseUrl, serviceKey || anonKey);
}

export async function GET() {
  try {
    const client = serviceClient();
    let { data, error } = await client
      .from('profile_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Auto-seed a blank row if the table is empty
    if (!data) {
      const { data: seeded, error: seedError } = await client
        .from('profile_settings')
        .insert({ name: '', title: '', description: '', image_url: null })
        .select()
        .single();
      if (seedError) return NextResponse.json({ error: seedError.message }, { status: 500 });
      data = seeded;
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(request) {
  const authHeader = request.headers.get('x-admin-secret');
  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, title, description, image_url, email, github, linkedin, twitter, website } = body;

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const updates = { updated_at: new Date().toISOString() };
    if (name        !== undefined) updates.name        = name;
    if (title       !== undefined) updates.title       = title;
    if (description !== undefined) updates.description = description;
    if (image_url   !== undefined) updates.image_url   = image_url;
    // Social fields
    if (email       !== undefined) updates.email       = email;
    if (github      !== undefined) updates.github      = github;
    if (linkedin    !== undefined) updates.linkedin    = linkedin;
    if (twitter     !== undefined) updates.twitter     = twitter;
    if (website     !== undefined) updates.website     = website;

    const { data, error } = await serviceClient()
      .from('profile_settings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    revalidatePath('/');
    revalidatePath('/about');

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
