import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const secret = process.env.ADMIN_SECRET;

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// GET — fetch single coding_profiles row
export async function GET() {
  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from('coding_profiles')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — upsert coding_profiles row
export async function PATCH(request) {
  if (request.headers.get('x-admin-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const supabase = adminClient();

    // Fetch existing row to get id (needed for upsert)
    const { data: existing } = await supabase
      .from('coding_profiles')
      .select('id')
      .limit(1)
      .maybeSingle();

    const payload = {
      ...(existing?.id ? { id: existing.id } : {}),
      github_username:     body.github_username     ?? null,
      github_display:      body.github_display      ?? true,
      leetcode_username:   body.leetcode_username   ?? null,
      leetcode_display:    body.leetcode_display    ?? true,
      hackerrank_username: body.hackerrank_username ?? null,
      hackerrank_display:  body.hackerrank_display  ?? true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('coding_profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
