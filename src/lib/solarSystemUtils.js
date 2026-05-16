// solarSystemUtils.js — Photorealistic Three.js Solar System
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
    rotationSpeed: 0.003, tilt: 0.034,
    textureType: 'mercury',
  },
  {
    name: 'Venus', size: 5.2, orbitRadius: 90, orbitSpeed: 1.17,
    rotationSpeed: 0.0007, tilt: 177.4 * (Math.PI / 180),
    textureType: 'venus', hasAtmosphere: true, atmosphereColor: 0xE8C56D, atmosphereOpacity: 0.35,
  },
  {
    name: 'Earth', size: 6.2, orbitRadius: 130, orbitSpeed: 1.0,
    rotationSpeed: 0.02, tilt: 23.5 * (Math.PI / 180),
    textureType: 'earth', hasAtmosphere: true, atmosphereColor: 0x4FC3F7, atmosphereOpacity: 0.18,
    hasMoon: true,
  },
  {
    name: 'Mars', size: 3.3, orbitRadius: 190, orbitSpeed: 0.8,
    rotationSpeed: 0.018, tilt: 25.2 * (Math.PI / 180),
    textureType: 'mars', hasAtmosphere: true, atmosphereColor: 0xFF8C69, atmosphereOpacity: 0.10,
  },
  {
    name: 'Jupiter', size: 20, orbitRadius: 260, orbitSpeed: 0.43,
    rotationSpeed: 0.04, tilt: 3.1 * (Math.PI / 180),
    textureType: 'jupiter',
  },
  {
    name: 'Saturn', size: 17, orbitRadius: 340, orbitSpeed: 0.32,
    rotationSpeed: 0.038, tilt: 26.7 * (Math.PI / 180),
    textureType: 'saturn',
    hasRing: true, ringInner: 21, ringOuter: 36,
  },
  {
    name: 'Uranus', size: 8, orbitRadius: 415, orbitSpeed: 0.23,
    rotationSpeed: 0.03, tilt: 97.8 * (Math.PI / 180),
    textureType: 'uranus',
    hasRing: true, ringInner: 10, ringOuter: 13, ringColor: 0x9EEEFF, ringOpacity: 0.3,
  },
  {
    name: 'Neptune', size: 7.8, orbitRadius: 490, orbitSpeed: 0.18,
    rotationSpeed: 0.031, tilt: 28.3 * (Math.PI / 180),
    textureType: 'neptune', hasAtmosphere: true, atmosphereColor: 0x3F54BA, atmosphereOpacity: 0.15,
  },
];

// ---------------------------------------------------------------------------
// PROCEDURAL TEXTURES
// ---------------------------------------------------------------------------
function makeTex(THREE, draw) {
  const S = 512, C = document.createElement('canvas');
  C.width = C.height = S;
  draw(C.getContext('2d'), S);
  return new THREE.CanvasTexture(C);
}

