# Architecture Plan

> **Status**: Phase 2 ✅ Complete (v2.1.0) | Phase 3 🔵 Planned
> **Version**: 3.0.0-plan

---

## Core Principles (Locked)

- Server Components by default; Client Components only for interactivity
- Centralize all data fetching in `services/`
- Follow Next.js App Router conventions
- Implement proper RLS policies in Supabase
- Sorting enforced at DB layer — never in UI
- No new dependencies without explicit justification

---

## Phase 2: Timeline System Architecture

### Scroll Engine Decision

**Chosen: Native IntersectionObserver + Framer Motion (already installed)**

- GSAP ScrollTrigger: REJECTED — not installed, +30kb gzip, overkill
- CSS Scroll-driven Animations: REJECTED — Safari support incomplete
- Custom window scroll events: REJECTED — main-thread blocking, leak risk

Framer Motion `useScroll()` (for ProgressIndicator) uses rAF internally — SSR-safe.
Framer Motion `whileInView` NOT used — replaced with IntersectionObserver + `animate` prop
for precise one-shot control and guaranteed cleanup.

---

### Component Tree

```
src/components/timeline/
├── TimelineContainer.js    ← SERVER COMPONENT (data fetch + SEO shell + featuredRank)
├── TimelineClient.js       ← CLIENT boundary (filter tabs + year separators)
├── TimelineTrack.js        ← CLIENT (vertical line, scaleY entrance)
├── TimelineEvent.js        ← CLIENT (IntersectionObserver + alternating layout)
├── EventCard.js            ← CLIENT (hover glow state + read more toggle + achievement badge)
├── MediaGallery.js         ← CLIENT (next/image grid + lightbox modal + keyboard nav)
├── VideoPreview.js         ← CLIENT (SVG ripple filter + lazy video)
├── VideoPlayer.js          ← CLIENT (dynamic import target, minimal wrapper)
└── ProgressIndicator.js    ← CLIENT (useScroll scoped to window)
```

**Critical boundary rule:** `TimelineContainer` is a Server Component.
No animation logic may cross the server boundary.
`TimelineClient` is the single Client boundary entry point.

---

### Rendering Model (Timeline)

