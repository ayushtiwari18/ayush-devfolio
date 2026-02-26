'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Code2 } from 'lucide-react';

const VideoPreviewController = dynamic(
  () => import('./VideoPreviewController'),
  { ssr: false }
);

export default function ProjectHero({ heroImage, coverImage, previewVideo, youtubeUrl, title }) {
  const wrapRef    = useRef(null);
  const mountRef   = useRef(null);
  const cleanupRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imageSrc = heroImage || coverImage || null;

  useEffect(() => {
    const container = mountRef.current;
    const wrapper   = wrapRef.current;
    if (!container || !wrapper) return;

    let isAlive = true;
    let THREE, renderer, simMat, dispMat;
    let rtA, rtB, rtC;
    let animId;
    let lastDrop = 0;
    const mouse = { moving: false };

    // Load cover image into an offscreen canvas → CanvasTexture
    // Uses HTMLImageElement only inside useEffect (client-only), never on server.
    function loadBgTexture(src, T, W, H) {
      return new Promise((resolve) => {
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const ctx = c.getContext('2d');
        if (src) {
          const img = document.createElement('img'); // safe: always inside useEffect
          img.crossOrigin = 'anonymous';
          img.onload  = () => { ctx.drawImage(img, 0, 0, W, H); resolve(new T.CanvasTexture(c)); };
          img.onerror = () => resolve(buildFallback(T, W, H));
          img.src = src;
        } else {
          resolve(buildFallback(T, W, H));
        }
      });
    }

    function buildFallback(T, W, H) {
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(W * 0.35, H * 0.45, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.9);
      g.addColorStop(0,   'rgba(99,102,241,0.22)');
      g.addColorStop(0.4, 'rgba(139,92,246,0.16)');
      g.addColorStop(1,   'rgba(0,0,0,0.55)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      return new T.CanvasTexture(c);
    }

    import('three').then(async (mod) => {
      if (!isAlive) return;
      THREE = mod;

      const W = container.offsetWidth  || wrapper.offsetWidth  || 800;
      const H = container.offsetHeight || wrapper.offsetHeight || 450;

      // ── WebGL renderer ──────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(1);
      renderer.setSize(W, H);
      renderer.domElement.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;border-radius:inherit;';
      container.appendChild(renderer.domElement);

      // ── Ping-pong render targets ─────────────────────────────────
      const rtParams = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      };
      rtA = new THREE.WebGLRenderTarget(W, H, rtParams);
      rtB = new THREE.WebGLRenderTarget(W, H, rtParams);
      rtC = new THREE.WebGLRenderTarget(W, H, rtParams);

      // ── Background texture (project cover image) ─────────────────
      const bgTex = await loadBgTexture(imageSrc, THREE, W, H);
      if (!isAlive) return;

      // ── GLSL ─────────────────────────────────────────────────────
      const vert = /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      // Damping 0.978 → waves die naturally in ~0.8 s
      // Gaussian 0.0004 → tight raindrop entry, not a splash
      const simFrag = /* glsl */`
        precision highp float;
        uniform sampler2D uPrev;
        uniform sampler2D uPrev2;
        uniform vec2  uResolution;
        uniform vec2  uMouse;
        uniform float uDropStrength;
        varying vec2 vUv;
        void main() {
          vec2  px   = 1.0 / uResolution;
          float l    = texture2D(uPrev, vUv - vec2(px.x, 0.0)).r;
          float r    = texture2D(uPrev, vUv + vec2(px.x, 0.0)).r;
          float u    = texture2D(uPrev, vUv - vec2(0.0, px.y)).r;
          float d    = texture2D(uPrev, vUv + vec2(0.0, px.y)).r;
          float p    = texture2D(uPrev2, vUv).r;
          float next = (l + r + u + d) * 0.5 - p;
          next      *= 0.978;
          if (uMouse.x >= 0.0) {
            float dist = length(vUv - uMouse);
            next += uDropStrength * exp(-dist * dist / 0.0004);
          }
          gl_FragColor = vec4(next, 0.0, 0.0, 1.0);
        }
      `;

      // Displacement 1.8 → subtle warp, not funhouse mirror
      // Specular 0.18 → faint glint only
      const dispFrag = /* glsl */`
        precision highp float;
        uniform sampler2D uHeight;
        uniform sampler2D uBackground;
        uniform vec2 uResolution;
        varying vec2 vUv;
        void main() {
          vec2  px  = 1.0 / uResolution;
          float l   = texture2D(uHeight, vUv - vec2(px.x, 0.0)).r;
          float r   = texture2D(uHeight, vUv + vec2(px.x, 0.0)).r;
          float u   = texture2D(uHeight, vUv - vec2(0.0, px.y)).r;
          float d   = texture2D(uHeight, vUv + vec2(0.0, px.y)).r;
          vec2  n   = vec2(r - l, d - u) * 1.8;
          vec2  uv2 = clamp(vUv + n, 0.0, 1.0);
          vec4  bg  = texture2D(uBackground, uv2);
          float h   = texture2D(uHeight, vUv).r;
          float spec = max(0.0, h) * 0.18;
          gl_FragColor = vec4(bg.rgb + spec, bg.a + abs(h) * 0.12);
        }
      `;

      // ── Scenes & materials ───────────────────────────────────────
      const simScene  = new THREE.Scene();
      const dispScene = new THREE.Scene();
      const cam       = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const quad      = new THREE.PlaneGeometry(2, 2);

      simMat = new THREE.ShaderMaterial({
        vertexShader: vert, fragmentShader: simFrag,
        uniforms: {
          uPrev:         { value: rtA.texture },
          uPrev2:        { value: rtB.texture },
          uResolution:   { value: new THREE.Vector2(W, H) },
          uMouse:        { value: new THREE.Vector2(-1, -1) },
          uDropStrength: { value: 0.0 },
        },
      });

      dispMat = new THREE.ShaderMaterial({
        vertexShader: vert, fragmentShader: dispFrag,
        transparent: true,
        uniforms: {
          uHeight:     { value: rtA.texture },
          uBackground: { value: bgTex },
          uResolution: { value: new THREE.Vector2(W, H) },
        },
      });

      simScene.add(new THREE.Mesh(quad, simMat));
      dispScene.add(new THREE.Mesh(quad, dispMat));

      function drip(x, y, str) {
        simMat.uniforms.uMouse.value.set(x, y);
        simMat.uniforms.uDropStrength.value = str;
        mouse.moving = true;
      }

      // ── Animation loop ───────────────────────────────────────────
      function animate() {
        if (!isAlive) return;
        animId = requestAnimationFrame(animate);

        const now = performance.now();
        // Ambient: 1 quiet drip every 3–6 s
        if (now - lastDrop > 3000 + Math.random() * 3000) {
          drip(Math.random(), Math.random(), 0.08 + Math.random() * 0.06);
          lastDrop = now;
        } else if (!mouse.moving) {
          simMat.uniforms.uMouse.value.set(-1, -1);
          simMat.uniforms.uDropStrength.value = 0.0;
        }
        mouse.moving = false;

        simMat.uniforms.uPrev.value  = rtA.texture;
        simMat.uniforms.uPrev2.value = rtB.texture;
        renderer.setRenderTarget(rtC);
        renderer.render(simScene, cam);

        const tmp = rtB; rtB = rtA; rtA = rtC; rtC = tmp;

        dispMat.uniforms.uHeight.value = rtA.texture;
        renderer.setRenderTarget(null);
        renderer.render(dispScene, cam);
      }
      animate();

      // ── Pointer events (canvas is pointer-events:none, wrapper handles) ──
      function getUV(e) {
        const rect = wrapper.getBoundingClientRect();
        const src  = e.touches ? e.touches[0] : e;
        return {
          x:  (src.clientX - rect.left)  / rect.width,
          y: 1 - (src.clientY - rect.top) / rect.height,
        };
      }
      const onMove = (e) => { const { x, y } = getUV(e); drip(x, y, 0.12); };
      const onDown = (e) => { const { x, y } = getUV(e); drip(x, y, 0.45); };

      wrapper.addEventListener('mousemove',  onMove, { passive: true });
      wrapper.addEventListener('mousedown',  onDown, { passive: true });
      wrapper.addEventListener('touchstart', onDown, { passive: true });
      wrapper.addEventListener('touchmove',  onMove, { passive: true });

      // ── Resize ───────────────────────────────────────────────────
      function onResize() {
        if (!wrapRef.current) return;
        const nW = wrapRef.current.offsetWidth;
        const nH = wrapRef.current.offsetHeight;
        renderer.setSize(nW, nH);
        [rtA, rtB, rtC].forEach(rt => rt.setSize(nW, nH));
        simMat.uniforms.uResolution.value.set(nW, nH);
        dispMat.uniforms.uResolution.value.set(nW, nH);
      }
      window.addEventListener('resize', onResize);

      cleanupRef.current = () => {
        isAlive = false;
        cancelAnimationFrame(animId);
        wrapper.removeEventListener('mousemove',  onMove);
        wrapper.removeEventListener('mousedown',  onDown);
        wrapper.removeEventListener('touchstart', onDown);
        wrapper.removeEventListener('touchmove',  onMove);
        window.removeEventListener('resize', onResize);
        [rtA, rtB, rtC].forEach(rt => rt?.dispose());
        bgTex.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode)
          renderer.domElement.parentNode.removeChild(renderer.domElement);
      };
    }).catch(console.error);

    return () => cleanupRef.current?.();
  }, [imageSrc]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20"
      style={{ aspectRatio: '16 / 7', cursor: 'crosshair' }}
    >
      {/* Static image layer — always visible beneath the WebGL canvas */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={`${title} project preview`}
          onLoad={() => setImgLoaded(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.4s',
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Code2 size={80} className="text-primary/20" />
        </div>
      )}

      {/* Three.js canvas is appended here */}
      <div ref={mountRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Bottom fade gradient */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />

      {previewVideo && (
        <VideoPreviewController
          previewVideo={previewVideo}
          youtubeUrl={youtubeUrl}
          heroRef={wrapRef}
        />
      )}
    </div>
  );
}
