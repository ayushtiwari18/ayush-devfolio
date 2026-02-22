/**
 * ProjectSection  — SERVER COMPONENT
 * ------------------------------------
 * Generic reusable section block.
 * Renders only when `content` is non-null and non-empty.
 * Uses react-markdown for rich text rendering.
 *
 * Props:
 *   title    – section heading (string)
 *   content  – markdown string or null
 *   icon     – optional emoji/icon string shown beside title
 */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectSection({ title, content, icon }) {
  if (!content || content.trim() === '') return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        {icon && <span aria-hidden="true">{icon}</span>}
        {title}
      </h2>
      <div className="prose prose-invert prose-blue max-w-none text-muted-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </section>
  );
}
