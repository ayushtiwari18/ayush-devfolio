// solarSystemUtils.js — Photorealistic Three.js Solar System
// Optimisation contract:
//   • NO EffectComposer / RenderPass / UnrealBloomPass (saves ~3 MB + 4,310 ms CPU)
//   • Asteroid belt → ONE InstancedMesh (600 → 1 draw call)
//   • Stars → 12k Points with custom GLSL shader
//   • devicePixelRatio capped at 1.5
//   • Progressive reveal via onReady callback
//   • Visibility API pause / resume
//   • Reduced-motion: static scene, no RAF loop
//   • Mobile/low-end GPU: simplified scene flag

let _THREE = null;
let _OrbitControls = null;

async function loadThree() {
  if (_THREE) return;
  const [three, oc] = await Promise.all([
    import('three'),
    import('three/addons/controls/OrbitControls.js'),
  ]);
  _THREE = three;
  _OrbitControls = oc.OrbitControls;
}

// ---------------------------------------------------------------------------
// GPU TIER — rough heuristic (mobile or low RAM → simplified)
// ---------------------------------------------------------------------------
function getGpuTier() {
  if (typeof window === 'undefined') return 'high';
  const gl = document.createElement('canvas').getContext('webgl');
  if (!gl) return 'low';
  const dbgInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (!dbgInfo) return 'mid';
  const renderer = gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
  if (/mali|adreno 3|adreno 4|powervr|apple a[6-9]/i.test(renderer)) return 'low';
  if (/adreno 5|apple a1[0-2]/i.test(renderer)) return 'mid';
  return 'high';
}

// ---------------------------------------------------------------------------
// PLANET DATA
// ---------------------------------------------------------------------------
export const planets = [
  {
    name: 'Sun', size: 38, color: 0xFDB813, emissive: 0xFF6000,
    emissiveIntensity: 2.5, orbitRadius: 0, orbitSpeed: 0,
    rotationSpeed: 0.0008, isSun: true,
  },
  {
    name: 'Mercury', size: 2.4, orbitRadius: 62, orbitSpeed: 1.6,
    rotationSpeed: 0.003, tilt: 0.034, textureType: 'mercury', segments: 24,
  },
  {
    name: 'Venus', size: 5.2, orbitRadius: 90, orbitSpeed: 1.17,
    rotationSpeed: 0.0007, tilt: 177.4 * (Math.PI / 180),
    textureType: 'venus', hasAtmosphere: true,
    atmosphereColor: 0xE8C56D, atmosphereOpacity: 0.35, segments: 32,
  },
  {
    name: 'Earth', size: 6.2, orbitRadius: 130, orbitSpeed: 1.0,
    rotationSpeed: 0.02, tilt: 23.5 * (Math.PI / 180),
    textureType: 'earth', hasAtmosphere: true,
    atmosphereColor: 0x4FC3F7, atmosphereOpacity: 0.18,
    hasMoon: true, segments: 48,
  },
  {
    name: 'Mars', size: 3.3, orbitRadius: 190, orbitSpeed: 0.8,
    rotationSpeed: 0.018, tilt: 25.2 * (Math.PI / 180),
    textureType: 'mars', hasAtmosphere: true,
    atmosphereColor: 0xFF8C69, atmosphereOpacity: 0.10, segments: 32,
  },
  {
    name: 'Jupiter', size: 20, orbitRadius: 260, orbitSpeed: 0.43,
    rotationSpeed: 0.04, tilt: 3.1 * (Math.PI / 180),
    textureType: 'jupiter', segments: 40,
  },
  {
    name: 'Saturn', size: 17, orbitRadius: 340, orbitSpeed: 0.32,
    rotationSpeed: 0.038, tilt: 26.7 * (Math.PI / 180),
    textureType: 'saturn',
    hasRing: true, ringInner: 21, ringOuter: 36, segments: 40,
  },
  {
    name: 'Uranus', size: 8, orbitRadius: 415, orbitSpeed: 0.23,
    rotationSpeed: 0.03, tilt: 97.8 * (Math.PI / 180),
    textureType: 'uranus',
    hasRing: true, ringInner: 10, ringOuter: 13,
    ringColor: 0x9EEEFF, ringOpacity: 0.3, segments: 28,
  },
  {
    name: 'Neptune', size: 7.8, orbitRadius: 490, orbitSpeed: 0.18,
    rotationSpeed: 0.031, tilt: 28.3 * (Math.PI / 180),
    textureType: 'neptune', hasAtmosphere: true,
    atmosphereColor: 0x3F54BA, atmosphereOpacity: 0.15, segments: 28,
  },
];

