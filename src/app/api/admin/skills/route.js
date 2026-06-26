import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const secret = process.env.ADMIN_SECRET;

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// GET — list all skills ordered by category then name
export async function GET() {
  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category')
      .order('name');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — add a new skill
export async function POST(request) {
  if (request.headers.get('x-admin-secret') !== secret)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { name, icon, category, level } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 });
    const supabase = adminClient();
    const { data, error } = await supabase
      .from('skills')
      .insert({ name: name.trim(), icon: icon?.trim() || null, category: category || 'other', level: level ?? 80 })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — update level (or any field) of a skill
export async function PATCH(request) {
  if (request.headers.get('x-admin-secret') !== secret)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, ...fields } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const supabase = adminClient();
    const { data, error } = await supabase
      .from('skills')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove a skill by id
export async function DELETE(request) {
  if (request.headers.get('x-admin-secret') !== secret)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const supabase = adminClient();
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
