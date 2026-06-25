/**
 * /api/admin/upload
 * POST multipart/form-data with field "file" (image)
 * → uploads to Supabase Storage bucket "avatars"
 * → returns { url: "<public URL>" }
 *
 * Requires:
 *  - x-admin-secret header matching ADMIN_SECRET env var
 *  - SUPABASE_SERVICE_ROLE_KEY env var (service role bypasses Storage RLS)
 *  - A PUBLIC bucket named "avatars" in Supabase Storage
 */
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey      = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminSecret  = process.env.ADMIN_SECRET || 'change-me-in-env';

const BUCKET        = 'avatars';
const MAX_BYTES     = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request) {
  // 1. Auth check
  const authHeader = request.headers.get('x-admin-secret');
  if (authHeader !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Guard: service key required for Storage uploads
  if (!serviceKey) {
    console.error('[upload] SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    return NextResponse.json(
      { error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is missing. Add it to .env.local and restart.' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP or GIF allowed' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 });
    }

    const ext      = file.type.split('/')[1].replace('jpeg', 'jpg');
    const fileName = `profile-${Date.now()}.${ext}`;

    // Use service role key — bypasses Storage RLS
    const client = createClient(supabaseUrl, serviceKey);

    const { error: uploadError } = await client.storage
      .from(BUCKET)
      .upload(fileName, arrayBuffer, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error('[upload] Supabase Storage error:', uploadError);
      return NextResponse.json(
        { error: `Storage error: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: { publicUrl } } = client.storage.from(BUCKET).getPublicUrl(fileName);
    return NextResponse.json({ url: publicUrl });

  } catch (err) {
    console.error('[upload] Unexpected error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
