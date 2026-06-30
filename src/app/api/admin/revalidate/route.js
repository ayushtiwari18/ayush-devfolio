/**
 * POST /api/admin/revalidate
 * On-demand Next.js cache revalidation for all public pages.
 * Call this after saving or publishing any content from admin.
 * Requires x-admin-secret header.
 *
 * Body (optional): { paths: ['/projects', '/blog'] }
 * Omit body to flush ALL content pages at once.
 */
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const secret = request.headers.get('x-admin-secret');
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || '';

  if (!secret || secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const paths = body.paths || [
      '/',
      '/projects',
      '/blog',
      '/about',
      '/certifications',
      '/events',
      '/hackathons',
      '/contact',
    ];

    for (const p of paths) {
      revalidatePath(p);
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[revalidate] Error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
