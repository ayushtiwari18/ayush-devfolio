'use client';

import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  Award, ExternalLink, X, Calendar, Hash,
  ShieldCheck, Link2, Tag, ChevronRight, LayoutGrid,
  Plus, Edit2, Check, Trash2, Globe, Eye, Upload,
  RotateCcw, Save, Loader2, Sparkles, Building2,
  ImageIcon, AlertCircle
} from 'lucide-react';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/lib/storage';

// ── helpers ───────────────────────────────────────────────────
const fmt = (d) => {
  if (!d) return null;
  try {
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return d;
    return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  } catch {
    return d;
  }
};

async function revalidateCertifications() {
  try {
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || '',
      },
      body: JSON.stringify({ paths: ['/certifications', '/'] }),
    });
  } catch {}
}

// ── Shared fallback placeholder ────────────────────────────────
function CertFallback({ large = false }) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 via-primary/5 to-zinc-900"
      style={{ height: large ? 220 : 140 }}
    >
      <div
        className={`rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center ${
          large ? 'w-20 h-20' : 'w-10 h-10'
        }`}
      >
        <Award size={large ? 36 : 20} className="text-primary/60" />
      </div>
      {!large && <span className="text-[10px] text-muted-foreground/50 font-medium">No image</span>}
    </div>
  );
}

// ── Adaptive image for card (plain img + onError) ───────────────
function CertCardImage({ src, alt }) {
  const [failed, setFailed] = useState(!src);
  if (failed || !src) return <CertFallback large={false} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || 'Certification badge'}
      onError={() => setFailed(true)}
      className="w-full h-auto block"
      style={{ maxHeight: 200, minHeight: 100, objectFit: 'contain', padding: '12px', background: 'transparent' }}
    />
  );
}

// ── Modal image (plain img + onError) ───────────────────────
function CertModalImage({ src, alt }) {
  const [failed, setFailed] = useState(!src);
  if (failed || !src) return <CertFallback large />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || 'Certification badge'}
      onError={() => setFailed(true)}
      className="w-full h-auto block"
      style={{ maxHeight: 380, objectFit: 'contain' }}
    />
  );
}

