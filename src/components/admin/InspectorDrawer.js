'use client';

import React, { useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function InspectorDrawer({
  isOpen = true,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  footer,
  saving = false,
  onSave,
  saveLabel = 'Save Changes',
}) {
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Inspector Drawer'}
      className="fixed inset-0 z-[9995] flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-xl h-full bg-[#0a0a0e] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 ring-1 ring-white/5"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0d0d12]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary">
                <Icon size={18} />
              </div>
            )}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                {title}
              </h2>
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
          {children}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0d0d12]/90 backdrop-blur-md flex items-center justify-end gap-3">
          {footer ? (
            footer
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-mono-code font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              {onSave && (
                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono-code font-bold bg-primary hover:bg-primary/90 text-black shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    saveLabel
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
