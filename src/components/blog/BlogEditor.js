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
  const onChangeRef     = useRef(onChange);
  const onMetaChangeRef = useRef(onMetaChange);
  // FIX 1 guard: flip to true after the first real DB content is loaded
  // so subsequent user edits never trigger a replaceBlocks() override.
  const hasInitialized  = useRef(false);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onMetaChangeRef.current = onMetaChange; }, [onMetaChange]);

  // Initialize editor with empty content — the real content arrives via the
  // useEffect below once the async fetchPost completes and value changes.
  const editor = useCreateBlockNote();

  // FIX 1 — Re-initialize editor when the real DB value arrives asynchronously.
  // useCreateBlockNote() can't react to prop changes so we drive it manually.
  // hasInitialized ensures we do this ONCE only; after that user edits own the content.
  useEffect(() => {
    if (!editor || hasInitialized.current) return;
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      if (Array.isArray(parsed) && parsed.length > 0) {
        editor.replaceBlocks(editor.document, parsed);
        hasInitialized.current = true;
        console.log('[BlogEditor] replaceBlocks on init — blocks:', parsed.length);
      }
    } catch (e) {
      console.error('[BlogEditor] replaceBlocks failed:', e);
    }
  }, [editor, value]);

  // Subscribe to document changes via the BlockNote onChange API
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
    // FIX 2 — stopPropagation on BOTH click and submit capture so BlockNote's
    // internal +/slash-menu buttons never bubble up to the parent <form>
    // and trigger an unintended form submission + router redirect.
    <div
      className="bn-editor-wrapper min-h-[500px] rounded-xl border border-border bg-background overflow-hidden"
      onClickCapture={(e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest?.('button')) {
          e.stopPropagation();
        }
      }}
      onSubmitCapture={(e) => e.stopPropagation()}
    >
      <BlockNoteView editor={editor} theme="dark" />
    </div>
  );
}
