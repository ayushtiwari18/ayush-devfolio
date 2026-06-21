/**
 * solarSystemUtils.js — Cycle 2: Three.js tree-shaking
 *
 * BEFORE: await import('three') pulls the ENTIRE Three.js namespace (~767KB)
 *         Webpack cannot tree-shake a dynamic namespace import.
 *
 * AFTER:  Named imports from three/src/* subpaths.
 *         Webpack sees exactly which classes are used and dead-code-eliminates
 *         everything else (loaders, geometries, extras we never use).
 *         Expected saving: ~250–350KB from the three-vendor chunk.
 *
 * Addons (OrbitControls, EffectComposer, etc.) are already subpath imports
 * so they were fine before — no change needed there.
 */

let _loaded = false;

// Typed references — populated by loadThree()
let Scene, Color, PerspectiveCamera, WebGLRenderer;
let BufferGeometry, Float32BufferAttribute;
let SphereGeometry, RingGeometry;
let MeshStandardMaterial, MeshBasicMaterial, LineBasicMaterial, PointsMaterial;
let Mesh, Line, Points;
let AmbientLight, PointLight;
let Vector2, Vector3;
let LinearToneMapping, DoubleSide;
let OrbitControls, EffectComposer, RenderPass, UnrealBloomPass;

async function loadThree() {
  if (_loaded) return;
  _loaded = true;

  // Named subpath imports — webpack tree-shakes unused Three.js internals
  const [
    sceneM, colorM, cameraM, rendererM,
    bufGeoM, f32M,
    sphereM, ringM,
    meshStdM, meshBasicM, lineBasicM, pointsMatM,
    meshM, lineM, pointsM,
    ambLightM, ptLightM,
    vec2M, vec3M,
    constants,
    ocM, ecM, rpM, ubM,
  ] = await Promise.all([
    import('three/src/scenes/Scene.js'),
    import('three/src/math/Color.js'),
    import('three/src/cameras/PerspectiveCamera.js'),
    import('three/src/renderers/WebGLRenderer.js'),
    import('three/src/core/BufferGeometry.js'),
    import('three/src/core/BufferAttribute.js'),
    import('three/src/geometries/SphereGeometry.js'),
    import('three/src/geometries/RingGeometry.js'),
    import('three/src/materials/MeshStandardMaterial.js'),
    import('three/src/materials/MeshBasicMaterial.js'),
    import('three/src/materials/LineBasicMaterial.js'),
    import('three/src/materials/PointsMaterial.js'),
    import('three/src/objects/Mesh.js'),
    import('three/src/objects/Line.js'),
    import('three/src/objects/Points.js'),
    import('three/src/lights/AmbientLight.js'),
    import('three/src/lights/PointLight.js'),
    import('three/src/math/Vector2.js'),
    import('three/src/math/Vector3.js'),
    import('three/src/constants.js'),
    import('three/addons/controls/OrbitControls.js'),
    import('three/addons/postprocessing/EffectComposer.js'),
    import('three/addons/postprocessing/RenderPass.js'),
    import('three/addons/postprocessing/UnrealBloomPass.js'),
  ]);

  Scene               = sceneM.Scene;
  Color               = colorM.Color;
  PerspectiveCamera   = cameraM.PerspectiveCamera;
  WebGLRenderer       = rendererM.WebGLRenderer;
  BufferGeometry      = bufGeoM.BufferGeometry;
  Float32BufferAttribute = f32M.Float32BufferAttribute;
  SphereGeometry      = sphereM.SphereGeometry;
  RingGeometry        = ringM.RingGeometry;
  MeshStandardMaterial = meshStdM.MeshStandardMaterial;
  MeshBasicMaterial   = meshBasicM.MeshBasicMaterial;
  LineBasicMaterial   = lineBasicM.LineBasicMaterial;
  PointsMaterial      = pointsMatM.PointsMaterial;
  Mesh                = meshM.Mesh;
  Line                = lineM.Line;
  Points              = pointsM.Points;
  AmbientLight        = ambLightM.AmbientLight;
  PointLight          = ptLightM.PointLight;
  Vector2             = vec2M.Vector2;
  Vector3             = vec3M.Vector3;
  LinearToneMapping   = constants.LinearToneMapping;
  DoubleSide          = constants.DoubleSide;
  OrbitControls       = ocM.OrbitControls;
  EffectComposer      = ecM.EffectComposer;
  RenderPass          = rpM.RenderPass;
  UnrealBloomPass     = ubM.UnrealBloomPass;
}

