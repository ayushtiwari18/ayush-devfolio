// solarSystemUtils.js
// Visual polish pass — brighter sun, denser stars, better camera, bloom tuning

let _THREE           = null;
let _OrbitControls   = null;
let _EffectComposer  = null;
let _RenderPass      = null;
let _UnrealBloomPass = null;

async function loadThree() {
  if (_THREE) return;
  _THREE = await import('three');
  const oc = await import('three/addons/controls/OrbitControls.js');
  const ec = await import('three/addons/postprocessing/EffectComposer.js');
  const rp = await import('three/addons/postprocessing/RenderPass.js');
  const ub = await import('three/addons/postprocessing/UnrealBloomPass.js');
  _OrbitControls   = oc.OrbitControls;
  _EffectComposer  = ec.EffectComposer;
  _RenderPass      = rp.RenderPass;
  _UnrealBloomPass = ub.UnrealBloomPass;
}

export const planets = [
  { name: 'Sun',     size: 42,   color: 0xfff4a0, orbitRadius: 0,   orbitSpeed: 0,    rotationSpeed: 0.002, emissive: true,  emissiveIntensity: 3.5 },
  { name: 'Mercury', size: 5,    color: 0xb5b5b5, orbitRadius: 70,  orbitSpeed: 1.6,  rotationSpeed: 0.004 },
  { name: 'Venus',   size: 8,    color: 0xf0b060, orbitRadius: 100, orbitSpeed: 1.17, rotationSpeed: 0.002 },
  { name: 'Earth',   size: 9,    color: 0x4f8fd6, orbitRadius: 140, orbitSpeed: 1,    rotationSpeed: 0.02  },
  { name: 'Mars',    size: 6,    color: 0xd9603a, orbitRadius: 195, orbitSpeed: 0.8,  rotationSpeed: 0.018 },
  { name: 'Jupiter', size: 26,   color: 0xe8c89a, orbitRadius: 275, orbitSpeed: 0.43, rotationSpeed: 0.04  },
  { name: 'Saturn',  size: 21,   color: 0xe8dfa0, orbitRadius: 355, orbitSpeed: 0.32, rotationSpeed: 0.038, hasRing: true },
  { name: 'Uranus',  size: 12,   color: 0x7de8e8, orbitRadius: 430, orbitSpeed: 0.23, rotationSpeed: 0.03  },
  { name: 'Neptune', size: 11,   color: 0x3a5fff, orbitRadius: 500, orbitSpeed: 0.18, rotationSpeed: 0.031 },
];