// ---------------------------------------------------------------------------
// PROCEDURAL TEXTURES  (512×512 canvas, cached)
// ---------------------------------------------------------------------------
const _texCache = {};
function makeTex(THREE, key, draw) {
  if (_texCache[key]) return _texCache[key];
  const S = 512;
  const C = document.createElement('canvas');
  C.width = C.height = S;
  draw(C.getContext('2d'), S);
  const t = new THREE.CanvasTexture(C);
  _texCache[key] = t;
  return t;
}

const buildTextures = (THREE) => ({
  mercury: makeTex(THREE, 'mercury', (ctx, S) => {
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, '#c0b090'); g.addColorStop(0.5, '#9a8878'); g.addColorStop(1, '#7a6858');
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * S, y = Math.random() * S, r = 1 + Math.random() * 5;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(50,40,30,${0.3 + Math.random() * 0.5})`; ctx.fill();
    }
  }),
  venus: makeTex(THREE, 'venus', (ctx, S) => {
    const g = ctx.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, '#e8c060'); g.addColorStop(0.5, '#c89830'); g.addColorStop(1, '#b88820');
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < 35; i++) {
      const y = Math.random() * S, h = 4 + Math.random() * 14;
      ctx.fillStyle = `rgba(210,160,40,${0.3 + Math.random() * 0.4})`;
      ctx.fillRect(0, y, S, h);
    }
  }),
  earth: makeTex(THREE, 'earth', (ctx, S) => {
    ctx.fillStyle = '#1565c0'; ctx.fillRect(0, 0, S, S);
    const land = [
      { x: 0.15, y: 0.2, w: 0.18, h: 0.35, c: '#2e7d32' },
      { x: 0.35, y: 0.15, w: 0.22, h: 0.40, c: '#388e3c' },
      { x: 0.55, y: 0.22, w: 0.16, h: 0.28, c: '#33691e' },
      { x: 0.60, y: 0.55, w: 0.22, h: 0.30, c: '#2e7d32' },
      { x: 0.08, y: 0.58, w: 0.14, h: 0.22, c: '#1b5e20' },
    ];
    land.forEach(l => {
      ctx.fillStyle = l.c;
      ctx.beginPath();
      ctx.ellipse(l.x * S, l.y * S, l.w * S * 0.5, l.h * S * 0.5, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(0, 0, S, 18); ctx.fillRect(0, S - 18, S, 18);
    for (let i = 0; i < 16; i++) {
      const y = 8 + Math.random() * (S - 16), h = 5 + Math.random() * 12;
      ctx.fillStyle = `rgba(255,255,255,${0.12 + Math.random() * 0.18})`;
      ctx.fillRect(Math.random() * S * 0.6 + S * 0.2, y, 40 + Math.random() * 110, h);
    }
  }),
  mars: makeTex(THREE, 'mars', (ctx, S) => {
    const g = ctx.createRadialGradient(S * 0.4, S * 0.4, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, '#d4480a'); g.addColorStop(0.4, '#b83a08'); g.addColorStop(1, '#8b2200');
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < 70; i++) {
      const x = Math.random() * S, y = Math.random() * S, r = 2 + Math.random() * 7;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(80,20,0,${0.2 + Math.random() * 0.4})`; ctx.fill();
    }
    ctx.fillStyle = 'rgba(230,220,200,0.55)';
    ctx.beginPath(); ctx.ellipse(S * 0.5, S * 0.05, S * 0.22, S * 0.055, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S * 0.5, S * 0.95, S * 0.18, S * 0.045, 0, 0, Math.PI * 2); ctx.fill();
  }),
  jupiter: makeTex(THREE, 'jupiter', (ctx, S) => {
    const bands = ['#c8a060', '#b8906a', '#d4b080', '#a07040', '#c89070', '#b88060', '#d0a870', '#a86830', '#c89050', '#e0c090'];
    const bh = S / bands.length;
    bands.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(0, i * bh, S, bh + 1); });
    ctx.fillStyle = 'rgba(200,120,80,0.55)';
    ctx.beginPath(); ctx.ellipse(S * 0.35, S * 0.62, S * 0.09, S * 0.05, 0.1, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 8; i++) {
      const y = (i + 0.5) * bh;
      ctx.strokeStyle = `rgba(100,60,20,${0.15 + Math.random() * 0.25})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke();
    }
  }),
  saturn: makeTex(THREE, 'saturn', (ctx, S) => {
    const bands = ['#e8d8a8', '#d4c090', '#e0cc98', '#c8b078', '#dcc888', '#c4a870'];
    const bh = S / bands.length;
    bands.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(0, i * bh, S, bh + 1); });
    for (let i = 0; i < 5; i++) {
      const y = (i + 0.5) * bh;
      ctx.strokeStyle = 'rgba(150,110,50,0.2)';
      ctx.lineWidth = Math.random() * 2.5;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke();
    }
  }),
  uranus: makeTex(THREE, 'uranus', (ctx, S) => {
    const g = ctx.createLinearGradient(0, 0, 0, S);
    g.addColorStop(0, '#72e8e8'); g.addColorStop(0.5, '#5cd4d4'); g.addColorStop(1, '#44c0c0');
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  }),
  neptune: makeTex(THREE, 'neptune', (ctx, S) => {
    const g = ctx.createRadialGradient(S * 0.45, S * 0.4, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, '#4060e0'); g.addColorStop(0.4, '#3050c8'); g.addColorStop(1, '#1828a0');
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = 'rgba(160,180,255,0.30)';
    ctx.beginPath(); ctx.ellipse(S * 0.55, S * 0.45, S * 0.11, S * 0.065, 0.3, 0, Math.PI * 2); ctx.fill();
  }),
});

// ---------------------------------------------------------------------------
// SUN GLOW TEXTURE
// ---------------------------------------------------------------------------
function createSunGlowTexture(THREE) {
  if (_texCache['sunGlow']) return _texCache['sunGlow'];
  const S = 256;
  const C = document.createElement('canvas');
  C.width = C.height = S;
  const ctx = C.getContext('2d');
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(255,230,120,1.0)');
  g.addColorStop(0.08, 'rgba(255,180,60,0.9)');
  g.addColorStop(0.25, 'rgba(255,100,20,0.55)');
  g.addColorStop(0.5, 'rgba(255,50,0,0.2)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(C);
  _texCache['sunGlow'] = t;
  return t;
}

// ---------------------------------------------------------------------------
// SATURN RING TEXTURE
// ---------------------------------------------------------------------------
function createRingTexture(THREE) {
  if (_texCache['ring']) return _texCache['ring'];
  const S = 512;
  const C = document.createElement('canvas');
  C.width = S; C.height = 1;
  const ctx = C.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, S, 0);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.05, 'rgba(160,130,80,0.3)');
  g.addColorStop(0.15, 'rgba(200,170,100,0.75)');
  g.addColorStop(0.3, 'rgba(220,190,120,0.9)');
  g.addColorStop(0.42, 'rgba(180,150,90,0.8)');
  g.addColorStop(0.5, 'rgba(10,10,10,0.05)');
  g.addColorStop(0.58, 'rgba(200,170,110,0.75)');
  g.addColorStop(0.72, 'rgba(180,150,90,0.55)');
  g.addColorStop(0.85, 'rgba(140,110,70,0.3)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, 1);
  const tex = new THREE.CanvasTexture(C);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  _texCache['ring'] = tex;
  return tex;
}

// ---------------------------------------------------------------------------
// MILKY WAY BACKGROUND SPHERE
// ---------------------------------------------------------------------------
function createMilkyWay(scene, THREE) {
  const S = 512;
  const C = document.createElement('canvas');
  C.width = C.height = S;
  const ctx = C.getContext('2d');
  ctx.fillStyle = '#000008'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * S;
    const band = Math.abs(Math.random() - 0.5) * S;
    const y = S / 2 + band * (Math.random() > 0.5 ? 1 : -1) * 0.4;
    const r = Math.random() * 1.0;
    const a = Math.max(0, 0.55 - band / S * 1.7);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    const hue = Math.random() > 0.7 ? '210,220,255' : '255,240,200';
    ctx.fillStyle = `rgba(${hue},${a})`; ctx.fill();
  }
  const g = ctx.createLinearGradient(0, S * 0.3, 0, S * 0.7);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.5, 'rgba(60,40,80,0.07)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  const geo = new THREE.SphereGeometry(1600, 24, 24);
  const mat = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(C),
    side: THREE.BackSide,
    transparent: true, opacity: 0.82,
    depthWrite: false,
  });
  scene.add(new THREE.Mesh(geo, mat));
}

// ---------------------------------------------------------------------------
// STARFIELD — 12k stars, custom GLSL size shader, spectral colours
// ---------------------------------------------------------------------------
export const createStarfield = (scene) => {
  const THREE = _THREE;
  const COUNT = 12000;
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const palette = [
    [1.0, 0.95, 0.88], [1.0, 0.82, 0.68], [0.82, 0.88, 1.0],
    [1, 1, 1], [1, 0.68, 0.58], [0.92, 0.98, 1],
  ];
  for (let i = 0; i < COUNT; i++) {
    const r = 800 + Math.random() * 700;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
    pos[i * 3 + 2] = r * Math.cos(p);
    const c = palette[Math.floor(Math.random() * palette.length)];
    col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    sizes[i] = Math.random() < 0.02 ? 3.5 : Math.random() < 0.1 ? 2.2 : 1.0;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uOpacity: { value: 0.0 } },
    vertexShader: `
      attribute float aSize;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (400.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        if (d > 1.0) discard;
        float a = smoothstep(1.0, 0.0, d);
        gl_FragColor = vec4(vColor, a * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const stars = new THREE.Points(geo, mat);
  scene.add(stars);
  return stars;
};

// ---------------------------------------------------------------------------
// NEBULA DUST CLOUDS — 4 additive-blended low-poly spheres
// ---------------------------------------------------------------------------
function createNebulaClouds(scene, THREE) {
  const configs = [
    { color: 0x2244aa, x: 600, y: 200, z: -800, s: 180, o: 0.05 },
    { color: 0x883366, x: -700, y: -150, z: -600, s: 140, o: 0.045 },
    { color: 0x225588, x: 200, y: 400, z: -900, s: 200, o: 0.04 },
    { color: 0x441166, x: -400, y: 300, z: 700, s: 160, o: 0.045 },
  ];
  configs.forEach(cfg => {
    const geo = new THREE.SphereGeometry(cfg.s, 6, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: cfg.color, transparent: true, opacity: cfg.o,
      depthWrite: false, side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(cfg.x, cfg.y, cfg.z);
    scene.add(m);
  });
}

// ---------------------------------------------------------------------------
// PLANETS
// ---------------------------------------------------------------------------
export const createPlanets = (scene) => {
  const THREE = _THREE;
  const textures = buildTextures(THREE);
  const planetObjects = [];
  const orbitPaths = [];

  planets.forEach(p => {
    const segs = p.segments || 32;
    const geo = new THREE.SphereGeometry(p.size, segs, segs);
    let mat;

    if (p.isSun) {
      mat = new THREE.MeshStandardMaterial({
        color: p.color, emissive: p.emissive,
        emissiveIntensity: p.emissiveIntensity,
        roughness: 1, metalness: 0,
      });
    } else {
      const tex = textures[p.textureType];
      mat = new THREE.MeshPhysicalMaterial({
        map: tex,
        roughness: p.name === 'Earth' ? 0.65 : p.name === 'Jupiter' || p.name === 'Saturn' ? 0.55 : 0.88,
        metalness: p.name === 'Mercury' ? 0.12 : 0.0,
        clearcoat: p.name === 'Earth' ? 0.15 : 0,
        clearcoatRoughness: 0.8,
      });
    }

    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = p.name;
    if (p.tilt) mesh.rotation.z = p.tilt;
    mesh.castShadow = true;
    mesh.receiveShadow = !p.isSun;

    // Orbit path
    if (p.orbitRadius > 0) {
      const startAngle = Math.random() * Math.PI * 2;
      mesh.position.set(
        Math.cos(startAngle) * p.orbitRadius, 0,
        Math.sin(startAngle) * p.orbitRadius
      );
      const pts = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * p.orbitRadius, 0, Math.sin(a) * p.orbitRadius));
      }
      const oGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const oMat = new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.22 });
      const orbit = new THREE.Line(oGeo, oMat);
      orbit.userData.isOrbit = true;
      scene.add(orbit);
      orbitPaths.push(orbit);
    }

    // Atmosphere
    if (p.hasAtmosphere) {
      const aGeo = new THREE.SphereGeometry(p.size * 1.055, 24, 24);
      const aMat = new THREE.MeshPhongMaterial({
        color: p.atmosphereColor, transparent: true, opacity: p.atmosphereOpacity,
        side: THREE.FrontSide, depthWrite: false,
      });
      mesh.add(new THREE.Mesh(aGeo, aMat));
    }

    // Earth clouds
    if (p.name === 'Earth') {
      const cTex = makeTex(THREE, 'earthClouds', (ctx, S) => {
        for (let i = 0; i < 55; i++) {
          const x = Math.random() * S, y = Math.random() * S;
          const w = 20 + Math.random() * 90, h = 4 + Math.random() * 16;
          ctx.fillStyle = `rgba(255,255,255,${0.08 + Math.random() * 0.22})`;
          ctx.beginPath(); ctx.ellipse(x, y, w, h, Math.random() * 0.5, 0, Math.PI * 2); ctx.fill();
        }
      });
      const cGeo = new THREE.SphereGeometry(p.size * 1.012, 32, 32);
      const cMat = new THREE.MeshPhongMaterial({ map: cTex, transparent: true, opacity: 0.5, depthWrite: false });
      const clouds = new THREE.Mesh(cGeo, cMat);
      clouds.userData.isCloudLayer = true;
      mesh.add(clouds);
    }

    // Venus haze
    if (p.name === 'Venus') {
      const vGeo = new THREE.SphereGeometry(p.size * 1.02, 24, 24);
      const vMat = new THREE.MeshPhongMaterial({ color: 0xF0D890, transparent: true, opacity: 0.38, depthWrite: false });
      mesh.add(new THREE.Mesh(vGeo, vMat));
    }

    // Rings
    if (p.hasRing) {
      if (p.name === 'Saturn') {
        const rGeo = new THREE.RingGeometry(p.ringInner, p.ringOuter, 96);
        const pos2 = rGeo.attributes.position;
        const uv = rGeo.attributes.uv;
        for (let i = 0; i < pos2.count; i++) {
          const vx = pos2.getX(i), vz = pos2.getZ(i);
          const dist = Math.sqrt(vx * vx + vz * vz);
          uv.setXY(i, (dist - p.ringInner) / (p.ringOuter - p.ringInner), 0.5);
        }
        uv.needsUpdate = true;
        const rMat = new THREE.MeshBasicMaterial({
          map: createRingTexture(THREE),
          side: THREE.DoubleSide, transparent: true, depthWrite: false,
        });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = Math.PI / 2 - (p.tilt || 0);
        mesh.add(ring);
      } else {
        const rGeo = new THREE.RingGeometry(p.ringInner, p.ringOuter, 48);
        const rMat = new THREE.MeshBasicMaterial({
          color: p.ringColor || 0x9EEEFF, side: THREE.DoubleSide,
          transparent: true, opacity: p.ringOpacity || 0.3, depthWrite: false,
        });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = Math.PI / 2 - (p.tilt || 0);
        mesh.add(ring);
      }
    }

    // Earth moon
    if (p.hasMoon) {
      const mTex = makeTex(THREE, 'moon', (ctx, S) => {
        ctx.fillStyle = '#9a9a9a'; ctx.fillRect(0, 0, S, S);
        for (let i = 0; i < 55; i++) {
          const x = Math.random() * S, y = Math.random() * S, r = 1 + Math.random() * 4;
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(60,60,60,${0.3 + Math.random() * 0.5})`; ctx.fill();
        }
      });
      const mGeo = new THREE.SphereGeometry(1.6, 20, 20);
      const mMat = new THREE.MeshPhysicalMaterial({ map: mTex, roughness: 0.95 });
      const moon = new THREE.Mesh(mGeo, mMat);
      moon.userData.moonAngle = Math.random() * Math.PI * 2;
      moon.userData.moonRadius = p.size * 2.2;
      moon.userData.moonSpeed = 0.08;
      mesh.add(moon);
    }

    // Sun: corona sprite + point light (NO UnrealBloomPass — AdditiveBlending does the work)
    if (p.isSun) {
      const glowTex = createSunGlowTexture(THREE);
      // Outer corona
      const sSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, color: 0xFF8800,
        transparent: true, blending: THREE.AdditiveBlending,
        depthWrite: false, opacity: 0.60,
      }));
      sSprite.scale.set(p.size * 6.5, p.size * 6.5, 1);
      mesh.add(sSprite);
      // Inner hot core
      const coreSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, color: 0xFFFFCC,
        transparent: true, blending: THREE.AdditiveBlending,
        depthWrite: false, opacity: 0.38,
      }));
      coreSprite.scale.set(p.size * 2.5, p.size * 2.5, 1);
      mesh.add(coreSprite);
      // Point light
      const sunLight = new THREE.PointLight(0xFFF4E0, 4.0, 2000, 1.2);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = sunLight.shadow.mapSize.height = 512;
      mesh.add(sunLight);
    }

    scene.add(mesh);
    planetObjects.push({
      mesh,
      orbitSpeed: p.orbitSpeed,
      rotationSpeed: p.rotationSpeed,
      orbitRadius: p.orbitRadius,
      startAngle: p.orbitRadius > 0 ? Math.atan2(mesh.position.z, mesh.position.x) : 0,
    });
  });

  return { planetObjects, orbitPaths };
};

// ---------------------------------------------------------------------------
// ASTEROID BELT — single InstancedMesh (1 draw call)
// ---------------------------------------------------------------------------
export const createAsteroidBelt = (scene) => {
  const THREE = _THREE;
  const COUNT = 400;
  const INNER = 215, OUTER = 252;

  // Shared low-poly geometry + material
  const geo = new THREE.IcosahedronGeometry(0.7, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0x888070, roughness: 0.92, metalness: 0.06 });
  const iMesh = new THREE.InstancedMesh(geo, mat, COUNT);
  iMesh.castShadow = false;
  iMesh.receiveShadow = false;
  iMesh.userData.asteroidData = [];

  const dummy = new THREE.Object3D();
  for (let i = 0; i < COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = INNER + Math.random() * (OUTER - INNER);
    const yOff = (Math.random() - 0.5) * 8;
    const scale = 0.3 + Math.random() * 0.9;

    dummy.position.set(Math.cos(angle) * radius, yOff, Math.sin(angle) * radius);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    iMesh.setMatrixAt(i, dummy.matrix);

    iMesh.userData.asteroidData.push({
      angle, radius,
      orbitSpeed: 0.00025 + Math.random() * 0.00025,
      yOff,
      scale,
    });
  }
  iMesh.instanceMatrix.needsUpdate = true;
  scene.add(iMesh);
  return iMesh;
};

// ---------------------------------------------------------------------------
// UPDATE — planets, moon, clouds
// ---------------------------------------------------------------------------
export const updatePlanets = (planetObjects, time, autoRotate) => {
  planetObjects.forEach(p => {
    if (p.orbitRadius > 0) {
      const a = p.startAngle + time * p.orbitSpeed;
      p.mesh.position.x = Math.cos(a) * p.orbitRadius;
      p.mesh.position.z = Math.sin(a) * p.orbitRadius;
    }
    if (autoRotate) p.mesh.rotation.y += p.rotationSpeed;
    p.mesh.children.forEach(child => {
      if (child.userData?.isCloudLayer) child.rotation.y += 0.00025;
      if (child.userData?.moonRadius !== undefined) {
        child.userData.moonAngle += child.userData.moonSpeed * 0.016;
        child.position.x = Math.cos(child.userData.moonAngle) * child.userData.moonRadius;
        child.position.z = Math.sin(child.userData.moonAngle) * child.userData.moonRadius;
      }
    });
  });
};

// ---------------------------------------------------------------------------
// UPDATE — asteroid belt (InstancedMesh)
// ---------------------------------------------------------------------------
export const updateAsteroidBelt = (iMesh) => {
  if (!iMesh) return;
  const THREE = _THREE;
  const dummy = new THREE.Object3D();
  const data = iMesh.userData.asteroidData;
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    d.angle += d.orbitSpeed;
    dummy.position.set(
      Math.cos(d.angle) * d.radius,
      d.yOff,
      Math.sin(d.angle) * d.radius
    );
    dummy.rotation.y += 0.008;
    dummy.scale.setScalar(d.scale);
    dummy.updateMatrix();
    iMesh.setMatrixAt(i, dummy.matrix);
  }
  iMesh.instanceMatrix.needsUpdate = true;
};

// ---------------------------------------------------------------------------
// INIT — no EffectComposer, no post-processing
// ---------------------------------------------------------------------------
export const initThreeJS = async (mount, { onReady } = {}) => {
  await loadThree();
  const THREE = _THREE;
  const gpuTier = getGpuTier();

  const scene = new THREE.Scene();
  const w = mount.clientWidth, h = mount.clientHeight;

  const camera = new THREE.PerspectiveCamera(58, w / h, 0.1, 6000);
  camera.position.set(0, 140, 360);

  const renderer = new THREE.WebGLRenderer({
    antialias: gpuTier !== 'low',
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,          // not needed, saves VRAM
  });
  renderer.setSize(w, h);
  // Cap DPR at 1.5 — biggest perf win on Retina displays
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, gpuTier === 'low' ? 1.0 : 1.5));
  renderer.shadowMap.enabled = gpuTier !== 'low';
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  mount.appendChild(renderer.domElement);

  // Background
  createMilkyWay(scene, THREE);
  if (gpuTier !== 'low') createNebulaClouds(scene, THREE);

  // Controls
  const controls = new _OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.055;
  controls.minDistance = 55;
  controls.maxDistance = 950;
  controls.autoRotate = false;
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI * 0.78;

  // Lighting
  scene.add(new THREE.AmbientLight(0x111122, 0.5));

  // Signal ready so Hero can fade in content
  if (typeof onReady === 'function') {
    // Allow one rAF so canvas is actually painted
    requestAnimationFrame(() => onReady());
  }

  return { scene, camera, renderer, controls };
};

export const animateCameraTo = (camera, targetPosition, duration = 1000) => {
  const THREE = _THREE;
  const start = camera.position.clone();
  const startTime = Date.now();
  const tick = () => {
    const t = Math.min((Date.now() - startTime) / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    camera.position.lerpVectors(
      start,
      new THREE.Vector3(targetPosition.x, targetPosition.y + 150, targetPosition.z + 300),
      ease
    );
    if (t < 1) requestAnimationFrame(tick);
  };
  tick();
};
