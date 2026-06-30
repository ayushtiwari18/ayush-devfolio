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
  const hasInitialized  = useRef(false);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onMetaChangeRef.current = onMetaChange; }, [onMetaChange]);

  const editor = useCreateBlockNote();

  // Load real DB content once after async fetchPost completes.
  // hasInitialized ref ensures this runs exactly once —
  // never overriding subsequent user edits.
  useEffect(() => {
    if (!editor || hasInitialized.current) return;
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      if (Array.isArray(parsed) && parsed.length > 0) {
        editor.replaceBlocks(editor.document, parsed);
        hasInitialized.current = true;
      }
    } catch (e) {
      console.error('[BlogEditor] replaceBlocks failed:', e);
    }
  }, [editor, value]);

  // Subscribe to editor changes
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
    // overflow-hidden REMOVED — it was clipping BlockNote's absolutely-positioned
    // slash menu, tooltips, and side-menu causing overlap/cut-off UI.
    // The + button redirect is handled in page.js via submitter check on onSubmit.
    <div className="bn-editor-wrapper min-h-[500px] rounded-xl border border-border bg-background">
      <BlockNoteView editor={editor} theme="dark" />
    </div>
  );
}
