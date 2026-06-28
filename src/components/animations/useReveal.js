'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * useReveal — shared IntersectionObserver hook.
 * SSR-safe: visible is always false on server and during hydration.
 * IntersectionObserver only runs client-side after mount.
 */
export function useReveal({
  threshold = 0.12,
  once = true,
  rootMargin = '0px',
} = {}) {
  const ref = useRef(null);
  // isMounted guards against SSR/hydration mismatch
  // visible starts false on both server and client first render
  const [isMounted, setIsMounted] = useState(false);
  const [visible, setVisible]     = useState(false);

  // Step 1: mark mounted after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Step 2: only observe once mounted (never runs on server)
  useEffect(() => {
    if (!isMounted) return;
    const el = ref.current;
    if (!el) return;
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
  }, [isMounted, threshold, once, rootMargin]);

  return { ref, visible };
}

/**
 * fadeUp — compositor-thread CSS transition style object.
 * Returns identical styles on server and client first render (both invisible)
 * so hydration always matches.
 */
export function fadeUp(visible, delay = 0, distance = 20) {
  return {
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateY(0)' : `translateY(${distance}px)`,
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  };
}
