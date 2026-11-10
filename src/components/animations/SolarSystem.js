'use client';

import { useEffect, useRef } from 'react';
import {
  initThreeJS,
  createStarfield,
  createPlanets,
  createAsteroidBelt,
  updatePlanets,
} from '@/lib/solarSystemUtils';

export default function SolarSystem({ showOrbits, autoRotate, onReady }) {
  const mountRef        = useRef(null);
  const sceneRef        = useRef(null);
  const rendererRef     = useRef(null);
  const cameraRef       = useRef(null);
  const controlsRef     = useRef(null);
  const composerRef     = useRef(null);
  const animationIdRef  = useRef(null);
  const planetsRef      = useRef([]);
  const orbitPathsRef   = useRef([]);
  const timeRef         = useRef(0);
  const starsRef        = useRef(null);
  const asteroidBeltRef = useRef(null);

  // Refs so the animation loop always reads latest values
  // without needing to re-run (and re-init) the entire effect.
  const autoRotateRef   = useRef(autoRotate);
  const onReadyFiredRef = useRef(false);

  // Keep autoRotateRef in sync on every render — zero re-init cost.
  autoRotateRef.current = autoRotate;

  // Main init effect — runs ONCE on mount (empty deps).
  // StrictMode will double-invoke in dev, but onReadyFiredRef
  // ensures onReady() is called exactly once across both runs.
  useEffect(() => {
    if (!mountRef.current) return;

    let isSubscribed = true;

    // Pause rendering when tab is hidden or when scrolled far past hero section
    let isVisible = true;
    const updateVisibility = () => {
      if (typeof window === 'undefined') return;
      isVisible = !document.hidden && window.scrollY < (window.innerHeight * 1.5);
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', updateVisibility);
      window.addEventListener('scroll', updateVisibility, { passive: true });
    }

    initThreeJS(mountRef.current)
      .then((threeContext) => {
        if (!isSubscribed || !mountRef.current) {
          if (threeContext?.renderer?.domElement?.parentNode) {
            try {
              threeContext.renderer.domElement.parentNode.removeChild(
                threeContext.renderer.domElement
              );
            } catch (_) {}
          }
          threeContext?.renderer?.dispose();
          return;
        }

        const { scene, camera, renderer, composer, controls } = threeContext;

        sceneRef.current    = scene;
        cameraRef.current   = camera;
        rendererRef.current = renderer;
        composerRef.current = composer;
        controlsRef.current = controls;

        starsRef.current = createStarfield(scene);

        const { planetObjects, orbitPaths } = createPlanets(scene);
        planetsRef.current    = planetObjects;
        orbitPathsRef.current = orbitPaths;
        orbitPaths.forEach((o) => { o.visible = showOrbits; });

        asteroidBeltRef.current = createAsteroidBelt(scene);

        const animate = () => {
          if (!isSubscribed) return;

          // Only compute & render Three.js frames when hero is in/near viewport and tab is active
          if (isVisible) {
            timeRef.current += 0.01;
            updatePlanets(planetsRef.current, timeRef.current, autoRotateRef.current);

            if (asteroidBeltRef.current) asteroidBeltRef.current.rotation.z += 0.001;
            if (starsRef.current) {
              starsRef.current.rotation.x += 0.0001;
              starsRef.current.rotation.y += 0.0001;
            }
            if (controlsRef.current) controlsRef.current.update();
            if (composerRef.current) composerRef.current.render();
          }

          animationIdRef.current = requestAnimationFrame(animate);
        };

        // Render initial frame immediately so canvas has pixels ready before reveal
        if (controlsRef.current) controlsRef.current.update();
        if (composerRef.current) composerRef.current.render();

        animate();

        // Fire onReady AFTER animate() starts and ONLY ONCE ever.
        if (onReady && !onReadyFiredRef.current) {
          onReadyFiredRef.current = true;
          onReady();
        }
      })
      .catch((err) => console.error('Solar System init failed:', err));

    const handleResize = () => {
      if (
        !mountRef.current ||
        !cameraRef.current ||
        !rendererRef.current ||
        !composerRef.current
      ) return;
      const w = mountRef.current.clientWidth || window.innerWidth || 1200;
      const h = mountRef.current.clientHeight || window.innerHeight || 800;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
      composerRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isSubscribed = false;
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', updateVisibility);
        window.removeEventListener('scroll', updateVisibility);
      }
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (rendererRef.current) {
        if (rendererRef.current.domElement?.parentNode) {
          try {
            rendererRef.current.domElement.parentNode.removeChild(
              rendererRef.current.domElement
            );
          } catch (_) {}
        }
        rendererRef.current.dispose();
      }
      if (composerRef.current && typeof composerRef.current.dispose === 'function') {
        try { composerRef.current.dispose(); } catch (_) {}
      }
      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0)
          sceneRef.current.remove(sceneRef.current.children[0]);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps — init runs once. autoRotate changes handled via ref.

  useEffect(() => {
    orbitPathsRef.current.forEach((o) => { o.visible = showOrbits; });
  }, [showOrbits]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}