export const createStarfield = (scene) => {
  const THREE = _THREE;
  const starGeometry = new THREE.BufferGeometry();

  // Two layers: many small dim stars + fewer bright stars
  const starVertices = [];
  const starSizes    = [];

  for (let i = 0; i < 18000; i++) {
    starVertices.push(
      (Math.random() - 0.5) * 2400,
      (Math.random() - 0.5) * 2400,
      (Math.random() - 0.5) * 2400
    );
    // Varied sizes: most small, some bright
    starSizes.push(Math.random() < 0.08 ? 2.5 + Math.random() * 1.5 : 0.8 + Math.random() * 0.8);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.1,
    transparent: true,
    opacity: 0.88,
    sizeAttenuation: true,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  return stars;
};

export const createPlanets = (scene) => {
  const THREE = _THREE;
  const planetObjects = [];
  const orbitPaths    = [];

  planets.forEach((planet) => {
    const geometry = new THREE.SphereGeometry(planet.size, 36, 36);
    let material;

    if (planet.emissive) {
      material = new THREE.MeshStandardMaterial({
        color:             planet.color,
        emissive:          planet.color,
        emissiveIntensity: planet.emissiveIntensity ?? 3.5,
        roughness: 0.2,
        metalness: 0.0,
      });
    } else {
      material = new THREE.MeshPhongMaterial({
        color:     planet.color,
        shininess: 30,
        specular:  new THREE.Color(0x444444),
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = planet.name;

    if (planet.orbitRadius > 0) {
      const angle = Math.random() * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * planet.orbitRadius;
      mesh.position.z = Math.sin(angle) * planet.orbitRadius;

      // Orbit path
      const orbitPoints = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        orbitPoints.push(Math.cos(a) * planet.orbitRadius, 0, Math.sin(a) * planet.orbitRadius);
      }
      const orbitGeo = new THREE.BufferGeometry();
      orbitGeo.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMat = new THREE.LineBasicMaterial({
        color:       0x6688aa,
        transparent: true,
        opacity:     0.25,
      });
      const orbit = new THREE.Line(orbitGeo, orbitMat);
      orbit.rotation.x      = Math.PI / 2;
      orbit.userData.isOrbit = true;
      scene.add(orbit);
      orbitPaths.push(orbit);
    }

    scene.add(mesh);
    planetObjects.push({
      mesh,
      orbitSpeed:    planet.orbitSpeed,
      rotationSpeed: planet.rotationSpeed,
      orbitRadius:   planet.orbitRadius,
    });

    // Saturn ring — wider, more visible
    if (planet.hasRing) {
      const ringGeo = new THREE.RingGeometry(planet.size + 6, planet.size + 18, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color:       0xd4c87a,
        side:        THREE.DoubleSide,
        transparent: true,
        opacity:     0.75,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.8;
      mesh.add(ring);
    }
  });

  return { planetObjects, orbitPaths };
};

// Asteroid belt REMOVED — was rendering as an ugly grey flat disk
// that dominated the scene visually.
export const createAsteroidBelt = (_scene) => null;

export const updatePlanets = (planetObjects, time, autoRotate) => {
  planetObjects.forEach((planet) => {
    if (planet.orbitRadius > 0) {
      planet.mesh.position.x = Math.cos(time * planet.orbitSpeed) * planet.orbitRadius;
      planet.mesh.position.z = Math.sin(time * planet.orbitSpeed) * planet.orbitRadius;
    }
    if (autoRotate) planet.mesh.rotation.y += planet.rotationSpeed;
  });
};

export const initThreeJS = async (mount) => {
  await loadThree();
  const THREE = _THREE;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00000a);

  const w = mount.clientWidth;
  const h = mount.clientHeight;

  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 10000);
  // Pulled back & higher so all planets + Saturn ring fit in frame
  camera.position.set(0, 320, 650);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping        = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  mount.appendChild(renderer.domElement);

  // Bloom — lower threshold so more objects glow, higher strength
  const renderScene = new _RenderPass(scene, camera);
  const bloomPass   = new _UnrealBloomPass(
    new THREE.Vector2(w, h),
    1.8,   // strength  (was 1.5)
    0.5,   // radius    (was 0.4)
    0.28   // threshold (was 0.85) — lower = more objects bloom
  );
  const composer = new _EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  const controls = new _OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance   = 80;
  controls.maxDistance   = 1200;

  // Ambient: slightly warmer so planets aren't blue-cold
  const ambientLight = new THREE.AmbientLight(0x111122, 1.0);
  scene.add(ambientLight);

  // Sun point light — stronger, farther reach so outer planets are lit
  const sunLight = new THREE.PointLight(0xfff4e0, 3, 3000);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // Subtle fill light from opposite side (so night side isn't pure black)
  const fillLight = new THREE.PointLight(0x112244, 0.4, 2000);
  fillLight.position.set(0, 0, -600);
  scene.add(fillLight);

  return { scene, camera, renderer, composer, controls };
};

export const animateCameraTo = (camera, targetPosition, duration = 1000) => {
  const THREE = _THREE;
  const startPosition = camera.position.clone();
  const startTime     = Date.now();
  const update = () => {
    const elapsed  = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    camera.position.lerpVectors(
      startPosition,
      new THREE.Vector3(targetPosition.x, targetPosition.y + 200, targetPosition.z + 300),
      progress
    );
    if (progress < 1) requestAnimationFrame(update);
  };
  update();
};
