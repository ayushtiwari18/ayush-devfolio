'use client';

import { useEffect, useRef } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import { countWords, extractExcerpt } from '@/lib/blogUtils';
import { uploadImage } from '@/lib/storage';

export default function BlogEditor({ value, onChange, onMetaChange }) {
  const onChangeRef     = useRef(onChange);
  const onMetaChangeRef = useRef(onMetaChange);
  const hasInitialized  = useRef(false);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onMetaChangeRef.current = onMetaChange; }, [onMetaChange]);

  const editor = useCreateBlockNote({
    uploadFile: async (file) => {
      // Upload image to the "blog" folder in Supabase storage
      const { url, error } = await uploadImage(file, 'blog');
      if (error) {
        alert('Image upload failed: ' + error);
        throw new Error(error);
      }
      return url; // Returns public URL to BlockNote to render and save
    }
  });

  // Load real DB content once after async fetchPost completes.
  // hasInitialized ref ensures this runs exactly once —
  // never overriding subsequent user edits.
  useEffect(() => {
    if (!editor || hasInitialized.current) return;
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      if (Array.isArray(parsed) && parsed.length > 0) {
        editor.replaceBlocks(editor.document, parsed);
      }
      // Unconditionally mark as initialized to prevent overwriting user edits on empty posts
      hasInitialized.current = true;
    } catch (e) {
      console.error('[BlogEditor] replaceBlocks failed:', e);
      // Mark true on error too, to prevent infinite loops
      hasInitialized.current = true;
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
    <div className="bn-editor-wrapper min-h-[500px] rounded-xl border border-border bg-background relative z-10">
      <style>{`
        /* Force ONLY the main editor BlockNote container to be transparent */
        .bn-editor-wrapper > .bn-container,
        .bn-editor-wrapper .bn-editor {
          background-color: transparent !important;
        }
        
        /* Fix the Menu Overlapping and Transparency Bug */
        .bn-menu-dropdown, .bn-popover, .bn-tooltip, [data-radix-popper-content-wrapper], .bn-suggestion-menu {
          z-index: 99999 !important;
          background-color: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border)) !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
          border-radius: 8px !important;
          color: hsl(var(--foreground)) !important;
        }
        
        /* Ensure the menu items themselves don't have transparent backgrounds bleeding through */
        .bn-menu-item {
          background-color: transparent !important;
          color: hsl(var(--foreground)) !important;
        }
        .bn-menu-item:hover, .bn-menu-item[data-hovered="true"], .bn-menu-item[data-selected="true"], [data-selected="true"] {
          background-color: hsl(var(--accent) / 0.2) !important;
        }
      `}</style>
      <BlockNoteView editor={editor} theme="dark" />
    </div>
  );
}
