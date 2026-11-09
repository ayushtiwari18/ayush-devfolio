'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then(mod => mod.Prism),
  { ssr: false }
);

import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// ── Inline content renderer ───────────────────────────────────
function InlineContent({ content }) {
  if (!content?.length) return null;
  return content.map((item, i) => {
    if (item.type === 'link') {
      return (
        <a key={i} href={item.href}
          className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all font-medium"
          target="_blank" rel="noopener noreferrer">
          <InlineContent content={item.content} />
        </a>
      );
    }
    const s = item.styles || {};
    let el = <span key={i}>{item.text}</span>;
    if (s.bold)          el = <strong key={i} className="font-semibold text-foreground">{item.text}</strong>;
    if (s.italic)        el = <em key={i} className="italic">{item.text}</em>;
    if (s.underline)     el = <u key={i} className="underline underline-offset-2">{item.text}</u>;
    if (s.strikethrough) el = <s key={i} className="line-through opacity-50">{item.text}</s>;
    if (s.code)          el = <code key={i} className="px-1.5 py-0.5 bg-zinc-800/80 text-emerald-300 rounded-md text-[0.9em] font-mono border border-zinc-700/50">{item.text}</code>;
    if (s.textColor && s.textColor !== 'default') el = <span key={i} style={{ color: s.textColor }}>{item.text}</span>;
    if (s.backgroundColor && s.backgroundColor !== 'default')
      el = <mark key={i} style={{ backgroundColor: s.backgroundColor }} className="px-1 rounded text-foreground">{item.text}</mark>;
    return el;
  });
}

// ── Heading anchor id ─────────────────────────────────────────
function headingId(content) {
  return (content?.filter(i => i.type === 'text').map(i => i.text).join('') || '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
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
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-mono-code transition-all px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/10 active:scale-95"
    >
      {copied ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-semibold">Copied!</span>
        </>
      ) : (
        <span>Copy</span>
      )}
    </button>
  );
}

