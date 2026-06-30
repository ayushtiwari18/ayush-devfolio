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

// ─── DIAGNOSTIC: intercept ALL form submits on the document ──────────────────
// This runs once when the module loads and catches any submit regardless of
// where it originated — inside a portal, outside the wrapper, anywhere.
if (typeof window !== 'undefined') {
  window.__bnSubmitDebugAttached = window.__bnSubmitDebugAttached || false;
  if (!window.__bnSubmitDebugAttached) {
    window.__bnSubmitDebugAttached = true;
    document.addEventListener('submit', (e) => {
      console.group('%c[BlogEditor DEBUG] 🚨 FORM SUBMIT INTERCEPTED on document', 'color:red;font-weight:bold;font-size:14px');
      console.log('submitting element:', e.target);
      console.log('submit target tagName:', e.target?.tagName);
      console.log('submit target id:', e.target?.id);
      console.log('submit target className:', e.target?.className);
      console.log('composed path (full bubble chain):',
        e.composedPath().map(n => {
          if (n === document) return 'document';
          if (n === window) return 'window';
          if (n?.tagName) return `${n.tagName.toLowerCase()}${n.id ? '#'+n.id : ''}${n.className ? '.'+String(n.className).split(' ').filter(Boolean).join('.') : ''}`;
          return String(n);
        })
      );
      console.groupEnd();
    }, true); // capture phase — fires before anything can stopPropagation
  }
}

export default function BlogEditor({ value, onChange, onMetaChange }) {
  const onChangeRef     = useRef(onChange);
  const onMetaChangeRef = useRef(onMetaChange);
  const hasInitialized  = useRef(false);
  const wrapperRef      = useRef(null);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onMetaChangeRef.current = onMetaChange; }, [onMetaChange]);

  const editor = useCreateBlockNote();

  // ─── DIAGNOSTIC: watch ALL clicks on document in capture phase ──────────────
  // Tells us: which element was clicked, is it inside our wrapper or a portal,
  // is it a button, what's its full DOM path.
  useEffect(() => {
    const handler = (e) => {
      const target = e.target;
      const isButton = target.tagName === 'BUTTON' || target.closest?.('button');
      if (!isButton) return; // only log button clicks to keep console clean

      const insideWrapper = wrapperRef.current?.contains(target);
      const btn = target.tagName === 'BUTTON' ? target : target.closest('button');

      console.group('%c[BlogEditor DEBUG] 🖱️ BUTTON CLICK detected', 'color:#f59e0b;font-weight:bold');
      console.log('clicked element:', target);
      console.log('nearest button:', btn);
      console.log('button type attr:', btn?.getAttribute('type') ?? '(none — defaults to submit!)');
      console.log('button textContent:', btn?.textContent?.trim()?.slice(0, 80));
      console.log('button aria-label:', btn?.getAttribute('aria-label'));
      console.log('inside editor wrapper div?', insideWrapper);
      console.log('inside document.body directly (portal)?', !insideWrapper);
      console.log('composedPath:',
        e.composedPath().slice(0, 8).map(n => {
          if (n === document) return 'document';
          if (n === window) return 'window';
          if (n?.tagName) return `${n.tagName.toLowerCase()}${n.id ? '#'+n.id : ''}${n.className ? '.'+String(n.className).split(' ').filter(Boolean).slice(0,3).join('.') : ''}`;
          return String(n);
        })
      );
      console.groupEnd();
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  // FIX 1 — replaceBlocks on first real async value
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

  // Subscribe to document changes
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
    <div
      ref={wrapperRef}
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
