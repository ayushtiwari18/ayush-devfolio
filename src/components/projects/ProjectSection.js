import {
  Target, Lightbulb, FolderTree, Zap, Scale, BookOpen, Telescope,
  ShieldCheck, LayoutTemplate,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ICON_MAP = {
  'Problem Statement': Target,
  'Solution':          Lightbulb,
  'Code Structure':    FolderTree,
  'Performance Decisions': Zap,
  'Trade-offs Made':   Scale,
  'Lessons Learned':   BookOpen,
  'Future Improvements': Telescope,
  'Security Considerations': ShieldCheck,
  'Architecture':      LayoutTemplate,
};

export default function ProjectSection({ title, content, icon }) {
  if (!content || content.trim() === '') return null;

  const LucideIcon = ICON_MAP[title];

  return (
    <section id={title.toLowerCase().replace(/\s+/g, '-')} className="mb-12 scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
          {LucideIcon
            ? <LucideIcon size={17} className="text-primary" />
            : <span className="text-base" aria-hidden="true">{icon}</span>
          }
        </div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="pl-0 border-l-2 border-primary/20 pl-5">
        <div className="prose prose-invert prose-blue max-w-none text-muted-foreground prose-p:leading-relaxed prose-p:text-[0.95rem]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
