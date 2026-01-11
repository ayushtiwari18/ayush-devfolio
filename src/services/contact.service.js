import { supabase } from '@/lib/supabase';

export async function submitContactMessage(data) {
  const { name, email, subject, message } = data;

  const { error } = await supabase
    .from('contact_messages')
    .insert([{
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      status: 'unread',
    }]);

  if (error) throw error;
  return { success: true };
}
