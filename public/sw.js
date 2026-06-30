// ─────────────────────────────────────────────────────────────────────────────
// Ayush Tiwari Portfolio — Service Worker v2
// Strategies:
//   /admin/*        → BYPASS (network only, no SW interference)
//   /api/*          → Network only
//   /_next/static/* → Cache-first (immutable)
//   Images          → Cache-first, max 60 entries
//   Navigation HTML → Network-first, fallback cache, then offline.html
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_VERSION = 'v2';
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

// ── Install ─────────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: purge old caches ───────────────────────────────────────────────
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

  // Skip non-GET and cross-origin requests entirely
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // 🔒 BYPASS: admin routes — never intercept, let browser handle directly
  // This prevents the 'Failed to convert value to Response' SW crash
  if (url.pathname.startsWith('/admin')) return;

  // API routes — network only, no caching
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Static assets (_next/static) — cache first, immutable
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

  // Images — cache first, max 60 entries, 30-day effective TTL
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

  // Navigation / HTML pages — network first, fallback to cache, then offline
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
