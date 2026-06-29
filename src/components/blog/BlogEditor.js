'use client';

import { useCallback } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';

function countWords(blocks) {
  if (!blocks?.length) return 0;
  let count = 0;
  const walk = (blocks) => {
    for (const block of blocks) {
      if (Array.isArray(block.content)) {
        for (const inline of block.content) {
          if (inline.type === 'text') count += inline.text.trim().split(/\s+/).filter(Boolean).length;
        }
      }
      if (block.type === 'codeBlock' || block.type === 'mermaid' || block.type === 'callout') {
        const txt = block.props?.code || block.props?.text || '';
        count += txt.trim().split(/\s+/).filter(Boolean).length;
      }
      if (block.children?.length) walk(block.children);
    }
  };
  walk(blocks);
  return count;
}

function extractExcerpt(blocks) {
  if (!blocks?.length) return '';
  for (const block of blocks) {
    if (block.type === 'paragraph' && Array.isArray(block.content)) {
      const text = block.content.filter(i => i.type === 'text').map(i => i.text).join('');
      if (text.trim().length > 20) return text.trim().substring(0, 200);
    }
  }
  return '';
}

export default function BlogEditor({ value, onChange, onMetaChange }) {
  const editor = useCreateBlockNote({
    initialContent: (() => {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
      } catch {
        return undefined;
      }
    })(),
  });

  const handleChange = useCallback(() => {
    const blocks = editor.document;
    const json = JSON.stringify(blocks);
    onChange(json);
    const words = countWords(blocks);
    const reading_time = Math.max(1, Math.ceil(words / 200));
    const excerpt = extractExcerpt(blocks);
    onMetaChange?.({ reading_time, excerpt });
  }, [editor, onChange, onMetaChange]);

  return (
    <div className="min-h-[500px] rounded-xl border border-border bg-background overflow-hidden blog-editor">
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme="dark"
      />
    </div>
  );
}
