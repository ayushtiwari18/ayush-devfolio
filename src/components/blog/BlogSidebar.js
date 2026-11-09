'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Twitter, Linkedin, Link2, Check, BookOpen, Clock, Tag, Award, ExternalLink } from 'lucide-react';

// Extract headings from BlockNote JSON blocks
function extractHeadings(content) {
  let blocks;
  try {
    blocks = typeof content === 'string' ? JSON.parse(content) : content;
  } catch {
    return [];
  }
  if (!Array.isArray(blocks)) return [];
  const headings = [];
  const walk = (blocks) => {
    for (const block of blocks) {
      if (block.type === 'heading') {
        const text = (block.content || []).filter(i => i.type === 'text').map(i => i.text).join('');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (text.trim()) {
          headings.push({ id, text, level: block.props?.level || 2 });
        }
      }
      if (block.children?.length) walk(block.children);
    }
  };
  walk(blocks);
  return headings;
}

export default function BlogSidebar({
  content, postUrl, postTitle,
  readingTime, tags,
  showToc = true, showShare = true,
}) {
  const headings = showToc ? extractHeadings(content) : [];
  const [activeId, setActiveId] = useState('');
  const [copied, setCopied] = useState(false);
  const observerRef = useRef(null);

  // IntersectionObserver — highlight active TOC heading as user scrolls
  useEffect(() => {
    if (!headings.length) return;
    const targets = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topmost.target.id);
        }
      },
      { rootMargin: '-10% 0px -75% 0px', threshold: 0 }
    );

    targets.forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [headings.length]);

  const copyLink = () => {
    navigator.clipboard.writeText(postUrl || (typeof window !== 'undefined' ? window.location.href : '')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="sticky top-24 space-y-6">

      {/* ── Table of Contents ── */}
      {showToc && headings.length > 0 && (
        <div className="bg-[#090D16] border border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-black/30 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-primary" />
              <span className="text-xs font-mono font-bold text-gray-200 uppercase tracking-widest">
                Contents
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/10">
              {headings.length} Sections
            </span>
          </div>

          <nav className="p-3 max-h-[55vh] overflow-y-auto custom-scrollbar">
            <ul className="space-y-1">
              {headings.map((h) => {
                const isActive = activeId === h.id;
                return (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className={`group flex items-start gap-2.5 rounded-xl px-3 py-2 text-xs font-sans transition-all duration-150 ${
                        h.level === 3 ? 'pl-6 text-[11px]' : ''
                      } ${
                        isActive
                          ? 'bg-primary/10 text-white font-medium border border-primary/25 shadow-sm shadow-primary/10'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                          isActive
                            ? 'bg-primary shadow-sm shadow-primary'
                            : 'bg-white/20 group-hover:bg-white/40'
                        }`}
                      />
                      <span className="line-clamp-2 leading-snug">
                        {h.text}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}

      {/* ── Author Engineering Credibility Card ── */}
      <div className="bg-[#090D16] border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/30">
        <div className="flex items-center gap-3.5 pb-4 border-b border-white/[0.08]">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-primary/40 shrink-0 shadow-md shadow-primary/10">
            <Image
              src="/images/profile/photo.jpg"
              alt="Ayush Tiwari"
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white truncate">Ayush Tiwari</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Active Author" />
            </div>
            <p className="text-xs text-gray-400 truncate">Systems & Full-Stack</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono">
          <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-300">
            <span className="text-gray-500 block text-[9px] uppercase">DSA Solved</span>
            <span className="font-bold text-white">885+</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-300">
            <span className="text-gray-500 block text-[9px] uppercase">LeetCode</span>
            <span className="font-bold text-emerald-400">1657 Rating</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <Link
            href="/#about"
            className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 text-[11px] font-mono"
          >
            <span>Read full bio</span>
            <ExternalLink size={11} />
          </Link>
          {readingTime && (
            <span className="text-gray-400 inline-flex items-center gap-1 font-mono text-[11px]">
              <Clock size={11} /> {readingTime}m read
            </span>
          )}
        </div>
      </div>

      {/* ── Share Card ── */}
      {showShare && (
        <div className="bg-[#090D16] border border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-black/30">
          <div className="px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
            <span className="text-xs font-mono font-bold text-gray-200 uppercase tracking-widest">
              Share Article
            </span>
          </div>
          <div className="p-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={shareTwitter}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-mono text-gray-300 hover:text-white hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/30 border border-white/[0.06] transition-all"
            >
              <Twitter size={14} className="text-[#1DA1F2]" />
              <span>Share on X / Twitter</span>
            </button>
            <button
              type="button"
              onClick={shareLinkedin}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-mono text-gray-300 hover:text-white hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 border border-white/[0.06] transition-all"
            >
              <Linkedin size={14} className="text-[#0A66C2]" />
              <span>Share on LinkedIn</span>
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-mono text-gray-300 hover:text-white hover:bg-primary/10 hover:border-primary/30 border border-white/[0.06] transition-all"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Link copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Link2 size={14} className="text-primary" />
                  <span>Copy canonical link</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Domain Tags ── */}
      {tags?.length > 0 && (
        <div className="bg-[#090D16] border border-white/10 rounded-2xl p-4 shadow-xl shadow-black/30">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-mono font-bold text-gray-200 uppercase tracking-widest">
            <Tag size={12} className="text-primary" />
            <span>Domain Topics</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-white/[0.03] text-gray-300 hover:text-white text-xs font-mono rounded-lg border border-white/10 hover:border-primary/40 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
