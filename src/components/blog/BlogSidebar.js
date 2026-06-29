'use client';

import { useEffect, useState, useRef } from 'react';
import { Calendar, Clock, Tag, Twitter, Linkedin, Link2, Check } from 'lucide-react';

function extractHeadings(content) {
  if (!content) return [];
  const lines = content.split('\n');
  const headings = [];
  for (const line of lines) {
    const m2 = line.match(/^## (.+)/);
    const m3 = line.match(/^### (.+)/);
    if (m2) {
      const text = m2[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ level: 2, text, id });
    } else if (m3) {
      const text = m3[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      headings.push({ level: 3, text, id });
    }
  }
  return headings;
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function BlogSidebar({
  content, postUrl, postTitle, createdAt, readingTime, tags,
  showToc = true, showShare = true,
}) {
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState('');
  const [copied, setCopied] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!showToc || headings.length === 0) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [headings.length, showToc]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}&via=ayushtiwari18`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;

  return (
    <div className="xl:sticky xl:top-24 space-y-5">

      {/* TOC */}
      {showToc && headings.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">On This Page</h3>
          <nav className="space-y-1">
            {headings.map(({ id, text, level }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`block text-sm leading-snug py-1 transition-colors ${
                  level === 3 ? 'pl-4' : 'pl-0'
                } ${
                  activeId === id
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {level === 3 && <span className="mr-1 opacity-40">›</span>}
                {text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Article Info */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Article Info</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Calendar size={14} className="shrink-0" />
            <span>{formatDate(createdAt)}</span>
          </div>
          {readingTime && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Clock size={14} className="shrink-0" />
              <span>{readingTime} min read</span>
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Tag size={14} className="shrink-0 mt-1 text-muted-foreground" />
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share */}
      {showShare && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Share</h3>
          <div className="flex flex-col gap-2">
            <a
              href={twitterUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm text-foreground"
            >
              <Twitter size={15} className="text-[#1DA1F2]" />
              Share on X / Twitter
            </a>
            <a
              href={linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm text-foreground"
            >
              <Linkedin size={15} className="text-[#0A66C2]" />
              Share on LinkedIn
            </a>
            <button
              onClick={copyLink}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm text-foreground w-full"
            >
              {copied
                ? <><Check size={15} className="text-green-400" /> Copied!</>
                : <><Link2 size={15} className="text-muted-foreground" /> Copy link</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