| Component           | Rendering | Reason                                                      |
|---------------------|-----------|-------------------------------------------------------------|
| TimelineContainer   | Server    | Supabase fetch, SEO static HTML, featuredRank computation   |
| TimelineClient      | Client    | useState (activeFilter), useMemo (filtered list, year rows) |
| TimelineTrack       | Client    | Framer Motion DOM animation                                 |
| TimelineEvent       | Client    | IntersectionObserver, useState(isVisible)                   |
| EventCard           | Client    | useState(hovered, expanded) — hover glow + read more toggle |
| MediaGallery        | Client    | useState(lightboxIndex), keyboard events                    |
| VideoPreview        | Client    | useState(isHovered/isInView), IntersectionObserver          |
| VideoPlayer         | Client    | Dynamic import target; ssr: false                           |
| ProgressIndicator   | Client    | useScroll() — tracks window scroll (no containerRef)        |

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
  // Computed server-side before passing to client:
  featuredRank: number|undefined, // 0-based rank among featured items; undefined if not featured
}
```

**Sort contract (NEVER violate):**
All queries use `.order('start_date', { ascending: false }).order('order', { ascending: true })`.
No `.sort()` calls exist or are permitted in any UI component.

---

### Ripple Effect Decision (Timeline)

**Chosen: SVG feTurbulence + feDisplacementMap as CSS filter**

- WebGL shader: REJECTED — cannot layer over `<video>`, massive complexity
- Canvas 2D pixel manipulation: REJECTED — main-thread blocking, mobile battery drain
- CSS filter runs on GPU compositor thread — zero JS in hover loop
- `@media (pointer: coarse)`: ripple disabled on mobile, opacity fade fallback
- `@media (prefers-reduced-motion)`: all transitions disabled at CSS layer

---

### Performance Contracts (Timeline)

- No virtualization until event count exceeds 100
- IntersectionObserver: `{ once: true }` pattern — disconnects after first trigger
- VideoPlayer: `dynamic(() => import('./VideoPlayer'), { ssr: false })`
  - Never in initial bundle
  - Unmounts when IntersectionObserver sees element leave viewport
- All `next/image` usage requires explicit `width`/`height` from data model (zero CLS)
- `useMemo` used in `TimelineClient` for filter + year separator computation (acceptable — not in scroll paths)
- No global `window.addEventListener('scroll', ...)` anywhere in the timeline system

---

### Hydration Safety Rules

- `suppressHydrationWarning` on ProgressIndicator fill div (scroll-dependent height)
- Framer Motion `initial="hidden"` does NOT set opacity:0 until JS hydrates
- CSS `.timeline-event-wrapper { opacity: 1 }` ensures no invisible flash on slow JS
- No `Math.random()` or `Date.now()` in any render path

---

### v2.1 Changes (post-launch polish)

| Change | File | Reason |
|--------|------|--------|
| Type filter tabs + year separators | TimelineClient.js | UX — 25 items need navigation |
| Description clamp + Read more toggle | EventCard.js | UX — page too tall without it |
| Achievement badge on featured events | EventCard.js | Highlight key accomplishments |
| animate-ping limited to first 3 featured | TimelineEvent.js | Reduced visual noise |
| Stagger delay capped at index 3 | TimelineEvent.js | No 1.68s wait on deep items |
| ProgressIndicator tracks window scroll | ProgressIndicator.js | Was broken — tracked inner div |
| featuredRank computed server-side | TimelineContainer.js | Zero client runtime cost |
| about/page.js wired to TimelineContainer | about/page.js | Was hardcoded 3-item array |

---

## Phase 3: Advanced Project Display System

> **Status**: 🔵 Architecture Approved — Pending Implementation
> **Scope**: Replace generic card+modal pattern with immersive case-study pages

---

### Routing Model Decision

**Chosen: ISR (Incremental Static Regeneration) — `revalidate = 86400`**

- Full SSG at build: REJECTED — requires redeploy when admin adds new projects
- Full SSR (no cache): REJECTED — Supabase cold query on every visit, poor TTFB
- Client-side fetch: REJECTED — no SEO, Google sees empty shell
- **ISR chosen**: static-fast for users, auto-refreshes daily, new slugs served on-demand via `dynamicParams = true`

```js
// src/app/projects/[slug]/page.js
export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map(p => ({ slug: p.slug }));
}
```

---

### Data Model Decision

**Chosen: Extend existing `projects` table with nullable columns — NOT a separate table, NOT MDX**

- MDX files: REJECTED — admin cannot edit files; breaks CMS model
- Separate `project_details` JOIN table: REJECTED — doubles query complexity for no benefit
- Nullable column extension: CHOSEN — one query, backward compatible, all existing rows valid

```js
// Extended projects table schema
{
  // ── EXISTING (unchanged) ──
  id:              uuid (pk),
  title:           text,
  slug:            text (unique),
  description:     text,           // shortDescription on cards
  technologies:    text[],
  cover_image:     text,           // 3:2 thumbnail for card grid
  github_url:      text,
  live_url:        text,
  featured:        boolean,
  published:       boolean,
  created_at:      timestamp,

  // ── NEW — all nullable, backward compatible ──
  hero_image:      text,           // 16:9 full-width hero screenshot
  preview_video:   text,           // short MP4 URL ≤30s (Supabase Storage)
  youtube_url:     text,           // full video redirect target
  tags:            text[],         // recommendation engine (≠ technologies)
  duration:        text,           // e.g. "3 months"
  order:           int default 0,

  // ── CASE STUDY (markdown strings, nullable) ──
  problem_statement:   text,
  solution:            text,
  architecture_plan:   text,
  code_structure:      text,
  performance_notes:   text,
  trade_offs:          text,
  lessons_learned:     text,
  future_improvements: text,

  // ── STRUCTURED ARRAYS (JSONB, nullable) ──
  strategies:   jsonb,  // Array<{ title: string, description: string }>
  challenges:   jsonb,  // Array<{ problem: string, fix: string }>

  // ── TECHNICAL EXPANSION (nullable) ──
  api_flow_diagram:  text,   // image URL or mermaid markdown string
  db_schema_visual:  text,   // image URL
  security_notes:    text,

  // ── RELATED CONTENT ──
  related_projects:  text[],  // array of slugs
  related_blogs:     text[],  // array of blog slugs
}
```

**`hero_image` vs `cover_image` distinction:** `cover_image` is a 3:2 crop for card thumbnails. `hero_image` is a 16:9 or full-width screenshot for the immersive page hero. Different crops, different source images.

**JSONB for `strategies` / `challenges`:** These are typed arrays (each item has title + body), not flat text. JSONB allows typed mapping in UI without a parse step.

---

### Component Tree (Phase 3)

```
src/app/projects/[slug]/page.js       ← SERVER (ISR, generateMetadata, JSON-LD)

