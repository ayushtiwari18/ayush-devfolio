import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// ── Inline content renderer ──────────────────────────────────
function InlineContent({ content }) {
  if (!content?.length) return null;
  return content.map((item, i) => {
    if (item.type === 'link') {
      return (
        <a key={i} href={item.href}
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
          target="_blank" rel="noopener noreferrer">
          <InlineContent content={item.content} />
        </a>
      );
    }
    const s = item.styles || {};
    let el = item.text;
    if (s.bold)          el = <strong key={i} className="font-semibold text-foreground">{el}</strong>;
    if (s.italic)        el = <em key={i} className="italic">{el}</em>;
    if (s.underline)     el = <u key={i} className="underline underline-offset-2">{el}</u>;
    if (s.strikethrough) el = <s key={i} className="line-through opacity-60">{el}</s>;
    if (s.code)          el = <code key={i} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[0.875em] font-mono">{el}</code>;
    if (s.textColor && s.textColor !== 'default') el = <span key={i} style={{ color: s.textColor }}>{el}</span>;
    if (s.backgroundColor && s.backgroundColor !== 'default')
      el = <span key={i} style={{ backgroundColor: s.backgroundColor }} className="px-1 rounded">{el}</span>;
    return <span key={i}>{el}</span>;
  });
}

// ── Heading anchor helper ─────────────────────────────────────
function headingId(content) {
  return content?.filter(i => i.type === 'text').map(i => i.text).join('')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
}

