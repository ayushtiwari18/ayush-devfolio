/**
 * planetProjects.js — Planet → Project data config
 *
 * Single source of truth that maps every planet in the solar system
 * scene to a real project. SolarSystem.js reads this to render the
 * interactive info panel when a user clicks a planet.
 *
 * Rules:
 *  - No imports from Three.js or any heavy lib — pure data only.
 *  - Colors must match the planet mesh color used in solarSystemUtils.js.
 *  - `slug` must match the Supabase `projects.slug` column exactly.
 *  - `orbitIndex` is 0-based, in order from Sun outward (Mercury = 0).
 *  - Keep `stats` to max 3 items — panel space is limited.
 *  - `links.live` and `links.github` can be null if not public.
 */

// ---------------------------------------------------------------------------
// TYPE REFERENCE (JSDoc — no TypeScript needed in this codebase)
// ---------------------------------------------------------------------------
/**
 * @typedef {Object} PlanetProject
 * @property {string}   planetName   - Display name of the planet
 * @property {number}   orbitIndex   - 0-based orbit order from the Sun
 * @property {string}   color        - Hex color matching the Three.js mesh
 * @property {string}   glowColor    - Hex for the panel accent / glow ring
 * @property {string}   size         - 'sm' | 'md' | 'lg' | 'xl' — relative to scene
 * @property {Object}   project      - The project data shown in the panel
 * @property {string}   project.title
 * @property {string}   project.slug          - Supabase slug (or null for external)
 * @property {string}   project.tagline       - One-line recruiter hook (≤ 80 chars)
 * @property {string}   project.description   - 2–3 sentence case-study summary
 * @property {string}   project.category      - e.g. 'Full Stack', 'Security', 'AI/ML'
 * @property {string[]} project.tech          - Top 4–6 technologies used
 * @property {Object}   project.stats         - Max 3 key metrics
 * @property {Object}   project.links
 * @property {string|null} project.links.github
 * @property {string|null} project.links.live
 */

// ---------------------------------------------------------------------------
// SUN — profile anchor (not a project, but a clickable node)
// ---------------------------------------------------------------------------
export const SUN_NODE = {
  planetName: 'Sun',
  type: 'profile',
  color: '#FDB813',
  glowColor: '#FF6B00',
  project: {
    title: 'Ayush Tiwari',
    slug: null,
    tagline: 'Full Stack Developer · Springer-published Researcher · AWS Certified',
    description:
      'Building production-grade web systems with MERN Stack, Next.js, Three.js, and AWS. Research on network security published in Springer. 5,600+ GitHub commits across 10+ deployed projects.',
    category: 'Profile',
    tech: ['React', 'Next.js', 'Node.js', 'AWS', 'Three.js', 'MongoDB'],
    stats: {
      commits: '5,600+',
      dsa: '885+ DSA',
      papers: '1 Springer Paper',
    },
    links: {
      github: 'https://github.com/ayushtiwari18',
      live: '/about',
    },
  },
};

// ---------------------------------------------------------------------------
// PLANETS — ordered Mercury (0) → Neptune (7)
// ---------------------------------------------------------------------------

/**
 * Mercury — Marine Minds
 * Closest to the Sun, small but fast. Marine Minds is a focused,
 * technically deep project — perfect Mercury energy.
 */
const MERCURY = {
  planetName: 'Mercury',
  orbitIndex: 0,
  color: '#B5B5B5',
  glowColor: '#00C9FF',
  size: 'sm',
  project: {
    title: 'Marine Minds',
    slug: 'marine-minds',
    tagline: 'AI-powered ocean health monitoring platform with real-time sensor data',
    description:
      'A full-stack IoT + AI platform that aggregates real-time ocean sensor data, runs ML inference for anomaly detection, and surfaces actionable insights through an interactive dashboard. Built for scale — handles concurrent WebSocket streams from distributed sensor nodes.',
    category: 'Full Stack · IoT · AI/ML',
    tech: ['Next.js', 'Node.js', 'WebSockets', 'MongoDB', 'Python', 'AWS'],
    stats: {
      sensors: 'Real-time IoT',
      stack: 'Full Stack + AI',
      deployment: 'AWS Deployed',
    },
    links: {
      github: 'https://github.com/ayushtiwari18/marine-minds',
      live: null,
    },
  },
};

/**
 * Venus — GameON
 * Venus is bright, high-energy, highly visible. GameON is the most
 * visually striking real-time multiplayer project.
 */
