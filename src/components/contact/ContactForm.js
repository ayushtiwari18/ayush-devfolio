'use client';

import { useState, useRef } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactForm } from '@/app/actions/contact';

const SUBJECTS = [
  'Project Collaboration',
  'Freelance / Hire',
  'Open Source',
  'Just Saying Hi',
  'Other',
];

export default function ContactForm() {
  const formRef = useRef(null);
  const [status, setStatus]   = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [errors, setErrors]   = useState({});

  const validate = (data) => {
    const e = {};
    if (!data.name?.trim())    e.name    = 'Name is required';
    if (!data.email?.trim())   e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email address';
    if (!data.subject?.trim()) e.subject = 'Please select a subject';
    if (!data.message?.trim()) e.message = 'Message is required';
    else if (data.message.trim().length < 20) e.message = 'Message must be at least 20 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());

    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setStatus('loading');

    try {
      const result = await submitContactForm(data);
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Message sent! I’ll get back to you soon.');
        formRef.current?.reset();
      } else {
        setStatus('error');
        setMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again or email me directly.');
    }
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl bg-muted border text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/40 ${
      errors[field] ? 'border-red-500/70' : 'border-border focus:border-primary/60'
    }`;

  if (status === 'success') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-card border border-border rounded-2xl gap-5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">Message Sent! 🎉</h3>
          <p className="text-muted-foreground text-sm max-w-xs">{message}</p>
        </div>
        <button
          onClick={() => setStatus('idle')}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5"
    >
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Send a Message</h2>
        <p className="text-sm text-muted-foreground">I read every message and reply within 24 hours.</p>
      </div>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5" htmlFor="name">Name *</label>
          <input id="name" name="name" type="text" placeholder="Ayush Tiwari" className={inputCls('name')} />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5" htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" className={inputCls('email')} />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1.5" htmlFor="subject">Subject *</label>
        <select id="subject" name="subject" defaultValue="" className={inputCls('subject')}>
          <option value="" disabled>Select a subject…</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1.5" htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell me about your project or idea…"
          className={`${inputCls('message')} resize-none`}
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>

      {/* Error banner */}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {message}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {status === 'loading' ? (
          <><Loader2 size={16} className="animate-spin" /> Sending…</>
        ) : (
          <><Send size={16} /> Send Message</>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Or email me directly at{' '}
        <a href="mailto:ayushtiwari102003@gmail.com" className="text-primary hover:underline">
          ayushtiwari102003@gmail.com
        </a>
      </p>
    </form>
  );
}
