/**
 * solarSystemUtils.js — Dynamic Three.js solar system with bloom & postprocessing.
 *
 * Uses cached Promise-based dynamic import of 'three' and official addons.
 * Safe for React 18 / Next.js StrictMode concurrent invocation.
 */

let _loadPromise = null;

let Scene, Color, PerspectiveCamera, WebGLRenderer;
let BufferGeometry, Float32BufferAttribute;
let SphereGeometry, RingGeometry;
let MeshStandardMaterial, MeshBasicMaterial, LineBasicMaterial, LineDashedMaterial, PointsMaterial;
let Mesh, Line, Points, InstancedMesh, Group;
let AmbientLight, PointLight;
let Vector2, Vector3, Matrix4, Quaternion, Euler;
let LinearToneMapping, ACESFilmicToneMapping, DoubleSide, AdditiveBlending;
let OrbitControls, EffectComposer, RenderPass, UnrealBloomPass, OutputPass;

async function loadThree() {
  if (!_loadPromise) {
    _loadPromise = (async () => {
      const [
        threeM,
        ocM,
        ecM,
        rpM,
        ubM,
        opM,
      ] = await Promise.all([
        import('three'),
        import('three/addons/controls/OrbitControls.js'),
        import('three/addons/postprocessing/EffectComposer.js'),
        import('three/addons/postprocessing/RenderPass.js'),
        import('three/addons/postprocessing/UnrealBloomPass.js'),
        import('three/addons/postprocessing/OutputPass.js'),
      ]);

      const THREE = threeM;
      Scene                  = THREE.Scene;
      Color                  = THREE.Color;
      PerspectiveCamera      = THREE.PerspectiveCamera;
      WebGLRenderer          = THREE.WebGLRenderer;
      BufferGeometry         = THREE.BufferGeometry;
      Float32BufferAttribute = THREE.Float32BufferAttribute;
      SphereGeometry         = THREE.SphereGeometry;
      RingGeometry           = THREE.RingGeometry;
      MeshStandardMaterial   = THREE.MeshStandardMaterial;
      MeshBasicMaterial      = THREE.MeshBasicMaterial;
      LineBasicMaterial      = THREE.LineBasicMaterial;
      LineDashedMaterial     = THREE.LineDashedMaterial;
      PointsMaterial         = THREE.PointsMaterial;
      Mesh                   = THREE.Mesh;
      Line                   = THREE.Line;
      Points                 = THREE.Points;
      InstancedMesh          = THREE.InstancedMesh;
      Group                  = THREE.Group;
      AmbientLight           = THREE.AmbientLight;
      PointLight             = THREE.PointLight;
      Vector2                = THREE.Vector2;
      Vector3                = THREE.Vector3;
      Matrix4                = THREE.Matrix4;
      Quaternion             = THREE.Quaternion;
      Euler                  = THREE.Euler;
      LinearToneMapping      = THREE.LinearToneMapping;
      ACESFilmicToneMapping  = THREE.ACESFilmicToneMapping;
      DoubleSide             = THREE.DoubleSide;
      AdditiveBlending       = THREE.AdditiveBlending;

      OrbitControls          = ocM.OrbitControls;
      EffectComposer         = ecM.EffectComposer;
      RenderPass             = rpM.RenderPass;
      UnrealBloomPass        = ubM.UnrealBloomPass;
      OutputPass             = opM.OutputPass;
    })();
  }
  return _loadPromise;
}

export const planets = [
  { name: 'Sun',     size: 24,  color: 0xffa030, orbitRadius: 0,   orbitSpeed: 0,    rotationSpeed: 0.002, emissive: true,  emissiveIntensity: 1.1, tilt: 0 },
  { name: 'Mercury', size: 5,   color: 0xc8c8c8, orbitRadius: 75,  orbitSpeed: 1.6,  rotationSpeed: 0.004, emissiveIntensity: 0.35, tilt: 0.03 },
  { name: 'Venus',   size: 7.5, color: 0xefb878, orbitRadius: 105, orbitSpeed: 1.17, rotationSpeed: 0.002, emissiveIntensity: 0.35, tilt: 177.3 },
  { name: 'Earth',   size: 9,   color: 0x4f8fd6, orbitRadius: 145, orbitSpeed: 1,    rotationSpeed: 0.02,  emissiveIntensity: 0.4,  tilt: 23.5 },
  { name: 'Mars',    size: 6.5, color: 0xef5350, orbitRadius: 195, orbitSpeed: 0.8,  rotationSpeed: 0.018, emissiveIntensity: 0.35, tilt: 25.2 },
  { name: 'Jupiter', size: 24,  color: 0xf6d6b2, orbitRadius: 275, orbitSpeed: 0.43, rotationSpeed: 0.04,  emissiveIntensity: 0.3,  tilt: 3.1 },
  { name: 'Saturn',  size: 19,  color: 0xfef08a, orbitRadius: 355, orbitSpeed: 0.32, rotationSpeed: 0.038, emissiveIntensity: 0.3,  tilt: 26.7, hasRing: true },
  { name: 'Uranus',  size: 12,  color: 0x67e8f9, orbitRadius: 430, orbitSpeed: 0.23, rotationSpeed: 0.03,  emissiveIntensity: 0.35, tilt: 97.8 },
  { name: 'Neptune', size: 11,  color: 0x3b82f6, orbitRadius: 500, orbitSpeed: 0.18, rotationSpeed: 0.031, emissiveIntensity: 0.4,  tilt: 28.3 },
];