export const planets = [
  { name: 'Sun',     size: 42,  color: 0xfff4a0, orbitRadius: 0,   orbitSpeed: 0,    rotationSpeed: 0.002, emissive: true,  emissiveIntensity: 3.5 },
  { name: 'Mercury', size: 5,   color: 0xb5b5b5, orbitRadius: 70,  orbitSpeed: 1.6,  rotationSpeed: 0.004, emissiveIntensity: 0.2  },
  { name: 'Venus',   size: 8,   color: 0xf0b060, orbitRadius: 100, orbitSpeed: 1.17, rotationSpeed: 0.002, emissiveIntensity: 0.2  },
  { name: 'Earth',   size: 9,   color: 0x4f8fd6, orbitRadius: 140, orbitSpeed: 1,    rotationSpeed: 0.02,  emissiveIntensity: 0.22 },
  { name: 'Mars',    size: 6,   color: 0xd9603a, orbitRadius: 195, orbitSpeed: 0.8,  rotationSpeed: 0.018, emissiveIntensity: 0.2  },
  { name: 'Jupiter', size: 26,  color: 0xe8c89a, orbitRadius: 275, orbitSpeed: 0.43, rotationSpeed: 0.04,  emissiveIntensity: 0.18 },
  { name: 'Saturn',  size: 21,  color: 0xe8dfa0, orbitRadius: 355, orbitSpeed: 0.32, rotationSpeed: 0.038, emissiveIntensity: 0.18, hasRing: true },
  { name: 'Uranus',  size: 12,  color: 0x7de8e8, orbitRadius: 430, orbitSpeed: 0.23, rotationSpeed: 0.03,  emissiveIntensity: 0.2  },
  { name: 'Neptune', size: 11,  color: 0x3a5fff, orbitRadius: 500, orbitSpeed: 0.18, rotationSpeed: 0.031, emissiveIntensity: 0.22 },
];

export const createStarfield = (scene) => {
  const starGeometry = new BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < 18000; i++) {
    starVertices.push(
      (Math.random() - 0.5) * 2400,
      (Math.random() - 0.5) * 2400,
      (Math.random() - 0.5) * 2400
    );
  }
  starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3));
  const starMaterial = new PointsMaterial({
    color: 0xffffff, size: 1.1, transparent: true, opacity: 0.88, sizeAttenuation: true,
  });
  const stars = new Points(starGeometry, starMaterial);
  scene.add(stars);
  return stars;
};

export const createPlanets = (scene) => {
  const planetObjects = [];
  const orbitPaths    = [];

  planets.forEach((planet) => {
    const geometry = new SphereGeometry(planet.size, 36, 36);
    let material;

    if (planet.name === 'Sun') {
      material = new MeshStandardMaterial({
        color: planet.color, emissive: planet.color,
        emissiveIntensity: planet.emissiveIntensity, roughness: 0.2, metalness: 0.0,
      });
    } else {
      material = new MeshStandardMaterial({
        color: new Color(planet.color), emissive: new Color(planet.color),
        emissiveIntensity: planet.emissiveIntensity ?? 0.2, roughness: 0.7, metalness: 0.0,
      });
    }

    const mesh = new Mesh(geometry, material);
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
      const orbitGeo = new BufferGeometry();
      orbitGeo.setAttribute('position', new Float32BufferAttribute(orbitPoints, 3));
      const orbitMat = new LineBasicMaterial({ color: 0x6688aa, transparent: true, opacity: 0.3 });
      const orbit = new Line(orbitGeo, orbitMat);
      orbit.rotation.x       = Math.PI / 2;
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

    if (planet.hasRing) {
      const ringGeo = new RingGeometry(planet.size + 6, planet.size + 18, 64);
      const ringMat = new MeshBasicMaterial({
        color: 0xd4c87a, side: DoubleSide, transparent: true, opacity: 0.75,
      });
      const ring = new Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.8;
      mesh.add(ring);
    }
  });

  return { planetObjects, orbitPaths };
};

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

  const scene = new Scene();
  scene.background = new Color(0x00000a);

  const w = mount.clientWidth;
  const h = mount.clientHeight;

  const camera = new PerspectiveCamera(60, w / h, 0.1, 10000);
  camera.position.set(0, 320, 650);

  const renderer = new WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping         = LinearToneMapping;
  renderer.toneMappingExposure = 0.9;
  mount.appendChild(renderer.domElement);

  const renderScene = new RenderPass(scene, camera);
  const bloomPass   = new UnrealBloomPass(new Vector2(w, h), 1.6, 0.5, 0.15);
  const composer    = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance   = 80;
  controls.maxDistance   = 1200;

  scene.add(new AmbientLight(0x222233, 1.5));
  const sunLight = new PointLight(0xfff4e0, 6, 0);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  return { scene, camera, renderer, composer, controls };
};

export const animateCameraTo = (camera, targetPosition, duration = 1000) => {
  const startPosition = camera.position.clone();
  const startTime     = Date.now();
  const update = () => {
    const elapsed  = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    camera.position.lerpVectors(
      startPosition,
      new Vector3(targetPosition.x, targetPosition.y + 200, targetPosition.z + 300),
      progress
    );
    if (progress < 1) requestAnimationFrame(update);
  };
  update();
};
