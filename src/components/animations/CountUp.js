'use client';

import { useEffect, useRef, useState } from 'react';
import { useReveal } from './useReveal';

/**
 * CountUp — animates a number from 0 to `end` when scrolled into view.
 *
 * Respects prefers-reduced-motion: if the user prefers reduced motion,
 * the final value is displayed immediately with no animation.
 *
 * @param {object} props
 * @param {number|string} props.end       — target value (strips non-digits for animation, e.g. "885+" → 885)
 * @param {string}        props.suffix    — appended after number, e.g. "+" or "x" (default '')
 * @param {string}        props.prefix    — prepended before number, e.g. "$" (default '')
 * @param {number}        props.duration  — animation duration in ms (default 1800)
 * @param {string}        props.className — CSS classes for the span
 * @param {number}        props.threshold — IntersectionObserver threshold (default 0.3)
 *
 * Usage:
 *   <CountUp end={885} suffix="+" className="text-4xl font-bold" />
 *   <CountUp end="5600" suffix="+" prefix="" duration={2000} />
 */
export default function CountUp({
  end,
  suffix = '',
  prefix = '',
  duration = 1800,
  className = '',
  threshold = 0.3,
}) {
  const { ref, visible } = useReveal({ threshold, once: true });
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const hasRun = useRef(false);

  // Parse numeric target — strip non-digit chars so "885+" → 885
  const target = parseInt(String(end).replace(/[^0-9]/g, ''), 10) || 0;

  useEffect(() => {
    if (!visible || hasRun.current) return;

    // Respect prefers-reduced-motion
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setCount(target);
      hasRun.current = true;
      return;
    }

    hasRun.current = true;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