const buildTextures = (THREE) => ({
  mercury: makeTex(THREE, (ctx, S) => {
    const g = ctx.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);
    g.addColorStop(0,'#c0b090'); g.addColorStop(0.5,'#9a8878'); g.addColorStop(1,'#7a6858');
    ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
    for(let i=0;i<120;i++){
      const x=Math.random()*S,y=Math.random()*S,r=1+Math.random()*6;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=`rgba(50,40,30,${0.3+Math.random()*0.5})`; ctx.fill();
      ctx.beginPath(); ctx.arc(x-r*0.3,y-r*0.3,r*1.1,0,Math.PI*2);
      ctx.strokeStyle='rgba(200,180,150,0.3)'; ctx.lineWidth=0.5; ctx.stroke();
    }
  }),
  venus: makeTex(THREE, (ctx, S) => {
    const g = ctx.createLinearGradient(0,0,S,S);
    g.addColorStop(0,'#e8c060'); g.addColorStop(0.3,'#d4a840'); g.addColorStop(0.6,'#c89830'); g.addColorStop(1,'#b88820');
    ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
    for(let i=0;i<40;i++){
      const y=Math.random()*S, h=4+Math.random()*16;
      ctx.fillStyle=`rgba(210,160,40,${0.3+Math.random()*0.4})`;
      ctx.fillRect(0,y,S,h);
    }
  }),
  earth: makeTex(THREE, (ctx, S) => {
    ctx.fillStyle='#1565c0'; ctx.fillRect(0,0,S,S);
    const land=[
      {x:0.15,y:0.2,w:0.18,h:0.35,c:'#2e7d32'},
      {x:0.35,y:0.15,w:0.22,h:0.40,c:'#388e3c'},
      {x:0.55,y:0.22,w:0.16,h:0.28,c:'#33691e'},
      {x:0.60,y:0.55,w:0.22,h:0.30,c:'#2e7d32'},
      {x:0.08,y:0.58,w:0.14,h:0.22,c:'#1b5e20'},
    ];
    land.forEach(l=>{
      ctx.fillStyle=l.c;
      ctx.beginPath();
      ctx.ellipse(l.x*S,l.y*S,l.w*S*0.5,l.h*S*0.5,Math.random(),0,Math.PI*2);
      ctx.fill();
    });
    ctx.fillStyle='rgba(255,255,255,0.7)';
    ctx.fillRect(0,0,S,20); ctx.fillRect(0,S-20,S,20);
    for(let i=0;i<18;i++){
      const y=8+Math.random()*(S-16), h=6+Math.random()*14;
      ctx.fillStyle=`rgba(255,255,255,${0.15+Math.random()*0.2})`;
      ctx.fillRect(Math.random()*S*0.6+S*0.2, y, 40+Math.random()*120, h);
    }
  }),
  mars: makeTex(THREE, (ctx, S) => {
    const g=ctx.createRadialGradient(S*0.4,S*0.4,0,S/2,S/2,S/2);
    g.addColorStop(0,'#d4480a'); g.addColorStop(0.4,'#b83a08'); g.addColorStop(1,'#8b2200');
    ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
    for(let i=0;i<80;i++){
      const x=Math.random()*S,y=Math.random()*S,r=2+Math.random()*8;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle=`rgba(80,20,0,${0.2+Math.random()*0.4})`; ctx.fill();
    }
    ctx.fillStyle='rgba(230,220,200,0.6)';
    ctx.beginPath(); ctx.ellipse(S*0.5,S*0.05,S*0.25,S*0.06,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S*0.5,S*0.95,S*0.20,S*0.05,0,0,Math.PI*2); ctx.fill();
  }),
  jupiter: makeTex(THREE, (ctx, S) => {
    const bands=[
      '#c8a060','#b8906a','#d4b080','#a07040','#c89070',
      '#b88060','#d0a870','#a86830','#c89050','#e0c090',
    ];
    const bh=S/bands.length;
    bands.forEach((c,i)=>{ ctx.fillStyle=c; ctx.fillRect(0,i*bh,S,bh+1); });
    ctx.fillStyle='rgba(200,120,80,0.55)';
    ctx.beginPath(); ctx.ellipse(S*0.35,S*0.62,S*0.09,S*0.05,0.1,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(240,180,120,0.3)';
    ctx.beginPath(); ctx.ellipse(S*0.35,S*0.62,S*0.11,S*0.065,-0.1,0,Math.PI*2); ctx.stroke();
    for(let i=0;i<8;i++){
      const y=(i+0.5)*bh;
      ctx.strokeStyle=`rgba(100,60,20,${0.15+Math.random()*0.25})`;
      ctx.lineWidth=1+Math.random()*2;
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(S,y); ctx.stroke();
    }
  }),
  saturn: makeTex(THREE, (ctx, S) => {
    const bands=['#e8d8a8','#d4c090','#e0cc98','#c8b078','#dcc888','#c4a870'];
    const bh=S/bands.length;
    bands.forEach((c,i)=>{ ctx.fillStyle=c; ctx.fillRect(0,i*bh,S,bh+1); });
    for(let i=0;i<6;i++){
      const y=(i+0.5)*bh;
      ctx.strokeStyle='rgba(150,110,50,0.2)';
      ctx.lineWidth=Math.random()*3;
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(S,y); ctx.stroke();
    }
  }),
  uranus: makeTex(THREE, (ctx, S) => {
    const g=ctx.createLinearGradient(0,0,0,S);
    g.addColorStop(0,'#72e8e8'); g.addColorStop(0.5,'#5cd4d4'); g.addColorStop(1,'#44c0c0');
    ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
    for(let i=0;i<10;i++){
      const y=Math.random()*S, h=4+Math.random()*10;
      ctx.fillStyle=`rgba(100,220,220,${0.1+Math.random()*0.15})`;
      ctx.fillRect(0,y,S,h);
    }
  }),
  neptune: makeTex(THREE, (ctx, S) => {
    const g=ctx.createRadialGradient(S*0.45,S*0.4,0,S/2,S/2,S/2);
    g.addColorStop(0,'#4060e0'); g.addColorStop(0.4,'#3050c8'); g.addColorStop(1,'#1828a0');
    ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
    ctx.fillStyle='rgba(160,180,255,0.35)';
    ctx.beginPath(); ctx.ellipse(S*0.55,S*0.45,S*0.12,S*0.07,0.3,0,Math.PI*2); ctx.fill();
  }),
});