// ── Single block renderer ─────────────────────────────────────
function Block({ block }) {
  const { type, props = {}, content = [], children = [] } = block;
  const align = props.textAlignment === 'center' ? 'text-center'
    : props.textAlignment === 'right' ? 'text-right' : '';

  switch (type) {
    case 'paragraph':
      if (!content?.length) return <div className="mb-4" />;
      return (
        <p className={`text-gray-200/90 leading-[1.85] mb-7 text-[1.0625rem] sm:text-[1.125rem] font-sans antialiased selection:bg-primary/20 selection:text-white ${align}`}>
          <InlineContent content={content} />
        </p>
      );

    case 'heading': {
      const id = headingId(content);
      const level = props.level || 2;
      const base = `group relative font-bold text-foreground scroll-mt-28 tracking-tight ${align}`;
      const anchor = (
        <a href={`#${id}`}
          className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 text-primary/70 hover:text-primary transition-opacity text-base font-mono select-none"
          title="Direct link to heading">
          #
        </a>
      );
      const inner = <><InlineContent content={content} /></>;
      if (level === 1) return <h1 id={id} className={`${base} text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-16 mb-6 text-white`}>{anchor}{inner}</h1>;
      if (level === 2) return (
        <h2 id={id} className={`${base} text-2xl sm:text-3xl font-bold mt-14 mb-6 text-white border-b border-white/10 pb-3 flex items-center justify-between`}>
          <span>{anchor}{inner}</span>
          <span className="text-[11px] font-mono font-normal uppercase tracking-widest text-primary/60 hidden sm:inline-block">Section</span>
        </h2>
      );
      return <h3 id={id} className={`${base} text-xl sm:text-2xl font-bold mt-10 mb-4 text-gray-100`}>{anchor}{inner}</h3>;
    }

    case 'bulletListItem':
      return (
        <li className={`text-gray-200/90 leading-[1.8] mb-2 font-sans antialiased ${align}`}>
          <InlineContent content={content} />
          {children.length > 0 && <ul className="list-disc list-outside pl-5 mt-1.5 space-y-1"><Blocks blocks={children} /></ul>}
        </li>
      );

    case 'numberedListItem':
      return (
        <li className={`text-gray-200/90 leading-[1.8] mb-2 font-sans antialiased ${align}`}>
          <InlineContent content={content} />
          {children.length > 0 && <ol className="list-decimal list-outside pl-5 mt-1.5 space-y-1"><Blocks blocks={children} /></ol>}
        </li>
      );

    case 'checkListItem':
      return (
        <li className="flex flex-col gap-1 mb-2.5 w-full">
          <div className="flex items-start gap-3">
            <span className={`mt-1.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[10px] ${
              props.checked ? 'bg-primary border-primary text-primary-foreground' : 'border-zinc-600'
            }`}>
              {props.checked && '✓'}
            </span>
            <span className={`text-gray-200/90 leading-[1.8] text-[1.0625rem] sm:text-[1.125rem] font-sans antialiased ${props.checked ? 'line-through opacity-40' : ''}`}>
              <InlineContent content={content} />
            </span>
          </div>
          {children.length > 0 && (
            <div className="pl-7 mt-1 w-full">
              <Blocks blocks={children} />
            </div>
          )}
        </li>
      );

    case 'codeBlock': {
      const lang = props.language || 'text';
      const code = content?.filter(i => i.type === 'text').map(i => i.text).join('') || '';
      return (
        <div className="relative my-8 rounded-2xl overflow-hidden border border-white/10 bg-[#07090E] shadow-2xl shadow-black/50 group">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0B0F19] border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/90 border border-[#E0443E]/50 shadow-sm shadow-[#FF5F56]/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/90 border border-[#DEA123]/50 shadow-sm shadow-[#FFBD2E]/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/90 border border-[#1AAB29]/50 shadow-sm shadow-[#27C93F]/20" />
              </div>
              <span className="text-[11px] font-mono tracking-wider text-gray-400 uppercase font-semibold">
                {lang} <span className="text-gray-600">// source</span>
              </span>
            </div>
            <CopyButton code={code} />
          </div>
          <SyntaxHighlighter
            language={lang}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: '1.25rem 1.5rem',
              borderRadius: 0,
              background: '#07090E',
              fontSize: '0.875rem',
              lineHeight: '1.75',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
            }}
            showLineNumbers
            lineNumberStyle={{ color: '#4B5563', fontSize: '0.75rem', minWidth: '2.5em', paddingRight: '1rem', userSelect: 'none' }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    }

    case 'image':
      return (
        <figure className="my-9 flex flex-col items-center">
          <div 
            className="rounded-xl overflow-hidden border border-border shadow-lg"
            style={{ maxWidth: props.previewWidth ? `${props.previewWidth}px` : '100%', width: '100%' }}
          >
            <img 
              src={props.url} 
              alt={props.caption || ''} 
              className="w-full h-auto object-contain bg-muted/20 mx-auto" 
            />
          </div>
          {props.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
              {props.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'video':
      return (
        <div className="my-8 rounded-xl overflow-hidden border border-border shadow-lg">
          <video src={props.url} controls className="w-full" />
          {props.caption && <p className="text-center text-sm text-muted-foreground py-2 italic">{props.caption}</p>}
        </div>
      );

    case 'audio':
      return (
        <div className="my-6 p-4 bg-card border border-border rounded-xl">
          <audio src={props.url} controls className="w-full" />
          {props.caption && <p className="text-sm text-muted-foreground mt-2 italic text-center">{props.caption}</p>}
        </div>
      );

    case 'file':
      return (
        <a href={props.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 my-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-colors group">
          <span className="text-2xl">📄</span>
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{props.name || 'Download File'}</p>
            <p className="text-xs text-muted-foreground">Click to open</p>
          </div>
        </a>
      );

    case 'quote':
      return (
        <blockquote className="relative pl-6 sm:pl-8 pr-6 py-5 my-8 border-l-2 border-primary bg-gradient-to-r from-primary/[0.08] to-transparent rounded-r-2xl">
          <p className="text-gray-100 italic text-lg sm:text-xl font-medium leading-relaxed font-serif">
            <InlineContent content={content} />
          </p>
        </blockquote>
      );

    case 'callout': {
      const emoji = props.emoji || '💡';
      const colorMap = {
        blue:   { wrap: 'bg-blue-950/30 border-blue-500/30 text-blue-200',   icon: 'bg-blue-500/20 text-blue-300' },
        red:    { wrap: 'bg-red-950/30 border-red-500/30 text-red-200',     icon: 'bg-red-500/20 text-red-300' },
        yellow: { wrap: 'bg-amber-950/30 border-amber-500/30 text-amber-200', icon: 'bg-amber-500/20 text-amber-300' },
        green:  { wrap: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200', icon: 'bg-emerald-500/20 text-emerald-300' },
        purple: { wrap: 'bg-purple-950/30 border-purple-500/30 text-purple-200', icon: 'bg-purple-500/20 text-purple-300' },
        gray:   { wrap: 'bg-[#090D16] border-white/10 text-gray-200',   icon: 'bg-white/10 text-gray-300' },
      };
      const c = colorMap[props.backgroundColor] || colorMap.gray;
      return (
        <div className={`flex gap-4 p-5 my-7 rounded-2xl border backdrop-blur-sm ${c.wrap} shadow-lg shadow-black/20`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base ${c.icon}`}>
            {emoji}
          </div>
          <div className="text-[0.9375rem] leading-[1.75] font-sans">
            <InlineContent content={content} />
          </div>
        </div>
      );
    }

    case 'table': {
      const rows = content?.rows || [];
      if (!rows.length) return null;
      const [header, ...body] = rows;
      return (
        <div className="overflow-x-auto my-8 rounded-2xl border border-white/10 shadow-xl bg-[#07090E]">
          <table className="w-full text-sm">
            <thead className="bg-[#0B0F19] border-b border-white/10">
              <tr>
                {header?.cells?.map((cell, i) => (
                  <th key={i} className="px-5 py-3.5 text-left font-mono font-semibold text-gray-300 text-xs uppercase tracking-wider">
                    <InlineContent content={cell.content || cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {body.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? '' : 'bg-white/[0.02] hover:bg-white/[0.04] transition-colors'}>
                  {row.cells?.map((cell, ci) => (
                    <td key={ci} className="px-5 py-3.5 text-gray-300/90 leading-relaxed font-sans">
                      <InlineContent content={cell.content || cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'divider':
      return (
        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          </div>
          <div className="flex-1 h-px bg-white/10" />
        </div>
      );

    default:
      if (content?.length) {
        return <p className="text-gray-200/90 leading-[1.8] mb-5 font-sans"><InlineContent content={content} /></p>;
      }
      return null;
  }
}

// ── List grouper ──────────────────────────────────────────────
function Blocks({ blocks }) {
  if (!blocks?.length) return null;
  const result = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === 'bulletListItem') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'bulletListItem') items.push(blocks[i++]);
      result.push(
        <ul key={`ul-${i}`} className="list-none pl-0 space-y-3 mb-7">
          {items.map((item, j) => (
            <li key={j} className="flex flex-col gap-1 w-full">
              <div className="flex items-start gap-3">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-sm shadow-primary/60" />
                <span className="text-gray-200/90 leading-[1.8] text-[1.0625rem] sm:text-[1.125rem] font-sans antialiased">
                  <InlineContent content={item.content} />
                </span>
              </div>
              {item.children?.length > 0 && (
                <div className="pl-6 mt-2 w-full">
                  <Blocks blocks={item.children} />
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    } else if (b.type === 'numberedListItem') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'numberedListItem') items.push(blocks[i++]);
      result.push(
        <ol key={`ol-${i}`} className="space-y-3 mb-7 pl-0 list-none">
          {items.map((item, j) => (
            <li key={j} className="flex flex-col gap-1 w-full">
              <div className="flex items-start gap-3.5">
                <span className="shrink-0 w-6 h-6 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                  {j + 1}
                </span>
                <span className="text-gray-200/90 leading-[1.8] text-[1.0625rem] sm:text-[1.125rem] font-sans antialiased">
                  <InlineContent content={item.content} />
                </span>
              </div>
              {item.children?.length > 0 && (
                <div className="pl-8 mt-2 w-full">
                  <Blocks blocks={item.children} />
                </div>
              )}
            </li>
          ))}
        </ol>
      );
    } else if (b.type === 'checkListItem') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'checkListItem') items.push(blocks[i++]);
      result.push(
        <ul key={`cl-${i}`} className="space-y-2.5 mb-7 list-none pl-0">
          {items.map((item, j) => <Block key={j} block={item} />)}
        </ul>
      );
    } else {
      result.push(<Block key={i} block={b} />);
      i++;
    }
  }
  return result;
}

export default function BlogContent({ content }) {
  if (!content) return null;

  let blocks;
  try {
    blocks = typeof content === 'string' ? JSON.parse(content) : content;
  } catch {
    return (
      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    );
  }

  if (!Array.isArray(blocks)) return null;

  return (
    <div className="blog-content max-w-[720px] mx-auto w-full">
      <Blocks blocks={blocks} />
    </div>
  );
}
