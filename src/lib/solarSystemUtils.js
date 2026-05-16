// solarSystemUtils.js
// Three.js is lazy-loaded here — never executed server-side.
// SolarSystem.js imports this via dynamic() with ssr:false.

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
  _OrbitControls   = oc.OrbitControls;
  _EffectComposer  = ec.EffectComposer;
  _RenderPass      = rp.RenderPass;
  _UnrealBloomPass = ub.UnrealBloomPass;
}

// ---------------------------------------------------------------------------
// PLANET DATA — realistic colours, sizes (relative), axial tilt, ring data
// ---------------------------------------------------------------------------
export const planets = [
  {
    name: 'Sun',
    size: 38,
    color: 0xFDB813,          // solar yellow-white
    emissive: 0xFF8C00,       // orange corona
    emissiveIntensity: 1.8,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.001,
    isSun: true,
  },
  {
    name: 'Mercury',
    size: 2.8,
    color: 0xB5B5B5,
    roughness: 0.9,
    metalness: 0.1,
    orbitRadius: 62,
    orbitSpeed: 1.6,
    rotationSpeed: 0.003,
    tilt: 0.034,
  },
  {
    name: 'Venus',
    size: 5.5,
    color: 0xE8C56D,          // thick sulphuric atmosphere
    emissive: 0x8B6914,
    emissiveIntensity: 0.2,
    roughness: 0.95,
    orbitRadius: 90,
    orbitSpeed: 1.17,
    rotationSpeed: 0.001,
    tilt: 177.4 * (Math.PI / 180), // retrograde
  },
  {
    name: 'Earth',
    size: 6,
    color: 0x2E86AB,          // oceanic blue
    emissive: 0x0D3B5E,       // city lights hint
    emissiveIntensity: 0.15,
    roughness: 0.7,
    metalness: 0.0,
    orbitRadius: 130,
    orbitSpeed: 1.0,
    rotationSpeed: 0.02,
    tilt: 23.5 * (Math.PI / 180),
  },
  {
    name: 'Mars',
    size: 3.2,
    color: 0xC1440E,          // iron-oxide red
    emissive: 0x6B1A00,
    emissiveIntensity: 0.08,
    roughness: 0.95,
    orbitRadius: 190,
    orbitSpeed: 0.8,
    rotationSpeed: 0.018,
    tilt: 25.2 * (Math.PI / 180),
  },
  {
    name: 'Jupiter',
    size: 20,
    color: 0xC88B3A,          // banded tan-brown
    emissive: 0x7A4F1A,
    emissiveIntensity: 0.05,
    roughness: 0.6,
    orbitRadius: 260,
    orbitSpeed: 0.43,
    rotationSpeed: 0.04,
    tilt: 3.1 * (Math.PI / 180),
  },
  {
    name: 'Saturn',
    size: 17,
    color: 0xE8D5A3,          // pale champagne gold
    emissive: 0x9A8040,
    emissiveIntensity: 0.04,
    roughness: 0.65,
    orbitRadius: 340,
    orbitSpeed: 0.32,
    rotationSpeed: 0.038,
    tilt: 26.7 * (Math.PI / 180),
    hasRing: true,
    ringInner: 20,
    ringOuter: 34,
    ringColor: 0xC8AA72,
    ringOpacity: 0.75,
  },
  {
    name: 'Uranus',
    size: 8,
    color: 0x7DE8E8,          // ice blue-green
    emissive: 0x1A6060,
    emissiveIntensity: 0.1,
    roughness: 0.4,
    orbitRadius: 415,
    orbitSpeed: 0.23,
    rotationSpeed: 0.03,
    tilt: 97.8 * (Math.PI / 180), // nearly sideways
    hasRing: true,
    ringInner: 10,
    ringOuter: 13,
    ringColor: 0x9EEEFF,
    ringOpacity: 0.35,
  },
  {
    name: 'Neptune',
    size: 7.5,
    color: 0x3F54BA,          // deep royal blue
    emissive: 0x10207A,
    emissiveIntensity: 0.15,
    roughness: 0.4,
    orbitRadius: 490,
    orbitSpeed: 0.18,
    rotationSpeed: 0.031,
    tilt: 28.3 * (Math.PI / 180),
  },
];

