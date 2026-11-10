'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUp, Share2, Check } from 'lucide-react';

export default function BlogReadingNav({ postTitle, postUrl, category }) {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [copied, setCopied] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const el = document.documentElement;
          const scrolled = el.scrollTop;
          const total = el.scrollHeight - el.clientHeight;
          const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
          
          if (progressRef.current) {
            progressRef.current.style.width = `${pct}%`;
          }
          
          const isPast = scrolled > 200;
          setScrolledPast(prev => prev !== isPast ? isPast : prev);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(postUrl || window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#05070B]/90 border-b border-white/10 transition-all duration-300 ${
        scrolledPast
          ? 'translate-y-0 opacity-100 shadow-xl shadow-black/40'
          : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Back Link & Domain Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-gray-300 hover:text-white transition-colors px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">All Articles</span>
            <span className="sm:hidden">Back</span>
          </Link>
          {category && (
            <span className="hidden md:inline-flex text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {category}
            </span>
          )}
        </div>

        {/* Center: Truncated Title */}
        <div className="flex-1 min-w-0 text-center px-2 hidden sm:block">
          <h2 className="text-xs sm:text-sm font-medium text-gray-200 truncate">
            {postTitle}
          </h2>
        </div>

        {/* Right: Progress metric, Share trigger, Scroll to Top */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-xs text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{progress}%</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 transition-colors"
            title="Copy post link"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Share2 size={13} />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      {/* Progress line */}
      <div className="h-[2px] w-full bg-white/[0.06] overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-primary via-emerald-400 to-primary transition-all duration-75 ease-out"
          style={{ width: '0%' }}
        />
      </div>
    </div>
  );
}
