'use client';

import React from 'react';
import { useAdminMode } from '@/context/AdminModeContext';
import { Edit3 } from 'lucide-react';

export default function EditableSection({
  sectionId,
  title,
  drawerId,
  drawerData = null,
  children,
  className = '',
}) {
  const { editMode, openDrawer } = useAdminMode();

  if (!editMode) {
    return (
      <div id={sectionId} className={className}>
        {children}
      </div>
    );
  }

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openDrawer(drawerId || sectionId, drawerData);
  };

  return (
    <div
      id={sectionId}
      className={`relative group/editable transition-all duration-300 rounded-2xl ${
        editMode
          ? 'hover:ring-1 hover:ring-primary/40 hover:shadow-[0_0_35px_rgba(0,240,255,0.08)]'
          : ''
      } ${className}`}
    >
      {/* Floating Section Edit Trigger */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 opacity-0 group-hover/editable:opacity-100 focus-within:opacity-100 transition-all duration-200 transform translate-y-1 group-hover/editable:translate-y-0 pointer-events-none">
        <button
          type="button"
          onClick={handleEditClick}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#08080c]/90 border border-primary/50 text-primary hover:bg-primary hover:text-black font-mono-code text-xs font-bold shadow-xl shadow-primary/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
          title={`Edit ${title || 'Section'} in-context`}
          aria-label={`Edit ${title || 'Section'}`}
        >
          <Edit3 size={12} />
          <span>Edit {title || 'Section'}</span>
        </button>
      </div>

      {children}
    </div>
  );
}
