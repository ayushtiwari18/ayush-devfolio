'use client';

import { Children, cloneElement, isValidElement, useEffect, useState } from 'react';
import { useReveal } from './useReveal';

/**
 * StaggeredList — staggered entrance animations for a list of children.
 *
 * SSR-safe:
 * - prefersReduced is read client-side only (useEffect), never during SSR
 * - visible starts false on server + client first render — no hydration mismatch
 *
 * @param {string} props.className   — applied to wrapper element
 * @param {string} props.as          — wrapper tag (default 'div')
 * @param {number} props.staggerMs   — delay between items in ms (default 80)
 * @param {number} props.durationMs  — transition duration per item (default 500)
 * @param {number} props.distance    — translateY distance in px (default 20)
 * @param {number} props.threshold   — IntersectionObserver threshold (default 0.1)
 */
export default function StaggeredList({
  children,
  staggerMs  = 80,
  durationMs = 500,
  distance   = 20,
  threshold  = 0.1,
  className  = '',
  as: Tag    = 'div',
}) {
  const { ref, visible } = useReveal({ threshold, once: true });

  // Read prefers-reduced-motion only on the client, never during SSR
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    setPrefersReduced(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  const styledChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;

    const delay = prefersReduced ? 0 : (index * staggerMs) / 1000;
    const itemStyle = prefersReduced
      ? {}
      : {
          opacity:    visible ? 1 : 0,
          transform:  visible ? 'translateY(0)' : `translateY(${distance}px)`,
          transition: `opacity ${durationMs}ms cubic-bezier(0.16,1,0.3,1) ${delay}s, transform ${durationMs}ms cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        };

    return cloneElement(child, {
      style: { ...child.props.style, ...itemStyle },
    });
  });

  return (
    <Tag ref={ref} className={className}>
      {styledChildren}
    </Tag>
  );
}