export const createStarfield = (scene) => {
  const starGeometry = new BufferGeometry();
  const starVertices = [];
  const starColors = [];
  
  const color1 = new Color(0xffffff); // White
  const color2 = new Color(0xaaaaff); // Blueish
  const color3 = new Color(0xffddaa); // Yellowish
  
  for (let i = 0; i < 15000; i++) {
    starVertices.push(
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 3000
    );
    
    // Mix colors
    const rand = Math.random();
    let c;
    if (rand < 0.6) c = color1;
    else if (rand < 0.8) c = color2;
    else c = color3;
    
    starColors.push(c.r, c.g, c.b);
  }
  
  starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3));
  starGeometry.setAttribute('color', new Float32BufferAttribute(starColors, 3));
  
  const starMaterial = new PointsMaterial({
    size: 1.2, 
    transparent: true, 
    opacity: 0.9, 
    sizeAttenuation: true,
    vertexColors: true
  });
  const stars = new Points(starGeometry, starMaterial);
  scene.add(stars);
  return stars;
};

export const createPlanets = (scene) => {
  const planetObjects = [];
  const orbitPaths    = [];

  planets.forEach((planet) => {
    const geometry = new SphereGeometry(planet.size, 64, 64);
    let material;

    if (planet.name === 'Sun') {
      material = new MeshStandardMaterial({
        color: new Color(0xffa030),
        emissive: new Color(0xff7700),
        emissiveIntensity: planet.emissiveIntensity,
        roughness: 0.2,
        metalness: 0.0,
      });
    } else {
      material = new MeshStandardMaterial({
        color: new Color(planet.color),
        emissive: new Color(planet.color),
        emissiveIntensity: planet.emissiveIntensity ?? 0.35,
        roughness: 0.6,
        metalness: 0.05,
      });
    }

    const mesh = new Mesh(geometry, material);
    mesh.name = planet.name;

    // Apply realistic axial tilt to the planet mesh
    if (planet.tilt) {
      mesh.rotation.z = planet.tilt * (Math.PI / 180);
    }

    if (planet.name === 'Sun') {
      // Inner warm corona
      const coronaGeo = new SphereGeometry(planet.size * 1.25, 32, 32);
      const coronaMat = new MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.16,
        side: DoubleSide,
        blending: AdditiveBlending
      });
      const corona = new Mesh(coronaGeo, coronaMat);
      mesh.add(corona);

      // Soft outer atmospheric flare
      const flareGeo = new SphereGeometry(planet.size * 1.55, 32, 32);
      const flareMat = new MeshBasicMaterial({
        color: 0xff4400,
        transparent: true,
        opacity: 0.05,
        side: DoubleSide,
        blending: AdditiveBlending
      });
      const flare = new Mesh(flareGeo, flareMat);
      mesh.add(flare);
    }
    
    let moonPivot = null;
    let moonMesh = null;
    if (planet.name === 'Earth') {
      // Atmosphere Glow
      const atmosGeo = new SphereGeometry(planet.size * 1.15, 32, 32);
      const atmosMat = new MeshBasicMaterial({
        color: 0x4f8fd6, transparent: true, opacity: 0.2,
        side: DoubleSide, blending: AdditiveBlending
      });
      const atmosphere = new Mesh(atmosGeo, atmosMat);
      mesh.add(atmosphere);

      // The Moon
      moonPivot = new Group();
      const moonGeo = new SphereGeometry(2, 16, 16);
      const moonMat = new MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 });
      moonMesh = new Mesh(moonGeo, moonMat);
      moonMesh.position.set(22, 0, 0); // Distance from Earth
      moonPivot.add(moonMesh);
      // We add the pivot to the scene (not the Earth mesh) so it orbits Earth independently of Earth's spin
      scene.add(moonPivot);
    }

    if (planet.orbitRadius > 0) {
      const angle = Math.random() * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * planet.orbitRadius;
      mesh.position.z = Math.sin(angle) * planet.orbitRadius;
      
      if (moonPivot) {
        moonPivot.position.copy(mesh.position);
      }

      const orbitPoints = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        orbitPoints.push(Math.cos(a) * planet.orbitRadius, 0, Math.sin(a) * planet.orbitRadius);
      }
      const orbitGeo = new BufferGeometry();
      orbitGeo.setAttribute('position', new Float32BufferAttribute(orbitPoints, 3));
      
      // Dashed sci-fi orbit lines in the horizontal X-Z orbital plane (y=0)
      const orbitMat = new LineDashedMaterial({ 
        color: 0x6688aa, transparent: true, opacity: 0.25, 
        dashSize: 4, gapSize: 2 
      });
      const orbit = new Line(orbitGeo, orbitMat);
      orbit.computeLineDistances(); // Required for LineDashedMaterial
      orbit.userData.isOrbit = true;
      scene.add(orbit);
      orbitPaths.push(orbit);
    }

    scene.add(mesh);
    planetObjects.push({
      mesh,
      moonPivot,
      moonMesh,
      orbitSpeed:    planet.orbitSpeed,
      rotationSpeed: planet.rotationSpeed,
      orbitRadius:   planet.orbitRadius,
    });

    if (planet.hasRing) {
      const ringGeo = new RingGeometry(planet.size + 4, planet.size + 14, 64);
      const ringMat = new MeshStandardMaterial({
        color: 0xd4c87a, side: DoubleSide, transparent: true, opacity: 0.8,
        roughness: 0.5, metalness: 0.1
      });
      const ring = new Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      mesh.add(ring);
      
      // Add a secondary faint inner ring
      const ringGeo2 = new RingGeometry(planet.size + 15, planet.size + 20, 64);
      const ringMat2 = new MeshStandardMaterial({
        color: 0xb5aa6b, side: DoubleSide, transparent: true, opacity: 0.3,
        roughness: 0.5
      });
      const ring2 = new Mesh(ringGeo2, ringMat2);
      ring2.rotation.x = Math.PI / 2.5;
      mesh.add(ring2);
    }
  });

  return { planetObjects, orbitPaths };
};