// ---------------------------------------------------------------------------
// STARFIELD — 15k stars with colour temperature variation
// ---------------------------------------------------------------------------
export const createStarfield = (scene) => {
  const THREE = _THREE;
  const COUNT = 15000;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);

  // Star colour temperature palette (BVOK spectral classes approx)
  const starColors = [
    [1.0, 0.97, 0.92],   // white/yellow-white (G/F)
    [1.0, 0.85, 0.70],   // orange (K)
    [0.85, 0.90, 1.00],  // blue-white (A/B)
    [1.0, 1.0, 1.0],     // pure white
    [1.0, 0.70, 0.60],   // orange-red (M)
  ];

  for (let i = 0; i < COUNT; i++) {
    const r = 900 + Math.random() * 800; // between 900–1700 units
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const c = starColors[Math.floor(Math.random() * starColors.length)];
    colors[i * 3]     = c[0];
    colors[i * 3 + 1] = c[1];
    colors[i * 3 + 2] = c[2];
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.9,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    sizeAttenuation: true,
  });

  const stars = new THREE.Points(geo, mat);
  scene.add(stars);
  return stars;
};

// ---------------------------------------------------------------------------
// PLANETS — photorealistic materials + axial tilt + rings
// ---------------------------------------------------------------------------
export const createPlanets = (scene) => {
  const THREE = _THREE;
  const planetObjects = [];
  const orbitPaths    = [];

  planets.forEach((p) => {
    // ── Geometry
    const geo = new THREE.SphereGeometry(p.size, 48, 48);

    // ── Material
    let mat;
    if (p.isSun) {
      mat = new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.emissive,
        emissiveIntensity: p.emissiveIntensity,
        roughness: 1,
        metalness: 0,
      });
    } else {
      mat = new THREE.MeshPhysicalMaterial({
        color: p.color,
        emissive: p.emissive || 0x000000,
        emissiveIntensity: p.emissiveIntensity || 0,
        roughness: p.roughness ?? 0.8,
        metalness: p.metalness ?? 0.0,
        clearcoat: 0,
      });
    }

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name  = p.name;
    if (p.tilt) mesh.rotation.z = p.tilt;
    mesh.castShadow    = true;
    mesh.receiveShadow = true;

    // ── Initial orbit position (random start angle)
    if (p.orbitRadius > 0) {
      const startAngle = Math.random() * Math.PI * 2;
      mesh.position.set(
        Math.cos(startAngle) * p.orbitRadius,
        0,
        Math.sin(startAngle) * p.orbitRadius
      );

      // Orbit path line
      const pts = [];
      for (let i = 0; i <= 256; i++) {
        const a = (i / 256) * Math.PI * 2;
        pts.push(new THREE.Vector3(
          Math.cos(a) * p.orbitRadius,
          0,
          Math.sin(a) * p.orbitRadius
        ));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x445566,
        transparent: true,
        opacity: 0.25,
      });
      const orbit = new THREE.Line(orbitGeo, orbitMat);
      orbit.userData.isOrbit = true;
      scene.add(orbit);
      orbitPaths.push(orbit);
    }

    // ── Rings (Saturn, Uranus)
    if (p.hasRing) {
      const ringGeo = new THREE.RingGeometry(p.ringInner, p.ringOuter, 128);
      // Fix RingGeometry UV mapping so it looks like a disc, not a fan
      const ringPos = ringGeo.attributes.position;
      const v3 = new THREE.Vector3();
      for (let i = 0; i < ringPos.count; i++) {
        v3.fromBufferAttribute(ringPos, i);
        ringGeo.attributes.uv.setXY(i, v3.length() < (p.ringInner + p.ringOuter) / 2 ? 0 : 1, 1);
      }
      const ringMat = new THREE.MeshBasicMaterial({
        color: p.ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: p.ringOpacity,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      // Saturn ring tilted ~27° from its equatorial plane
      ring.rotation.x = Math.PI / 2 - (p.tilt || 0);
      mesh.add(ring);
    }

    // ── Sun corona glow (sprite halo)
    if (p.isSun) {
      const spriteMat = new THREE.SpriteMaterial({
        map: createSunGlowTexture(THREE),
        color: 0xFF6600,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.55,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(p.size * 5, p.size * 5, 1);
      mesh.add(sprite);

      // Sun point light
      const sunLight = new THREE.PointLight(0xFFF4E0, 3.5, 1800, 1.4);
      mesh.add(sunLight);
    }

    scene.add(mesh);
    planetObjects.push({
      mesh,
      orbitSpeed:    p.orbitSpeed,
      rotationSpeed: p.rotationSpeed,
      orbitRadius:   p.orbitRadius,
      startAngle:    p.orbitRadius > 0 ? Math.atan2(mesh.position.z, mesh.position.x) : 0,
    });
  });

  return { planetObjects, orbitPaths };
};

// ---------------------------------------------------------------------------
// SUN GLOW TEXTURE — drawn on a canvas, no external file needed
// ---------------------------------------------------------------------------
function createSunGlowTexture(THREE) {
  const size   = 256;
  const canvas = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0,    'rgba(255, 180,  60, 1.0)');
  grad.addColorStop(0.2,  'rgba(255, 120,  20, 0.7)');
  grad.addColorStop(0.5,  'rgba(255,  80,   0, 0.25)');
  grad.addColorStop(1.0,  'rgba(0,     0,   0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// ---------------------------------------------------------------------------
// ASTEROID BELT — 400 individual low-poly rocks
// ---------------------------------------------------------------------------
export const createAsteroidBelt = (scene) => {
  const THREE = _THREE;
  const group = new THREE.Group();
  const INNER = 215, OUTER = 250;

  for (let i = 0; i < 400; i++) {
    const size   = 0.3 + Math.random() * 1.2;
    const geo    = new THREE.DodecahedronGeometry(size, 0);
    const mat    = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.07 + Math.random() * 0.05, 0.2, 0.3 + Math.random() * 0.2),
      roughness: 1,
      metalness: 0.1,
    });
    const mesh  = new THREE.Mesh(geo, mat);
    const angle  = Math.random() * Math.PI * 2;
    const radius = INNER + Math.random() * (OUTER - INNER);
    mesh.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 8,
      Math.sin(angle) * radius
    );
    mesh.rotation.set(Math.random(), Math.random(), Math.random());
    mesh.userData.angle        = angle;
    mesh.userData.radius       = radius;
    mesh.userData.orbitSpeed   = 0.0004 + Math.random() * 0.0003;
    mesh.userData.rotationAxis = new THREE.Vector3(
      Math.random(), Math.random(), Math.random()
    ).normalize();
    group.add(mesh);
  }

  scene.add(group);
  return group;
};

