# Feature Specifications

> **Phase 2 Status**: ✅ Complete (v2.1.0)
> **Phase 3 Status**: 🔵 Planned

---

## Phase 2: Timeline Feature Specification

### Acceptance Criteria

- [x] Timeline renders from real Supabase data (`timeline_events` table)
- [x] Events displayed in reverse chronological order (newest at top)
- [x] Sorting enforced at DB layer (`start_date DESC, order ASC`) — never in UI
- [x] Scroll entrance animations fire once per element, then stop
- [x] All IntersectionObserver instances disconnect after first trigger
- [x] No `window.addEventListener('scroll')` exists in the timeline system
- [x] Mobile layout: single column, image above content
- [x] Desktop layout: alternating left/right (even=card-left, odd=card-right)
- [x] `prefers-reduced-motion`: all animations suppressed (CSS + JS layer)
- [x] No hydration mismatch errors in browser console
- [x] Timeline section visible and functional without JavaScript (SEO fallback)
- [x] VideoPlayer never loads until user hover (desktop) or tap (mobile)
- [x] VideoPlayer unmounts when element leaves viewport
- [x] MediaGallery lightbox closes on Escape key (also ArrowLeft / ArrowRight navigation)
- [x] ProgressIndicator only visible on `md:` breakpoint and above

### Additional Features (Added in v2.1)

- [x] Type filter tabs (All / Hackathons / Projects / Work / Education / Freelance / Life) with live counts
- [x] Year group separators between events (2026, 2025, 2024…)
- [x] Description clamped to 3 lines with Read more / Show less toggle
- [x] Achievement badge on featured events (trophy icon + highlight text)
- [x] animate-ping limited to first 3 featured items only
- [x] Stagger delay capped at index 3 (max 210ms) — no excessive wait on deep items
- [x] ProgressIndicator fixed to track window scroll (not inner div)

---

### Event Types & Colors

| Type        | Label     | Dot Color     |
|-------------|-----------|---------------|
| hackathon   | Hackathon | violet-500    |
| work        | Work      | blue-500      |
| freelancing | Freelance | emerald-500   |
| college     | Education | amber-500     |
| project     | Project   | pink-500      |
| enjoyment   | Life      | orange-500    |

---

### Date Display Rules

- `end_date = null` → show "Ongoing" badge + "– Present" in date range
- `end_date` present → show formatted range: "March 2024 – June 2024"
- Use `formatDate()` from `@/utils/formatDate` — consistent with rest of site

---

### Admin Panel Requirements (Phase 3 — Pending)

- [ ] CRUD for `timeline_events` table
- [ ] `order` field: number input with helper text: "Lower number = shown first within same month"
- [ ] `type` field: dropdown with 6 options
- [ ] `media` field: multi-image upload to Supabase Storage, returns JSONB array
- [ ] `video_url` field: text input (URL to hosted video)
- [ ] `published` toggle: default OFF

---

### Performance Budget (Timeline)

- Timeline component tree initial JS: < 10kb gzipped (Framer Motion excluded — already loaded)
- VideoPlayer chunk: < 2kb (minimal HTML5 wrapper)
- MediaGallery lightbox: zero external dependencies
- IntersectionObserver: O(1) per element, O(n) total — acceptable for n < 100

---

### Ripple Effect Behavior (Timeline)

- Desktop (`pointer: fine`): SVG feTurbulence filter activates on mouseenter
- Mobile (`pointer: coarse`): ripple disabled; video activates on first tap
- Reduced motion: no transition of any kind
- Video unmounts on: mouseLeave (desktop), second tap (mobile), scroll out of viewport

---

## Phase 3: Advanced Project Display System

> **Status**: 🔵 Planned — Architecture approved, implementation pending

---

### Core Problem Being Solved

Current `ProjectCard.js` opens a **modal** on click — no shareable URL, no SEO, no case-study depth.
Current `[slug]/page.js` is a skeleton: renders only `title`, `description`, `technologies`, `cover_image`.
This phase replaces both with an immersive, recruiter-grade case-study experience.

---

### Project Listing Page (`/projects`) — Acceptance Criteria

- [ ] `ProjectCard` is a Server Component (modal code fully removed)
- [ ] Card click navigates to `/projects/[slug]` via `<Link>` — no modal
- [ ] `cover_image` thumbnail renders at correct aspect ratio with no CLS
- [ ] Featured badge renders on `featured: true` projects
- [ ] Technology tags show max 3, `+N more` badge if overflow
- [ ] Empty state renders when no projects published
- [ ] Page is server-rendered with static `metadata` export

---

### Project Detail Page (`/projects/[slug]`) — Acceptance Criteria

#### Routing
- [ ] ISR with `revalidate = 86400`
- [ ] `generateStaticParams` pre-generates all published slugs at build
- [ ] `dynamicParams = true` — new slugs served on-demand, then cached
- [ ] `notFound()` called for unpublished or missing slugs

