import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Planet data - scaled for visualization
export const planets = [
  {
    name: 'Sun',
    size: 40,
    color: 0xffff00,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.002,
    emissive: true,
  },
  {
    name: 'Mercury',
    size: 3.2,
    color: 0xaaaaaa,
    orbitRadius: 60,
    orbitSpeed: 1.6,
    rotationSpeed: 0.004,
  },
  {
    name: 'Venus',
    size: 6,
    color: 0xe6a760,
    orbitRadius: 85,
    orbitSpeed: 1.17,
    rotationSpeed: 0.002,
  },
  {
    name: 'Earth',
    size: 6.3,
    color: 0x6b93d6,
    orbitRadius: 120,
    orbitSpeed: 1,
    rotationSpeed: 0.02,
  },
  {
    name: 'Mars',
    size: 3.4,
    color: 0xd5704e,
    orbitRadius: 180,
    orbitSpeed: 0.8,
    rotationSpeed: 0.018,
  },
  {
    name: 'Jupiter',
    size: 22,
    color: 0xe0be95,
    orbitRadius: 250,
    orbitSpeed: 0.43,
    rotationSpeed: 0.04,
  },
  {
    name: 'Saturn',
    size: 18.5,
    color: 0xe0d7a4,
    orbitRadius: 320,
    orbitSpeed: 0.32,
    rotationSpeed: 0.038,
    hasRing: true,
  },
  {
    name: 'Uranus',
    size: 8,
    color: 0xa5f2f3,
    orbitRadius: 390,
    orbitSpeed: 0.23,
    rotationSpeed: 0.03,
  },
  {
    name: 'Neptune',
    size: 7.7,
    color: 0x517cff,
    orbitRadius: 460,
    orbitSpeed: 0.18,
    rotationSpeed: 0.031,
  },
];

// Create starfield
export const createStarfield = (scene) => {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    transparent: true,
  });

  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starVertices, 3)
  );

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  return stars;
};

// Create planets
export const createPlanets = (scene) => {
  const planetObjects = [];
  const orbitPaths = [];

  planets.forEach((planet) => {
    // Create planet geometry and material
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    let material;

    if (planet.emissive) {
      material = new THREE.MeshStandardMaterial({
        color: planet.color,
        emissive: planet.color,
        emissiveIntensity: 2,
      });
    } else {
      material = new THREE.MeshPhongMaterial({
        color: planet.color,
        shininess: 10,
      });
    }

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = planet.name;

    if (planet.orbitRadius > 0) {
      // Position planets around the sun
      const planetOrbitAngle = Math.random() * Math.PI * 2;
      mesh.position.x = Math.cos(planetOrbitAngle) * planet.orbitRadius;
      mesh.position.z = Math.sin(planetOrbitAngle) * planet.orbitRadius;

      // Create orbit path
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      const segments = 128;

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        orbitPoints.push(
          Math.cos(angle) * planet.orbitRadius,
          0,
          Math.sin(angle) * planet.orbitRadius
        );
      }

      orbitGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(orbitPoints, 3)
      );

      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.3,
        linewidth: 1,
      });

      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      orbit.userData.isOrbit = true;
      scene.add(orbit);
      orbitPaths.push(orbit);
    }

    scene.add(mesh);
    planetObjects.push({
      mesh,
      orbitSpeed: planet.orbitSpeed,
      rotationSpeed: planet.rotationSpeed,
      orbitRadius: planet.orbitRadius,
    });

    // Create ring for Saturn
    if (planet.hasRing) {
      const ringGeometry = new THREE.RingGeometry(
        planet.size + 5,
        planet.size + 12,
        32
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xe0d7a4,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 3;
      mesh.add(ring);
    }
  });

  return { planetObjects, orbitPaths };
};

// Create asteroid belt
export const createAsteroidBelt = (scene) => {
  const asteroidGeometry = new THREE.TorusGeometry(240, 40, 16, 100);
  const asteroidMaterial = new THREE.MeshBasicMaterial({
    color: 0x888888,
    transparent: true,
    opacity: 0.2,
  });
  const asteroidBelt = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
  asteroidBelt.rotation.x = Math.PI / 2;
  scene.add(asteroidBelt);
  return asteroidBelt;
};

// Update planets positions and rotations
export const updatePlanets = (planetObjects, time, autoRotate) => {
  planetObjects.forEach((planet) => {
    if (planet.orbitRadius > 0) {
      planet.mesh.position.x =
        Math.cos(time * planet.orbitSpeed) * planet.orbitRadius;
      planet.mesh.position.z =
        Math.sin(time * planet.orbitSpeed) * planet.orbitRadius;
    }

    if (autoRotate) {
      planet.mesh.rotation.y += planet.rotationSpeed;
    }
  });
};

// Initialize Three.js scene
export const initThreeJS = (mount) => {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    mount.clientWidth / mount.clientHeight,
    0.1,
    10000
  );
  camera.position.set(0, 200, 500);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  mount.appendChild(renderer.domElement);

  // Post-processing for glow effects
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(mount.clientWidth, mount.clientHeight),
    1.5, // strength
    0.4, // radius
    0.85 // threshold
  );

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 50;
  controls.maxDistance = 1000;

  // Light sources
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  return { scene, camera, renderer, composer, controls };
};

// Animate camera to position
export const animateCameraTo = (camera, targetPosition, duration = 1000) => {
  const startPosition = camera.position.clone();
  const startTime = Date.now();

  const update = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    camera.position.lerpVectors(
      startPosition,
      new THREE.Vector3(
        targetPosition.x,
        targetPosition.y + 200,
        targetPosition.z + 300
      ),
      progress
    );

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  update();
};
