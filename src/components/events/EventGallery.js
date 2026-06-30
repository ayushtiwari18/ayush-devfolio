'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function EventGallery({ images = [], title = '' }) {
  const [lightbox, setLightbox] = useState(null); // index or null

  if (!images.length) return null;

  const prev = () => setLightbox(i => (i - 1 + images.length) % images.length);
  const next = () => setLightbox(i => (i + 1) % images.length);

  const handleKey = (e) => {
    if (e.key === 'Escape')     setLightbox(null);
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  };

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="group relative rounded-xl overflow-hidden border border-border aspect-video hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} photo ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          onKeyDown={handleKey}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div onClick={e => e.stopPropagation()} className="max-w-5xl max-h-[85vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightbox]}
              alt={`${title} photo ${lightbox + 1}`}
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 rounded-full text-white text-xs">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
