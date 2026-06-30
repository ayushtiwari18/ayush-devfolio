'use client';

import { useEffect, useRef } from 'react';
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
          if (inline.type === 'text')
            count += inline.text.trim().split(/\s+/).filter(Boolean).length;
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
      const text = block.content
        .filter((i) => i.type === 'text')
        .map((i) => i.text)
        .join('');
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

  // Subscribe to document changes via the correct BlockNote API
  useEffect(() => {
    if (!editor) return;
    const unsubscribe = editor.onChange(() => {
      const blocks = editor.document;
      onChangeRef.current(JSON.stringify(blocks));
      const words = countWords(blocks);
      onMetaChangeRef.current?.({
        reading_time: Math.max(1, Math.ceil(words / 200)),
        excerpt: extractExcerpt(blocks),
      });
    });
    return () => unsubscribe?.();
  }, [editor]);

  return (
    // stopPropagation on the wrapper div prevents ANY button click inside
    // BlockNote from bubbling up to the parent <form> as a submit event.
    // We do NOT call preventDefault here — that would break editor interactions.
    <div
      className="bn-editor-wrapper min-h-[500px] rounded-xl border border-border bg-background overflow-hidden"
      onClickCapture={(e) => {
        if (
          e.target.tagName === 'BUTTON' ||
          e.target.closest?.('button')
        ) {
          e.stopPropagation();
        }
      }}
    >
      <BlockNoteView editor={editor} theme="dark" />
    </div>
  );
}
