// solarSystemUtils.js
// All Three.js usage is intentionally kept inside regular functions so
// this module is only ever executed on the client (SolarSystem.js
// already imports it via dynamic import with ssr:false).
// The top-level static `import * as THREE` was the root cause of the
// webpack server-side build crash — replaced with a lazy getter below.

let _THREE = null;
let _OrbitControls = null;
let _EffectComposer = null;
let _RenderPass = null;
let _UnrealBloomPass = null;

async function loadThree() {
  if (_THREE) return;
  _THREE = await import('three');
  const oc = await import('three/addons/controls/OrbitControls.js');
  const ec = await import('three/addons/postprocessing/EffectComposer.js');
  const rp = await import('three/addons/postprocessing/RenderPass.js');
  const ub = await import('three/addons/postprocessing/UnrealBloomPass.js');
  _OrbitControls  = oc.OrbitControls;
  _EffectComposer = ec.EffectComposer;
  _RenderPass     = rp.RenderPass;
  _UnrealBloomPass = ub.UnrealBloomPass;
}

// Planet data — pure data, safe at module level
export const planets = [
  { name: 'Sun',     size: 40,   color: 0xffff00, orbitRadius: 0,   orbitSpeed: 0,    rotationSpeed: 0.002, emissive: true },
  { name: 'Mercury', size: 3.2,  color: 0xaaaaaa, orbitRadius: 60,  orbitSpeed: 1.6,  rotationSpeed: 0.004 },
  { name: 'Venus',   size: 6,    color: 0xe6a760, orbitRadius: 85,  orbitSpeed: 1.17, rotationSpeed: 0.002 },
  { name: 'Earth',   size: 6.3,  color: 0x6b93d6, orbitRadius: 120, orbitSpeed: 1,    rotationSpeed: 0.02  },
  { name: 'Mars',    size: 3.4,  color: 0xd5704e, orbitRadius: 180, orbitSpeed: 0.8,  rotationSpeed: 0.018 },
  { name: 'Jupiter', size: 22,   color: 0xe0be95, orbitRadius: 250, orbitSpeed: 0.43, rotationSpeed: 0.04  },
  { name: 'Saturn',  size: 18.5, color: 0xe0d7a4, orbitRadius: 320, orbitSpeed: 0.32, rotationSpeed: 0.038, hasRing: true },
  { name: 'Uranus',  size: 8,    color: 0xa5f2f3, orbitRadius: 390, orbitSpeed: 0.23, rotationSpeed: 0.03  },
  { name: 'Neptune', size: 7.7,  color: 0x517cff, orbitRadius: 460, orbitSpeed: 0.18, rotationSpeed: 0.031 },
];

export const createStarfield = (scene) => {
  const THREE = _THREE;
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true });
  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    starVertices.push(
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000
    );
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  return stars;
};

export const createPlanets = (scene) => {
  const THREE = _THREE;
  const planetObjects = [];
  const orbitPaths = [];

  planets.forEach((planet) => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    let material;
    if (planet.emissive) {
      material = new THREE.MeshStandardMaterial({ color: planet.color, emissive: planet.color, emissiveIntensity: 2 });
    } else {
      material = new THREE.MeshPhongMaterial({ color: planet.color, shininess: 10 });
    }
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = planet.name;

    if (planet.orbitRadius > 0) {
      const angle = Math.random() * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * planet.orbitRadius;
      mesh.position.z = Math.sin(angle) * planet.orbitRadius;

      const orbitPoints = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        orbitPoints.push(Math.cos(a) * planet.orbitRadius, 0, Math.sin(a) * planet.orbitRadius);
      }
      const orbitGeo = new THREE.BufferGeometry();
      orbitGeo.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMat = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 });
      const orbit = new THREE.Line(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      orbit.userData.isOrbit = true;
      scene.add(orbit);
      orbitPaths.push(orbit);
    }

    scene.add(mesh);
    planetObjects.push({ mesh, orbitSpeed: planet.orbitSpeed, rotationSpeed: planet.rotationSpeed, orbitRadius: planet.orbitRadius });

    if (planet.hasRing) {
      const ringGeo = new THREE.RingGeometry(planet.size + 5, planet.size + 12, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xe0d7a4, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      mesh.add(ring);
    }
  });

  return { planetObjects, orbitPaths };
};

export const createAsteroidBelt = (scene) => {
  const THREE = _THREE;
  const geo = new THREE.TorusGeometry(240, 40, 16, 100);
  const mat = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.2 });
  const belt = new THREE.Mesh(geo, mat);
  belt.rotation.x = Math.PI / 2;
  scene.add(belt);
  return belt;
};

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
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 10000);
  camera.position.set(0, 200, 500);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  mount.appendChild(renderer.domElement);

  const renderScene = new _RenderPass(scene, camera);
  const bloomPass = new _UnrealBloomPass(
    new THREE.Vector2(mount.clientWidth, mount.clientHeight),
    1.5, 0.4, 0.85
  );
  const composer = new _EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  const controls = new _OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 50;
  controls.maxDistance = 1000;

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  return { scene, camera, renderer, composer, controls };
};

export const animateCameraTo = (camera, targetPosition, duration = 1000) => {
  const THREE = _THREE;
  const startPosition = camera.position.clone();
  const startTime = Date.now();
  const update = () => {
    const elapsed = Date.now() - startTime;
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
