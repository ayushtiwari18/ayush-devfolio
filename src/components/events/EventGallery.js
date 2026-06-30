'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';

export default function EventGallery({ images = [], title = '' }) {
  const [active,   setActive]   = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const carouselRef = useRef(null);
  const touchStartX = useRef(null);

  const total = images.length;
  const prev  = useCallback(() => setActive(i => (i - 1 + total) % total), [total]);
  const next  = useCallback(() => setActive(i => (i + 1) % total), [total]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }, [prev, next]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (!total) return null;

  return (
    <>
      <div
        ref={carouselRef}
        tabIndex={0}
        className="outline-none select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/*
          Main image container:
          - explicit h-[480px] so object-contain has a real parent height to work against
          - bg-muted fills the letterbox areas around portrait/square images
        */}
        <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-border bg-muted group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={active}
            src={images[active]}
            alt={`${title} — photo ${active + 1}`}
            className="w-full h-full object-contain transition-opacity duration-300"
          />

          {/* Prev / Next arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                aria-label="Next photo"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Expand button */}
          <button
            onClick={() => setLightbox(true)}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
            aria-label="View fullscreen"
          >
            <Expand size={16} />
          </button>

          {/* Counter pill */}
          {total > 1 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium z-10">
              {active + 1} / {total}
            </div>
          )}
        </div>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Photo ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === active
                    ? 'w-5 h-2 bg-primary'
                    : 'w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Thumbnail strip */}
        {total > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-muted ${
                  i === active
                    ? 'border-primary shadow-md shadow-primary/20 scale-105'
                    : 'border-transparent opacity-50 hover:opacity-100 hover:border-border'
                }`}
                aria-label={`Photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape')     setLightbox(false);
            if (e.key === 'ArrowLeft')  prev();
            if (e.key === 'ArrowRight') next();
          }}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen image viewer"
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {total > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-10"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div onClick={e => e.stopPropagation()} className="flex items-center justify-center w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active]}
              alt={`${title} — photo ${active + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </div>

          {total > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white z-10"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/10 rounded-full text-white text-xs">
            {active + 1} / {total}
          </div>
        </div>
      )}
    </>
  );
}
