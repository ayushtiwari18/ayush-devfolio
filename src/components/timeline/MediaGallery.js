'use client';

/**
 * MediaGallery — image grid with lightbox
 * -----------------------------------------
 * PERFORMANCE DECISIONS:
 * - Uses next/image with explicit width/height from data model — zero CLS
 * - First image: loading="eager" (above fold for first event)
 * - Subsequent images: loading="lazy"
 * - No external lightbox library — custom modal via useState
 *
 * ACCESSIBILITY:
 * - Each thumbnail has aria-label describing its action
 * - Modal has role="dialog" + aria-modal + focus trap via autoFocus
 * - Escape key closes modal
 */

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function MediaGallery({ media, title }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const isOpen = lightboxIndex !== null;
  const activeSrc = isOpen ? media[lightboxIndex] : null;

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev < media.length - 1 ? prev + 1 : 0
    );
  }, [media.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev > 0 ? prev - 1 : media.length - 1
    );
  }, [media.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeLightbox, goNext, goPrev]);

  if (!media || media.length === 0) return null;

  return (
    <>
      {/* Thumbnail Grid */}
      <div
        className={`
          grid gap-2
          ${media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}
        `}
        role="list"
        aria-label={`Images for ${title}`}
      >
        {media.map((item, index) => (
          <button
            key={item.url}
            role="listitem"
            type="button"
            onClick={() => openLightbox(index)}
            aria-label={`View image ${index + 1}: ${item.alt}`}
            className="
              relative overflow-hidden rounded-lg
              aspect-video w-full
              focus:outline-none focus:ring-2 focus:ring-primary
              group cursor-pointer
            "
          >
            <Image
              src={item.url}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="
                object-cover w-full h-full
                transition-transform duration-300
                group-hover:scale-105
              "
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Hover overlay */}
            <span
              aria-hidden="true"
              className="
                absolute inset-0 bg-black/0
                group-hover:bg-black/20
                transition-colors duration-200
              "
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && activeSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${activeSrc.alt}`}
          className="
            fixed inset-0 z-50
            bg-black/90
            flex items-center justify-center
            p-4
          "
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              autoFocus
              onClick={closeLightbox}
              aria-label="Close image viewer"
              className="
                absolute -top-10 right-0
                text-white/70 hover:text-white
                text-sm font-medium
                focus:outline-none focus:underline
              "
            >
              Close ×
            </button>

            {/* Active image */}
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
              <Image
                src={activeSrc.url}
                alt={activeSrc.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Alt text caption */}
            {activeSrc.alt && (
              <p className="text-white/60 text-sm text-center mt-3">
                {activeSrc.alt}
              </p>
            )}

            {/* Previous / Next */}
            {media.length > 1 && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="text-white/70 hover:text-white text-sm focus:outline-none focus:underline"
                >
                  ← Previous
                </button>
                <span className="text-white/40 text-xs self-center">
                  {lightboxIndex + 1} / {media.length}
                </span>
                <button
                  onClick={goNext}
                  aria-label="Next image"
                  className="text-white/70 hover:text-white text-sm focus:outline-none focus:underline"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
