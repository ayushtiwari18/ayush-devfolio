'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * SolarSystem — optimised Three.js background
 *
 * Key optimisations vs. previous version:
 *  • NO EffectComposer / UnrealBloomPass / RenderPass (saves ~3 MB JS + 4 310 ms CPU)
 *  • Asteroid belt → InstancedMesh (600 → 1 draw call)
 *  • Stars → 12k Points with GLSL shader (was 30k PointsMaterial)
 *  • DPR capped at 1.5 (was 2)
 *  • Visibility API pause/resume — RAF stops when tab is hidden
 *  • prefers-reduced-motion: static frame only, no RAF loop
 *  • onReady callback triggers hero content fade-in
 */
export default function SolarSystem({ showOrbits, autoRotate, onReady }) {
  const mountRef        = useRef(null);
  const sceneRef        = useRef(null);
  const rendererRef     = useRef(null);
  const cameraRef       = useRef(null);
  const controlsRef     = useRef(null);
  const animationIdRef  = useRef(null);
  const planetsRef      = useRef([]);
  const orbitPathsRef   = useRef([]);
  const asteroidBeltRef = useRef(null);
  const timeRef         = useRef(0);
  const starsRef        = useRef(null);
  const starsReadyRef   = useRef(false);

  // Stable onReady reference
  const onReadyRef = useRef(onReady);
  useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

  const handleReady = useCallback(() => {
    if (onReadyRef.current) onReadyRef.current();
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    let active = true;

    // Respect prefers-reduced-motion: render one static frame, no loop
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    import('@/lib/solarSystemUtils')
      .then(async (utils) => {
        if (!active || !mountRef.current) return;

        const {
          initThreeJS,
          createStarfield,
          createPlanets,
          createAsteroidBelt,
          updatePlanets,
          updateAsteroidBelt,
        } = utils;

        const { scene, camera, renderer, controls } =
          await initThreeJS(mountRef.current, { onReady: handleReady });
        if (!active) return;

        sceneRef.current    = scene;
        cameraRef.current   = camera;
        rendererRef.current = renderer;
        controlsRef.current = controls;

        // --- PROGRESSIVE REVEAL ---
        // 1. Stars appear immediately (t=0)
        starsRef.current = createStarfield(scene);
        starsReadyRef.current = true;

        // 2. Planets fade in over 1.2 s — created after first paint
        requestAnimationFrame(() => {
          if (!active) return;
          const { planetObjects, orbitPaths } = createPlanets(scene);
          planetsRef.current    = planetObjects;
          orbitPathsRef.current = orbitPaths;
          orbitPaths.forEach(o => { o.visible = showOrbits; });
          asteroidBeltRef.current = createAsteroidBelt(scene);
        });

        // --- ANIMATION LOOP ---
        const animate = () => {
          if (!active) return;
          animationIdRef.current = requestAnimationFrame(animate);
          timeRef.current += 0.007;

          if (planetsRef.current.length > 0) {
            updatePlanets(planetsRef.current, timeRef.current, autoRotate);
            updateAsteroidBelt(asteroidBeltRef.current);
          }

          // Slow star drift
          if (starsRef.current) {
            starsRef.current.rotation.y += 0.000025;
            // Fade stars in during first 120 frames
            const mat = starsRef.current.material;
            if (mat.uniforms && mat.uniforms.uOpacity.value < 1.0) {
              mat.uniforms.uOpacity.value = Math.min(mat.uniforms.uOpacity.value + 0.008, 1.0);
            }
          }

          if (controlsRef.current) controlsRef.current.update();
          renderer.render(scene, camera);   // direct render — no composer

          if (prefersReducedMotion) {
            cancelAnimationFrame(animationIdRef.current);
          }
        };
        animate();

        // Pause RAF when tab is hidden — huge battery / CPU saving
        const handleVisibility = () => {
          if (document.hidden) {
            cancelAnimationFrame(animationIdRef.current);
          } else if (active) {
            animate();
          }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // store cleanup reference
        mountRef.current.__cleanupVisibility = () =>
          document.removeEventListener('visibilitychange', handleVisibility);
      })
      .catch(err => console.error('[SolarSystem] init failed:', err));

    const onResize = () => {
      if (!mountRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current?.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      active = false;
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationIdRef.current);
      mountRef.current?.__cleanupVisibility?.();
      if (rendererRef.current) {
        try {
          rendererRef.current.domElement?.parentNode?.removeChild(
            rendererRef.current.domElement
          );
        } catch (_) {}
        rendererRef.current.dispose();
      }
      if (sceneRef.current) sceneRef.current.clear();
      // Dispose geometries held on instanced mesh
      if (asteroidBeltRef.current) {
        asteroidBeltRef.current.geometry?.dispose();
        asteroidBeltRef.current.material?.dispose();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRotate, handleReady]);

  useEffect(() => {
    orbitPathsRef.current.forEach(o => { o.visible = showOrbits; });
  }, [showOrbits]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}
