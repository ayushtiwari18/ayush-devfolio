'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {
  Info,
  Sparkles,
  AlertTriangle,
  AlertOctagon,
  Bookmark,
  Check,
  Copy,
  Activity,
} from 'lucide-react';
import { contentToMarkdown } from '@/lib/blogUtils';
const ArchifyDiagram = dynamic(() => import('./ArchifyDiagram'), {
  ssr: false,
  loading: () => (
    <div className="my-8 rounded-2xl border border-white/10 bg-[#070A0F] shadow-2xl overflow-hidden p-6">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity size={16} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-mono font-bold text-white flex items-center gap-2">
              <span>Loading System Architecture...</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Interactive Flow
              </span>
            </h4>
          </div>
        </div>
      </div>
      <div className="h-[280px] rounded-xl bg-[#06080E] border border-white/5 flex items-center justify-center mt-4">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Mounting Interactive System Flow...</span>
        </div>
      </div>
    </div>
  ),
});

// IDE Editor Theme for Prism
const ideTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: 'transparent',
    textShadow: 'none',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
    textShadow: 'none',
  },
};

function getNodeText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (node.props?.children) return getNodeText(node.props.children);
  return '';
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ── Copy-code button ──────────────────────────────────────────
function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy code to clipboard"
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-mono transition-all px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 active:scale-95"
    >
      {copied ? (
        <>
          <Check size={12} className="text-emerald-400" />
          <span className="text-emerald-400 font-semibold">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={12} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// ── Shared syntax-highlighted code block ───────────────────────
function CodeBlockCard({ lang = 'text', code }) {
  const cleanLang = (lang || 'text').trim().toLowerCase();
  return (
    <div className="relative my-8 rounded-2xl overflow-hidden border border-white/10 bg-[#080B11] shadow-2xl shadow-black/50 group">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D111A] border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/90 border border-[#E0443E]/50 shadow-sm shadow-[#FF5F56]/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/90 border border-[#DEA123]/50 shadow-sm shadow-[#FFBD2E]/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/90 border border-[#1AAB29]/50 shadow-sm shadow-[#27C93F]/20" />
          </div>
          <span className="text-[11px] font-mono tracking-wider text-gray-400 uppercase font-semibold">
            {cleanLang} <span className="text-gray-600">// source</span>
          </span>
        </div>
        <CopyButton code={code} />
      </div>
      <SyntaxHighlighter
        language={cleanLang}
        style={ideTheme}
        codeTagProps={{
          style: {
            background: 'transparent',
            textShadow: 'none',
          },
        }}
        customStyle={{
          margin: 0,
          padding: '1.25rem 1.5rem',
          borderRadius: 0,
          background: '#080B11',
          fontSize: '0.875rem',
          lineHeight: '1.75',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
        showLineNumbers
        lineNumberStyle={{
          color: '#4B5563',
          fontSize: '0.75rem',
          minWidth: '2.5em',
          paddingRight: '1rem',
          userSelect: 'none',
          background: 'transparent',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ── Glow Callout Card ──────────────────────────────────────────
const CALLOUT_CONFIGS = {
  NOTE: {
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-950/15',
    text: 'text-cyan-300',
    icon: Info,
    label: 'NOTE',
  },
  TIP: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-950/15',
    text: 'text-emerald-300',
    icon: Sparkles,
    label: 'PRO TIP',
  },
  WARNING: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-950/15',
    text: 'text-amber-300',
    icon: AlertTriangle,
    label: 'WARNING',
  },
  IMPORTANT: {
    border: 'border-purple-500/30',
    bg: 'bg-purple-950/15',
    text: 'text-purple-300',
    icon: Bookmark,
    label: 'IMPORTANT',
  },
  CAUTION: {
    border: 'border-rose-500/30',
    bg: 'bg-rose-950/15',
    text: 'text-rose-300',
    icon: AlertOctagon,
    label: 'CAUTION',
  },
};

function CalloutCard({ type, children }) {
  const config = CALLOUT_CONFIGS[type] || CALLOUT_CONFIGS.NOTE;
  const Icon = config.icon;

  return (
    <div className={`my-8 rounded-2xl border p-5 sm:p-6 backdrop-blur-md shadow-xl ${config.border} ${config.bg}`}>
      <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold tracking-wider uppercase">
        <Icon size={15} className={config.text} />
        <span className={config.text}>{config.label}</span>
      </div>
      <div className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans">
        {children}
      </div>
    </div>
  );
}

// ── Shared heading renderer ───────────────────────────────────
function renderHeading(level, id, children) {
  const base = 'group relative font-bold text-foreground scroll-mt-28 tracking-tight';
  const anchor = (
    <a
      href={`#${id}`}
      className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 text-primary/70 hover:text-primary transition-opacity text-base font-mono select-none"
      title="Direct link to heading"
    >
      #
    </a>
  );
  if (level === 1) {
    return (
      <h1 id={id} className={`${base} text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-16 mb-6 text-white`}>
        {anchor}{children}
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h2 id={id} className={`${base} text-2xl sm:text-3xl font-bold mt-14 mb-6 text-white border-b border-white/10 pb-3 flex items-center justify-between`}>
        <span>{anchor}{children}</span>
        <span className="text-[11px] font-mono font-normal uppercase tracking-widest text-primary/60 hidden sm:inline-block">Section</span>
      </h2>
    );
  }
  return (
    <h3 id={id} className={`${base} text-xl sm:text-2xl font-bold mt-10 mb-4 text-gray-100`}>
      {anchor}{children}
    </h3>
  );
}

// ── Blog Article Image with Zoom Lightbox & Graceful Fallback ──────
function BlogImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <span className="my-9 flex flex-col items-center w-full block">
        <span
          role="button"
          tabIndex={0}
          onClick={() => !hasError && setIsZoomed(true)}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !hasError) {
              e.preventDefault();
              setIsZoomed(true);
            }
          }}
          className={`group relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl w-full bg-[#07090E] block ${
            !hasError ? 'cursor-zoom-in' : ''
          }`}
        >
          {/* Skeleton Shimmer while loading */}
          {!loaded && !hasError && (
            <span className="block w-full aspect-video bg-gradient-to-r from-white/[0.02] via-white/[0.06] to-white/[0.02] animate-pulse" />
          )}

          {/* Fallback if URL fails */}
          {hasError ? (
            <span className="p-8 flex flex-col items-center justify-center gap-2 text-center text-xs font-mono text-gray-400 bg-red-500/[0.03] border border-red-500/20 rounded-xl">
              <span className="text-red-400 font-semibold">Image preview unavailable</span>
              {alt && <span className="text-gray-500 italic max-w-md">{alt}</span>}
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-primary underline underline-offset-4 hover:text-primary-light"
              >
                Open image source ↗
              </a>
            </span>
          ) : (
            <img
              src={src}
              alt={alt || 'Blog illustration'}
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setHasError(true)}
              className={`w-full h-auto object-contain mx-auto transition-all duration-500 ${
                loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.99] absolute inset-0'
              } group-hover:brightness-105`}
            />
          )}

          {/* Subtle hover expand pill */}
          {loaded && !hasError && (
            <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-mono text-gray-300 border border-white/10 flex items-center gap-1.5 shadow-lg pointer-events-none">
              <span>Click to expand</span>
            </span>
          )}
        </span>

        {alt && (
          <span className="text-center text-xs font-mono text-gray-400 mt-3 italic block max-w-2xl px-4">
            {alt}
          </span>
        )}
      </span>

      {/* Lightbox Modal */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div className="relative max-w-7xl max-h-[92vh] flex flex-col items-center">
            <img
              src={src}
              alt={alt || 'Enlarged illustration'}
              className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl border border-white/15"
            />
            {alt && (
              <p className="mt-4 text-xs sm:text-sm font-mono text-gray-300 text-center max-w-3xl bg-black/60 px-4 py-2 rounded-xl border border-white/10">
                {alt}
              </p>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
              className="absolute -top-12 right-0 sm:right-0 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono transition-all flex items-center gap-1.5"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Markdown component map ─────────────────────────────────────
const markdownComponents = {
  pre({ children }) {
    return <>{children}</>;
  },
  code({ node, inline, className, children, ...props }) {
    const match = /language-([a-zA-Z0-9_:-]+)/.exec(className || '');
    const rawLang = match ? match[1].toLowerCase() : '';
    const codeString = String(children || '').replace(/\n$/, '');

    // Archify System Architecture Diagram renderer
    if (rawLang === 'diagram:arch' || rawLang === 'archify' || rawLang === 'diagram') {
      return <ArchifyDiagram rawJson={codeString} />;
    }

    const isBlock = match || (!inline && codeString.includes('\n'));
    if (isBlock) {
      const cleanLang = rawLang || 'text';
      return <CodeBlockCard lang={cleanLang} code={codeString} />;
    }
    return (
      <code
        className="px-1.5 py-0.5 bg-zinc-800/80 text-emerald-300 rounded-md text-[0.9em] font-mono border border-zinc-700/50"
        {...props}
      >
        {children}
      </code>
    );
  },
  h1: ({ id, children }) => renderHeading(1, id || slugify(getNodeText(children)), children),
  h2: ({ id, children }) => renderHeading(2, id || slugify(getNodeText(children)), children),
  h3: ({ id, children }) => renderHeading(3, id || slugify(getNodeText(children)), children),
  p: ({ children }) => (
    <p className="text-gray-200/90 leading-[1.85] mb-7 text-[1.0625rem] sm:text-[1.125rem] font-sans antialiased selection:bg-primary/20 selection:text-white">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 mb-7 space-y-2 text-gray-200/90 leading-[1.8] font-sans antialiased">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 mb-7 space-y-2 text-gray-200/90 leading-[1.8] font-sans antialiased">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="mb-1 leading-[1.8] text-gray-200/90 font-sans antialiased">
      {children}
    </li>
  ),
  blockquote: ({ children }) => {
    const textContent = getNodeText(children).trim();
    const alertMatch = textContent.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/i);

    if (alertMatch) {
      const type = alertMatch[1].toUpperCase();
      // Remove alert marker from text
      const cleanText = textContent.replace(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/i, '');
      return <CalloutCard type={type}>{cleanText}</CalloutCard>;
    }

    return (
      <blockquote className="relative pl-6 sm:pl-8 pr-6 py-5 my-8 border-l-2 border-primary bg-gradient-to-r from-primary/[0.08] to-transparent rounded-r-2xl">
        <div className="text-gray-100 italic text-lg sm:text-xl font-medium leading-relaxed font-serif">
          {children}
        </div>
      </blockquote>
    );
  },
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all font-medium"
    >
      {children}
    </a>
  ),
  hr: () => (
    <div className="flex items-center gap-4 my-10">
      <div className="flex-1 h-px bg-white/10" />
      <div className="flex gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
      </div>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-8 rounded-2xl border border-white/10 shadow-xl bg-[#07090E]">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#0B0F19] border-b border-white/10">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-5 py-3.5 text-left font-mono font-semibold text-gray-300 text-xs uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-5 py-3.5 text-gray-300/90 leading-relaxed font-sans border-b border-white/5">
      {children}
    </td>
  ),
  img: BlogImage,
};

export default function BlogContent({ content }) {
  if (!content) return null;

  // Convert legacy BlockNote or Tiptap JSON to standardized Markdown string
  const markdown = contentToMarkdown(content);
  if (!markdown || !markdown.trim()) return null;

  return (
    <div className="blog-content w-full max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
