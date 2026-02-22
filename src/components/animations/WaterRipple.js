'use client';

import { useEffect, useRef } from 'react';

/**
 * WaterRipple — GentleRain-style WebGL water simulation.
 *
 * Technique (identical to gentlerain.ai):
 *  1. Two ping-pong WebGL render targets (RTA / RTB) store the wave height field.
 *  2. SIMULATION SHADER: reads previous two frames, runs the wave equation,
 *     writes next height field. Mouse position injects energy.
 *  3. DISPLAY SHADER: reads current height field, computes surface normals,
 *     displaces UV lookups into the background texture → refraction shimmer.
 *
 * The background "texture" is the site's dark indigo gradient rendered
 * onto an off-screen canvas so it matches the hero theme.
 */
export default function WaterRipple({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let THREE, renderer, simMat, dispMat;
    let rtA, rtB;
    let animId;
    let isAlive = true;

    // mouse state
    const mouse = { x: -1, y: -1, moving: false };
    let lastDrop = 0;

    // ── load Three.js then bootstrap ─────────────────────────────
    import('three').then((mod) => {
      if (!isAlive) return;
      THREE = mod;

      const W = container.offsetWidth;
      const H = container.offsetHeight;

      // ── renderer ─────────────────────────────────────────────
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        preserveDrawingBuffer: false,
      });
      renderer.setPixelRatio(1); // keep sim at 1:1 for speed
      renderer.setSize(W, H);
      renderer.domElement.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;mix-blend-mode:screen;opacity:0.7;';
      container.appendChild(renderer.domElement);

      // ── ping-pong render targets ──────────────────────────────
      const rtParams = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      };
      rtA = new THREE.WebGLRenderTarget(W, H, rtParams);
      rtB = new THREE.WebGLRenderTarget(W, H, rtParams);

      // ── build background texture from an off-screen canvas ────
      const bgCanvas = document.createElement('canvas');
      bgCanvas.width = W; bgCanvas.height = H;
      const bgCtx = bgCanvas.getContext('2d');
      // deep-indigo radial gradient matching the portfolio theme
      const grad = bgCtx.createRadialGradient(
        W * 0.35, H * 0.45, 0,
        W * 0.5,  H * 0.5,  Math.max(W, H) * 0.9
      );
      grad.addColorStop(0,   'rgba(99, 102,241,0.22)');
      grad.addColorStop(0.4, 'rgba(139, 92,246,0.16)');
      grad.addColorStop(0.8, 'rgba( 30, 27, 75,0.30)');
      grad.addColorStop(1,   'rgba(  0,  0,  0,0.55)');
      bgCtx.fillStyle = grad;
      bgCtx.fillRect(0, 0, W, H);
      // faint star-like dots
      for (let i = 0; i < 80; i++) {
        const rx = Math.random() * W, ry = Math.random() * H;
        const rg = bgCtx.createRadialGradient(rx, ry, 0, rx, ry, 40);
        rg.addColorStop(0,   `rgba(167,139,250,${(Math.random()*0.1).toFixed(3)})`);
        rg.addColorStop(1,   'rgba(0,0,0,0)');
        bgCtx.fillStyle = rg;
        bgCtx.beginPath(); bgCtx.arc(rx, ry, 40, 0, Math.PI*2); bgCtx.fill();
      }
      const bgTex = new THREE.CanvasTexture(bgCanvas);

      // ─────────────────────────────────────────────────────────
      // SIMULATION SHADER
      // Reads rtA (previous height) and rtB (height before that).
      // Writes next height to whichever RT we render into.
      // uMouse injects a gaussian droplet at the cursor position.
      // ─────────────────────────────────────────────────────────
      const simVert = /* glsl */`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
      const simFrag = /* glsl */`
        precision highp float;
        uniform sampler2D uPrev;   // height field t-1
        uniform sampler2D uPrev2;  // height field t-2
        uniform vec2  uResolution;
        uniform vec2  uMouse;      // normalised [0,1], -1 = inactive
        uniform float uDropStrength;
        varying vec2 vUv;

        void main() {
          vec2 px = 1.0 / uResolution;

          // sample 4 neighbours
          float left  = texture2D(uPrev, vUv - vec2(px.x, 0.0)).r;
          float right = texture2D(uPrev, vUv + vec2(px.x, 0.0)).r;
          float up    = texture2D(uPrev, vUv - vec2(0.0, px.y)).r;
          float down  = texture2D(uPrev, vUv + vec2(0.0, px.y)).r;
          float curr  = texture2D(uPrev,  vUv).r;
          float prev2 = texture2D(uPrev2, vUv).r;

          // wave equation:  next = 2*curr - prev + c²*(neighbours - 4*curr)
          // simplified (c²≈0.5):  next = (left+right+up+down)*0.5 - prev2
          float next = (left + right + up + down) * 0.5 - prev2;
          next *= 0.986; // damping — controls ripple lifetime

          // inject mouse droplet
          if (uMouse.x >= 0.0) {
            float dist = length(vUv - uMouse);
            // gaussian with sigma ≈ 0.025 of screen width
            float drop = uDropStrength * exp(-dist * dist / (2.0 * 0.0006));
            next += drop;
          }

          gl_FragColor = vec4(next, 0.0, 0.0, 1.0);
        }
      `;

      // ─────────────────────────────────────────────────────────
      // DISPLAY SHADER
      // Reads the current height field, computes the surface normal
      // (gradient of heights), then displaces the UV lookup into
      // the background texture — this is the refraction effect.
      // ─────────────────────────────────────────────────────────
      const dispFrag = /* glsl */`
        precision highp float;
        uniform sampler2D uHeight;     // current height field
        uniform sampler2D uBackground; // scene background
        uniform vec2  uResolution;
        varying vec2 vUv;

        void main() {
          vec2 px = 1.0 / uResolution;

          // surface normal from height gradient
          float left  = texture2D(uHeight, vUv - vec2(px.x, 0.0)).r;
          float right = texture2D(uHeight, vUv + vec2(px.x, 0.0)).r;
          float up    = texture2D(uHeight, vUv - vec2(0.0, px.y)).r;
          float down  = texture2D(uHeight, vUv + vec2(0.0, px.y)).r;

          // gradient = refraction vector
          vec2 normal = vec2(right - left, down - up) * 3.5;

          // displace UV into background (clamp to edge)
          vec2 displacedUv = clamp(vUv + normal, 0.0, 1.0);
          vec4 bg = texture2D(uBackground, displacedUv);

          // slight specular gleam on wave crests
          float height  = texture2D(uHeight, vUv).r;
          float specular = max(0.0, height) * 0.6;
          vec3  specColor = vec3(0.55, 0.45, 1.0) * specular;

          gl_FragColor = vec4(bg.rgb + specColor, bg.a + abs(height) * 0.4);
        }
      `;

      // ── two-scene setup (sim scene + display scene) ───────────
      const simScene  = new THREE.Scene();
      const dispScene = new THREE.Scene();
      const camera    = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const quad      = new THREE.PlaneGeometry(2, 2);

      simMat = new THREE.ShaderMaterial({
        vertexShader: simVert,
        fragmentShader: simFrag,
        uniforms: {
          uPrev:        { value: rtA.texture },
          uPrev2:       { value: rtB.texture },
          uResolution:  { value: new THREE.Vector2(W, H) },
          uMouse:       { value: new THREE.Vector2(-1, -1) },
          uDropStrength:{ value: 0.0 },
        },
      });

      dispMat = new THREE.ShaderMaterial({
        vertexShader: simVert,
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

      // keep a third RT to write sim output without reading/writing same texture
      let rtC = new THREE.WebGLRenderTarget(W, H, rtParams);

      // ── ambient auto-drip ─────────────────────────────────────
      function triggerDrip(x, y, strength) {
        simMat.uniforms.uMouse.value.set(x, y);
        simMat.uniforms.uDropStrength.value = strength;
      }

      // ── animation loop ────────────────────────────────────────
      function animate() {
        if (!isAlive) return;
        animId = requestAnimationFrame(animate);

        const now = performance.now();

        // ambient drip every 1.5–3 s
        if (now - lastDrop > 1500 + Math.random() * 1500) {
          triggerDrip(Math.random(), Math.random(), 0.25 + Math.random() * 0.3);
          lastDrop = now;
        } else if (!mouse.moving) {
          // clear mouse injection between frames
          simMat.uniforms.uMouse.value.set(-1, -1);
          simMat.uniforms.uDropStrength.value = 0.0;
        }

        // ① run simulation → write into rtC
        simMat.uniforms.uPrev.value  = rtA.texture;
        simMat.uniforms.uPrev2.value = rtB.texture;
        renderer.setRenderTarget(rtC);
        renderer.render(simScene, camera);

        // ② rotate buffers: B←A, A←C
        const tmp = rtB; rtB = rtA; rtA = rtC; rtC = tmp;

        // ③ render display pass to screen
        dispMat.uniforms.uHeight.value = rtA.texture;
        renderer.setRenderTarget(null);
        renderer.render(dispScene, camera);

        // clear mouse moving flag after each frame
        mouse.moving = false;
      }

      animate();

      // ── pointer events (attached to the HERO section, not canvas) ─
      const hero = container.closest('section') || container;

      function onMove(e) {
        const rect = hero.getBoundingClientRect();
        const src  = e.touches ? e.touches[0] : e;
        const nx   = (src.clientX - rect.left)  / rect.width;
        const ny   = 1.0 - (src.clientY - rect.top) / rect.height; // flip Y for GL
        triggerDrip(nx, ny, 0.35);
        mouse.moving = true;
      }

      function onDown(e) {
        const rect = hero.getBoundingClientRect();
        const src  = e.touches ? e.touches[0] : e;
        const nx   = (src.clientX - rect.left)  / rect.width;
        const ny   = 1.0 - (src.clientY - rect.top) / rect.height;
        triggerDrip(nx, ny, 0.9);
        mouse.moving = true;
      }

      hero.addEventListener('mousemove',  onMove, { passive: true });
      hero.addEventListener('mousedown',  onDown, { passive: true });
      hero.addEventListener('touchstart', onDown, { passive: true });
      hero.addEventListener('touchmove',  onMove, { passive: true });

      // ── resize ────────────────────────────────────────────────
      function onResize() {
        const nW = container.offsetWidth;
        const nH = container.offsetHeight;
        renderer.setSize(nW, nH);
        [rtA, rtB, rtC].forEach(rt => rt.setSize(nW, nH));
        simMat.uniforms.uResolution.value.set(nW, nH);
        dispMat.uniforms.uResolution.value.set(nW, nH);
      }
      window.addEventListener('resize', onResize);

      // stash cleanup refs
      container._rippleCleanup = () => {
        isAlive = false;
        cancelAnimationFrame(animId);
        hero.removeEventListener('mousemove',  onMove);
        hero.removeEventListener('mousedown',  onDown);
        hero.removeEventListener('touchstart', onDown);
        hero.removeEventListener('touchmove',  onMove);
        window.removeEventListener('resize', onResize);
        [rtA, rtB, rtC].forEach(rt => rt.dispose());
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      isAlive = false;
      container._rippleCleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
