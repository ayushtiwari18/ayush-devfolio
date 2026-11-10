'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Calendar, MapPin, Users, Award,
  Youtube, ExternalLink, Share2, Check, Sparkles,
  Camera, Film, Heart, Maximize2, X, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function PehelStoryView({ event }) {
  const [copied, setCopied] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Parse links safely
  const links = typeof event.links === 'object' && event.links !== null
    ? event.links
    : {};

  const youtubeUrl = links.live || 'https://youtu.be/zhoe5JBrwJ4';
  const youtubeEmbedId = 'zhoe5JBrwJ4';
  const linkedinUrl = links.github || links.linkedin || 'https://www.linkedin.com/posts/tiwariaayush_peheleknayisubha-gyangangainstitutions-gratitude-activity-7256210384066371584-uoR9';

  // Gather all photos for the gallery
  const galleryImages = [];
  if (event.cover_image) {
    galleryImages.push({
      url: event.cover_image,
      caption: 'Pehel 8th Edition Official Event Cover & Production Asset'
    });
  }
  if (Array.isArray(event.images)) {
    event.images.forEach((img, i) => {
      const src = typeof img === 'string' ? img : img.url;
      if (src && !galleryImages.some(g => g.url === src)) {
        galleryImages.push({
          url: src,
          caption: `Pehel 8th Edition Live Event Capture #${i + 1}`
        });
      }
    });
  }

  // Keyboard navigation for lightbox
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevLightbox = useCallback(() => {
    setLightboxIndex(idx => (idx !== null && galleryImages.length > 0 ? (idx - 1 + galleryImages.length) % galleryImages.length : null));
  }, [galleryImages.length]);
  const nextLightbox = useCallback(() => {
    setLightboxIndex(idx => (idx !== null && galleryImages.length > 0 ? (idx + 1) % galleryImages.length : null));
  }, [galleryImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, prevLightbox, nextLightbox]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-200">
      {/* ── STICKY READING / UTILITY HEADER ── */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#05070B]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Archive / Events</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400">
            <a href="#production-video" className="hover:text-cyan-400 transition-colors">01. Video Theater</a>
            <a href="#story" className="hover:text-cyan-400 transition-colors">02. Narrative</a>
            <a href="#gallery" className="hover:text-cyan-400 transition-colors">03. Gallery</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">04. Toolkit</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-mono text-slate-300 hover:bg-white/[0.07] hover:border-white/20 transition-all"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 size={13} />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-b from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Film size={12} />
              Video Production &amp; Creative Lead
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-white/[0.05] text-slate-400 border border-white/10">
              8th Annual Edition
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Heart size={11} className="fill-emerald-400/20" />
              Community Tribute
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Pehel — Ek Nayi Subha
          </h1>

          <p className="text-xl sm:text-2xl font-light text-slate-300 mb-8 max-w-3xl leading-relaxed">
            {event.tagline || 'Celebrating the Unsung Heroes of Our Campus'}
          </p>

          {/* Key Facts Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-2xl bg-[#090D16] border border-white/10 shadow-2xl">
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">Role</span>
              <p className="text-sm font-semibold text-white mt-1">Video Lead &amp; Organizer</p>
            </div>
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">Team</span>
              <p className="text-sm font-semibold text-white mt-1">Team Indigo (24 Members)</p>
            </div>
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">Location</span>
              <p className="text-sm font-semibold text-white mt-1">GGITS Campus, Jabalpur</p>
            </div>
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">Coverage</span>
              <p className="text-sm font-semibold text-white mt-1">8 Hours Live · 500+ Attendees</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: EMBEDDED VIDEO THEATER ── */}
      <section id="production-video" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-[#070A11]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
                <Film size={14} />
                <span>Cinematic Artifact</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Official Event Video Production
              </h2>
            </div>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs font-mono font-medium text-rose-300 hover:bg-rose-500/20 transition-all"
            >
              <Youtube size={14} className="text-rose-400" />
              <span>Watch on YouTube</span>
              <ExternalLink size={12} className="opacity-70" />
            </a>
          </div>

          {/* YouTube 16:9 Theater Player */}
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-cyan-950/20">
            <div className="aspect-video w-full relative">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeEmbedId}?rel=0&modestbranding=1`}
                title="Pehel 8th Edition Official Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <div className="p-4 sm:p-5 bg-[#090D16] border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-300">
                  Produced, shot &amp; edited for Gyan Ganga Group of Institutions
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:underline"
                >
                  <span>LinkedIn Showcase Post</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: EDITORIAL NARRATIVE STORY ── */}
      <section id="story" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Metadata & Mission Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-[#090D16] border border-white/10 space-y-5 sticky top-20">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                <Sparkles size={14} />
                <span>Executive Context</span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400">Initiative</span>
                <p className="text-sm font-semibold text-white mt-0.5">Pehel — Ek Nayi Subha</p>
                <p className="text-xs text-slate-400 mt-1">An annual campus tradition honoring workers who build, clean, and protect the campus.</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <span className="text-[11px] font-mono uppercase text-slate-400">My Responsibility</span>
                <p className="text-sm font-semibold text-white mt-0.5">End-to-End Media Documentation</p>
                <p className="text-xs text-slate-400 mt-1">Directing multi-angle event cinematography, live photography, and same-day turnaround editing for university distribution.</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <span className="text-[11px] font-mono uppercase text-slate-400">Key Moments</span>
                <ul className="text-xs text-slate-300 mt-2 space-y-1.5 list-disc list-inside">
                  <li>Hand-printing unity mural</li>
                  <li>Friendly staff vs. student football</li>
                  <li>Bouncer solo musical performance</li>
                  <li>Token appreciation &amp; gift ceremony</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Narrative Chapters */}
          <div className="lg:col-span-8 space-y-12 text-slate-300 leading-relaxed">
            {/* Chapter 1 */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Chapter 01</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-4">
                The Vision: Recognizing the Unseen Workforce
              </h3>
              <p className="text-slate-300 text-base leading-relaxed mb-4">
                Universities are bustling ecosystems of lectures, hackathons, and labs. Yet the individuals who ensure
                water runs, pathways are spotless, electrical grids hold up, and campus security remains steadfast often
                remain invisible in mainstream celebrations.
              </p>
              <p className="text-slate-300 text-base leading-relaxed">
                <strong className="text-white">Pehel – Ek Nayi Subha</strong> was conceived at Gyan Ganga Group of Institutions
                to turn the spotlight completely onto our auxiliary staff. For the 8th edition, as a core member of Team Indigo,
                my commitment was to document the day not merely as a corporate recap, but as an authentic, human celebration
                of gratitude.
              </p>
            </div>

            {/* Chapter 2 */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Chapter 02</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-4">
                Live Coverage &amp; Capturing Spontaneous Joy
              </h3>
              <p className="text-slate-300 text-base leading-relaxed mb-4">
                The celebration spanned 8 continuous hours packed with dynamic energy. We organized hand-printing sessions
                where hundreds of students, faculty members, and auxiliary staff pressed paint-coated palms onto canvas
                murals—symbolizing unity and shared dignity.
              </p>
              <p className="text-slate-300 text-base leading-relaxed mb-4">
                This was followed by friendly football matches where roles dissolved—students and security guards cheered
                together side-by-side. Documenting this meant running across the grounds with gimbal rigs, capturing candid smiles,
                and recording raw audio amidst cheers and applause.
              </p>
              <blockquote className="my-6 p-5 rounded-xl border-l-2 border-cyan-400 bg-white/[0.02] text-sm text-slate-200 italic">
                &ldquo;Capturing genuine gratitude cannot be staged. It requires being completely present in the crowd, anticipating moments before they occur, and letting the human spirit speak for itself.&rdquo;
              </blockquote>
            </div>

            {/* Chapter 3 */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Chapter 03</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-4">
                The Standing Ovation: &ldquo;Main Shayar Toh Nahi&rdquo;
              </h3>
              <p className="text-slate-300 text-base leading-relaxed mb-4">
                Every event has that one defining moment that transcends the schedule. During the cultural talent segment,
                one of our campus security bouncers stepped onto the auditorium stage, took the microphone, and delivered a
                heartfelt rendition of <em>&ldquo;Main Shayar Toh Nahi&rdquo;</em>.
              </p>
              <p className="text-slate-300 text-base leading-relaxed">
                The entire hall erupted. Faculty, directors, and students stood up in unison for an emotional standing ovation.
                Capturing the emotion on his face through the camera lens was one of the most rewarding moments of my creative journey.
              </p>
            </div>

            {/* Chapter 4 */}
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Chapter 04</span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-4">
                Gift Ceremonies &amp; What Leadership Really Means
              </h3>
              <p className="text-slate-300 text-base leading-relaxed mb-4">
                The celebration concluded with a university-wide gift distribution ceremony where every auxiliary worker was
                personally honored with tokens of appreciation and heartfelt applause.
              </p>
              <p className="text-slate-300 text-base leading-relaxed">
                Leading the video production and working alongside 24 organizers in Team Indigo reinforced an enduring
                principle: technical engineering is about systems, but true leadership is about people. Documenting Pehel
                sharpened my skills in fast-paced video editing, narrative pacing, and real-time event coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: PHOTO GALLERY & LIGHTBOX ── */}
      <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-[#070A11]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
                <Camera size={14} />
                <span>Visual Archive</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Event Photography Gallery
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Click photo to view fullscreen
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#090D16] cursor-pointer hover:border-cyan-500/40 transition-all duration-300 shadow-xl"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-black/40">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="w-full flex items-center justify-between text-xs font-mono text-white">
                    <span>{img.caption}</span>
                    <Maximize2 size={14} className="text-cyan-400 shrink-0 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: PRODUCTION TOOLKIT & SKILLS ── */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Execution Competencies</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Production Toolkit &amp; Leadership Skills
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { title: 'Video Editing', desc: 'Premiere Pro, pacing, color grading' },
              { title: 'Cinematography', desc: 'Live event multi-cam & gimbal operation' },
              { title: 'Event Production', desc: 'Stage logistics, audio & schedule flow' },
              { title: 'Team Leadership', desc: 'Directing coverage with 24 organizers' },
              { title: 'Community Impact', desc: 'Auxiliary staff recognition & engagement' },
              { title: 'Rapid Turnaround', desc: 'Same-day media editing for distribution' },
              { title: 'Storyboarding', desc: 'Structuring narrative arc and highlights' },
              { title: 'Communication', desc: 'Cross-functional university coordination' },
            ].map((skill, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#090D16] border border-white/10 hover:border-cyan-500/30 transition-colors"
              >
                <span className="text-xs font-bold text-white block mb-1">{skill.title}</span>
                <span className="text-[11px] text-slate-400 font-mono block leading-relaxed">{skill.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FOOTER NAVIGATOR ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#070A11]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-mono text-slate-300 hover:bg-white/[0.08] hover:border-cyan-500/40 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Back to Events &amp; Hackathons</span>
          </Link>

          <Link
            href="/projects/sentinal"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-sm font-mono text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            <span>Next Case Study: Sentinal WAF</span>
            <ExternalLink size={16} />
          </Link>
        </div>
      </section>

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            aria-label="Close fullscreen view"
          >
            <X size={20} />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[lightboxIndex]?.url}
              alt={galleryImages[lightboxIndex]?.caption}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <p className="mt-4 text-xs font-mono text-slate-300 text-center">
              {galleryImages[lightboxIndex]?.caption} ({lightboxIndex + 1} / {galleryImages.length})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
