'use client';

/**
 * VideoPlayer — minimal HTML5 video wrapper
 * ------------------------------------------
 * This component is ALWAYS dynamically imported via next/dynamic.
 * It is NEVER included in the initial JS bundle.
 *
 * Loaded only when VideoPreview determines:
 *   shouldShowVideo === true (isHovered && isInView)
 *
 * Kept intentionally minimal — no state, no effects.
 * The parent (VideoPreview) owns mount/unmount lifecycle.
 */

export default function VideoPlayer({
  src,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  className = '',
}) {
  if (!src) return null;

  return (
    <video
      src={src}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      className={className}
      // Preload none — VideoPlayer only mounts when user intends to watch
      preload="none"
    />
  );
}
