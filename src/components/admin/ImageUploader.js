'use client';

/**
 * ImageUploader — reusable drag-drop image upload component
 * -----------------------------------------------------------
 * Props:
 *   value       {string}    current image URL (for preview)
 *   onChange    {fn}        called with new public URL string when upload succeeds
 *   folder      {string}    Supabase Storage subfolder (e.g. 'projects', 'timeline')
 *   label       {string}    field label shown above
 *   hint        {string}    optional helper text below
 *   multiple    {boolean}   if true, allows multi-file upload (returns URL[] via onChange)
 *   existingUrls {string[]} existing URLs when multiple=true
 *
 * Single mode:   onChange(url: string)
 * Multiple mode: onChange(urls: string[])  — full updated array each time
 *
 * Supabase requirement:
 *   Create a PUBLIC bucket named 'portfolio' in Supabase Storage.
 *   Add RLS policy: authenticated users can INSERT + DELETE.
 */

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadImage, deleteImage } from '@/lib/storage';

export default function ImageUploader({
  value        = '',
  onChange,
  folder       = 'general',
  label        = 'Image',
  hint         = '',
  multiple     = false,
  existingUrls = [],
}) {
  const inputRef   = useRef(null);
  const [dragging, setDragging]  = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState(existingUrls);
  const [error,    setError]     = useState(null);
  const [success,  setSuccess]   = useState(false);

  // Validate file type + size
  const validate = (file) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowed.includes(file.type)) return 'Only JPG, PNG, WebP, GIF, SVG allowed';
    if (file.size > 5 * 1024 * 1024)  return 'File must be under 5MB';
    return null;
  };

  const handleFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    setError(null);
    setSuccess(false);

    const fileList = Array.from(files);

    if (!multiple) {
      // Single upload mode
      const file = fileList[0];
      const validationError = validate(file);
      if (validationError) { setError(validationError); return; }

      setUploading(true);
      const { url, error: uploadError } = await uploadImage(file, folder);
      setUploading(false);

      if (uploadError) { setError(uploadError); return; }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onChange(url);
    } else {
      // Multi upload mode
      const valid = [];
      for (const file of fileList) {
        const err = validate(file);
        if (err) { setError(err); return; }
        valid.push(file);
      }

      setUploading(true);
      const results = await Promise.all(valid.map(f => uploadImage(f, folder)));
      setUploading(false);

      const failed = results.find(r => r.error);
      if (failed) { setError(failed.error); return; }

      const newUrls = [...uploadedUrls, ...results.map(r => r.url)];
      setUploadedUrls(newUrls);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onChange(newUrls);
    }
  }, [folder, multiple, onChange, uploadedUrls]);

  // Drag handlers
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()  => setDragging(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeUrl = useCallback((urlToRemove) => {
    const updated = uploadedUrls.filter(u => u !== urlToRemove);
    setUploadedUrls(updated);
    onChange(updated);
  }, [uploadedUrls, onChange]);

  const dropzoneBase = `
    relative border-2 border-dashed rounded-xl
    transition-all duration-200 cursor-pointer
    flex flex-col items-center justify-center
    gap-3 p-6 text-center
    min-h-[140px]
  `;
  const dropzoneIdle   = 'border-border bg-background hover:border-primary/50 hover:bg-primary/5';
  const dropzoneDrag   = 'border-primary bg-primary/5 scale-[1.01]';
  const dropzoneActive = dragging ? dropzoneDrag : dropzoneIdle;

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-foreground">{label}</label>
      )}

      {/* Single mode — existing preview */}
      {!multiple && value && (
        <div className="relative rounded-xl overflow-hidden bg-muted border border-border">
          <div className="relative aspect-video w-full">
            <Image
              src={value}
              alt="Current image"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
            aria-label="Remove image"
          >
            <X size={14} className="text-white" />
          </button>
          <p className="px-3 py-2 text-xs text-muted-foreground truncate">{value}</p>
        </div>
      )}

      {/* Multi mode — existing previews */}
      {multiple && uploadedUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {uploadedUrls.map((url, i) => (
            <div key={url} className="relative rounded-lg overflow-hidden bg-muted border border-border group">
              <div className="relative aspect-square">
                <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" unoptimized />
              </div>
              <button
                type="button"
                onClick={() => removeUrl(url)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Remove"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {(!multiple || true) && (
        <div
          className={`${dropzoneBase} ${dropzoneActive}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload image"
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            multiple={multiple}
            className="sr-only"
            onChange={e => handleFiles(e.target.files)}
          />

          {uploading ? (
            <>
              <Loader2 size={28} className="text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading…</p>
            </>
          ) : success ? (
            <>
              <CheckCircle size={28} className="text-emerald-500" />
              <p className="text-sm text-emerald-500 font-medium">Uploaded!</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {dragging
                  ? <Upload size={22} className="text-primary" />
                  : <ImageIcon size={22} className="text-primary" />
                }
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {dragging ? 'Drop to upload' : 'Click or drag & drop'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  JPG, PNG, WebP, GIF — max 5MB{multiple ? ' — multiple files allowed' : ''}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