// ---------------------------------------------------------------------------
// SUN GLOW TEXTURE
// ---------------------------------------------------------------------------
function createSunGlowTexture(THREE) {
  const S=512, C=document.createElement('canvas');
  C.width=C.height=S;
  const ctx=C.getContext('2d');
  const g=ctx.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);
  g.addColorStop(0,'rgba(255,230,120,1.0)');
  g.addColorStop(0.08,'rgba(255,180,60,0.9)');
  g.addColorStop(0.25,'rgba(255,100,20,0.55)');
  g.addColorStop(0.5,'rgba(255,50,0,0.2)');
  g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
  return new THREE.CanvasTexture(C);
}

// ---------------------------------------------------------------------------
// SATURN RING TEXTURE — gradient bands, Cassini division
// ---------------------------------------------------------------------------
function createRingTexture(THREE) {
  const S=512, C=document.createElement('canvas');
  C.width=S; C.height=1;
  const ctx=C.getContext('2d');
  const g=ctx.createLinearGradient(0,0,S,0);
  g.addColorStop(0,'rgba(0,0,0,0)');
  g.addColorStop(0.05,'rgba(160,130,80,0.3)');
  g.addColorStop(0.15,'rgba(200,170,100,0.75)');
  g.addColorStop(0.3,'rgba(220,190,120,0.9)');
  g.addColorStop(0.42,'rgba(180,150,90,0.8)');
  g.addColorStop(0.5,'rgba(10,10,10,0.05)'); // Cassini division
  g.addColorStop(0.58,'rgba(200,170,110,0.75)');
  g.addColorStop(0.72,'rgba(180,150,90,0.55)');
  g.addColorStop(0.85,'rgba(140,110,70,0.3)');
  g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,S,1);
  const tex=new THREE.CanvasTexture(C);
  tex.wrapS=tex.wrapT=THREE.ClampToEdgeWrapping;
  return tex;
}

