'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

const AUTOPLAY_DELAY_MS = 10_000;
const SHORT_VIDEO_THRESHOLD_S = 60;

/**
 * VideoPreviewController
 * ----------------------
 * Manages the 10-second delayed autoplay, click-to-play/redirect,
 * and viewport-based cleanup.
 *
 * Props:
 *   previewVideo  – MP4 URL (Supabase Storage)
 *   youtubeUrl    – YouTube full video URL (optional)
 *   heroRef       – ref to the outer hero container (for IntersectionObserver)
 */
export default function VideoPreviewController({ previewVideo, youtubeUrl, heroRef }) {
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const observerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayBtn, setShowPlayBtn] = useState(false);

  // Check prefers-reduced-motion once (client side only)
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useEffect(() => {
    if (!previewVideo || prefersReduced) {
      setShowPlayBtn(!!previewVideo);
      return;
    }

    const videoEl = videoRef.current;
    const heroEl = heroRef?.current;
    if (!videoEl || !heroEl) return;

    const startAutoplayTimer = () => {
      timerRef.current = setTimeout(() => {
        videoEl.play().then(() => setIsPlaying(true)).catch(() => {});
      }, AUTOPLAY_DELAY_MS);
    };

    const stopAndReset = () => {
      clearTimeout(timerRef.current);
      videoEl.pause();
      videoEl.currentTime = 0;
      setIsPlaying(false);
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAutoplayTimer();
          } else {
            stopAndReset();
          }
        });
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(heroEl);

    return () => {
      stopAndReset();
      observerRef.current?.disconnect();
    };
  }, [previewVideo, prefersReduced, heroRef]);

  function handleClick() {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const duration = videoEl.duration || 0;

    if (duration > 0 && duration <= SHORT_VIDEO_THRESHOLD_S) {
      // Short video — play in-page to completion
      clearTimeout(timerRef.current);
      videoEl.play().then(() => setIsPlaying(true)).catch(() => {});
    } else if (youtubeUrl) {
      // Long video — redirect to YouTube
      window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
    } else if (videoEl) {
      // No YouTube URL — play anyway
      videoEl.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }

  if (!previewVideo) return null;

  return (
    <div
      className="absolute inset-0 z-10 cursor-pointer"
      onClick={handleClick}
      role="button"
      aria-label="Play project preview"
    >
      <video
        ref={videoRef}
        src={previewVideo}
        muted
        playsInline
        preload="none"
        loop={false}
        onEnded={() => setIsPlaying(false)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: isPlaying ? 1 : 0, transition: 'opacity 0.4s ease' }}
      />

      {/* Play button overlay — hidden once video is playing */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-black/70 transition-colors">
            <Play size={28} className="text-white ml-1" fill="white" />
          </div>
        </div>
      )}
    </div>
  );
}
