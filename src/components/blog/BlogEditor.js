'use client';

import { useCallback, useEffect, useRef } from 'react';
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
  const onChangeRef = useRef(onChange);
  const onMetaChangeRef = useRef(onMetaChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onMetaChangeRef.current = onMetaChange; }, [onMetaChange]);

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

  // Wire BlockNote's internal onChange to parent via editor.onChange API
  useEffect(() => {
    if (!editor) return;
    const unsubscribe = editor.onChange(() => {
      const blocks = editor.document;
      const json = JSON.stringify(blocks);
      onChangeRef.current(json);
      const words = countWords(blocks);
      const reading_time = Math.max(1, Math.ceil(words / 200));
      const excerpt = extractExcerpt(blocks);
      onMetaChangeRef.current?.({ reading_time, excerpt });
    });
    return () => unsubscribe?.();
  }, [editor]);

  // Block ALL clicks inside the editor from bubbling to the <form>
  // This prevents BlockNote's internal buttons (+ / formatting toolbar)
  // from being treated as form submit buttons
  const stopFormSubmit = useCallback((e) => {
    const tag = e.target.tagName;
    if (tag === 'BUTTON' || e.target.closest('button')) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return (
    <div
      className="min-h-[500px] rounded-xl border border-border bg-background overflow-hidden blog-editor"
      onClick={stopFormSubmit}
      onClickCapture={stopFormSubmit}
    >
      <BlockNoteView
        editor={editor}
        theme="dark"
      />
    </div>
  );
}
