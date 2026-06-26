import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const secret = process.env.ADMIN_SECRET;
const adminClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FIELDS = 'id,company,role,employment_type,start_date,end_date,location,description,technologies,created_at,updated_at';

export async function GET() {
  try {
    const { data, error } = await adminClient()
      .from('experience')
      .select(FIELDS)
      .order('start_date', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (req.headers.get('x-admin-secret') !== secret)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const b = await req.json();
    if (!b.company?.trim() || !b.role?.trim() || !b.start_date?.trim())
      return NextResponse.json({ error: 'company, role and start_date are required' }, { status: 400 });
    const { data, error } = await adminClient()
      .from('experience')
      .insert({
        company:         b.company.trim(),
        role:            b.role.trim(),
        employment_type: b.employment_type?.trim() || 'Internship',
        start_date:      b.start_date.trim(),
        end_date:        b.end_date?.trim()     || null,
        location:        b.location?.trim()     || null,
        description:     b.description?.trim()  || null,
        technologies:    b.technologies?.trim() || null,
      })
      .select(FIELDS)
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (req.headers.get('x-admin-secret') !== secret)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, ...b } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const { data, error } = await adminClient()
      .from('experience')
      .update({
        company:         b.company?.trim()         || null,
        role:            b.role?.trim()            || null,
        employment_type: b.employment_type?.trim() || null,
        start_date:      b.start_date?.trim()      || null,
        end_date:        b.end_date?.trim()        || null,
        location:        b.location?.trim()        || null,
        description:     b.description?.trim()     || null,
        technologies:    b.technologies?.trim()    || null,
        updated_at:      new Date().toISOString(),
      })
      .eq('id', id)
      .select(FIELDS)
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (req.headers.get('x-admin-secret') !== secret)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const { error } = await adminClient().from('experience').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
