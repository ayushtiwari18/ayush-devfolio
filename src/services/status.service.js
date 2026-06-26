import { supabase } from '@/lib/supabase';

export async function getStatus() {
  const { data, error } = await supabase
    .from('coding_profiles')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertStatus(payload) {
  const { data, error } = await supabase
    .from('coding_profiles')
    .upsert(
      { ...payload },
      { onConflict: 'id', ignoreDuplicates: false }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