src/components/projects/
├── ProjectHero.js                    ← CLIENT (ripple, video, IntersectionObserver)
│   ├── RippleEffectLayer.js          ← CLIENT (CSS class toggle only — 0 bytes JS in loop)
│   └── VideoPreviewController.js     ← CLIENT (timer, visibility, YouTube redirect)
│
├── ProjectOverview.js                ← SERVER (title, tags, duration, links)
├── ProjectSection.js                 ← SERVER (reusable: { title, content } → markdown render)
├── StrategyGrid.js                   ← SERVER (maps strategies[] JSONB → styled cards)
├── ChallengeAccordion.js             ← CLIENT (useState(openIndex) only)
├── ArchitectureViewer.js             ← CLIENT (dynamic import, ssr: false)
├── RelatedContentSection.js          ← SERVER (tag-based DB query, no state)
│   ├── RelatedProjectCard.js         ← SERVER
│   └── RelatedBlogCard.js            ← SERVER
└── ProjectCTASection.js              ← SERVER (GitHub + Live links)
```

**Heavy component lazy loading:**
```js
const ArchitectureViewer = dynamic(() => import('./ArchitectureViewer'), { ssr: false });
const VideoPreviewController = dynamic(() => import('./VideoPreviewController'), { ssr: false });
```
Both load only when their section enters viewport via IntersectionObserver.

---

### Rendering Model (Phase 3)

| Component | Rendering | Reason |
|---|---|---|
| `[slug]/page.js` | Server (ISR) | SEO, metadata, structured data |
| `ProjectHero` | Client | IntersectionObserver, timer, state |
| `RippleEffectLayer` | Client | CSS hover class toggle |
| `VideoPreviewController` | Client | setTimeout, useRef, visibility |
| `ProjectOverview` | Server | No interactivity |
| `ProjectSection` | Server | Markdown render, no state |
| `StrategyGrid` | Server | Maps data → JSX |
| `ChallengeAccordion` | Client | useState(openIndex) |
| `ArchitectureViewer` | Client | Dynamic import, ssr: false |
| `RelatedContentSection` | Server | Tag-based DB query |

---

### Ripple Effect Decision (Phase 3)

**Chosen: SVG feTurbulence + feDisplacementMap as CSS filter** — same as Phase 2 Timeline

- WebGL shader: REJECTED — cannot layer over `<video>`, bundle cost, unmaintainable
- Canvas 2D: REJECTED — main-thread blocking, mobile battery drain
- GSAP distortion: REJECTED — +30kb, version lock, new dependency
- **SVG CSS filter chosen**: 0 bytes JS in hover loop, GPU compositor thread, consistent with existing Timeline system, `@media (prefers-reduced-motion)` handled at CSS layer, `@media (pointer: coarse)` disables on mobile

---

### Video System Architecture (Phase 3)

**10-second autoplay preview flow:**

```
Hero enters viewport (IntersectionObserver threshold: 0.5)
  → video: muted, playsInline, preload="none" → .play()
  → setTimeout(10s) → .pause(), reset to t=0