const VENUS = {
  planetName: 'Venus',
  orbitIndex: 1,
  color: '#E8C47A',
  glowColor: '#FFB347',
  size: 'sm',
  project: {
    title: 'GameON',
    slug: 'gameon',
    tagline: 'Real-time multiplayer gaming platform with live matchmaking and leaderboards',
    description:
      'A production-grade multiplayer gaming platform built with Socket.io for real-time game state sync, JWT-based auth, and Redis-backed session management. Supports concurrent rooms, live leaderboards, and sub-100ms game state updates.',
    category: 'Full Stack · Real-time · Gaming',
    tech: ['React', 'Node.js', 'Socket.io', 'Redis', 'MongoDB', 'JWT'],
    stats: {
      latency: '<100ms updates',
      arch: 'WebSocket rooms',
      auth: 'JWT + Redis',
    },
    links: {
      github: 'https://github.com/ayushtiwari18/GameON',
      live: null,
    },
  },
};

/**
 * Earth — Devfolio (this portfolio)
 * Earth = home. This portfolio IS the home base.
 */
const EARTH = {
  planetName: 'Earth',
  orbitIndex: 2,
  color: '#4B9CD3',
  glowColor: '#00FF88',
  size: 'md',
  project: {
    title: 'Ayush Devfolio',
    slug: 'ayush-devfolio',
    tagline: 'Production-grade developer portfolio — Next.js 15, Supabase, Three.js',
    description:
      'This portfolio — built with Next.js 15 App Router, Supabase PostgreSQL, and Three.js. Features ISR, dynamic metadata, JSON-LD structured data, sitemap, and a custom solar system animation. Engineered for Lighthouse > 90 and recruiter-first UX.',
    category: 'Full Stack · Portfolio · SEO',
    tech: ['Next.js 15', 'Supabase', 'Three.js', 'Tailwind CSS', 'Vercel'],
    stats: {
      target: 'Lighthouse > 90',
      db: 'Supabase ISR',
      seo: 'JSON-LD + OG',
    },
    links: {
      github: 'https://github.com/ayushtiwari18/ayush-devfolio',
      live: 'https://ayush-devfolio.vercel.app',
    },
  },
};

/**
 * Mars — Sentinel WAF/IDS
 * Mars = red, aggressive, defense-oriented. Sentinel is the security
 * project — a Web Application Firewall and Intrusion Detection System.
 * This is also tied to the Springer research paper.
 */
const MARS = {
  planetName: 'Mars',
  orbitIndex: 3,
  color: '#C1440E',
  glowColor: '#FF4444',
  size: 'md',
  project: {
    title: 'Sentinel WAF/IDS',
    slug: 'sentinel-waf-ids',
    tagline: 'Production WAF + IDS — research published in Springer (2024)',
    description:
      'A custom Web Application Firewall and Intrusion Detection System built from first principles. Implements OWASP Top 10 rule sets, real-time traffic analysis, and ML-based anomaly detection. The underlying research on network security was peer-reviewed and published in a Springer-indexed journal.',
    category: 'Security · Backend · Research',
    tech: ['Node.js', 'Python', 'ML', 'Nginx', 'Docker', 'AWS EC2'],
    stats: {
      publication: 'Springer Published',
      coverage: 'OWASP Top 10',
      detection: 'ML Anomaly',
    },
    links: {
      github: 'https://github.com/ayushtiwari18/sentinel-waf',
      live: null,
    },
  },
};

/**
 * Jupiter — TaskManager Pro
 * Jupiter is the largest planet — TaskManager is the most feature-complete
 * full-stack CRUD + real-time collaboration system.
 */
const JUPITER = {
  planetName: 'Jupiter',
  orbitIndex: 4,
  color: '#C88B3A',
  glowColor: '#FF9F43',
  size: 'lg',
  project: {
    title: 'TaskManager Pro',
    slug: 'taskmanager-pro',
    tagline: 'Full-stack collaborative task manager with real-time sync and role-based access',
    description:
      'A production-ready project management tool with real-time collaboration via WebSockets, role-based access control (Admin/Member/Viewer), drag-and-drop Kanban boards, and email notification pipelines. Deployed on AWS with CI/CD via GitHub Actions.',
    category: 'Full Stack · SaaS · Real-time',
    tech: ['React', 'Express', 'MongoDB', 'Socket.io', 'AWS', 'GitHub Actions'],
    stats: {
      auth: 'RBAC 3-tier',
      deploy: 'AWS + CI/CD',
      realtime: 'WebSocket sync',
    },
    links: {
      github: 'https://github.com/ayushtiwari18/task-manager',
      live: null,
    },
  },
};

/**
 * Saturn — CodeArena
 * Saturn has rings — CodeArena has leaderboards (rings of competition).
 * Competitive programming platform with judge engine.
 */