// ---------------------------------------------------------------------------
// UPDATE — planet orbits + asteroid belt individual rock movement
// ---------------------------------------------------------------------------
export const updatePlanets = (planetObjects, time, autoRotate) => {
  planetObjects.forEach((p) => {
    if (p.orbitRadius > 0) {
      const angle = p.startAngle + time * p.orbitSpeed;
      p.mesh.position.x = Math.cos(angle) * p.orbitRadius;
      p.mesh.position.z = Math.sin(angle) * p.orbitRadius;
    }
    if (autoRotate) p.mesh.rotation.y += p.rotationSpeed;
  });
};

export const updateAsteroidBelt = (belt, delta) => {
  if (!belt) return;
  belt.children.forEach((rock) => {
    rock.userData.angle += rock.userData.orbitSpeed;
    rock.position.x = Math.cos(rock.userData.angle) * rock.userData.radius;
    rock.position.z = Math.sin(rock.userData.angle) * rock.userData.radius;
    rock.rotateOnAxis(rock.userData.rotationAxis, 0.005);
  });
};

// ---------------------------------------------------------------------------
// THREE.JS INIT
// ---------------------------------------------------------------------------
export const initThreeJS = async (mount) => {
  await loadThree();
  const THREE = _THREE;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000005); // near-black with tiny blue tint

  // Subtle nebula-like fog at far distance
  scene.fog = new THREE.FogExp2(0x000010, 0.00045);

  const w = mount.clientWidth;
  const h = mount.clientHeight;
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 5000);
  camera.position.set(0, 150, 380); // closer than before — more immersive

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha:     false,
    powerPreference: 'high-performance',
  });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2x
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  mount.appendChild(renderer.domElement);

  // Post-processing — bloom tuned for solar glow without over-brightening
  const renderScene = new _RenderPass(scene, camera);
  const bloomPass   = new _UnrealBloomPass(
    new THREE.Vector2(w, h),
    1.2,   // strength (was 1.5 — too aggressive)
    0.6,   // radius
    0.75   // threshold
  );
  const composer = new _EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // Orbit controls — smooth damping
  const controls = new _OrbitControls(camera, renderer.domElement);
  controls.enableDamping    = true;
  controls.dampingFactor    = 0.06;
  controls.minDistance      = 60;
  controls.maxDistance      = 900;
  controls.autoRotate       = false; // handled manually via autoRotate prop
  controls.autoRotateSpeed  = 0.3;
  controls.enablePan        = false;
  controls.maxPolarAngle    = Math.PI * 0.75;

  // Ambient: very low — sun's PointLight does the heavy lifting
  const ambient = new THREE.AmbientLight(0x111122, 0.6);
  scene.add(ambient);

  return { scene, camera, renderer, composer, controls };
};

export const animateCameraTo = (camera, targetPosition, duration = 1000) => {
  const THREE = _THREE;
  const start     = camera.position.clone();
  const startTime = Date.now();
  const tick = () => {
    const t = Math.min((Date.now() - startTime) / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease-in-out
    camera.position.lerpVectors(
      start,
      new THREE.Vector3(targetPosition.x, targetPosition.y + 150, targetPosition.z + 300),
      ease
    );
    if (t < 1) requestAnimationFrame(tick);
  };
  tick();
};
