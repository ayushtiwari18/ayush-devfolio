'use client';

import { useEffect, useState, useRef } from 'react';
import { Twitter, Linkedin, Link2, Check, BookOpen, Clock } from 'lucide-react';

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
        headings.push({ id, text, level: block.props?.level || 2 });
      }
      if (block.children?.length) walk(block.children);
    }
  };
  walk(blocks);
  return headings;
}

// Reading progress bar — thin line at top of viewport
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.round((scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-50 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
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
          // Pick the topmost visible heading
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topmost.target.id);
        }
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );

    targets.forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [headings.length]);

  const copyLink = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`,
      '_blank'
    );
  };

  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
      '_blank'
    );
  };

  return (
    <>
      <ReadingProgress />

      <div className="sticky top-24 space-y-5">

        {/* ── TOC ── */}
        {showToc && headings.length > 0 && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-border bg-primary/5">
              <BookOpen size={14} className="text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-widest">Contents</span>
            </div>
            <nav className="px-3 py-3">
              <ul className="space-y-0.5">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all duration-150 ${
                        h.level === 3 ? 'pl-6' : ''
                      } ${
                        activeId === h.id
                          ? 'bg-primary/15 text-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                      }`}
                    >
                      {activeId === h.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                      <span className="line-clamp-2 leading-snug">{h.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* ── Stats ── */}
        {readingTime && (
          <div className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-xl">
            <Clock size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{readingTime} min read</span>
          </div>
        )}

        {/* ── Share ── */}
        {showShare && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border bg-primary/5">
              <span className="text-xs font-bold text-foreground uppercase tracking-widest">Share</span>
            </div>
            <div className="p-3 flex flex-col gap-2">
              <button onClick={shareTwitter}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-foreground/80 hover:text-foreground hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/30 border border-transparent transition-all">
                <Twitter size={15} className="text-[#1DA1F2]" />
                Share on X / Twitter
              </button>
              <button onClick={shareLinkedin}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-foreground/80 hover:text-foreground hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/30 border border-transparent transition-all">
                <Linkedin size={15} className="text-[#0A66C2]" />
                Share on LinkedIn
              </button>
              <button onClick={copyLink}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-foreground/80 hover:text-foreground hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all">
                {copied
                  ? <><Check size={15} className="text-green-400" /><span className="text-green-400">Link copied!</span></>
                  : <><Link2 size={15} className="text-primary" />Copy link</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── Tags ── */}
        {tags?.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <span key={i}
                  className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
