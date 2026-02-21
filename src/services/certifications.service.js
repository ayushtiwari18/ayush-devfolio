import { supabase } from '@/lib/supabase';

export async function getPublishedCertifications() {
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('issue_date', { ascending: false });

  if (error) throw error;
  return data || [];
}
