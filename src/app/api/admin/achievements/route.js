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
      .from('achievements')
      .select('id, label, value, description, icon, order_index, published')
      .order('order_index', { ascending: true });
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
    const { label, value, description, icon, order_index, published } = await request.json();
    if (!label?.trim()) return NextResponse.json({ error: 'label is required' }, { status: 400 });
    if (!value?.trim()) return NextResponse.json({ error: 'value is required' }, { status: 400 });
    const { data, error } = await adminClient()
      .from('achievements')
      .insert({
        label: label.trim(),
        value: value.trim(),
        description: description?.trim() || null,
        icon: icon?.trim() || 'rocket',
        order_index: order_index ?? 0,
        published: published ?? true,
      })
      .select('id, label, value, description, icon, order_index, published')
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
    const { id, label, value, description, icon, order_index, published } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const updates = {};
    if (label       !== undefined) updates.label       = label?.trim()       || null;
    if (value       !== undefined) updates.value       = value?.trim()       || null;
    if (description !== undefined) updates.description = description?.trim() || null;
    if (icon        !== undefined) updates.icon        = icon?.trim()        || 'rocket';
    if (order_index !== undefined) updates.order_index = order_index;
    if (published   !== undefined) updates.published   = published;
    const { data, error } = await adminClient()
      .from('achievements')
      .update(updates)
      .eq('id', id)
      .select('id, label, value, description, icon, order_index, published')
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
    const { error } = await adminClient().from('achievements').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