// ---------------------------------------------------------------------------
// MILKY WAY BAND
// ---------------------------------------------------------------------------
function createMilkyWay(scene, THREE) {
  const S=1024, C=document.createElement('canvas');
  C.width=S; C.height=S;
  const ctx=C.getContext('2d');
  ctx.fillStyle='#000008'; ctx.fillRect(0,0,S,S);
  for(let i=0;i<6000;i++){
    const x=Math.random()*S;
    const band=Math.abs(Math.random()-0.5)*S;
    const y=S/2+band*(Math.random()>0.5?1:-1)*0.4;
    const r=Math.random()*1.2;
    const a=Math.max(0,0.6-band/S*1.8);
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    const hue=Math.random()>0.7?'210,220,255':'255,240,200';
    ctx.fillStyle=`rgba(${hue},${a})`; ctx.fill();
  }
  const g=ctx.createLinearGradient(0,S*0.3,0,S*0.7);
  g.addColorStop(0,'rgba(0,0,0,0)');
  g.addColorStop(0.5,'rgba(60,40,80,0.08)');
  g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
  const geo=new THREE.SphereGeometry(1600,32,32);
  const mat=new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(C),
    side: THREE.BackSide,
    transparent: true, opacity: 0.85,
    depthWrite: false,
  });
  scene.add(new THREE.Mesh(geo,mat));
}

