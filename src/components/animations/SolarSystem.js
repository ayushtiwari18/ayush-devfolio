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
  const timeRef         = useRef(0);
  const starsRef        = useRef(null);
  const asteroidBeltRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let isSubscribed = true;

    // Both imports are dynamic — three is never touched server-side
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

        // initThreeJS is now async (lazy-loads three + addons internally)
        const { scene, camera, renderer, composer, controls } =
          await initThreeJS(mountRef.current);

        if (!isSubscribed) return;

        sceneRef.current    = scene;
        cameraRef.current   = camera;
        rendererRef.current = renderer;
        composerRef.current = composer;
        controlsRef.current = controls;

        starsRef.current = createStarfield(scene);

        const { planetObjects, orbitPaths } = createPlanets(scene);
        planetsRef.current    = planetObjects;
        orbitPathsRef.current = orbitPaths;

        // Apply initial orbit visibility
        orbitPaths.forEach(o => { o.visible = showOrbits; });

        asteroidBeltRef.current = createAsteroidBelt(scene);

        const animate = () => {
          if (!isSubscribed) return;
          timeRef.current += 0.01;

          updatePlanets(planetsRef.current, timeRef.current, autoRotate);

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
      })
      .catch((err) => console.error('Solar System init failed:', err));

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) return;
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
          try { rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement); } catch (_) {}
        }
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        while (sceneRef.current.children.length > 0)
          sceneRef.current.remove(sceneRef.current.children[0]);
      }
    };
  }, [autoRotate]);

  useEffect(() => {
    orbitPathsRef.current.forEach(o => { o.visible = showOrbits; });
  }, [showOrbits]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}
