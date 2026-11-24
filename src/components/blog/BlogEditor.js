'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Code,
  TextQuote,
  Network,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Eye,
  PenTool,
  StickyNote,
  Columns,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { uploadImage } from '@/lib/storage';
import { contentToMarkdown, countWords, estimateReadingTime, extractExcerpt } from '@/lib/blogUtils';
import BlogContent from './BlogContent';
import imageCompression from 'browser-image-compression';

export default function BlogEditor({ value, onChange, onMetaChange, initialNotes = '' }) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Parse initial incoming content (converting legacy JSON if needed)
  const [content, setContent] = useState(() => contentToMarkdown(value) || '');
  const [notes, setNotes] = useState(() => {
    if (initialNotes) return initialNotes;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('blog-notes-scratchpad') || '';
    }
    return '';
  });

  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'split' | 'preview' | 'notes'
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [draftRecovered, setDraftRecovered] = useState(false);

  // Sync internal state when prop `value` changes from external source (e.g., initial fetch)
  useEffect(() => {
    if (value !== undefined) {
      const converted = contentToMarkdown(value);
      if (converted && !content) {
        setContent(converted);
      }
    }
  }, [value, content]);

  // Draft recovery check on mount if value is empty
  useEffect(() => {
    if (!value && typeof window !== 'undefined') {
      const saved = localStorage.getItem('blog-draft-autosave');
      if (saved && saved.trim()) {
        setContent(saved);
        setDraftRecovered(true);
        setTimeout(() => setDraftRecovered(false), 3500);
      }
    }
  }, [value]);

  // Handle content updates
  const handleContentChange = useCallback((newText) => {
    setContent(newText);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog-draft-autosave', newText);
    }
    onChange?.(newText);

    // Compute metrics
    const words = countWords(newText);
    const readingTime = estimateReadingTime(newText);
    const excerpt = extractExcerpt(newText);

    onMetaChange?.({
      reading_time: readingTime,
      excerpt,
      word_count: words,
      notes,
    });
  }, [onChange, onMetaChange, notes]);

  // Handle scratchpad notes updates
  const handleNotesChange = useCallback((newNotes) => {
    setNotes(newNotes);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog-notes-scratchpad', newNotes);
    }
    onMetaChange?.({ notes: newNotes });
  }, [onMetaChange]);

  // Insert formatting into textarea around selection
  const insertFormat = useCallback((prefix, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newFullText = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    handleContentChange(newFullText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  }, [handleContentChange]);

  // Image upload and markdown insertion
  const processImageFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    setUploadMessage('Compressing image...');

    try {
      let fileToUpload = file;
      try {
        const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1920, useWebWorker: true };
        fileToUpload = await imageCompression(file, options);
      } catch (err) {
        console.warn('Image compression bypassed:', err);
      }

      setUploadMessage('Uploading to Supabase...');
      const { url, error } = await uploadImage(fileToUpload, 'blog');
      if (error || !url) throw new Error(error || 'Upload failed');

      // Insert markdown image tag
      const altText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Image';
      insertFormat(`\n![${altText}](`, `${url})\n`, '');
      setUploadMessage('Image uploaded!');
      setTimeout(() => setUploadMessage(null), 2500);
    } catch (err) {
      console.error(err);
      setUploadMessage(`Error: ${err.message || 'Upload failed'}`);
      setTimeout(() => setUploadMessage(null), 4000);
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      await processImageFile(files[0]);
    }
  };

  // Paste handler for screenshots
  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          await processImageFile(file);
          return;
        }
      }
    }
  };

  // Tab key indents by 2 spaces instead of leaving textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertFormat('  ', '', '');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertFormat('**', '**', 'bold text');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertFormat('*', '*', 'italic text');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      insertFormat('[', '](https://example.com)', 'link title');
    }
  };

  // Insert Archify system diagram template
  const insertArchifyDiagram = () => {
    const template = `\n\`\`\`diagram:arch
{
  "title": "System Architecture",
  "components": [
    { "id": "client", "type": "frontend", "label": "Client UI", "sublabel": "Next.js App", "pos": [40, 80], "size": [140, 52] },
    { "id": "api", "type": "backend", "label": "API Server", "sublabel": "Edge Actions", "pos": [240, 80], "size": [140, 52] },
    { "id": "db", "type": "database", "label": "Supabase DB", "sublabel": "PostgreSQL", "pos": [440, 80], "size": [140, 52] }
  ],
  "connections": [
    { "from": "client", "to": "api", "label": "HTTPS", "flow": "forward" },
    { "from": "api", "to": "db", "label": "Query", "flow": "forward" }
  ]
}
\`\`\`\n`;
    insertFormat(template, '', '');
  };

  const wordCount = useMemo(() => countWords(content), [content]);
  const readingTime = useMemo(() => estimateReadingTime(content), [content]);

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-[#070A0F] shadow-2xl overflow-hidden flex flex-col min-h-[580px]">
      {/* Draft recovery notice */}
      {draftRecovered && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-mono font-medium shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={13} />
          <span>Local draft auto-recovered</span>
        </div>
      )}

      {/* Upload status indicator */}
      {uploadMessage && (
        <div className="absolute top-3 right-4 bg-primary/20 border border-primary/40 text-primary-light px-3 py-1 rounded-lg text-xs font-mono z-50 flex items-center gap-2">
          {uploading ? <div className="w-2.5 h-2.5 rounded-full border-2 border-primary border-t-transparent animate-spin" /> : <CheckCircle2 size={13} />}
          <span>{uploadMessage}</span>
        </div>
      )}

      {/* Top Controls & Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#0B0F17] border-b border-white/[0.08]">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'write' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            <PenTool size={13} />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all hidden md:flex items-center gap-1.5 ${
              activeTab === 'split' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Columns size={13} />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-primary text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'notes' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-amber-300'
            }`}
          >
            <StickyNote size={13} />
            <span>Notes / Scratchpad</span>
          </button>
        </div>

        {/* Formatting Action Buttons (Active in Write & Split views) */}
        {(activeTab === 'write' || activeTab === 'split') && (
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => insertFormat('**', '**', 'bold text')}
              title="Bold (Ctrl+B)"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormat('*', '*', 'italic text')}
              title="Italic (Ctrl+I)"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormat('\n## ', '\n', 'Section Heading')}
              title="Heading 2"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all font-mono text-xs font-bold"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertFormat('\n### ', '\n', 'Subheading')}
              title="Heading 3"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all font-mono text-xs font-bold"
            >
              H3
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button
              type="button"
              onClick={() => insertFormat('\n```typescript\n', '\n```\n', '// code here')}
              title="IDE Code Block"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-1"
            >
              <Code size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormat('\n> [!NOTE]\n> ', '\n', 'Key technical insight or context')}
              title="Glow Callout Card"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <TextQuote size={14} />
            </button>
            <button
              type="button"
              onClick={insertArchifyDiagram}
              title="Archify System Architecture Diagram"
              className="px-2 py-1 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-indigo-500/20 transition-all flex items-center gap-1 text-xs font-mono"
            >
              <Network size={13} />
              <span>Diagram</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload Image"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <ImageIcon size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && processImageFile(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* Word count & Reading stats */}
        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>
      </div>

      {/* Editor Body / Content Area */}
      <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        {/* Write View (Full width or left side of Split) */}
        {(activeTab === 'write' || activeTab === 'split') && (
          <div
            className={`flex-1 flex flex-col relative ${
              activeTab === 'split' ? 'border-r border-white/[0.08]' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Write your article in clean Markdown... Paste or drop images directly. Use 'Ctrl+B', 'Ctrl+I', or toolbar shortcuts."
              className="flex-1 w-full bg-transparent p-6 sm:p-8 text-gray-200 font-mono text-sm sm:text-base leading-relaxed outline-none resize-none selection:bg-primary/30 selection:text-white placeholder:text-gray-600 custom-scrollbar"
              spellCheck="false"
            />
            <div className="px-6 py-2 bg-[#090D14] border-t border-white/[0.05] text-[11px] font-mono text-gray-500 flex justify-between items-center">
              <span>Markdown Studio • GFM + Callouts + Archify Diagrams</span>
              <span>Drop or paste images directly</span>
            </div>
          </div>
        )}

        {/* Preview View (Full width or right side of Split) */}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#080B11] custom-scrollbar">
            {content.trim() ? (
              <BlogContent content={content} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 font-mono text-xs p-12 text-center">
                <Sparkles size={24} className="mb-2 text-primary opacity-60" />
                <span>Live preview will render your markdown, IDE code blocks, callouts, and system diagrams here.</span>
              </div>
            )}
          </div>
        )}

        {/* Notes & Brainstorming Scratchpad Drawer */}
        {activeTab === 'notes' && (
          <div className="flex-1 flex flex-col p-6 sm:p-8 bg-[#090D16]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-sm font-mono font-bold text-amber-300 flex items-center gap-2">
                  <StickyNote size={15} />
                  <span>Brainstorming Scratchpad & Notes</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Draft rough ideas, paste research links, outline sections, or leave prompts for Antigravity AI to transform into your final article.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (notes.trim()) {
                    insertFormat(`\n\n## Outline / Notes\n${notes}\n\n`, '', '');
                    setActiveTab('write');
                  }
                }}
                disabled={!notes.trim()}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono hover:bg-amber-500/30 transition-all disabled:opacity-40"
              >
                Insert Notes into Draft
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Jot down bullet points, links, thoughts, or AI prompts here... Saved continuously."
              className="flex-1 w-full bg-[#06080E] border border-white/10 rounded-xl p-4 text-amber-100/90 font-mono text-sm leading-relaxed outline-none resize-none focus:border-amber-500/50 custom-scrollbar"
            />
          </div>
        )}
      </div>
    </div>
  );
}
