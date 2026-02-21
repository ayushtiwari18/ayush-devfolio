# Architecture Plan — Phase 2 Timeline System

> **Status**: Approved & Locked
> **Version**: 2.0.0 (Phase 2 additions)

---

## Core Principles (Locked)

- Server Components by default; Client Components only for interactivity
- Centralize all data fetching in `services/`
- Follow Next.js App Router conventions
- Implement proper RLS policies in Supabase
- Sorting enforced at DB layer — never in UI

---

## Phase 2: Timeline System Architecture

### Scroll Engine Decision

**Chosen: Native IntersectionObserver + Framer Motion (already installed)**

- GSAP ScrollTrigger: REJECTED — not installed, +30kb gzip, overkill
- CSS Scroll-driven Animations: REJECTED — Safari support incomplete
- Custom window scroll events: REJECTED — main-thread blocking, leak risk

Framer Motion `useScroll` (for ProgressIndicator) uses rAF internally — SSR-safe.
Framer Motion `whileInView` NOT used — replaced with IntersectionObserver + `animate` prop
for precise one-shot control and guaranteed cleanup.

---

### Component Tree

```
src/components/timeline/
├── TimelineContainer.js    ← SERVER COMPONENT (data fetch + SEO shell)
├── TimelineClient.js       ← CLIENT boundary (scroll context root)
├── TimelineTrack.js        ← CLIENT (vertical line, scaleY entrance)
├── TimelineEvent.js        ← CLIENT (IntersectionObserver + alternating layout)
├── EventCard.js            ← CLIENT (pure presentational, zero state)
├── MediaGallery.js         ← CLIENT (next/image grid + lightbox modal)
├── VideoPreview.js         ← CLIENT (SVG ripple filter + lazy video)
├── VideoPlayer.js          ← CLIENT (dynamic import target, minimal wrapper)
└── ProgressIndicator.js    ← CLIENT (useScroll scoped to container ref)
```

**Critical boundary rule:** `TimelineContainer` is a Server Component.
No animation logic may cross the server boundary.
`TimelineClient` is the single Client boundary entry point.

---

### Rendering Model

| Component           | Rendering | Reason                                        |
|---------------------|-----------|-----------------------------------------------|
| TimelineContainer   | Server    | Supabase fetch, SEO static HTML, no DOM API   |
| TimelineClient      | Client    | useRef for container, scroll context root     |
| TimelineTrack       | Client    | Framer Motion DOM animation                   |
| TimelineEvent       | Client    | IntersectionObserver, useState(isVisible)     |
| EventCard           | Client    | Lives inside Client tree; pure presentational |
| MediaGallery        | Client    | useState(lightboxIndex), keyboard events      |
| VideoPreview        | Client    | useState(isHovered/isInView), IntersectionObs |
| VideoPlayer         | Client    | Dynamic import target; ssr: false             |
| ProgressIndicator   | Client    | useScroll requires DOM ref                    |

---

### Data Model (timeline_events table)

```js
{
  id:          string,    // UUID
  type:        'hackathon'|'work'|'freelancing'|'college'|'project'|'enjoyment',
  title:       string,
  description: string,
  start_date:  string,    // 'YYYY-MM-DD' — DATE column in Postgres
  end_date:    string|null, // null = ongoing
  media:       Array<{ url, alt, width, height }>, // JSONB
  video_url:   string|null,
  order:       number,    // Admin tie-breaker, default 0
  featured:    boolean,
  published:   boolean,
}
```

**Sort contract (NEVER violate):**
All queries use `.order('start_date', { ascending: false }).order('order', { ascending: true })`.
No `.sort()` calls exist or are permitted in any UI component.

---

### Ripple Effect Decision

**Chosen: SVG feTurbulence + feDisplacementMap as CSS filter**

- WebGL shader: REJECTED — cannot layer over `<video>`, massive complexity
- Canvas 2D pixel manipulation: REJECTED — main-thread blocking, mobile battery drain
- CSS filter runs on GPU compositor thread — zero JS in hover loop
- `@media (pointer: coarse)`: ripple disabled on mobile, opacity fade fallback
- `@media (prefers-reduced-motion)`: all transitions disabled at CSS layer

---

### Performance Contracts

- No virtualization until event count exceeds 100
- IntersectionObserver: `{ once: true }` pattern — disconnects after first trigger
- VideoPlayer: `dynamic(() => import('./VideoPlayer'), { ssr: false })`
  - Never in initial bundle
  - Unmounts when IntersectionObserver sees element leave viewport
- All `next/image` usage requires explicit `width`/`height` from data model (zero CLS)
- `useMemo` only in Server Components (TimelineContainer) — not in scroll paths
- No global `window.addEventListener('scroll', ...)` anywhere in the timeline system

---

### Hydration Safety Rules

- `suppressHydrationWarning` on ProgressIndicator fill div (scroll-dependent height)
- Framer Motion `initial="hidden"` does NOT set opacity:0 until JS hydrates
- CSS `.timeline-event-wrapper { opacity: 1 }` ensures no invisible flash on slow JS
- No `Math.random()` or `Date.now()` in any render path

---

### Files Changed in Phase 2

```
supabase/timeline-events-migration.sql   ← Run in Supabase SQL Editor
supabase/timeline-events-seed.sql        ← Run after migration
src/services/timeline.service.js
src/components/timeline/TimelineContainer.js
src/components/timeline/TimelineClient.js
src/components/timeline/TimelineTrack.js
src/components/timeline/TimelineEvent.js
src/components/timeline/EventCard.js
src/components/timeline/MediaGallery.js
src/components/timeline/VideoPreview.js
src/components/timeline/VideoPlayer.js
src/components/timeline/ProgressIndicator.js
src/styles/globals.css                   ← Timeline CSS block appended
docs/03-architecture-plan.md             ← This file
docs/04-feature-specifications.md        ← Timeline behavior specs
```