export const createAsteroidBelt = (scene) => {
  const asteroidCount = 3500;
  const geometry = new SphereGeometry(0.8, 6, 6); // Low poly asteroid
  const material = new MeshStandardMaterial({
    color: 0x888888,
    roughness: 0.9,
    metalness: 0.1,
  });
  
  const asteroidBelt = new InstancedMesh(geometry, material, asteroidCount);
  const matrix = new Matrix4();
  const position = new Vector3();
  const rotation = new Quaternion();
  const scale = new Vector3();

  // Asteroid belt between Mars (195) and Jupiter (275)
  const innerRadius = 220;
  const outerRadius = 250;

  for (let i = 0; i < asteroidCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
    
    position.x = Math.cos(angle) * radius;
    position.y = (Math.random() - 0.5) * 15; // Vertical spread
    position.z = Math.sin(angle) * radius;

    const euler = new Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rotation.setFromEuler(euler);
    
    const s = Math.random() * 1.5 + 0.5;
    scale.set(s, s, s);

    matrix.compose(position, rotation, scale);
    asteroidBelt.setMatrixAt(i, matrix);
  }

  scene.add(asteroidBelt);
  return asteroidBelt;
};

export const updatePlanets = (planetObjects, time, autoRotate) => {
  planetObjects.forEach((planet) => {
    if (planet.orbitRadius > 0) {
      planet.mesh.position.x = Math.cos(time * planet.orbitSpeed) * planet.orbitRadius;
      planet.mesh.position.z = Math.sin(time * planet.orbitSpeed) * planet.orbitRadius;
    }
    
    // Animate the Moon if this planet has one
    if (planet.moonPivot && planet.moonMesh) {
      planet.moonPivot.position.copy(planet.mesh.position);
      // Moon orbits earth much faster than earth orbits sun
      planet.moonPivot.rotation.y = time * 3.5; 
      // Moon itself rotates slowly
      planet.moonMesh.rotation.y += 0.01;
    }

    if (autoRotate) {
      planet.mesh.rotation.y += planet.rotationSpeed;
    }
  });
};

export const initThreeJS = async (mount) => {
  await loadThree();

  const scene = new Scene();
  scene.background = new Color(0x00000a);

  const w = mount?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
  const h = mount?.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 800);

  const camera = new PerspectiveCamera(60, (w > 0 && h > 0) ? (w / h) : (16 / 9), 0.1, 10000);
  camera.position.set(0, 320, 650);

  const renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));
  renderer.toneMapping         = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // Clear any existing canvas nodes (e.g. from HMR or StrictMode)
  while (mount.firstChild) {
    mount.removeChild(mount.firstChild);
  }
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width   = '100%';
  renderer.domElement.style.height  = '100%';
  mount.appendChild(renderer.domElement);

  const renderScene = new RenderPass(scene, camera);
  const bloomPass   = new UnrealBloomPass(new Vector2(w, h), 0.75, 0.4, 0.5);
  const composer    = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  if (OutputPass) {
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance   = 80;
  controls.maxDistance   = 1200;

  scene.add(new AmbientLight(0x1a2236, 1.8));
  const sunLight = new PointLight(0xfff5e6, 3.2, 2500, 0.6);
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
