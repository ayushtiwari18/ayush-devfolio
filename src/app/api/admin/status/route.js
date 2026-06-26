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

export async function PATCH(request) {
  if (request.headers.get('x-admin-secret') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const supabase = adminClient();

    const { data: existing } = await supabase
      .from('coding_profiles')
      .select('id')
      .limit(1)
      .maybeSingle();

    const payload = {
      ...(existing?.id ? { id: existing.id } : {}),
      // usernames + display
      github_username:      body.github_username      ?? null,
      github_display:       body.github_display       ?? true,
      leetcode_username:    body.leetcode_username     ?? null,
      leetcode_display:     body.leetcode_display      ?? true,
      codechef_username:    body.codechef_username     ?? null,
      codechef_display:     body.codechef_display      ?? true,
      codeforces_username:  body.codeforces_username   ?? null,
      codeforces_display:   body.codeforces_display    ?? true,
      hackerrank_username:  body.hackerrank_username   ?? null,
      hackerrank_display:   body.hackerrank_display    ?? true,
      gfg_username:         body.gfg_username          ?? null,
      gfg_display:          body.gfg_display           ?? true,
      // leetcode stats
      leetcode_solved:      body.leetcode_solved      != null ? Number(body.leetcode_solved)      : null,
      leetcode_rating:      body.leetcode_rating      != null ? Number(body.leetcode_rating)      : null,
      leetcode_contests:    body.leetcode_contests    != null ? Number(body.leetcode_contests)    : null,
      // codechef stats
      codechef_rating:      body.codechef_rating      != null ? Number(body.codechef_rating)      : null,
      codechef_contests:    body.codechef_contests    != null ? Number(body.codechef_contests)    : null,
      codechef_problems:    body.codechef_problems    != null ? Number(body.codechef_problems)    : null,
      // codeforces stats
      codeforces_rating:    body.codeforces_rating    != null ? Number(body.codeforces_rating)    : null,
      codeforces_contests:  body.codeforces_contests  != null ? Number(body.codeforces_contests)  : null,
      codeforces_problems:  body.codeforces_problems  != null ? Number(body.codeforces_problems)  : null,
      // hackerrank stats
      hackerrank_stars:     body.hackerrank_stars     ?? null,
      hackerrank_certs:     body.hackerrank_certs     != null ? Number(body.hackerrank_certs)     : null,
      hackerrank_problems:  body.hackerrank_problems  != null ? Number(body.hackerrank_problems)  : null,
      // gfg stats
      gfg_problems:         body.gfg_problems         != null ? Number(body.gfg_problems)         : null,
      gfg_score:            body.gfg_score            != null ? Number(body.gfg_score)            : null,
      gfg_streak:           body.gfg_streak           ?? null,
      // overall
      total_problems:       body.total_problems       != null ? Number(body.total_problems)       : null,
      total_contests:       body.total_contests       != null ? Number(body.total_contests)       : null,
      total_badges:         body.total_badges         != null ? Number(body.total_badges)         : null,
      max_streak:           body.max_streak           ?? null,
      updated_at:           new Date().toISOString(),
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
