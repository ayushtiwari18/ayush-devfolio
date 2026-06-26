import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const secret = process.env.ADMIN_SECRET;
const adminClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FIELDS = 'id,institution,degree,field,start_date,end_date,description,location,created_at,updated_at';

export async function GET() {
  try {
    const { data, error } = await adminClient()
      .from('education')
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
    const body = await req.json();
    if (!body.institution?.trim() || !body.degree?.trim() || !body.start_date?.trim())
      return NextResponse.json({ error: 'institution, degree and start_date are required' }, { status: 400 });
    const { data, error } = await adminClient()
      .from('education')
      .insert({
        institution: body.institution.trim(),
        degree:      body.degree.trim(),
        field:       body.field?.trim()       || null,
        start_date:  body.start_date.trim(),
        end_date:    body.end_date?.trim()    || null,
        location:    body.location?.trim()    || null,
        description: body.description?.trim() || null,
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
    const { id, ...body } = await req.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    const { data, error } = await adminClient()
      .from('education')
      .update({
        institution: body.institution?.trim() || null,
        degree:      body.degree?.trim()      || null,
        field:       body.field?.trim()       || null,
        start_date:  body.start_date?.trim()  || null,
        end_date:    body.end_date?.trim()    || null,
        location:    body.location?.trim()    || null,
        description: body.description?.trim() || null,
        updated_at:  new Date().toISOString(),
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
    const { error } = await adminClient().from('education').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