// ---------------------------------------------------------------------------
// STARFIELD — 30k stars with spectral colour
// ---------------------------------------------------------------------------
export const createStarfield = (scene) => {
  const THREE=_THREE;
  const COUNT=30000;
  const pos=new Float32Array(COUNT*3);
  const col=new Float32Array(COUNT*3);
  const sz=new Float32Array(COUNT);
  const palette=[
    [1.0,0.95,0.88],[1.0,0.82,0.68],[0.82,0.88,1.0],[1,1,1],[1,0.68,0.58],[0.92,0.98,1]
  ];
  for(let i=0;i<COUNT;i++){
    const r=800+Math.random()*700;
    const t=Math.random()*Math.PI*2;
    const p=Math.acos(2*Math.random()-1);
    pos[i*3]=r*Math.sin(p)*Math.cos(t);
    pos[i*3+1]=r*Math.sin(p)*Math.sin(t);
    pos[i*3+2]=r*Math.cos(p);
    const c=palette[Math.floor(Math.random()*palette.length)];
    col[i*3]=c[0]; col[i*3+1]=c[1]; col[i*3+2]=c[2];
    sz[i]=Math.random()<0.02?2.5:Math.random()<0.1?1.6:0.8;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const mat=new THREE.PointsMaterial({
    size:1.1, vertexColors:true, transparent:true, opacity:0.92,
    sizeAttenuation:true,
  });
  const stars=new THREE.Points(geo,mat);
  scene.add(stars);
  return stars;
};

// ---------------------------------------------------------------------------
// NEBULA DUST CLOUDS
// ---------------------------------------------------------------------------
function createNebulaClouds(scene, THREE) {
  const configs=[
    {color:0x2244aa, x:600,  y:200,  z:-800, s:180, o:0.06},
    {color:0x883366, x:-700, y:-150, z:-600, s:140, o:0.05},
    {color:0x225588, x:200,  y:400,  z:-900, s:200, o:0.04},
    {color:0x441166, x:-400, y:300,  z:700,  s:160, o:0.05},
  ];
  configs.forEach(cfg=>{
    const geo=new THREE.SphereGeometry(cfg.s,8,8);
    const mat=new THREE.MeshBasicMaterial({
      color:cfg.color, transparent:true, opacity:cfg.o,
      depthWrite:false, side:THREE.BackSide,
    });
    const m=new THREE.Mesh(geo,mat);
    m.position.set(cfg.x,cfg.y,cfg.z);
    scene.add(m);
  });
}

// ---------------------------------------------------------------------------
// PLANETS
// ---------------------------------------------------------------------------
export const createPlanets = (scene) => {
  const THREE=_THREE;
  const textures=buildTextures(THREE);
  const planetObjects=[];
  const orbitPaths=[];
  const moons=[];

  planets.forEach(p=>{
    const geo=new THREE.SphereGeometry(p.size,64,64);
    let mat;
    if(p.isSun){
      mat=new THREE.MeshStandardMaterial({
        color:p.color, emissive:p.emissive, emissiveIntensity:p.emissiveIntensity,
        roughness:1, metalness:0,
      });
    } else {
      const tex=textures[p.textureType];
      mat=new THREE.MeshPhysicalMaterial({
        map: tex,
        roughness: p.name==='Earth'?0.65:p.name==='Jupiter'||p.name==='Saturn'?0.55:0.88,
        metalness: p.name==='Mercury'?0.12:0.0,
        clearcoat: p.name==='Earth'?0.15:0,
        clearcoatRoughness: 0.8,
      });
    }
    const mesh=new THREE.Mesh(geo,mat);
    mesh.name=p.name;
    if(p.tilt) mesh.rotation.z=p.tilt;
    mesh.castShadow=true; mesh.receiveShadow=true;

    // Orbit path
    if(p.orbitRadius>0){
      const startAngle=Math.random()*Math.PI*2;
      mesh.position.set(Math.cos(startAngle)*p.orbitRadius,0,Math.sin(startAngle)*p.orbitRadius);
      const pts=[];
      for(let i=0;i<=256;i++){
        const a=(i/256)*Math.PI*2;
        pts.push(new THREE.Vector3(Math.cos(a)*p.orbitRadius,0,Math.sin(a)*p.orbitRadius));
      }
      const oGeo=new THREE.BufferGeometry().setFromPoints(pts);
      const oMat=new THREE.LineBasicMaterial({color:0x334455,transparent:true,opacity:0.2});
      const orbit=new THREE.Line(oGeo,oMat);
      orbit.userData.isOrbit=true;
      scene.add(orbit); orbitPaths.push(orbit);
    }

    // Atmosphere glow
    if(p.hasAtmosphere){
      const aGeo=new THREE.SphereGeometry(p.size*1.055,32,32);
      const aMat=new THREE.MeshPhongMaterial({
        color:p.atmosphereColor, transparent:true, opacity:p.atmosphereOpacity,
        side:THREE.FrontSide, depthWrite:false,
      });
      mesh.add(new THREE.Mesh(aGeo,aMat));
    }

    // Earth cloud layer
    if(p.name==='Earth'){
      const cTex=makeTex(THREE,(ctx,S)=>{
        for(let i=0;i<60;i++){
          const x=Math.random()*S, y=Math.random()*S;
          const w=20+Math.random()*100, h=4+Math.random()*18;
          ctx.fillStyle=`rgba(255,255,255,${0.1+Math.random()*0.25})`;
          ctx.beginPath(); ctx.ellipse(x,y,w,h,Math.random()*0.5,0,Math.PI*2); ctx.fill();
        }
      });
      const cGeo=new THREE.SphereGeometry(p.size*1.012,48,48);
      const cMat=new THREE.MeshPhongMaterial({
        map:cTex, transparent:true, opacity:0.55, depthWrite:false,
      });
      const clouds=new THREE.Mesh(cGeo,cMat);
      clouds.userData.isCloudLayer=true;
      mesh.add(clouds);
    }

    // Venus cloud layer
    if(p.name==='Venus'){
      const vGeo=new THREE.SphereGeometry(p.size*1.02,32,32);
      const vMat=new THREE.MeshPhongMaterial({
        color:0xF0D890, transparent:true, opacity:0.4, depthWrite:false,
      });
      mesh.add(new THREE.Mesh(vGeo,vMat));
    }

    // Rings — Saturn gradient, Uranus thin
    if(p.hasRing){
      if(p.name==='Saturn'){
        const rGeo=new THREE.RingGeometry(p.ringInner,p.ringOuter,128);
        // Remap UVs for linear gradient along radius
        const pos2=rGeo.attributes.position;
        const uv=rGeo.attributes.uv;
        for(let i=0;i<pos2.count;i++){
          const vx=pos2.getX(i), vz=pos2.getZ(i);
          const dist=Math.sqrt(vx*vx+vz*vz);
          const u=(dist-p.ringInner)/(p.ringOuter-p.ringInner);
          uv.setXY(i,u,0.5);
        }
        rGeo.attributes.uv.needsUpdate=true;
        const rMat=new THREE.MeshBasicMaterial({
          map:createRingTexture(THREE),
          side:THREE.DoubleSide, transparent:true, depthWrite:false,
        });
        const ring=new THREE.Mesh(rGeo,rMat);
        ring.rotation.x=Math.PI/2-(p.tilt||0);
        mesh.add(ring);
      } else {
        const rGeo=new THREE.RingGeometry(p.ringInner,p.ringOuter,64);
        const rMat=new THREE.MeshBasicMaterial({
          color:p.ringColor||0x9EEEFF, side:THREE.DoubleSide,
          transparent:true, opacity:p.ringOpacity||0.3, depthWrite:false,
        });
        const ring=new THREE.Mesh(rGeo,rMat);
        ring.rotation.x=Math.PI/2-(p.tilt||0);
        mesh.add(ring);
      }
    }

    // Moon for Earth
    if(p.hasMoon){
      const mGeo=new THREE.SphereGeometry(1.6,32,32);
      const mTex=makeTex(THREE,(ctx,S)=>{
        ctx.fillStyle='#9a9a9a'; ctx.fillRect(0,0,S,S);
        for(let i=0;i<60;i++){
          const x=Math.random()*S,y=Math.random()*S,r=1+Math.random()*5;
          ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
          ctx.fillStyle=`rgba(60,60,60,${0.3+Math.random()*0.5})`; ctx.fill();
        }
      });
      const mMat=new THREE.MeshPhysicalMaterial({map:mTex,roughness:0.95});
      const moon=new THREE.Mesh(mGeo,mMat);
      moon.userData.moonAngle=Math.random()*Math.PI*2;
      moon.userData.moonRadius=p.size*2.2;
      moon.userData.moonSpeed=0.08;
      mesh.add(moon);
      moons.push(moon);
    }

    // Sun corona glow + point light + lens flare
    if(p.isSun){
      const sSprite=new THREE.Sprite(new THREE.SpriteMaterial({
        map:createSunGlowTexture(THREE),
        color:0xFF8800, transparent:true,
        blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.65,
      }));
      sSprite.scale.set(p.size*6.5,p.size*6.5,1);
      mesh.add(sSprite);
      // Inner hot core sprite
      const coreSprite=new THREE.Sprite(new THREE.SpriteMaterial({
        map:createSunGlowTexture(THREE),
        color:0xFFFFCC, transparent:true,
        blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.4,
      }));
      coreSprite.scale.set(p.size*2.5,p.size*2.5,1);
      mesh.add(coreSprite);
      const sunLight=new THREE.PointLight(0xFFF4E0,4.0,2000,1.2);
      sunLight.castShadow=true;
      sunLight.shadow.mapSize.width=sunLight.shadow.mapSize.height=1024;
      mesh.add(sunLight);
    }

    scene.add(mesh);
    planetObjects.push({
      mesh, orbitSpeed:p.orbitSpeed, rotationSpeed:p.rotationSpeed,
      orbitRadius:p.orbitRadius,
      startAngle:p.orbitRadius>0?Math.atan2(mesh.position.z,mesh.position.x):0,
    });
  });

  return {planetObjects, orbitPaths, moons};
};

// ---------------------------------------------------------------------------
// ASTEROID BELT
// ---------------------------------------------------------------------------
export const createAsteroidBelt = (scene) => {
  const THREE=_THREE;
  const group=new THREE.Group();
  const INNER=215, OUTER=252;
  for(let i=0;i<600;i++){
    const size=0.25+Math.random()*1.0;
    const geo=i%3===0
      ? new THREE.DodecahedronGeometry(size,0)
      : new THREE.IcosahedronGeometry(size,0);
    const mat=new THREE.MeshStandardMaterial({
      color:new THREE.Color().setHSL(0.06+Math.random()*0.04,0.2+Math.random()*0.15,0.25+Math.random()*0.25),
      roughness:0.95, metalness:0.05+Math.random()*0.1,
    });
    const mesh=new THREE.Mesh(geo,mat);
    const angle=Math.random()*Math.PI*2;
    const radius=INNER+Math.random()*(OUTER-INNER);
    const yOff=(Math.random()-0.5)*10;
    mesh.position.set(Math.cos(angle)*radius,yOff,Math.sin(angle)*radius);
    mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);
    mesh.userData.angle=angle; mesh.userData.radius=radius;
    mesh.userData.orbitSpeed=0.0003+Math.random()*0.0003;
    mesh.userData.rotAxis=new THREE.Vector3(Math.random(),Math.random(),Math.random()).normalize();
    group.add(mesh);
  }
  scene.add(group); return group;
};

