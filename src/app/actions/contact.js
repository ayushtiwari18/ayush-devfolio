'use server';

import { supabase } from '@/lib/supabase';

/**
 * Server Action: save contact message to Supabase `contact_messages` table.
 * Optionally sends an email via Resend if RESEND_API_KEY is set.
 *
 * Supabase table schema (run once in SQL editor):
 * -----------------------------------------------
 * create table contact_messages (
 *   id          uuid primary key default gen_random_uuid(),
 *   name        text not null,
 *   email       text not null,
 *   subject     text not null,
 *   message     text not null,
 *   created_at  timestamptz default now()
 * );
 * -----------------------------------------------
 */
export async function submitContactForm({ name, email, subject, message }) {
  // Basic server-side guard
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return { success: false, message: 'All fields are required.' };
  }

  try {
    // 1️⃣  Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }]);

    if (dbError) {
      console.error('[contact action] Supabase insert error:', dbError);
      // Don’t fail hard — still try to send email
    }

    // 2️⃣  Send email via Resend (optional — only if RESEND_API_KEY is configured)
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
            to: ['ayushtiwari102003@gmail.com'],
            reply_to: email.trim(),
            subject: `[Portfolio] ${subject} — from ${name}`,
            html: `
              <h2>New contact message from your portfolio</h2>
              <table style="border-collapse:collapse;width:100%">
                <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
                <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${email}</td></tr>
                <tr><td style="padding:8px;font-weight:bold">Subject</td><td style="padding:8px">${subject}</td></tr>
                <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px;white-space:pre-wrap">${message}</td></tr>
              </table>
            `,
          }),
        });
        if (!res.ok) console.error('[contact action] Resend error:', await res.text());
      } catch (emailErr) {
        console.error('[contact action] Resend fetch error:', emailErr);
      }
    }

    return { success: true, message: 'Thanks for reaching out! I’ll reply within 24 hours.' };
  } catch (err) {
    console.error('[contact action] Unexpected error:', err);
    return { success: false, message: 'Something went wrong. Please try again or email me directly.' };
  }
}