const SATURN = {
  planetName: 'Saturn',
  orbitIndex: 5,
  color: '#E4D191',
  glowColor: '#F9CA24',
  size: 'lg',
  project: {
    title: 'CodeArena',
    slug: 'codearena',
    tagline: 'Online judge platform with live contests, custom test cases, and leaderboards',
    description:
      'A competitive programming platform with a sandboxed code execution engine, multi-language support (C++, Java, Python), real-time contest leaderboards, and a problem-set CMS. Handles concurrent submissions with a queue-based judge worker architecture.',
    category: 'Full Stack · DevTools · Backend',
    tech: ['React', 'Node.js', 'Docker', 'Redis', 'PostgreSQL', 'AWS Lambda'],
    stats: {
      languages: 'C++, Java, Python',
      arch: 'Queue + Workers',
      execution: 'Docker sandbox',
    },
    links: {
      github: 'https://github.com/ayushtiwari18/code-arena',
      live: null,
    },
  },
};

/**
 * Uranus — WeatherApp
 * Uranus is ice-blue, atmospheric. WeatherApp is the clean,
 * API-driven atmospheric data project.
 */
const URANUS = {
  planetName: 'Uranus',
  orbitIndex: 6,
  color: '#7DE8E8',
  glowColor: '#74B9FF',
  size: 'md',
  project: {
    title: 'WeatherApp',
    slug: 'weather-app',
    tagline: 'Real-time weather dashboard with forecast charts and location-based alerts',
    description:
      'A performant weather application built with Next.js and OpenWeatherMap API. Features SSR for instant LCP, geolocation-based auto-detection, 7-day forecast charts with Chart.js, and PWA support for offline access to last-known weather data.',
    category: 'Frontend · API · PWA',
    tech: ['Next.js', 'Chart.js', 'OpenWeatherMap API', 'Tailwind CSS', 'PWA'],
    stats: {
      render: 'SSR for fast LCP',
      offline: 'PWA Support',
      forecast: '7-day charts',
    },
    links: {
      github: 'https://github.com/ayushtiwari18/weather-app',
      live: null,
    },
  },
};

/**
 * Neptune — CloudDeploy CLI
 * Neptune is the farthest, deep and mysterious. CloudDeploy is the
 * DevOps/infrastructure CLI tool — deep backend work, less visible
 * but technically impressive.
 */
const NEPTUNE = {
  planetName: 'Neptune',
  orbitIndex: 7,
  color: '#3F54BA',
  glowColor: '#A29BFE',
  size: 'md',
  project: {
    title: 'CloudDeploy CLI',
    slug: 'clouddeploy-cli',
    tagline: 'CLI tool for automated AWS deployments with zero-downtime rolling updates',
    description:
      'A Node.js CLI tool that automates the full AWS deployment pipeline — EC2 provisioning, S3 asset upload, CloudFront invalidation, and health-check-gated rolling updates. Built to eliminate manual deployment steps and enforce infrastructure-as-code practices.',
    category: 'DevOps · CLI · AWS',
    tech: ['Node.js', 'AWS SDK', 'EC2', 'S3', 'CloudFront', 'GitHub Actions'],
    stats: {
      deploy: 'Zero-downtime',
      infra: 'IaC practices',
      cloud: 'AWS full stack',
    },
    links: {
      github: 'https://github.com/ayushtiwari18/clouddeploy-cli',
      live: null,
    },
  },
};

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

/**
 * Ordered array — index matches orbitIndex (Mercury first, Neptune last).
 * SolarSystem.js iterates this to assign project data to each planet mesh
 * by matching `planet.orbitIndex` or by planet name.
 */
export const PLANET_PROJECTS = [
  MERCURY, // 0 — Marine Minds
  VENUS,   // 1 — GameON
  EARTH,   // 2 — Devfolio
  MARS,    // 3 — Sentinel WAF/IDS
  JUPITER, // 4 — TaskManager Pro
  SATURN,  // 5 — CodeArena
  URANUS,  // 6 — WeatherApp
  NEPTUNE, // 7 — CloudDeploy CLI
];

/**
 * Map for O(1) lookup by planet name.
 * Usage: PLANET_PROJECTS_MAP.get('Mars') → { ...marsData }
 */
export const PLANET_PROJECTS_MAP = new Map(
  PLANET_PROJECTS.map((p) => [p.planetName, p])
);

/**
 * Helper — get project data for a planet by name.
 * Returns null if planet name not found (safe fallback for Three.js raycaster).
 *
 * @param {string} planetName
 * @returns {PlanetProject | null}
 */
export function getProjectByPlanet(planetName) {
  return PLANET_PROJECTS_MAP.get(planetName) ?? null;
}

/**
 * Helper — get all projects as a flat array (for sitemap, preloading, etc.)
 * Excludes the Sun node.
 *
 * @returns {PlanetProject[]}
 */
export function getAllPlanetProjects() {
  return PLANET_PROJECTS;
}