// ---------------------------------------------------------------------------
// UPDATES
// ---------------------------------------------------------------------------
export const updatePlanets = (planetObjects, time, autoRotate) => {
  planetObjects.forEach(p=>{
    if(p.orbitRadius>0){
      const a=p.startAngle+time*p.orbitSpeed;
      p.mesh.position.x=Math.cos(a)*p.orbitRadius;
      p.mesh.position.z=Math.sin(a)*p.orbitRadius;
    }
    if(autoRotate) p.mesh.rotation.y+=p.rotationSpeed;
    // Rotate cloud layers
    p.mesh.children.forEach(child=>{
      if(child.userData?.isCloudLayer) child.rotation.y+=0.0003;
    });
    // Animate moon
    p.mesh.children.forEach(child=>{
      if(child.userData?.moonRadius!==undefined){
        child.userData.moonAngle+=child.userData.moonSpeed*0.016;
        child.position.x=Math.cos(child.userData.moonAngle)*child.userData.moonRadius;
        child.position.z=Math.sin(child.userData.moonAngle)*child.userData.moonRadius;
      }
    });
  });
};

export const updateAsteroidBelt = (belt) => {
  if(!belt) return;
  belt.children.forEach(rock=>{
    rock.userData.angle+=rock.userData.orbitSpeed;
    rock.position.x=Math.cos(rock.userData.angle)*rock.userData.radius;
    rock.position.z=Math.sin(rock.userData.angle)*rock.userData.radius;
    rock.rotateOnAxis(rock.userData.rotAxis,0.006);
  });
};

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------
export const initThreeJS = async (mount) => {
  await loadThree();
  const THREE=_THREE;

  const scene=new THREE.Scene();
  const w=mount.clientWidth, h=mount.clientHeight;

  const camera=new THREE.PerspectiveCamera(58,w/h,0.1,6000);
  camera.position.set(0,140,360);

  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setSize(w,h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.15;
  mount.appendChild(renderer.domElement);

  // Milky Way background
  createMilkyWay(scene,THREE);
  // Nebula dust
  createNebulaClouds(scene,THREE);

  // Bloom
  const renderScene=new _RenderPass(scene,camera);
  const bloomPass=new _UnrealBloomPass(new THREE.Vector2(w,h),1.1,0.55,0.78);
  const composer=new _EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // Controls
  const controls=new _OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true; controls.dampingFactor=0.055;
  controls.minDistance=55; controls.maxDistance=950;
  controls.autoRotate=false; controls.enablePan=false;
  controls.maxPolarAngle=Math.PI*0.78;

  // Lighting
  scene.add(new THREE.AmbientLight(0x111122,0.5));

  return {scene,camera,renderer,composer,controls};
};

export const animateCameraTo=(camera,targetPosition,duration=1000)=>{
  const THREE=_THREE;
  const start=camera.position.clone(), startTime=Date.now();
  const tick=()=>{
    const t=Math.min((Date.now()-startTime)/duration,1);
    const ease=t<0.5?2*t*t:-1+(4-2*t)*t;
    camera.position.lerpVectors(start,new THREE.Vector3(targetPosition.x,targetPosition.y+150,targetPosition.z+300),ease);
    if(t<1) requestAnimationFrame(tick);
  };
  tick();
};
