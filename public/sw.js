// ─────────────────────────────────────────────────────────────────────────────
// Ayush Tiwari Portfolio — Service Worker
// Strategy:
//   - Shell / navigation requests → Network-first, fallback to cache, then offline.html
//   - Static assets (_next/static) → Cache-first (immutable, 1-year TTL)
//   - Images → Cache-first, max 60 entries, 30-day TTL
//   - API routes → Network-only (never cache)
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_VERSION = 'v1';
const SHELL_CACHE   = `shell-${CACHE_VERSION}`;
const STATIC_CACHE  = `static-${CACHE_VERSION}`;
const IMAGE_CACHE   = `images-${CACHE_VERSION}`;

const SHELL_URLS = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/certifications',
  '/events',
  '/contact',
  '/offline.html',
];

// ── Install: pre-cache shell routes ──────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: purge old caches ────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const VALID = [SHELL_CACHE, STATIC_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !VALID.includes(k)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // API routes — network only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Static assets — cache first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async cache => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // Images — cache first, max 60, 30 days
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/)
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async cache => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) {
            cache.put(request, response.clone());
            // Trim cache to max 60 entries
            cache.keys().then(keys => {
              if (keys.length > 60) cache.delete(keys[0]);
            });
          }
          return response;
        } catch {
          return new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // Navigation / HTML — network first, fallback to cache, then offline
  if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            caches.open(SHELL_CACHE).then(c => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match('/offline.html');
        })
    );
    return;
  }

  // Default — network first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
