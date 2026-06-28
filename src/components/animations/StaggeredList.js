'use client';

import { Children, cloneElement, isValidElement } from 'react';
import { useReveal } from './useReveal';

/**
 * StaggeredList — wraps children and applies staggered entrance animations.
 *
 * Each direct child gets an inline style with:
 *   - opacity 0→1
 *   - translateY(distance)→0
 *   - transition-delay = index * staggerMs
 *
 * Respects prefers-reduced-motion: if reduced motion is preferred,
 * all children are immediately visible with no transition.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {number} props.staggerMs   — delay between each child in ms (default 80)
 * @param {number} props.durationMs  — transition duration per item in ms (default 500)
 * @param {number} props.distance    — translateY distance in px (default 20)
 * @param {number} props.threshold   — IOb threshold to trigger (default 0.1)
 * @param {string} props.className   — wrapper div className
 * @param {string} props.as          — wrapper element tag (default 'div')
 *
 * Usage:
 *   <StaggeredList staggerMs={80} className="grid grid-cols-3 gap-4">
 *     {items.map(item => <Card key={item.id} {...item} />)}
 *   </StaggeredList>
 */
export default function StaggeredList({
  children,
  staggerMs = 80,
  durationMs = 500,
  distance = 20,
  threshold = 0.1,
  className = '',
  as: Tag = 'div',
}) {
  const { ref, visible } = useReveal({ threshold, once: true });

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

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
