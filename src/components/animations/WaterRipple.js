'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * WaterRipple — canvas-based water surface simulation.
 * Uses a classic two-buffer height-field wave equation:
 *   next[i] = (2 * curr[i] - prev[i] + damping * (neighbors - 2*curr[i]))
 * Mouse / touch interaction drops ripples into the field.
 * Renders by displacing pixel samples from the source image/gradient.
 */
export default function WaterRipple({ className = '' }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);

  // ── initialise simulation buffers ──────────────────────────────────────────
  const init = useCallback((canvas) => {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width  = w;
    canvas.height = h;
    const size = w * h;

    stateRef.current = {
      w, h, size,
      // two height-field buffers (Float32 for smooth gradients)
      buf: [new Float32Array(size), new Float32Array(size)],
      cur: 0,
      ctx: canvas.getContext('2d'),
      // off-screen source canvas that we displace
      src: null,
      animId: null,
      lastDrop: 0,
    };

    // build the source gradient canvas once
    const src = document.createElement('canvas');
    src.width  = w;
    src.height = h;
    const sCtx = src.getContext('2d');

    // deep-blue → purple gradient matching the portfolio dark theme
    const grad = sCtx.createRadialGradient(w * 0.35, h * 0.45, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
    grad.addColorStop(0,   'rgba(99,  102, 241, 0.18)');  // indigo
    grad.addColorStop(0.4, 'rgba(139,  92, 246, 0.12)');  // violet
    grad.addColorStop(0.8, 'rgba( 30,  27,  75, 0.25)');  // dark navy
    grad.addColorStop(1,   'rgba(  0,   0,   0, 0.40)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, w, h);

    // soft noise dots for texture
    for (let i = 0; i < 120; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      const rr = Math.random() * 2 + 0.5;
      const dot = sCtx.createRadialGradient(rx, ry, 0, rx, ry, rr * 8);
      dot.addColorStop(0,   `rgba(167,139,250,${(Math.random() * 0.12).toFixed(3)})`);
      dot.addColorStop(1,   'rgba(0,0,0,0)');
      sCtx.fillStyle = dot;
      sCtx.beginPath();
      sCtx.arc(rx, ry, rr * 8, 0, Math.PI * 2);
      sCtx.fill();
    }

    stateRef.current.src = src;
  }, []);

  // ── drop a ripple at (x, y) with radius r ──────────────────────────────────
  const drop = useCallback((x, y, radius = 18, strength = 220) => {
    const s = stateRef.current;
    if (!s) return;
    const { w, h, buf, cur } = s;
    const px = Math.floor(x);
    const py = Math.floor(y);
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dist2 = dx * dx + dy * dy;
        if (dist2 <= radius * radius) {
          const nx = px + dx;
          const ny = py + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
            const falloff = 1 - Math.sqrt(dist2) / radius;
            buf[cur][ny * w + nx] += strength * falloff * falloff;
          }
        }
      }
    }
  }, []);

  // ── one simulation + render tick ───────────────────────────────────────────
  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const { w, h, size, buf, ctx, src } = s;
    const cur  = s.cur;
    const prev = 1 - cur;
    const DAMPING = 0.986;   // > 0.98 = long-living ripples, < 0.97 = die fast

    // ── wave propagation ────────────────────────────────────────────
    const next = buf[prev]; // reuse old buffer
    const curr = buf[cur];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        next[i] =
          (curr[i - 1] + curr[i + 1] + curr[i - w] + curr[i + w]) * 0.5
          - next[i];
        next[i] *= DAMPING;
      }
    }
    s.cur = prev; // swap

    // ── render: pixel displacement ──────────────────────────────────
    const srcData = (() => {
      const tmp = document.createElement('canvas');
      tmp.width = w; tmp.height = h;
      tmp.getContext('2d').drawImage(src, 0, 0);
      return tmp.getContext('2d').getImageData(0, 0, w, h);
    });

    // lazy-cache source pixels each frame (fast path)
    if (!s._srcPixels || s._srcDirty) {
      const tmp = document.createElement('canvas');
      tmp.width = w; tmp.height = h;
      tmp.getContext('2d').drawImage(src, 0, 0);
      s._srcPixels = tmp.getContext('2d').getImageData(0, 0, w, h);
      s._srcDirty  = false;
    }
    const srcPx  = s._srcPixels;
    const output = ctx.createImageData(w, h);
    const od     = output.data;
    const sd     = srcPx.data;
    const wave   = buf[s.cur]; // the freshly propagated buffer

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i  = y * w + x;
        // gradient of height field = refraction vector
        const dx = (wave[i - 1] - wave[i + 1]) >> 2; // bit-shift ÷4 fast
        const dy = (wave[i - w] - wave[i + w]) >> 2;

        // clamp source lookup
        let sx = x + dx;
        let sy = y + dy;
        if (sx < 0) sx = 0; else if (sx >= w) sx = w - 1;
        if (sy < 0) sy = 0; else if (sy >= h) sy = h - 1;

        const src4 = (sy * w + sx) * 4;
        const dst4 = i * 4;

        od[dst4]     = sd[src4];
        od[dst4 + 1] = sd[src4 + 1];
        od[dst4 + 2] = sd[src4 + 2];
        // enhance alpha slightly in disturbed areas for a gleam
        const mag = Math.abs(dx) + Math.abs(dy);
        od[dst4 + 3] = Math.min(255, sd[src4 + 3] + mag * 3);
      }
    }

    ctx.putImageData(output, 0, 0);
    s.animId = requestAnimationFrame(tick);
  }, []);

  // ── autonomous ambient drips ────────────────────────────────────────────────
  const ambientDrip = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const now = performance.now();
    // random drip every 1.2–2.8 s
    if (now - s.lastDrop > 1200 + Math.random() * 1600) {
      drop(
        Math.random() * s.w,
        Math.random() * s.h,
        6 + Math.random() * 10,
        60 + Math.random() * 100,
      );
      s.lastDrop = now;
    }
  }, [drop]);

  // wrap tick so ambient drips fire every frame without coupling tick↔drop
  const frame = useCallback(() => {
    ambientDrip();
    tick();
  }, [ambientDrip, tick]);

  // ── mount / unmount ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    init(canvas);

    // start loop
    stateRef.current.animId = requestAnimationFrame(frame);

    // ── pointer interaction ────────────────────────────────────────
    let isDown = false;

    const getPos = (e, rect) => {
      const src = e.touches ? e.touches[0] : e;
      return {
        x: (src.clientX - rect.left) * (canvas.width  / rect.width),
        y: (src.clientY - rect.top)  * (canvas.height / rect.height),
      };
    };

    const onMove = (e) => {
      if (!isDown && e.type === 'mousemove') {
        // hover — tiny gentle drip
        const rect = canvas.getBoundingClientRect();
        const { x, y } = getPos(e, rect);
        drop(x, y, 8, 40);
        return;
      }
      if (isDown || e.type === 'touchmove') {
        const rect = canvas.getBoundingClientRect();
        const { x, y } = getPos(e, rect);
        drop(x, y, 14, 130);
      }
    };
    const onDown = (e) => {
      isDown = true;
      const rect = canvas.getBoundingClientRect();
      const { x, y } = getPos(e, rect);
      drop(x, y, 22, 280);
    };
    const onUp = () => { isDown = false; };

    canvas.addEventListener('mousemove',  onMove, { passive: true });
    canvas.addEventListener('mousedown',  onDown, { passive: true });
    canvas.addEventListener('mouseup',    onUp);
    canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    canvas.addEventListener('touchmove',  onMove, { passive: true });
    canvas.addEventListener('touchend',   onUp);

    // ── resize ────────────────────────────────────────────────────
    const onResize = () => {
      cancelAnimationFrame(stateRef.current?.animId);
      init(canvas);
      stateRef.current.animId = requestAnimationFrame(frame);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(stateRef.current?.animId);
      canvas.removeEventListener('mousemove',  onMove);
      canvas.removeEventListener('mousedown',  onDown);
      canvas.removeEventListener('mouseup',    onUp);
      canvas.removeEventListener('mouseleave', onUp);
      canvas.removeEventListener('touchstart', onDown);
      canvas.removeEventListener('touchmove',  onMove);
      canvas.removeEventListener('touchend',   onUp);
      window.removeEventListener('resize', onResize);
    };
  }, [init, frame, drop]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ mixBlendMode: 'screen', opacity: 0.55 }}
    />
  );
}
