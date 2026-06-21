'use client';
/**
 * FallbackImage — CLIENT COMPONENT
 * Wraps Next.js Image with an onError handler.
 * If the src URL 404s or fails to load, swaps to a
 * styled placeholder (slot filled by `fallback` prop).
 *
 * Usage:
 *   <FallbackImage
 *     src={item.image}
 *     alt={item.name}
 *     fill
 *     className="object-cover ..."
 *     fallback={<Trophy size={80} className="text-yellow-500/30" />}
 *     containerClassName="absolute inset-0 flex items-center justify-center"
 *   />
 */
import { useState } from 'react';
import Image from 'next/image';

export default function FallbackImage({
  src,
  alt,
  fallback,
  containerClassName = 'absolute inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-500/10 to-orange-500/10',
  ...imageProps
}) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className={containerClassName}>
        {fallback}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      {...imageProps}
    />
  );
}
