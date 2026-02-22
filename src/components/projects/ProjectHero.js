'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Code2 } from 'lucide-react';

const VideoPreviewController = dynamic(
  () => import('./VideoPreviewController'),
  { ssr: false }
);

/**
 * ProjectHero
 * -----------
 * Full-width hero image with GentleRain-style WebGL water ripple.
 *
 * How it works:
 *  - Three.js WebGLRenderer + two ping-pong RenderTargets (rtA / rtB / rtC).
 *  - SIMULATION shader: runs wave equation per-pixel on GPU each frame.
 *    Mouse position injects a gaussian droplet (energy) into the height field.
 *  - DISPLAY shader: reads height gradient → surface normal → displaces UV
 *    lookup into the project cover image → glass-water refraction effect.
 *  - Ambient auto-drips keep the surface alive when mouse is idle.
 *  - Lazy-loads Three.js so it never affects SSR or initial bundle.
 */
export default function ProjectHero({ heroImage, coverImage, previewVideo, youtubeUrl, title }) {
  const wrapRef   = useRef(null);  // outer container (events + size)
  const mountRef  = useRef(null);  // inner div Three.js appends canvas into
  const heroRef   = useRef(null);  // for VideoPreviewController
  const cleanupRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const imageSrc = heroImage || coverImage || null;

  // ── Bootstrap WebGL once the image has been loaded into a cross-origin-safe
  //     Image element (or immediately when there is no image).
  useEffect(() => {
    const container = mountRef.current;
    const wrapper   = wrapRef.current;
    if (!container || !wrapper) return;

    let isAlive = true;
    let THREE, renderer, simMat, dispMat;
    let rtA, rtB, rtC;
    let animId;
    let lastDrop = 0;
    const mouse = { x: -1, y: -1, moving: false };

    // ── helper: load image into a canvas, return CanvasTexture ───────
    function loadBgTexture(src, ThreeRef, W, H) {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d');

        if (src) {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.drawImage(img, 0, 0, W, H);
            resolve(new ThreeRef.CanvasTexture(canvas));
          };
          img.onerror = () => resolve(buildFallbackTexture(ThreeRef, W, H));
          img.src = src;
        } else {
          resolve(buildFallbackTexture(ThreeRef, W, H));
        }
      });
    }

    function buildFallbackTexture(ThreeRef, W, H) {
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(W*0.35, H*0.45, 0, W*0.5, H*0.5, Math.max(W,H)*0.9);
      grad.addColorStop(0,   'rgba(99,102,241,0.22)');
      grad.addColorStop(0.4, 'rgba(139,92,246,0.16)');
      grad.addColorStop(1,   'rgba(0,0,0,0.55)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      return new ThreeRef.CanvasTexture(canvas);
    }

    // ── main bootstrap ───────────────────────────────────────────
    import('three').then(async (mod) => {
      if (!isAlive) return;
      THREE = mod;

      const W = container.offsetWidth  || wrapper.offsetWidth  || 800;
      const H = container.offsetHeight || wrapper.offsetHeight || 450;

      // ── renderer ────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(1);
      renderer.setSize(W, H);
      renderer.domElement.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;border-radius:inherit;';
      container.appendChild(renderer.domElement);

      // ── ping-pong render targets ────────────────────────────
      const rtParams = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      };
      rtA = new THREE.WebGLRenderTarget(W, H, rtParams);
      rtB = new THREE.WebGLRenderTarget(W, H, rtParams);
      rtC = new THREE.WebGLRenderTarget(W, H, rtParams);

      // ── background texture (project cover image) ────────────
      const bgTex = await loadBgTexture(imageSrc, THREE, W, H);
      if (!isAlive) return;

      // ── GLSL shaders ──────────────────────────────────────
      const vert = /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const simFrag = /* glsl */`
        precision highp float;
        uniform sampler2D uPrev;
        uniform sampler2D uPrev2;
        uniform vec2  uResolution;
        uniform vec2  uMouse;
        uniform float uDropStrength;
        varying vec2 vUv;
        void main() {
          vec2 px = 1.0 / uResolution;
          float l = texture2D(uPrev, vUv - vec2(px.x, 0.0)).r;
          float r = texture2D(uPrev, vUv + vec2(px.x, 0.0)).r;
          float u = texture2D(uPrev, vUv - vec2(0.0, px.y)).r;
          float d = texture2D(uPrev, vUv + vec2(0.0, px.y)).r;
          float c = texture2D(uPrev,  vUv).r;
          float p = texture2D(uPrev2, vUv).r;
          float next = (l + r + u + d) * 0.5 - p;
          next *= 0.985;
          if (uMouse.x >= 0.0) {
            float dist = length(vUv - uMouse);
            next += uDropStrength * exp(-dist * dist / 0.0008);
          }
          gl_FragColor = vec4(next, 0.0, 0.0, 1.0);
        }
      `;

      const dispFrag = /* glsl */`
        precision highp float;
        uniform sampler2D uHeight;
        uniform sampler2D uBackground;
        uniform vec2 uResolution;
        varying vec2 vUv;
        void main() {
          vec2 px = 1.0 / uResolution;
          float l = texture2D(uHeight, vUv - vec2(px.x, 0.0)).r;
          float r = texture2D(uHeight, vUv + vec2(px.x, 0.0)).r;
          float u = texture2D(uHeight, vUv - vec2(0.0, px.y)).r;
          float d = texture2D(uHeight, vUv + vec2(0.0, px.y)).r;
          vec2  n = vec2(r - l, d - u) * 4.0;
          vec2  displacedUv = clamp(vUv + n, 0.0, 1.0);
          vec4  bg = texture2D(uBackground, displacedUv);
          float h  = texture2D(uHeight, vUv).r;
          float spec = max(0.0, h) * 0.5;
          vec3 specColor = vec3(1.0, 1.0, 1.0) * spec;
          gl_FragColor = vec4(bg.rgb + specColor, bg.a + abs(h) * 0.3);
        }
      `;

      // ── scenes & materials ────────────────────────────────────
      const simScene  = new THREE.Scene();
      const dispScene = new THREE.Scene();
      const camera    = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const quad      = new THREE.PlaneGeometry(2, 2);

      simMat = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: simFrag,
        uniforms: {
          uPrev:         { value: rtA.texture },
          uPrev2:        { value: rtB.texture },
          uResolution:   { value: new THREE.Vector2(W, H) },
          uMouse:        { value: new THREE.Vector2(-1, -1) },
          uDropStrength: { value: 0.0 },
        },
      });

      dispMat = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: dispFrag,
        transparent: true,
        uniforms: {
          uHeight:     { value: rtA.texture },
          uBackground: { value: bgTex },
          uResolution: { value: new THREE.Vector2(W, H) },
        },
      });

      simScene.add(new THREE.Mesh(quad, simMat));
      dispScene.add(new THREE.Mesh(quad, dispMat));

      // ── helpers ────────────────────────────────────────────
      function drip(x, y, str) {
        simMat.uniforms.uMouse.value.set(x, y);
        simMat.uniforms.uDropStrength.value = str;
        mouse.moving = true;
      }

      // ── animation loop ─────────────────────────────────────────
      function animate() {
        if (!isAlive) return;
        animId = requestAnimationFrame(animate);

        const now = performance.now();
        // ambient drip every 1.2–2.8 s
        if (now - lastDrop > 1200 + Math.random() * 1600) {
          drip(Math.random(), Math.random(), 0.2 + Math.random() * 0.25);
          lastDrop = now;
        } else if (!mouse.moving) {
          simMat.uniforms.uMouse.value.set(-1, -1);
          simMat.uniforms.uDropStrength.value = 0.0;
        }
        mouse.moving = false;

        // sim pass → rtC
        simMat.uniforms.uPrev.value  = rtA.texture;
        simMat.uniforms.uPrev2.value = rtB.texture;
        renderer.setRenderTarget(rtC);
        renderer.render(simScene, camera);

        // rotate buffers B←A, A←C
        const tmp = rtB; rtB = rtA; rtA = rtC; rtC = tmp;

        // display pass → screen
        dispMat.uniforms.uHeight.value = rtA.texture;
        renderer.setRenderTarget(null);
        renderer.render(dispScene, camera);
      }
      animate();

      // ── pointer events on the wrapper (canvas is pointer-events:none) ─
      function getUV(e) {
        const rect = wrapper.getBoundingClientRect();
        const src  = e.touches ? e.touches[0] : e;
        return {
          x:  (src.clientX - rect.left)  / rect.width,
          y: 1 - (src.clientY - rect.top) / rect.height, // flip Y for WebGL
        };
      }
      const onMove  = (e) => { const {x,y} = getUV(e); drip(x, y, 0.28); };
      const onDown  = (e) => { const {x,y} = getUV(e); drip(x, y, 0.8); };

      wrapper.addEventListener('mousemove',  onMove, { passive: true });
      wrapper.addEventListener('mousedown',  onDown, { passive: true });
      wrapper.addEventListener('touchstart', onDown, { passive: true });
      wrapper.addEventListener('touchmove',  onMove, { passive: true });

      // ── resize ─────────────────────────────────────────────
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

      // stash cleanup
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
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    }).catch(console.error);

    return () => cleanupRef.current?.();
  }, [imageSrc]);

  return (
    // wrapRef → pointer events + bounding rect source
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20"
      style={{ aspectRatio: '16 / 7', cursor: 'crosshair' }}
    >
      {/* Static project image beneath the WebGL canvas */}
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

      {/* Inner div Three.js appends its canvas into */}
      <div
        ref={mountRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Bottom fade gradient */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />

      {/* Video controller */}
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
