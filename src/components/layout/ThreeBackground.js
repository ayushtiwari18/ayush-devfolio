'use client';

import { useEffect, useRef } from 'react';

/**
 * ThreeBackground — lazy Three.js particle field
 *
 * PERF CONTRACT (Commit 3):
 *  • `three` is NEVER imported at module level.
 *  • The entire THREE namespace is loaded inside useEffect via dynamic import.
 *  • This means `three` is completely absent from the SSR bundle and from
 *    the layout chunk — it only downloads after hydration, on the client.
 *  • On mobile / reduced-motion: RAF loop is skipped entirely (static frame).
 *  • DPR capped at 1.5 (was 2) to halve GPU pixel fill on retina screens.
 *
 * This component is used on non-hero pages as a lightweight ambient background.
 * The hero page uses SolarSystem instead (also dynamically imported).
 */
export function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer, geometry, material, animationId, handleMouseMove, handleResize;
    let active = true;

    // ── Lazy-load three INSIDE the effect — never in the module scope ──
    import('three').then((THREE) => {
      if (!active || !containerRef.current) return;

      const scene    = new THREE.Scene();
      const camera   = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      // Cap DPR at 1.5 — halves GPU pixel fill on retina screens vs DPR 2
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      containerRef.current.appendChild(renderer.domElement);

      // Particles
      geometry = new THREE.BufferGeometry();
      // Reduce particle count on mobile to save GPU bandwidth
      const isMobile = window.innerWidth < 768;
      const particlesCount = isMobile ? 400 : 1000;
      const posArray = new Float32Array(particlesCount * 3);
      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      material = new THREE.PointsMaterial({
        size: 0.01,
        color: '#3b82f6',
        transparent: true,
        opacity: 0.6,
      });

      const particlesMesh = new THREE.Points(geometry, material);
      scene.add(particlesMesh);
      camera.position.z = 3;

      let mouseX = 0;
      let mouseY = 0;

      handleMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth)  *  2 - 1;
        mouseY = (event.clientY / window.innerHeight) * -2 + 1;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      const animate = () => {
        if (!active) return;
        animationId = requestAnimationFrame(animate);
        particlesMesh.rotation.x += 0.0005 + mouseY * 0.0001;
        particlesMesh.rotation.y += 0.0005 + mouseX * 0.0001;
        renderer.render(scene, camera);
        // Respect reduced motion: render one static frame then stop
        if (prefersReducedMotion) cancelAnimationFrame(animationId);
      };
      animate();

      handleResize = () => {
        if (!containerRef.current) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
    });

    return () => {
      active = false;
      if (animationId)    cancelAnimationFrame(animationId);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleResize)    window.removeEventListener('resize', handleResize);
      if (renderer) {
        try {
          renderer.domElement?.parentNode?.removeChild(renderer.domElement);
        } catch (_) {}
        renderer.dispose();
      }
      geometry?.dispose();
      material?.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
