'use client';

import { useEffect, useState, useRef } from 'react';

export default function CursorPet() {
  const [mounted, setMounted] = useState(false);
  const spriteRef = useRef(null);
  const containerRef = useRef(null);

  // High-performance refs: zero React state re-renders during mouse movement
  const mousePosRef = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const state = useRef({ action: 'wait' });

  useEffect(() => {
    // Check if device supports fine pointer (mouse/trackpad), exclude touch-only
    const hasFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    setMounted(true);

    const handleMouseMove = (e) => {
      mousePosRef.current.x = e.clientX + 15;
      mousePosRef.current.y = e.clientY + 15;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId;
    let lastAnimTime = performance.now();
    let frameIndex = 0;
    let lastMousePos = { x: -100, y: -100 };
    let lastMouseTime = performance.now();

    const animations = {
      idle:       { row: 0, frames: 6, speed: 150 },
      run_right:  { row: 1, frames: 8, speed: 70 },
      run_left:   { row: 2, frames: 8, speed: 70 },
      wave:       { row: 3, frames: 4, speed: 200 },
      jump:       { row: 4, frames: 5, speed: 100 },
      fail:       { row: 5, frames: 8, speed: 150 },
      wait:       { row: 6, frames: 6, speed: 150 },
      running:    { row: 7, frames: 6, speed: 60 },
      review:     { row: 8, frames: 6, speed: 200 }
    };

    const SPEED = 2.5;
    const WAKE_DELAY = 1200;

    const loop = (time) => {
      const targetX = mousePosRef.current.x;
      const targetY = mousePosRef.current.y;

      // Initialize starting point
      if (pos.current.x === -100 && targetX !== -100) {
        pos.current.x = targetX;
        pos.current.y = targetY;
      }

      // Mouse movement tracking
      const mouseMoved = Math.abs(targetX - lastMousePos.x) > 5 ||
                         Math.abs(targetY - lastMousePos.y) > 5;

      if (mouseMoved) {
        lastMousePos.x = targetX;
        lastMousePos.y = targetY;
        lastMouseTime = time;
        if (['wave', 'review', 'idle'].includes(state.current.action)) {
          state.current.action = 'wait';
          frameIndex = 0;
        }
      }

      const timeSinceMouseMove = time - lastMouseTime;
      const dx = targetX - pos.current.x;
      const dy = targetY - pos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const oldAction = state.current.action;

      // State Machine Logic
      if (['wait', 'idle', 'wave', 'review'].includes(state.current.action)) {
        if (dist > 40 && timeSinceMouseMove > WAKE_DELAY) {
          state.current.action = dx > 0 ? 'run_right' : 'run_left';
        } else if (dist <= 40) {
          if (timeSinceMouseMove < 4000) {
            state.current.action = 'idle';
          } else if (timeSinceMouseMove < 8000) {
            state.current.action = 'wave';
          } else {
            state.current.action = 'review';
          }
        }
      }

      // Physics Engine
      if (state.current.action === 'run_left' || state.current.action === 'run_right') {
        if (dist < 10) {
          state.current.action = 'idle';
        } else {
          const angle = Math.atan2(dy, dx);
          pos.current.x += Math.cos(angle) * SPEED;
          pos.current.y += Math.sin(angle) * SPEED;
          state.current.action = dx > 0 ? 'run_right' : 'run_left';
        }
      }

      if (oldAction !== state.current.action) {
        frameIndex = 0;
      }

      // Transform Position directly via DOM - zero React re-render overhead
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      // Animation Rendering
      const currentAnim = animations[state.current.action] || animations.idle;
      if (time - lastAnimTime > currentAnim.speed) {
        frameIndex = (frameIndex + 1) % currentAnim.frames;
        lastAnimTime = time;

        if (spriteRef.current) {
          const bgX = `calc(100% / 7 * ${frameIndex})`;
          const bgY = `calc(100% / 8 * ${currentAnim.row})`;
          spriteRef.current.style.backgroundPosition = `${bgX} ${bgY}`;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="hidden md:block"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    >
      <div ref={containerRef} style={{ willChange: 'transform' }}>
        <div
          ref={spriteRef}
          style={{
            width: '45px',
            height: '49px',
            backgroundImage: 'url(/capvolt.webp)',
            backgroundSize: '800% 900%',
            backgroundPosition: '0% 0%',
            filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))'
          }}
        />
      </div>
    </div>
  );
}