// ── Detail Modal (Public View Mode) ──────────────────────────
function CertModal({ cert, onClose }) {
  if (!cert) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all"
          aria-label="Close modal"
        >
          <X size={15} />
        </button>

        <div className="w-full bg-zinc-950 overflow-hidden">
          <CertModalImage src={cert.image || cert.image_url} alt={cert.title} />
          <div className="h-8 bg-gradient-to-t from-card to-transparent -mt-8 pointer-events-none" />
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {cert.category && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full mb-3">
              <Tag size={10} />
              {cert.category}
            </span>
          )}

          <h2 className="text-xl font-bold text-foreground mb-1 leading-snug">{cert.title}</h2>
          <p className="text-base text-primary font-semibold mb-5">{cert.issuer}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {fmt(cert.date || cert.issued_date) && (
              <div className="flex items-center gap-2.5 p-3 bg-background rounded-xl border border-border">
                <Calendar size={14} className="text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Issued</p>
                  <p className="text-sm font-medium text-foreground">{fmt(cert.date || cert.issued_date)}</p>
                </div>
              </div>
            )}
            {fmt(cert.expiry_date) && (
              <div className="flex items-center gap-2.5 p-3 bg-background rounded-xl border border-border">
                <Calendar size={14} className="text-orange-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Expires</p>
                  <p className="text-sm font-medium text-foreground">{fmt(cert.expiry_date)}</p>
                </div>
              </div>
            )}
            {cert.credential_id && (
              <div className="flex items-center gap-2.5 p-3 bg-background rounded-xl border border-border">
                <Hash size={14} className="text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Credential ID</p>
                  <p className="text-sm font-mono text-foreground truncate">{cert.credential_id}</p>
                </div>
              </div>
            )}
            {cert.category && (
              <div className="flex items-center gap-2.5 p-3 bg-background rounded-xl border border-border">
                <Tag size={14} className="text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Category</p>
                  <p className="text-sm font-medium text-foreground">{cert.category}</p>
                </div>
              </div>
            )}
          </div>

          {cert.description && (
            <div className="p-4 bg-background border border-border rounded-xl mb-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {(cert.url || cert.certificate_url) && (
              <a
                href={cert.url || cert.certificate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                <ExternalLink size={14} /> View Credential
              </a>
            )}
            {cert.verification_url && (
              <a
                href={cert.verification_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-background border border-border text-foreground text-sm font-semibold rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <ShieldCheck size={14} className="text-green-400" /> Verify
              </a>
            )}
            {cert.credential_id && (
              <button
                onClick={() => navigator.clipboard.writeText(cert.credential_id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-background border border-border text-foreground text-sm font-semibold rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <Link2 size={14} className="text-primary" /> Copy ID
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inline Editable Cert Card Component ───────────────────────
function EditableCertCard({
  cert,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onTogglePublished,
  isSaving,
}) {
  const [title, setTitle] = useState(cert.title || '');
  const [issuer, setIssuer] = useState(cert.issuer || '');
  const [date, setDate] = useState(cert.date || cert.issued_date || '');
  const [credentialId, setCredentialId] = useState(cert.credential_id || '');
  const [category, setCategory] = useState(cert.category || '');
  const [image, setImage] = useState(cert.image || cert.image_url || '');
  const [url, setUrl] = useState(cert.url || cert.certificate_url || '');
  const [verificationUrl, setVerificationUrl] = useState(cert.verification_url || '');
  const [description, setDescription] = useState(cert.description || '');
  const [published, setPublished] = useState(cert.published !== false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Sync state when cert prop changes or when starting edit
  const handleReset = useCallback(() => {
    setTitle(cert.title || '');
    setIssuer(cert.issuer || '');
    setDate(cert.date || cert.issued_date || '');
    setCredentialId(cert.credential_id || '');
    setCategory(cert.category || '');
    setImage(cert.image || cert.image_url || '');
    setUrl(cert.url || cert.certificate_url || '');
    setVerificationUrl(cert.verification_url || '');
    setDescription(cert.description || '');
    setPublished(cert.published !== false);
  }, [cert]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const { url: uploadedUrl, error: uploadErr } = await uploadImage(file, 'certifications');
      if (uploadErr) throw new Error(uploadErr);
      if (uploadedUrl) {
        setImage(uploadedUrl);
      }
    } catch (err) {
      console.error('Failed to upload badge image:', err);
    } finally {
      setUploadingImage(false);
      setDragOver(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSave({
      id: cert.id,
      title,
      issuer,
      date,
      credential_id: credentialId,
      category,
      image,
      image_url: image,
      url,
      certificate_url: url,
      verification_url: verificationUrl,
      description,
      published,
    });
  };

  const handleCancelClick = (e) => {
    e.stopPropagation();
    handleReset();
    onCancelEdit();
  };

  if (!isEditing) {
    return (
      <div className="group relative w-full bg-[#090D16] border border-primary/20 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col shadow-lg shadow-black/40">
        {/* Floating Action Controls on Card */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-[#06080E]/90 border border-white/10 backdrop-blur-md shadow-lg">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePublished(cert);
            }}
            className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
              cert.published !== false
                ? 'text-emerald-400 hover:bg-emerald-500/10'
                : 'text-amber-400 hover:bg-amber-500/10'
            }`}
            title={cert.published !== false ? 'Published (click to unpublish)' : 'Draft (click to publish)'}
            aria-label="Toggle Published"
          >
            <Globe size={13} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartEdit(cert.id);
            }}
            className="p-1.5 rounded-lg text-xs font-mono text-primary hover:bg-primary/10 transition-all"
            title="Edit credential in-place"
            aria-label="Edit Certificate"
          >
            <Edit2 size={13} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(cert);
            }}
            className="p-1.5 rounded-lg text-xs font-mono text-red-400 hover:bg-red-500/10 transition-all"
            title="Delete credential"
            aria-label="Delete Certificate"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Image area with click-to-edit indicator */}
        <div
          onClick={() => onStartEdit(cert.id)}
          className="relative w-full bg-[#06080E] overflow-hidden cursor-pointer"
        >
          <CertCardImage src={cert.image || cert.image_url} alt={cert.title} />
          <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
            {cert.category && (
              <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium rounded-full border border-white/10">
                {cert.category}
              </span>
            )}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                cert.published !== false
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {cert.published !== false ? 'Pub' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Card Body with direct inline click hooks */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2
              onClick={() => onStartEdit(cert.id)}
              className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug flex-1 cursor-pointer"
              title="Click to edit title"
            >
              {cert.title}
            </h2>
          </div>

          <p
            onClick={() => onStartEdit(cert.id)}
            className="text-xs text-primary font-semibold mb-1 cursor-pointer hover:underline"
            title="Click to edit issuer"
          >
            {cert.issuer}
          </p>

          {fmt(cert.date || cert.issued_date) && (
            <p
              onClick={() => onStartEdit(cert.id)}
              className="text-[11px] text-muted-foreground flex items-center gap-1 mb-2 cursor-pointer hover:text-white"
              title="Click to edit issue date"
            >
              <Calendar size={10} />
              {fmt(cert.date || cert.issued_date)}
            </p>
          )}

          {cert.description && (
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
              {cert.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10">
            <span
              onClick={() => onStartEdit(cert.id)}
              className="text-[10px] font-mono text-gray-400 cursor-pointer hover:text-primary transition-colors"
              title="Click to edit credential ID"
            >
              {cert.credential_id ? `ID: ${cert.credential_id.slice(0, 14)}…` : 'No ID • Click to set'}
            </span>
            <button
              type="button"
              onClick={() => onStartEdit(cert.id)}
              className="flex items-center gap-1 text-[10px] font-mono text-primary font-semibold hover:underline"
            >
              <Edit2 size={10} />
              <span>Edit Card</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active In-Place Card Editor
  return (
    <div className="relative w-full bg-[#090D16] border-2 border-primary rounded-2xl overflow-hidden p-4 space-y-3 shadow-2xl shadow-primary/10 animate-in fade-in zoom-in-95 duration-200">
      {/* Floating Action Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
            Inline Card Editor
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPublished((prev) => !prev)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
              published
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
            title="Toggle Published State"
            aria-label="Toggle Published"
          >
            {published ? 'Published' : 'Draft'}
          </button>
        </div>
      </div>

      {/* Badge Image Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full h-32 rounded-xl border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragOver
            ? 'border-primary bg-primary/10'
            : 'border-white/20 bg-[#06080E] hover:border-primary/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploadingImage ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span className="text-[10px] font-mono text-gray-400">Uploading badge...</span>
          </div>
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title || 'Badge Preview'}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 p-2 text-center">
            <Upload size={18} className="text-primary/70" />
            <span className="text-[11px] font-mono text-gray-300 font-medium">
              Drop badge image or click to upload
            </span>
            <span className="text-[9px] font-mono text-gray-500">JPG, PNG, WebP or SVG</span>
          </div>
        )}
      </div>

      {/* Direct In-Place Input Fields */}
      <div className="space-y-2">
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
            Credential Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AWS Certified Cloud Practitioner"
            className="w-full text-xs font-bold text-white bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
              Issuer *
            </label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g. Amazon Web Services"
              className="w-full text-xs text-primary font-semibold bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Cloud"
              className="w-full text-xs text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
              Issue Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="YYYY-MM"
              className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
              Credential ID
            </label>
            <input
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="e.g. AWS-12345"
              className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
            Verification / Certificate URL
          </label>
          <input
            type="url"
            value={verificationUrl || url}
            onChange={(e) => {
              setVerificationUrl(e.target.value);
              setUrl(e.target.value);
            }}
            placeholder="https://www.credly.com/badges/..."
            className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
          />
        </div>
      </div>

      {/* Action Buttons: Save, Cancel, Delete */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => onDelete(cert)}
          className="flex items-center gap-1 text-[11px] font-mono text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
          title="Delete this credential"
          aria-label="Delete"
        >
          <Trash2 size={12} />
          <span>Delete</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={isSaving}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Cancel"
          >
            <RotateCcw size={12} />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving || !title.trim() || !issuer.trim()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-mono font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
            aria-label="Save"
          >
            {isSaving ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={12} />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Inline New Certificate Creation Card ──────────────────────
function NewCertCardPlaceholder({ onAdd, onCancel, isCreating, setIsCreating }) {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7));
  const [credentialId, setCredentialId] = useState('');
  const [category, setCategory] = useState('Cloud');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const { url: uploadedUrl, error: uploadErr } = await uploadImage(file, 'certifications');
      if (uploadErr) throw new Error(uploadErr);
      if (uploadedUrl) {
        setImage(uploadedUrl);
      }
    } catch (err) {
      console.error('Failed to upload badge image:', err);
    } finally {
      setUploadingImage(false);
      setDragOver(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim() || !issuer.trim()) return;
    setSubmitting(true);
    try {
      await onAdd({
        title: title.trim(),
        issuer: issuer.trim(),
        date: date.trim() || new Date().toISOString().slice(0, 7),
        credential_id: credentialId.trim() || null,
        category: category.trim() || 'General',
        image: image.trim() || null,
        image_url: image.trim() || null,
        url: url.trim() || null,
        certificate_url: url.trim() || null,
        verification_url: verificationUrl.trim() || null,
        description: description.trim() || null,
        published,
      });

      // Reset
      setTitle('');
      setIssuer('');
      setDate(new Date().toISOString().slice(0, 7));
      setCredentialId('');
      setCategory('Cloud');
      setImage('');
      setUrl('');
      setVerificationUrl('');
      setDescription('');
      setIsCreating(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isCreating) {
    return (
      <button
        type="button"
        onClick={() => setIsCreating(true)}
        className="w-full min-h-[220px] rounded-2xl border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center group cursor-pointer"
        aria-label="Add New Certificate"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-3 shadow-lg shadow-primary/10">
          <Plus size={24} />
        </div>
        <span className="text-sm font-mono font-bold text-primary tracking-wide">
          + Add New Certificate
        </span>
        <span className="text-xs font-mono text-gray-400 mt-1">
          Direct inline credential creation
        </span>
      </button>
    );
  }

  return (
    <div className="relative w-full bg-[#090D16] border-2 border-primary rounded-2xl overflow-hidden p-4 space-y-3 shadow-2xl shadow-primary/15 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary">
            New Certificate Form
          </span>
        </div>
        <button
          type="button"
          onClick={() => setPublished((prev) => !prev)}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
            published
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}
        >
          {published ? 'Published' : 'Draft'}
        </button>
      </div>

      {/* Image Uploader */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFileUpload(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full h-32 rounded-xl border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragOver
            ? 'border-primary bg-primary/10'
            : 'border-white/20 bg-[#06080E] hover:border-primary/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="hidden"
        />

        {uploadingImage ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span className="text-[10px] font-mono text-gray-400">Uploading badge...</span>
          </div>
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt="Preview badge"
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 p-2 text-center">
            <Upload size={18} className="text-primary/70" />
            <span className="text-[11px] font-mono text-gray-300 font-medium">
              Drop badge image or click to upload
            </span>
            <span className="text-[9px] font-mono text-gray-500">JPG, PNG, WebP or SVG</span>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-2">
        <div>
          <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
            Credential Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AWS Certified Cloud Practitioner"
            className="w-full text-xs font-bold text-white bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
              Issuer *
            </label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g. Amazon Web Services"
              className="w-full text-xs text-primary font-semibold bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Cloud"
              className="w-full text-xs text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
              Issue Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="YYYY-MM"
              className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
              Credential ID
            </label>
            <input
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="e.g. AWS-12345"
              className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-gray-400 font-semibold block mb-0.5">
            Verification URL
          </label>
          <input
            type="url"
            value={verificationUrl}
            onChange={(e) => {
              setVerificationUrl(e.target.value);
              setUrl(e.target.value);
            }}
            placeholder="https://www.credly.com/badges/..."
            className="w-full text-xs font-mono text-gray-300 bg-[#06080E] border border-white/10 focus:border-primary rounded-lg px-2.5 py-1.5 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => setIsCreating(false)}
          className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleCreate}
          disabled={submitting || !title.trim() || !issuer.trim()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-black text-xs font-mono font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Check size={13} />
              <span>Create Certificate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Cert card (Public View Mode) ──────────────────────────────
function CertCard({ cert, onClick }) {
  return (
    <button
      onClick={() => onClick(cert)}
      className="group w-full text-left bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
    >
      <div className="relative w-full bg-zinc-950 overflow-hidden">
        <CertCardImage src={cert.image || cert.image_url} alt={cert.title} />
        {cert.category && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium rounded-full z-10">
            {cert.category}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug flex-1">
            {cert.title}
          </h2>
          <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
        </div>

        <p className="text-xs text-primary font-semibold mb-1">{cert.issuer}</p>

        {fmt(cert.date || cert.issued_date) && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-2">
            <Calendar size={10} />
            {fmt(cert.date || cert.issued_date)}
          </p>
        )}

        {cert.description && (
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
            {cert.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/60">
          <span className="text-[10px] text-muted-foreground/60 font-medium">
            {cert.credential_id ? `ID: ${cert.credential_id.slice(0, 12)}…` : 'Click to view'}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-primary font-semibold">
            <ExternalLink size={9} /> Details
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function CertificationsClient({ certifications = [] }) {
  const { isAdmin, editMode, showToast } = useAdminMode();

  const [items, setItems] = useState(certifications);
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // Inline Editing States
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set();
    items.forEach((c) => {
      if (c.category) cats.add(c.category);
    });
    return ['All', ...Array.from(cats).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    return activeCategory === 'All'
      ? items
      : items.filter((c) => c.category === activeCategory);
  }, [items, activeCategory]);

  // Handler: Save existing certification
  const handleSaveCert = async (updatedCert) => {
    setIsSaving(true);
    try {
      const payload = {
        title: updatedCert.title,
        issuer: updatedCert.issuer,
        category: updatedCert.category || null,
        description: updatedCert.description || null,
        image: updatedCert.image || null,
        url: updatedCert.url || null,
        date: updatedCert.date || null,
        credential_id: updatedCert.credential_id || null,
        verification_url: updatedCert.verification_url || null,
        published: updatedCert.published,
      };

      const { error } = await supabase
        .from('certifications')
        .update(payload)
        .eq('id', updatedCert.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((c) => (c.id === updatedCert.id ? { ...c, ...updatedCert } : c))
      );
      setEditingId(null);
      showToast?.(`Certification "${updatedCert.title}" saved successfully!`, 'success');
      revalidateCertifications();
    } catch (err) {
      console.error('Error updating certification:', err);
      showToast?.(err?.message || 'Failed to update certification', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Delete certification
  const handleDeleteCert = async (cert) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete credential "${cert.title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', cert.id);

      if (error) throw error;

      setItems((prev) => prev.filter((c) => c.id !== cert.id));
      if (editingId === cert.id) setEditingId(null);
      showToast?.(`Certification "${cert.title}" removed.`, 'success');
      revalidateCertifications();
    } catch (err) {
      console.error('Error deleting certification:', err);
      showToast?.(err?.message || 'Failed to delete certification', 'error');
    }
  };

  // Handler: Toggle published status
  const handleTogglePublished = async (cert) => {
    const nextPublished = cert.published === false ? true : false;
    try {
      const { error } = await supabase
        .from('certifications')
        .update({ published: nextPublished })
        .eq('id', cert.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((c) => (c.id === cert.id ? { ...c, published: nextPublished } : c))
      );
      showToast?.(
        `Certification "${cert.title}" marked as ${nextPublished ? 'Published' : 'Draft'}`,
        'success'
      );
      revalidateCertifications();
    } catch (err) {
      console.error('Error toggling publication:', err);
      showToast?.(err?.message || 'Failed to update publication status', 'error');
    }
  };

  // Handler: Create new certification inline
  const handleAddNewCert = async (newPayload) => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .insert([newPayload])
        .select()
        .single();

      if (error) throw error;

      const created = data || {
        id: `cert-${Date.now()}`,
        ...newPayload,
      };

      setItems((prev) => [created, ...prev]);
      showToast?.(`Certificate "${newPayload.title}" created successfully!`, 'success');
      revalidateCertifications();
    } catch (err) {
      console.error('Error creating certification:', err);
      showToast?.(err?.message || 'Failed to create certification', 'error');
      throw err;
    }
  };

  const isEditable = isAdmin && editMode;

  return (
    <>
      {/* Category filter */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {cat === 'All' ? <LayoutGrid size={12} /> : <Tag size={11} />}
              {cat}
              {cat === 'All' && (
                <span
                  className={`text-xs ml-0.5 ${
                    activeCategory === 'All'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {items.length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {/* Inline Add New Certificate Card for Admin Edit Mode */}
        {isEditable && (
          <NewCertCardPlaceholder
            onAdd={handleAddNewCert}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
          />
        )}

        {filtered.map((cert) =>
          isEditable ? (
            <EditableCertCard
              key={cert.id}
              cert={cert}
              isEditing={editingId === cert.id}
              onStartEdit={(id) => setEditingId(id)}
              onCancelEdit={() => setEditingId(null)}
              onSave={handleSaveCert}
              onDelete={handleDeleteCert}
              onTogglePublished={handleTogglePublished}
              isSaving={isSaving && editingId === cert.id}
            />
          ) : (
            <CertCard key={cert.id} cert={cert} onClick={setSelected} />
          )
        )}
      </div>

      {filtered.length === 0 && !isEditable && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <Award size={28} className="text-primary/60" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No certifications in this category</h3>
          <button
            onClick={() => setActiveCategory('All')}
            className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Show all
          </button>
        </div>
      )}

      {/* Detail Modal for View Mode */}
      {!isEditable && selected && (
        <CertModal cert={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
