import { supabase } from '@/lib/supabase';

export async function submitContactMessage(data) {
  const { name, email, message } = data;

  const { error } = await supabase
    .from('contact_messages')
    .insert([{
      name,
      email,
      message,
      status: 'unread',
    }]);

  if (error) throw error;
  return { success: true };
}
