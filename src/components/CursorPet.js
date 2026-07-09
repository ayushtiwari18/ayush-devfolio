'use client';

import { useEffect, useState, useRef } from 'react';

export default function CursorPet() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isClient, setIsClient] = useState(false);
  
  const spriteRef = useRef(null);
  const containerRef = useRef(null);
  
  // Game state
  const pos = useRef({ x: -100, y: -100 });
  const state = useRef({
    action: 'wait',
  });

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX + 15, y: e.clientY + 15 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let animationFrameId;
    let lastAnimTime = performance.now();
    let frameIndex = 0;
    
    let lastMousePos = { x: -100, y: -100 };
    let lastMouseTime = performance.now();
    
    // Exact Petdex Animation Mapping from User
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
    
    const SPEED = 2.5; // Constant walking speed (no spring jumping)
    const WAKE_DELAY = 1200; // 1.2s delay before chasing
    
    const loop = (time) => {
      // 1. Mouse movement tracking
      const mouseMoved = Math.abs(mousePosition.x - lastMousePos.x) > 5 || 
                         Math.abs(mousePosition.y - lastMousePos.y) > 5;
      
      if (mouseMoved) {
        lastMousePos = { x: mousePosition.x, y: mousePosition.y };
        lastMouseTime = time;
        if (['wave', 'review', 'idle'].includes(state.current.action)) {
          state.current.action = 'wait';
          frameIndex = 0; // reset frame on action change
        }
      }

      const timeSinceMouseMove = time - lastMouseTime;
      const dx = mousePosition.x - pos.current.x;
      const dy = mousePosition.y - pos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const oldAction = state.current.action;
      
      // 2. State Machine Logic
      if (['wait', 'idle', 'wave', 'review'].includes(state.current.action)) {
        if (dist > 40 && timeSinceMouseMove > WAKE_DELAY) {
          state.current.action = dx > 0 ? 'run_right' : 'run_left';
        } else if (dist <= 40) {
          // Idle sequences
          if (timeSinceMouseMove < 4000) {
            state.current.action = 'idle';
          } else if (timeSinceMouseMove < 8000) {
            state.current.action = 'wave';
          } else {
            state.current.action = 'review';
          }
        }
      }

      // 3. Physics Engine (Constant Speed)
      if (state.current.action === 'run_left' || state.current.action === 'run_right') {
        if (dist < 10) {
          state.current.action = 'idle';
        } else {
          // Move towards mouse at a constant, slow speed (no spring snapping)
          const angle = Math.atan2(dy, dx);
          pos.current.x += Math.cos(angle) * SPEED;
          pos.current.y += Math.sin(angle) * SPEED;
          
          // Switch run direction dynamically if mouse crossed over
          state.current.action = dx > 0 ? 'run_right' : 'run_left';
        }
      }
      
      // Reset frame index if action changed
      if (oldAction !== state.current.action) {
        frameIndex = 0;
      }

      // 4. Transform Position (Updates EVERY 60fps frame for ultra-smooth movement)
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      // 5. Animation Rendering (Updates sprite based on animation speed)
      const currentAnim = animations[state.current.action] || animations.idle;
      
      if (time - lastAnimTime > currentAnim.speed) {
        frameIndex = (frameIndex + 1) % currentAnim.frames;
        lastAnimTime = time;
        
        if (spriteRef.current) {
          // Always use 7 and 8 as denominators because the spritesheet is physically 8 cols x 9 rows
          const bgX = `calc(100% / 7 * ${frameIndex})`;
          const bgY = `calc(100% / 8 * ${currentAnim.row})`;
          spriteRef.current.style.backgroundPosition = `${bgX} ${bgY}`;
        }
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    // Jump pet to initial mouse position on first load so it doesn't walk from (-100, -100)
    if (pos.current.x === -100) {
        pos.current.x = mousePosition.x;
        pos.current.y = mousePosition.y;
    }
    
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePosition, isClient]);

  if (!isClient) return null;

  return (
    <div
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
            width: '45px', // slightly taller ratio (192x208 approx)
            height: '49px', 
            backgroundImage: 'url(/capvolt.webp)',
            backgroundSize: '800% 900%', // Exactly 8 cols, 9 rows
            backgroundPosition: '0% 0%',
            filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))'
          }}
        />
      </div>
    </div>
  );
}
