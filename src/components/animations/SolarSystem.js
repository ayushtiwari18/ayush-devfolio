'use client';

import { useEffect, useRef } from 'react';

export default function SolarSystem({ showOrbits, autoRotate }) {
  const mountRef        = useRef(null);
  const sceneRef        = useRef(null);
  const rendererRef     = useRef(null);
  const cameraRef       = useRef(null);
  const controlsRef     = useRef(null);
  const composerRef     = useRef(null);
  const animationIdRef  = useRef(null);
  const planetsRef      = useRef([]);
  const orbitPathsRef   = useRef([]);
  const asteroidBeltRef = useRef(null);
  const timeRef         = useRef(0);
  const starsRef        = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    let active = true;

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

        const { scene, camera, renderer, composer, controls } =
          await initThreeJS(mountRef.current);
        if (!active) return;

        sceneRef.current    = scene;
        cameraRef.current   = camera;
        rendererRef.current = renderer;
        composerRef.current = composer;
        controlsRef.current = controls;

        starsRef.current = createStarfield(scene);
        const { planetObjects, orbitPaths } = createPlanets(scene);
        planetsRef.current    = planetObjects;
        orbitPathsRef.current = orbitPaths;
        orbitPaths.forEach(o => { o.visible = showOrbits; });
        asteroidBeltRef.current = createAsteroidBelt(scene);

        const animate = () => {
          if (!active) return;
          timeRef.current += 0.008;

          updatePlanets(planetsRef.current, timeRef.current, autoRotate);
          updateAsteroidBelt(asteroidBeltRef.current);

          // Slow star drift
          if (starsRef.current) {
            starsRef.current.rotation.y += 0.00005;
          }

          if (controlsRef.current) controlsRef.current.update();
          if (composerRef.current) composerRef.current.render();
          animationIdRef.current = requestAnimationFrame(animate);
        };
        animate();
      })
      .catch((err) => console.error('[SolarSystem] init failed:', err));

    const onResize = () => {
      if (!mountRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current?.setSize(w, h);
      composerRef.current?.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      active = false;
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationIdRef.current);
      if (rendererRef.current) {
        try { rendererRef.current.domElement?.parentNode?.removeChild(rendererRef.current.domElement); } catch (_) {}
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [autoRotate]);

  useEffect(() => {
    orbitPathsRef.current.forEach(o => { o.visible = showOrbits; });
  }, [showOrbits]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}
