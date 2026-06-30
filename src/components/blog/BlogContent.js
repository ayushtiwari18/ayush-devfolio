import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
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
    if (s.code)          el = <code key={i} className="px-1.5 py-0.5 bg-zinc-800 text-emerald-300 rounded text-[0.85em] font-mono border border-zinc-700">{item.text}</code>;
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

// ── Copy-code button (client interaction via inline onclick) ──
function CopyButton({ code }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        navigator.clipboard.writeText(code).then(() => {
          const btn = e.currentTarget;
          btn.textContent = 'Copied!';
          btn.classList.add('text-green-400');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('text-green-400');
          }, 1500);
        });
      }}
      className="text-xs text-zinc-400 hover:text-white font-mono transition-colors px-2 py-0.5 rounded hover:bg-zinc-700"
    >
      Copy
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
      if (!content?.length) return <div className="mb-3" />;
      return (
        <p className={`text-foreground/85 leading-[1.9] mb-5 text-[1.05rem] ${align}`}>
          <InlineContent content={content} />
        </p>
      );

    case 'heading': {
      const id = headingId(content);
      const level = props.level || 2;
      const base = `group relative font-bold text-foreground scroll-mt-28 ${align}`;
      const anchor = (
        <a href={`#${id}`}
          className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 text-primary/60 hover:text-primary transition-opacity text-base font-mono">
          #
        </a>
      );
      const inner = <><InlineContent content={content} /></>;
      if (level === 1) return <h1 id={id} className={`${base} text-3xl lg:text-4xl mt-12 mb-4`}>{anchor}{inner}</h1>;
      if (level === 2) return (
        <h2 id={id} className={`${base} text-2xl mt-12 mb-4`}>
          {anchor}
          <span className="inline-flex items-center gap-2">
            <span className="text-primary text-lg font-black">//</span>
            {inner}
          </span>
        </h2>
      );
      return <h3 id={id} className={`${base} text-xl mt-8 mb-3 text-foreground/90`}>{anchor}{inner}</h3>;
    }

    case 'bulletListItem':
      return (
        <li className={`text-foreground/80 leading-relaxed mb-2 ${align}`}>
          <InlineContent content={content} />
          {children.length > 0 && <ul className="list-disc list-outside pl-5 mt-1.5 space-y-1"><Blocks blocks={children} /></ul>}
        </li>
      );

    case 'numberedListItem':
      return (
        <li className={`text-foreground/80 leading-relaxed mb-2 ${align}`}>
          <InlineContent content={content} />
          {children.length > 0 && <ol className="list-decimal list-outside pl-5 mt-1.5 space-y-1"><Blocks blocks={children} /></ol>}
        </li>
      );

    case 'checkListItem':
      return (
        <li className="flex items-start gap-3 mb-2.5">
          <span className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[10px] ${
            props.checked ? 'bg-primary border-primary text-primary-foreground' : 'border-zinc-600'
          }`}>
            {props.checked && '✓'}
          </span>
          <span className={`text-foreground/80 leading-relaxed ${props.checked ? 'line-through opacity-40' : ''}`}>
            <InlineContent content={content} />
          </span>
        </li>
      );

    case 'codeBlock': {
      const lang = props.language || 'text';
      const code = content?.filter(i => i.type === 'text').map(i => i.text).join('') || '';
      return (
        <div className="relative my-7 rounded-xl overflow-hidden border border-zinc-700/60 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-700/60">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
              </div>
              <span className="text-xs font-mono text-zinc-400 ml-1">{lang}</span>
            </div>
            <CopyButton code={code} />
          </div>
          <SyntaxHighlighter
            language={lang}
            style={oneDark}
            customStyle={{ margin: 0, borderRadius: 0, background: '#0d1117', fontSize: '0.875rem', lineHeight: '1.7' }}
            showLineNumbers
            lineNumberStyle={{ color: '#4a5568', fontSize: '0.75rem', minWidth: '2.5em' }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    }

    case 'image':
      return (
        <figure className="my-9">
          <div className="rounded-xl overflow-hidden border border-border shadow-lg">
            <img src={props.url} alt={props.caption || ''} className="w-full" />
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
        <blockquote className="relative pl-6 pr-5 py-4 my-7 border-l-4 border-primary bg-primary/5 rounded-r-xl">
          <p className="text-foreground/80 italic text-lg leading-relaxed">
            <InlineContent content={content} />
          </p>
        </blockquote>
      );

    case 'callout': {
      const emoji = props.emoji || '💡';
      const colorMap = {
        blue:   { wrap: 'bg-blue-950/40 border-blue-500/30',   text: 'text-blue-200' },
        red:    { wrap: 'bg-red-950/40 border-red-500/30',     text: 'text-red-200' },
        yellow: { wrap: 'bg-yellow-950/40 border-yellow-500/30', text: 'text-yellow-200' },
        green:  { wrap: 'bg-green-950/40 border-green-500/30', text: 'text-green-200' },
        purple: { wrap: 'bg-purple-950/40 border-purple-500/30', text: 'text-purple-200' },
        gray:   { wrap: 'bg-zinc-800/50 border-zinc-600/40',   text: 'text-zinc-300' },
      };
      const c = colorMap[props.backgroundColor] || colorMap.gray;
      return (
        <div className={`flex gap-3.5 p-4 my-6 rounded-xl border ${c.wrap}`}>
          <span className="text-xl shrink-0 mt-0.5">{emoji}</span>
          <div className={`text-sm leading-relaxed ${c.text}`}>
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
        <div className="overflow-x-auto my-7 rounded-xl border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-primary/10 border-b border-border">
              <tr>
                {header?.cells?.map((cell, i) => (
                  <th key={i} className="px-5 py-3 text-left font-semibold text-foreground text-xs uppercase tracking-wider">
                    <InlineContent content={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {body.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? '' : 'bg-primary/3'}>
                  {row.cells?.map((cell, ci) => (
                    <td key={ci} className="px-5 py-3 text-foreground/80">
                      <InlineContent content={cell} />
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
          <div className="flex-1 h-px bg-border" />
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>
      );

    default:
      if (content?.length) {
        return <p className="text-foreground/80 leading-relaxed mb-4"><InlineContent content={content} /></p>;
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
        <ul key={`ul-${i}`} className="list-none pl-0 space-y-2 mb-6">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-foreground/80 leading-relaxed text-[1.02rem]">
                <InlineContent content={item.content} />
              </span>
            </li>
          ))}
        </ul>
      );
    } else if (b.type === 'numberedListItem') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'numberedListItem') items.push(blocks[i++]);
      result.push(
        <ol key={`ol-${i}`} className="space-y-2 mb-6 pl-0 list-none">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                {j + 1}
              </span>
              <span className="text-foreground/80 leading-relaxed text-[1.02rem]">
                <InlineContent content={item.content} />
              </span>
            </li>
          ))}
        </ol>
      );
    } else if (b.type === 'checkListItem') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'checkListItem') items.push(blocks[i++]);
      result.push(
        <ul key={`cl-${i}`} className="space-y-2 mb-6 list-none pl-0">
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
        <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    );
  }

  if (!Array.isArray(blocks)) return null;

  return (
    <div className="blog-content max-w-none">
      <Blocks blocks={blocks} />
    </div>
  );
}