// ── Single block renderer ─────────────────────────────────────
function Block({ block }) {
  const { type, props = {}, content = [], children = [] } = block;

  const align = props.textAlignment === 'center' ? 'text-center'
    : props.textAlignment === 'right' ? 'text-right' : 'text-left';

  switch (type) {
    case 'paragraph':
      return (
        <p className={`text-foreground/80 leading-[1.85] mb-5 text-[1.05rem] ${align}`}>
          <InlineContent content={content} />
        </p>
      );

    case 'heading': {
      const id = headingId(content);
      const level = props.level || 2;
      const base = 'group relative font-bold text-foreground scroll-mt-24';
      const anchor = (
        <a href={`#${id}`}
          className="absolute -left-5 opacity-0 group-hover:opacity-100 text-primary transition-opacity">#</a>
      );
      if (level === 1) return <h1 id={id} className={`${base} text-3xl mt-10 mb-4 ${align}`}>{anchor}<InlineContent content={content} /></h1>;
      if (level === 2) return <h2 id={id} className={`${base} text-2xl mt-10 mb-4 pb-2 border-b border-border ${align}`}>{anchor}<InlineContent content={content} /></h2>;
      return <h3 id={id} className={`${base} text-xl mt-8 mb-3 ${align}`}>{anchor}<InlineContent content={content} /></h3>;
    }

    case 'bulletListItem':
      return (
        <li className={`text-foreground/80 leading-relaxed mb-1 ${align}`}>
          <InlineContent content={content} />
          {children.length > 0 && <ul className="list-disc list-outside pl-5 mt-1 space-y-1"><Blocks blocks={children} /></ul>}
        </li>
      );

    case 'numberedListItem':
      return (
        <li className={`text-foreground/80 leading-relaxed mb-1 ${align}`}>
          <InlineContent content={content} />
          {children.length > 0 && <ol className="list-decimal list-outside pl-5 mt-1 space-y-1"><Blocks blocks={children} /></ol>}
        </li>
      );

    case 'checkListItem':
      return (
        <li className="flex items-start gap-2.5 mb-2">
          <input type="checkbox" checked={props.checked || false} readOnly
            className="mt-1 w-4 h-4 accent-primary shrink-0" />
          <span className={`text-foreground/80 leading-relaxed ${props.checked ? 'line-through opacity-50' : ''}`}>
            <InlineContent content={content} />
          </span>
        </li>
      );

    case 'codeBlock': {
      const lang = props.language || 'text';
      const code = content?.filter(i => i.type === 'text').map(i => i.text).join('') || '';
      return (
        <div className="relative mb-6 rounded-xl overflow-hidden border border-border">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a2e] border-b border-border">
            <span className="text-xs font-mono text-muted-foreground">{lang}</span>
          </div>
          <SyntaxHighlighter
            language={lang}
            style={oneDark}
            customStyle={{ margin: 0, borderRadius: 0, background: '#0d1117', fontSize: '0.875rem' }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );
    }

    case 'image':
      return (
        <figure className="my-8">
          <img src={props.url} alt={props.caption || ''}
            className="w-full rounded-xl border border-border" />
          {props.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
              {props.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'video':
      return (
        <div className="my-8 rounded-xl overflow-hidden border border-border">
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
          className="flex items-center gap-3 p-4 my-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-colors">
          <span className="text-2xl">📄</span>
          <div>
            <p className="text-sm font-medium text-foreground">{props.name || 'Download File'}</p>
            <p className="text-xs text-muted-foreground">Click to open</p>
          </div>
        </a>
      );

    case 'quote':
      return (
        <blockquote className="relative pl-5 pr-4 py-3 my-6 bg-primary/5 border border-primary/20 rounded-r-xl border-l-4 border-l-primary italic text-foreground/70 text-lg">
          <InlineContent content={content} />
        </blockquote>
      );

    case 'callout': {
      const emoji = props.emoji || '💡';
      const colorMap = {
        blue:   'bg-blue-500/10 border-blue-500/30 text-blue-200',
        red:    'bg-red-500/10 border-red-500/30 text-red-200',
        yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200',
        green:  'bg-green-500/10 border-green-500/30 text-green-200',
        gray:   'bg-muted border-border text-muted-foreground',
      };
      const colorClass = colorMap[props.backgroundColor] || colorMap.gray;
      return (
        <div className={`flex gap-3 p-4 my-5 rounded-xl border ${colorClass}`}>
          <span className="text-xl shrink-0">{emoji}</span>
          <div className="text-sm leading-relaxed"><InlineContent content={content} /></div>
        </div>
      );
    }

    case 'table': {
      const rows = content?.rows || [];
      if (!rows.length) return null;
      const [header, ...body] = rows;
      return (
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-primary/10">
              <tr>
                {header?.cells?.map((cell, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold text-foreground border-b border-border">
                    <InlineContent content={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className="hover:bg-primary/5 transition-colors">
                  {row.cells?.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 border-b border-border text-foreground/80">
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
      return <hr className="border-border my-8" />;

    default:
      // Fallback — render inline content if any
      if (content?.length) {
        return <p className="text-foreground/80 leading-relaxed mb-4"><InlineContent content={content} /></p>;
      }
      return null;
  }
}

// ── List wrapper — groups consecutive list items ──────────────
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
        <ul key={`ul-${i}`} className="list-disc list-outside pl-6 space-y-1.5 text-foreground/80 mb-5">
          {items.map((item, j) => <Block key={j} block={item} />)}
        </ul>
      );
    } else if (b.type === 'numberedListItem') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'numberedListItem') items.push(blocks[i++]);
      result.push(
        <ol key={`ol-${i}`} className="list-decimal list-outside pl-6 space-y-1.5 text-foreground/80 mb-5">
          {items.map((item, j) => <Block key={j} block={item} />)}
        </ol>
      );
    } else if (b.type === 'checkListItem') {
      const items = [];
      while (i < blocks.length && blocks[i].type === 'checkListItem') items.push(blocks[i++]);
      result.push(
        <ul key={`cl-${i}`} className="space-y-1.5 mb-5 list-none pl-0">
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

  // Parse JSON blocks
  let blocks;
  try {
    blocks = typeof content === 'string' ? JSON.parse(content) : content;
  } catch {
    // Fallback: render as plain text if not valid JSON (legacy posts)
    return (
      <div className="prose prose-lg prose-invert max-w-none">
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