#### Hero Section
- [ ] `hero_image` renders full-width; falls back to `cover_image` if null
- [ ] SVG feTurbulence ripple activates on `mouseenter` (desktop only)
- [ ] Ripple does NOT activate on `pointer: coarse` devices
- [ ] `prefers-reduced-motion`: ripple entirely suppressed at CSS layer
- [ ] After 10 seconds of viewport intersection: `preview_video` autoplays muted
- [ ] Video is `muted`, `playsInline`, `preload="none"`
- [ ] Autoplay does not start if `prefers-reduced-motion` is active
- [ ] User click on short video (≤60s): plays in-page to completion
- [ ] User click on long video (>60s): `window.open(youtube_url)`
- [ ] Hero leaves viewport: `.pause()`, `clearTimeout`, `observer.disconnect()` — no memory leaks
- [ ] If neither `preview_video` nor `youtube_url` present: hero renders as static image only

#### Case Study Sections
- [ ] Each section only renders when its DB field is non-null
- [ ] Section order: Problem Statement → Solution → Architecture → Code Structure → Strategies → Challenges → Performance → Trade-offs → Lessons Learned → Future Improvements
- [ ] All markdown fields rendered via `react-markdown` with `rehype-highlight` for code blocks
- [ ] `StrategyGrid`: maps `strategies` JSONB array → individual styled cards
- [ ] `ChallengeAccordion`: maps `challenges` JSONB array → accordion (problem + fix per item)
- [ ] `ArchitectureViewer`: renders `api_flow_diagram` as image or mermaid block; dynamically imported
- [ ] No section renders a heading if content is null (no empty whitespace gaps)

#### Technical Expansion
- [ ] `api_flow_diagram` renders if present
- [ ] `db_schema_visual` renders as `next/image` if present
- [ ] `security_notes` renders in `ProjectSection` if present

#### Related Content
- [ ] `RelatedContentSection` fetches projects sharing any tag in `tags[]`, excludes current slug
- [ ] Related blog posts fetched by slug from `related_blogs[]` field
- [ ] Section does not render if both related arrays are empty
- [ ] Related items always filtered `published: true` — stale slugs silently excluded

#### SEO
- [ ] `generateMetadata` outputs unique `title`, `description`, `canonical`, `openGraph`, `twitter`
- [ ] OG image uses `hero_image` → fallback `cover_image` → fallback site default
- [ ] `description` uses `problem_statement.slice(0, 160)` → fallback `description`
- [ ] JSON-LD `SoftwareApplication` schema injected as `<script type="application/ld+json">`
- [ ] BreadcrumbList schema: `Home > Projects > title`
- [ ] Canonical URL: `https://ayushtiwari.dev/projects/${slug}`

#### Sitemap
- [ ] `src/app/sitemap.js` includes all published project slugs dynamically
- [ ] Each slug entry includes `lastModified: project.updated_at ?? project.created_at`

---

### Performance Budget (Phase 3)

- `ProjectHero` initial JS: < 5kb gzipped
- `VideoPreviewController` chunk: < 3kb (dynamic import, loads only when hero in viewport)
- `ArchitectureViewer` chunk: < 5kb (dynamic import, loads only when section in viewport)
- `react-markdown` + `rehype-highlight`: acceptable (renders server-side in Server Components)
- No new animation library added; SVG filter = 0 bytes JS
- Zero `window.addEventListener('scroll')` calls in project system

---

### Admin Panel Requirements (Phase 3 — Projects)

- [ ] All new nullable fields exposed in admin project editor
- [ ] `hero_image`: image upload to Supabase Storage
- [ ] `preview_video`: file upload (MP4 only, client-side duration check ≤ 30s recommended)
- [ ] `youtube_url`: URL text input with format validation
- [ ] `problem_statement` … `future_improvements`: rich text editor (markdown output)
- [ ] `strategies`: dynamic field array (add/remove rows, each row: title + description)
- [ ] `challenges`: dynamic field array (add/remove rows, each row: problem + fix)
- [ ] `related_projects`: multi-select from published project slugs
- [ ] `related_blogs`: multi-select from published blog slugs
- [ ] `order`: number input, helper: "Lower number = shown first"
- [ ] All fields optional — save valid with any subset filled
- [ ] Admin save triggers revalidation: `POST /api/revalidate?path=/projects/${slug}`

---

### Migration Rules

- `ProjectCard.js` modal code is **fully deleted** — not refactored
- Existing `description` column is not renamed — used as `shortDescription` on cards
- All new DB columns are nullable — zero existing row breakage
- `[slug]/page.js` is a **full rewrite** — not an incremental edit
- `sitemap.js` gets an additive change only — existing entries preserved
