'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, Sparkles, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const INTENT_PILLS = [
  { label: '🚀 Full-Stack Web App', prefix: "I'd like to discuss building a full-stack web application with Next.js & Node.js: " },
  { label: '☁️ AWS Cloud Architecture', prefix: "I need consultation on AWS cloud infrastructure, Docker, or database scaling: " },
  { label: '💼 Full-Time Engineering Role', prefix: "We are hiring for a software engineering position and would love to chat: " },
  { label: '☕ Technical Consultation', prefix: "I have a technical question or collaboration proposal: " },
];

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectIntent = (pill) => {
    setSelectedIntent(pill.label);
    if (!formData.message || formData.message.startsWith('I')) {
      setFormData((prev) => ({
        ...prev,
        message: pill.prefix,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('contact_messages').insert([{
        ...formData,
        status: 'unread',
      }]);

      if (error) throw error;

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setSelectedIntent(null);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#05070B] overflow-hidden">
      
      {/* Background ambient radial glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/[0.03] rounded-full blur-[140px] pointer-events-none"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono-code mb-4 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold uppercase tracking-wider">AVAILABLE FOR Q1/Q2 OPPORTUNITIES</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-[-0.03em] leading-tight mb-4">
            Start a <span className="text-primary inline-block">Conversation</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Have a project in mind, an architectural challenge, or a full-time engineering opportunity?
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-[#090D16] border border-white/10 hover:border-indigo-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black/80 transition-all duration-300">
          
          {/* Quick Intent Pills */}
          <div className="mb-8">
            <p className="text-xs font-mono-code font-semibold uppercase tracking-wider text-gray-400 mb-3">
              What can we build together?
            </p>
            <div className="flex flex-wrap gap-2">
              {INTENT_PILLS.map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => handleSelectIntent(pill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono-code transition-all select-none ${
                    selectedIntent === pill.label
                      ? 'bg-primary text-white border border-primary/50 shadow-md shadow-primary/20'
                      : 'bg-white/[0.03] border border-white/10 text-gray-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-emerald-400" size={32} />
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-2">Message Delivered!</h3>
              <p className="text-gray-400 text-sm font-mono-code">
                Thank you for reaching out. I will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono-code uppercase tracking-wider font-semibold text-gray-400 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#06080E] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-mono-code"
                    placeholder="Alex Chen"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono-code uppercase tracking-wider font-semibold text-gray-400 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#06080E] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-mono-code"
                    placeholder="alex@company.com"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-mono-code uppercase tracking-wider font-semibold text-gray-400 mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-[#06080E] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all text-sm font-sans leading-relaxed"
                  placeholder="Tell me about your project, architecture needs, or role details..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_25px_-5px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all text-sm"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                      Dispatching Message...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} />
                      Send Transmission
                    </span>
                  )}
                </Button>

                <div className="flex items-center gap-4 text-xs font-mono-code text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-primary" /> Jabalpur, IN
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-emerald-400" /> IST (UTC+5:30)
                  </span>
                </div>
              </div>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
