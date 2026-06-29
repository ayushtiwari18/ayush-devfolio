import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function BlogContent({ content }) {
  if (!content) return null;
  return (
    <div className="prose prose-lg prose-invert max-w-none blog-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="group relative text-3xl font-bold text-foreground mt-10 mb-4 scroll-mt-24" {...props}>
              <a href={`#${props.id}`} className="absolute -left-6 top-1 opacity-0 group-hover:opacity-100 text-primary transition-opacity">#</a>
              {props.children}
            </h1>
          ),
          h2: ({ node, ...props }) => (
            <h2 className="group relative text-2xl font-bold text-foreground mt-10 mb-4 pb-2 border-b border-border scroll-mt-24" {...props}>
              <a href={`#${props.id}`} className="absolute -left-6 top-1 opacity-0 group-hover:opacity-100 text-primary transition-opacity">#</a>
              {props.children}
            </h2>
          ),
          h3: ({ node, ...props }) => (
            <h3 className="group relative text-xl font-semibold text-foreground mt-8 mb-3 scroll-mt-24" {...props}>
              <a href={`#${props.id}`} className="absolute -left-6 top-0.5 opacity-0 group-hover:opacity-100 text-primary transition-opacity">#</a>
              {props.children}
            </h3>
          ),
          p: ({ node, ...props }) => (
            <p className="text-foreground/80 leading-[1.85] mb-5 text-[1.05rem]" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside pl-6 space-y-2 text-foreground/80 mb-5" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside pl-6 space-y-2 text-foreground/80 mb-5" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="relative pl-5 pr-4 py-3 my-6 bg-primary/5 border border-primary/20 rounded-r-xl border-l-4 border-l-primary italic text-foreground/70 text-lg" {...props} />
          ),
          code: ({ node, inline, className, ...props }) =>
            inline
              ? <code className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[0.875em] font-mono" {...props} />
              : <code className={`block text-sm font-mono ${className || ''}`} {...props} />,
          pre: ({ node, ...props }) => (
            <pre className="relative rounded-xl overflow-x-auto mb-6 border border-border bg-[#0d1117] text-sm" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-primary/10 text-foreground" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-3 text-left font-semibold border-b border-border" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-3 border-b border-border text-foreground/80" {...props} />
          ),
          hr: () => <hr className="border-border my-8" />,
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          img: ({ node, src, alt, ...props }) => (
            <figure className="my-8">
              <img src={src} alt={alt} className="w-full rounded-xl border border-border" {...props} />
              {alt && <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">{alt}</figcaption>}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
