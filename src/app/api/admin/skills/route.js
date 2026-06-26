import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const secret = process.env.ADMIN_SECRET;

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET() {
  try {
    const { data, error } = await adminClient()
      .from('skills')
      .select('id, name, icon, category, created_at')
      .order('category').order('name');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (request.headers.get('x-admin-secret') !== secret)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { name, icon, category } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 });
    const { data, error } = await adminClient()
      .from('skills')
      .insert({ name: name.trim(), icon: icon?.trim() || null, category: category || 'other' })
      .select('id, name, icon, category, created_at')
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (request.headers.get('x-admin-secret') !== secret)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, name, icon, category } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const updates = {};
    if (name     !== undefined) updates.name     = name?.trim() || null;
    if (icon     !== undefined) updates.icon     = icon?.trim() || null;
    if (category !== undefined) updates.category = category;
    const { data, error } = await adminClient()
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select('id, name, icon, category, created_at')
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (request.headers.get('x-admin-secret') !== secret)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const { error } = await adminClient().from('skills').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
