/**
 * /api/admin/profile
 * GET   — return current profile_settings row
 * PATCH — update profile_settings row (requires x-admin-secret header)
 *
 * DB columns: id, name, title, description, resume_url,
 *   github_url, linkedin_url, twitter_url, form_endpoint, image_url,
 *   about_bio, about_location, about_email, about_availability,
 *   about_highlights (jsonb), created_at, updated_at
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

    // Auto-seed blank row if table is empty
    if (!data) {
      const { data: seeded, error: seedError } = await client
        .from('profile_settings')
        .insert({
          name: '', title: '', description: '',
          image_url: null, resume_url: null,
          github_url: null, linkedin_url: null,
          twitter_url: null, form_endpoint: null,
          about_bio: null, about_location: null,
          about_email: null, about_availability: null,
          about_highlights: null,
        })
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
    const {
      id,
      // Hero fields
      name, title, description, image_url,
      resume_url, github_url, linkedin_url, twitter_url, form_endpoint,
      // About fields
      about_bio, about_location, about_email,
      about_availability, about_highlights,
    } = body;

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const updates = { updated_at: new Date().toISOString() };

    // Hero fields
    if (name          !== undefined) updates.name          = name;
    if (title         !== undefined) updates.title         = title;
    if (description   !== undefined) updates.description   = description;
    if (image_url     !== undefined) updates.image_url     = image_url;
    if (resume_url    !== undefined) updates.resume_url    = resume_url;
    if (github_url    !== undefined) updates.github_url    = github_url;
    if (linkedin_url  !== undefined) updates.linkedin_url  = linkedin_url;
    if (twitter_url   !== undefined) updates.twitter_url   = twitter_url;
    if (form_endpoint !== undefined) updates.form_endpoint = form_endpoint;

    // About fields
    if (about_bio          !== undefined) updates.about_bio          = about_bio;
    if (about_location     !== undefined) updates.about_location     = about_location;
    if (about_email        !== undefined) updates.about_email        = about_email;
    if (about_availability !== undefined) updates.about_availability = about_availability;
    if (about_highlights   !== undefined) updates.about_highlights   = about_highlights;

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
