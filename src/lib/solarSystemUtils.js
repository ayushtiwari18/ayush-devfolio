// solarSystemUtils.js
// All Three.js usage is kept inside functions — this module is only ever
// executed on the client (SolarSystem.js imports it via dynamic import
// with ssr:false). Static top-level `import * as THREE` caused SSR crash.

let _THREE          = null;
let _OrbitControls  = null;
let _EffectComposer = null;
let _RenderPass     = null;
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

// ── Planet data ────────────────────────────────────────────────────────────
export const planets = [
  { name: 'Sun',     size: 40,   color: 0xFDB813, orbitRadius: 0,   orbitSpeed: 0,    rotationSpeed: 0.002, emissive: true },
  { name: 'Mercury', size: 3.2,  color: 0xb5b5b5, orbitRadius: 60,  orbitSpeed: 1.6,  rotationSpeed: 0.004 },
  { name: 'Venus',   size: 6,    color: 0xe8cda0, orbitRadius: 90,  orbitSpeed: 1.17, rotationSpeed: 0.002 },
  { name: 'Earth',   size: 6.3,  color: 0x2e86de, orbitRadius: 130, orbitSpeed: 1,    rotationSpeed: 0.02  },
  { name: 'Mars',    size: 4.0,  color: 0xc0392b, orbitRadius: 185, orbitSpeed: 0.8,  rotationSpeed: 0.018 },
  { name: 'Jupiter', size: 24,   color: 0xc8a97e, orbitRadius: 260, orbitSpeed: 0.43, rotationSpeed: 0.04  },
  { name: 'Saturn',  size: 20,   color: 0xe8d5a3, orbitRadius: 335, orbitSpeed: 0.32, rotationSpeed: 0.038, hasRing: true },
  { name: 'Uranus',  size: 9,    color: 0x7fb3d3, orbitRadius: 400, orbitSpeed: 0.23, rotationSpeed: 0.03  },
  { name: 'Neptune', size: 8.5,  color: 0x2980b9, orbitRadius: 465, orbitSpeed: 0.18, rotationSpeed: 0.031 },
];

// ── Starfield ──────────────────────────────────────────────────────────────
export const createStarfield = (scene) => {
  const THREE = _THREE;
  const starGeometry = new THREE.BufferGeometry();

  // Size-variation + slight warm/cool colour tint for depth realism
  const count = 15000;
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  const sizes     = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

    // Slight colour variation: pure white → warm yellow-white or cool blue-white
    const temp = Math.random();
    colors[i * 3]     = 0.9 + temp * 0.1;          // R
    colors[i * 3 + 1] = 0.9 + temp * 0.05;         // G
    colors[i * 3 + 2] = 0.95 + (1 - temp) * 0.05;  // B

    sizes[i] = 0.5 + Math.random() * 1.5;
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  starGeometry.setAttribute('color',    new THREE.Float32BufferAttribute(colors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    sizeAttenuation: true,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  return stars;
};

// ── Planets ────────────────────────────────────────────────────────────────
export const createPlanets = (scene) => {
  const THREE = _THREE;
  const planetObjects = [];
  const orbitPaths = [];

  planets.forEach((planet) => {
    const geometry = new THREE.SphereGeometry(planet.size, 64, 64);
    let material;

    if (planet.emissive) {
      // Sun: self-lit, high emissive so bloom picks it up strongly
      material = new THREE.MeshStandardMaterial({
        color: planet.color,
        emissive: planet.color,
        emissiveIntensity: 3,
        roughness: 0.4,
        metalness: 0,
      });
    } else {
      // Planets: lit by the Sun PointLight + ambient
      material = new THREE.MeshStandardMaterial({
        color: planet.color,
        roughness: 0.8,
        metalness: 0.1,
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
        orbitPoints.push(
          Math.cos(a) * planet.orbitRadius,
          0,
          Math.sin(a) * planet.orbitRadius
        );
      }
      const orbitGeo = new THREE.BufferGeometry();
      orbitGeo.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x4a4a8a,
        transparent: true,
        opacity: 0.4,
      });
      const orbit = new THREE.Line(orbitGeo, orbitMat);
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

    // Saturn ring
    if (planet.hasRing) {
      const ringGeo = new THREE.RingGeometry(planet.size + 6, planet.size + 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc8b88a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      mesh.add(ring);
    }
  });

  return { planetObjects, orbitPaths };
};

// ── Asteroid Belt ──────────────────────────────────────────────────────────
export const createAsteroidBelt = (scene) => {
  const THREE = _THREE;
  const geo = new THREE.TorusGeometry(222, 12, 8, 100);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x7a7a7a,
    transparent: true,
    opacity: 0.15,
    wireframe: true,
  });
  const belt = new THREE.Mesh(geo, mat);
  belt.rotation.x = Math.PI / 2;
  scene.add(belt);
  return belt;
};

// ── Update loop ────────────────────────────────────────────────────────────
export const updatePlanets = (planetObjects, time, autoRotate) => {
  planetObjects.forEach((planet) => {
    if (planet.orbitRadius > 0) {
      planet.mesh.position.x = Math.cos(time * planet.orbitSpeed * 0.3) * planet.orbitRadius;
      planet.mesh.position.z = Math.sin(time * planet.orbitSpeed * 0.3) * planet.orbitRadius;
    }
    if (autoRotate) planet.mesh.rotation.y += planet.rotationSpeed * 0.5;
  });
};

// ── Three.js init ──────────────────────────────────────────────────────────
export const initThreeJS = async (mount) => {
  await loadThree();
  const THREE = _THREE;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00000a); // very slightly blue-black

  const w = mount.clientWidth;
  const h = mount.clientHeight;

  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 10000);
  camera.position.set(0, 120, 350); // closer + lower so planets fill viewport

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  mount.appendChild(renderer.domElement);

  // ── Bloom post-processing ─────────────────────────────────────────────
  // threshold: 0.15 — low enough for planets to catch bloom
  // strength:  2.0  — vivid glow visible against dark space
  // radius:    0.6  — spread bloom a bit wider for corona effect
  const renderScene = new _RenderPass(scene, camera);
  const bloomPass   = new _UnrealBloomPass(
    new THREE.Vector2(w, h),
    2.0,   // strength
    0.6,   // radius
    0.15   // threshold  ← KEY FIX: was 0.85, killing all planet bloom
  );
  const composer = new _EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // ── Lighting ──────────────────────────────────────────────────────────
  // Ambient: dim fill so dark sides of planets aren’t pitch black
  const ambientLight = new THREE.AmbientLight(0x111133, 1.5);
  scene.add(ambientLight);

  // Sun PointLight: primary light source — makes planets look 3D
  const sunLight = new THREE.PointLight(0xfff5e0, 3, 2000, 1);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // Subtle back-fill so far planets aren’t invisible
  const backLight = new THREE.DirectionalLight(0x0033aa, 0.3);
  backLight.position.set(0, 1, -1);
  scene.add(backLight);

  // ── Controls ──────────────────────────────────────────────────────────
  const controls = new _OrbitControls(camera, renderer.domElement);
  controls.enableDamping  = true;
  controls.dampingFactor  = 0.05;
  controls.minDistance    = 50;
  controls.maxDistance    = 1200;
  controls.enablePan      = false;

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
