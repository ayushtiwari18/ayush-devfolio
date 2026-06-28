'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * useReveal — shared IntersectionObserver hook.
 *
 * Replaces the 3+ inline duplicates across CodingStats, Experience, Education.
 *
 * @param {object} options
 * @param {number}  options.threshold  — 0–1 visibility ratio to trigger (default 0.12)
 * @param {boolean} options.once       — disconnect after first trigger (default true)
 * @param {string}  options.rootMargin — IOb rootMargin string (default '0px')
 *
 * @returns {{ ref: React.RefObject, visible: boolean }}
 *
 * Usage:
 *   const { ref, visible } = useReveal({ threshold: 0.15 });
 *   <div ref={ref} style={{ opacity: visible ? 1 : 0 }} />
 */
export function useReveal({
  threshold = 0.12,
  once = true,
  rootMargin = '0px',
} = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already visible — skip observer setup (e.g. hot-reload)
    if (visible && once) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, once, rootMargin]);

  return { ref, visible };
}

/**
 * fadeUp — convenience style object for reveal transitions.
 * Pure CSS, zero JS on animation frame — compositor-thread only.
 *
 * @param {boolean} visible
 * @param {number}  delay   — seconds
 * @param {number}  distance — px to travel (default 20)
 */
export function fadeUp(visible, delay = 0, distance = 20) {
  return {
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateY(0)' : `translateY(${distance}px)`,
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  };
}