User clicks before 10s:
  ├─ video.duration ≤ 60s → play to end in-page
  └─ video.duration > 60s → window.open(youtube_url)

Hero leaves viewport:
  → .pause(), clearTimeout, reset src (free memory)
```

**Autoplay policy compliance:** `muted` attribute bypasses Chrome/Safari autoplay block. Industry standard.

**`prefers-reduced-motion`:** Checked via `window.matchMedia` before `.play()`. If true, video never autoplays — static thumbnail + manual play button shown.

**Cleanup contract (mandatory):**
```js
return () => {
  clearTimeout(autoplayTimer.current);
  observer.disconnect();
  videoRef.current?.pause();
};
```

---

### SEO Structure (Phase 3)

**Per-project `generateMetadata`:**
```js
{
  title: `${project.title} — Ayush Tiwari`,
  description: project.problem_statement?.slice(0, 160) ?? project.description,
  alternates: { canonical: `https://ayushtiwari.dev/projects/${slug}` },
  openGraph: {
    images: [{ url: project.hero_image ?? project.cover_image, width: 1200, height: 630 }],
    type: 'article',
  },
  twitter: { card: 'summary_large_image' }
}
```

**JSON-LD structured data (SoftwareApplication schema):**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "project.title",
  "description": "project.description",
  "url": "https://ayushtiwari.dev/projects/slug",
  "author": { "@type": "Person", "name": "Ayush Tiwari" },
  "applicationCategory": "WebApplication",
  "dateCreated": "project.created_at",
  "keywords": "project.tags joined"
}
```

**BreadcrumbList schema:** `Home > Projects > project.title`

**sitemap.js:** Must include dynamic slug entries from `getPublishedProjects()`.

---

### Admin Compatibility (Phase 3)

All new fields are nullable — admin enriches projects progressively. Section does not render if field is null.

| Field | Input Type |
|---|---|
| `hero_image` | Image upload (Supabase Storage) |
| `preview_video` | File upload MP4, max 30s |
| `youtube_url` | Text input (URL) |
| `problem_statement` … `future_improvements` | Rich text (markdown) |
| `strategies` | JSON array editor (title + description pairs) |
| `challenges` | JSON array editor (problem + fix pairs) |
| `related_projects` | Multi-select slug picker |
| `related_blogs` | Multi-select slug picker |
| `order` | Number input |

---

### Migration Path (Phase 3)

1. `supabase/projects-casestudy-migration.sql` — `ALTER TABLE projects ADD COLUMN ...` for all new nullable columns
2. `src/services/projects.service.js` — add `getRelatedProjects(tags[], excludeSlug)`
3. `src/components/projects/` — build full new component tree
4. `src/app/projects/[slug]/page.js` — rebuild with ISR + new metadata + JSON-LD
5. `src/components/cards/ProjectCard.js` — remove modal, convert to Server Component with `<Link>` wrapper
6. `src/app/sitemap.js` — add dynamic project slug generation
7. `docs/03-architecture-plan.md` + `docs/04-feature-specifications.md` — update ✅ (this file)

---

### Files in Phase 3 System

```
supabase/projects-casestudy-migration.sql
src/services/projects.service.js              ← add getRelatedProjects()
src/components/projects/ProjectHero.js
src/components/projects/RippleEffectLayer.js
src/components/projects/VideoPreviewController.js
src/components/projects/ProjectOverview.js
src/components/projects/ProjectSection.js
src/components/projects/StrategyGrid.js
src/components/projects/ChallengeAccordion.js
src/components/projects/ArchitectureViewer.js
src/components/projects/RelatedContentSection.js
src/components/projects/RelatedProjectCard.js
src/components/projects/RelatedBlogCard.js
src/components/projects/ProjectCTASection.js
src/components/cards/ProjectCard.js           ← modal removed, Server Component
src/app/projects/[slug]/page.js               ← ISR rebuild
src/app/projects/page.js                      ← uses updated ProjectCard
src/app/sitemap.js                            ← add project slugs
docs/03-architecture-plan.md                  ← this file
docs/04-feature-specifications.md             ← phase 3 specs
```
