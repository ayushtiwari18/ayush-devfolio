'use server';

import { supabase } from '@/lib/supabase';

/**
 * Inserts into the existing `contact_messages` table.
 *
 * Schema:
 *   id           uuid (auto)
 *   name         text
 *   email        text
 *   subject      text
 *   message      text
 *   created_at   timestamptz (auto)
 *   responded_at timestamptz (null)
 *   status       text  → default 'unread'
 */
export async function submitContactForm({ name, email, subject, message }) {
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return { success: false, message: 'All fields are required.' };
  }

  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{
        name:         name.trim(),
        email:        email.trim(),
        subject:      subject.trim(),
        message:      message.trim(),
        status:       'unread',
        responded_at: null,
      }]);

    if (error) {
      console.error('[contact action] Supabase error:', error);
      return { success: false, message: 'Could not save your message. Please try again or email me directly.' };
    }

    // Optional: send email via Resend if key is configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'Portfolio Contact <onboarding@resend.dev>',
            to:   ['ayushtiwari102003@gmail.com'],
            reply_to: email.trim(),
            subject: `[Portfolio] ${subject} — from ${name}`,
            html: `
              <h2 style="font-family:sans-serif">New contact message</h2>
              <table style="font-family:sans-serif;border-collapse:collapse;width:100%">
                <tr><td style="padding:8px 16px;font-weight:600;background:#f4f4f5">Name</td><td style="padding:8px 16px">${name}</td></tr>
                <tr><td style="padding:8px 16px;font-weight:600;background:#f4f4f5">Email</td><td style="padding:8px 16px">${email}</td></tr>
                <tr><td style="padding:8px 16px;font-weight:600;background:#f4f4f5">Subject</td><td style="padding:8px 16px">${subject}</td></tr>
                <tr><td style="padding:8px 16px;font-weight:600;background:#f4f4f5;vertical-align:top">Message</td><td style="padding:8px 16px;white-space:pre-wrap">${message}</td></tr>
              </table>
            `,
          }),
        });
        if (!res.ok) console.error('[contact action] Resend error:', await res.text());
      } catch (e) {
        console.error('[contact action] Resend fetch failed:', e);
      }
    }

    return { success: true, message: 'Thanks for reaching out! I’ll reply within 24 hours.' };
  } catch (err) {
    console.error('[contact action] Unexpected error:', err);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}
