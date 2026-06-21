'use client';

import { useEffect, useRef } from 'react';

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

    import('@/lib/solarSystemUtils')
      .then(async (utilsModule) => {
        if (!isSubscribed || !mountRef.current) return;

        const {
          initThreeJS,
          createStarfield,
          createPlanets,
          createAsteroidBelt,
          updatePlanets,
        } = utilsModule;

        const { scene, camera, renderer, composer, controls } =
          await initThreeJS(mountRef.current);

        // Re-check after the await — StrictMode cleanup may have run.
        if (!isSubscribed || !mountRef.current) return;

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
          timeRef.current += 0.01;

          // Read from ref — always latest value, no re-init needed.
          updatePlanets(planetsRef.current, timeRef.current, autoRotateRef.current);

          if (asteroidBeltRef.current) asteroidBeltRef.current.rotation.z += 0.001;
          if (starsRef.current) {
            starsRef.current.rotation.x += 0.0001;
            starsRef.current.rotation.y += 0.0001;
          }
          if (controlsRef.current) controlsRef.current.update();
          if (composerRef.current) composerRef.current.render();

          animationIdRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Fire onReady AFTER animate() starts and ONLY ONCE ever.
        // onReadyFiredRef prevents StrictMode 2nd run from firing it
        // again (which would be a no-op but is cleaner to guard).
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
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
      composerRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isSubscribed = false;
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
