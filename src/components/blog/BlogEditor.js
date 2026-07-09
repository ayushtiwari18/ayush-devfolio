import React, { useEffect, useRef, useState, Component } from 'react';
import { 
  useCreateBlockNote
} from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import { countWords, extractExcerpt } from '@/lib/blogUtils';
import { uploadImage } from '@/lib/storage';
import imageCompression from 'browser-image-compression';

// 1. Error Boundary to protect the Admin Panel from corrupted Editor State crashes
class EditorErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("BlockNote crashed:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex flex-col items-center justify-center p-6 bg-red-950/20 border border-red-500/50 rounded-xl text-center">
          <span className="text-4xl mb-4">⚠️</span>
          <h3 className="text-xl font-bold text-red-400 mb-2">Editor Crashed</h3>
          <p className="text-red-200/80 mb-6 max-w-md text-sm">
            The editor encountered corrupted data and crashed. 
            If you have an invalid autosave draft causing this, you can clear it below.
          </p>
          <button 
            type="button"
            onClick={() => {
              localStorage.removeItem('blog-draft-autosave');
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Clear Autosave Draft & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Standard BlockNote usage allows for robust built-in UI

export default function BlogEditor({ value, onChange, onMetaChange }) {
  const onChangeRef     = useRef(onChange);
  const onMetaChangeRef = useRef(onMetaChange);
  const hasInitialized  = useRef(false);
  const [draftRecovered, setDraftRecovered] = useState(false);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onMetaChangeRef.current = onMetaChange; }, [onMetaChange]);

  const editor = useCreateBlockNote({
    uploadFile: async (file) => {
      let fileToUpload = file;
      try {
        if (file.type.startsWith('image/')) {
          const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          fileToUpload = await imageCompression(file, options);
        }
      } catch (e) {
        console.warn('Image compression failed, uploading original', e);
      }

      const { url, error } = await uploadImage(fileToUpload, 'blog');
      if (error) {
        alert('Image upload failed: ' + error);
        throw new Error(error);
      }
      return url;
    }
  });

  // 3. Initialize with DB value OR recover from LocalStorage Autosave
  useEffect(() => {
    if (!editor || hasInitialized.current) return;
    try {
      if (value && value !== '[]' && value !== '""') {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (Array.isArray(parsed) && parsed.length > 0) {
          editor.replaceBlocks(editor.document, parsed);
          hasInitialized.current = true;
          return;
        }
      }
      
      const draft = localStorage.getItem('blog-draft-autosave');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        if (Array.isArray(parsedDraft) && parsedDraft.length > 0) {
          editor.replaceBlocks(editor.document, parsedDraft);
          setDraftRecovered(true);
          setTimeout(() => setDraftRecovered(false), 3000);
        }
      }
      
      hasInitialized.current = true;
    } catch (e) {
      console.error('[BlogEditor] initialization failed:', e);
      hasInitialized.current = true;
    }
  }, [editor, value]);

  // 4. Subscribe to changes and Autosave
  useEffect(() => {
    if (!editor) return;
    const unsubscribe = editor.onChange(() => {
      const blocks = editor.document;
      const jsonStr = JSON.stringify(blocks);
      
      localStorage.setItem('blog-draft-autosave', jsonStr);
      
      onChangeRef.current(jsonStr);
      const words = countWords(blocks);
      onMetaChangeRef.current?.({
        reading_time: Math.max(1, Math.ceil(words / 200)),
        excerpt: extractExcerpt(blocks),
      });
    });
    return () => unsubscribe?.();
  }, [editor]);

  return (
    <div className="relative">
      {/* Draft Recovery Toast */}
      {draftRecovered && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary/20 border border-primary/50 text-primary px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-primary/10 animate-in fade-in slide-in-from-top-4 z-50">
          Unsaved draft recovered successfully!
        </div>
      )}
      <div className="bn-editor-wrapper min-h-[500px] rounded-xl border border-border bg-background relative z-10">
        <style>{`
          .bn-editor-wrapper > .bn-container,
          .bn-editor-wrapper .bn-editor {
            background-color: transparent !important;
          }
          .bn-menu-dropdown, .bn-popover, .bn-tooltip, [data-radix-popper-content-wrapper], .bn-suggestion-menu, .bn-select-content {
            z-index: 99999 !important;
            background-color: hsl(var(--card)) !important;
            border: 1px solid hsl(var(--border)) !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
            border-radius: 8px !important;
            color: hsl(var(--foreground)) !important;
          }
          .bn-menu-item {
            background-color: transparent !important;
            color: hsl(var(--foreground)) !important;
          }
          .bn-menu-item:hover, .bn-menu-item[data-hovered="true"], .bn-menu-item[data-selected="true"], [data-selected="true"] {
            background-color: hsl(var(--accent) / 0.2) !important;
          }
        `}</style>
        <EditorErrorBoundary>
          <BlockNoteView editor={editor} theme="dark" />
        </EditorErrorBoundary>
      </div>
    </div>
  );
}
