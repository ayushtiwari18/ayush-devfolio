# Feature Specifications — Phase 2 Timeline

> **Status**: ✅ Complete
> **Version**: 2.1.0

---

## Timeline Feature Specification

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

### Performance Budget

- Timeline component tree initial JS: < 10kb gzipped (Framer Motion excluded — already loaded)
- VideoPlayer chunk: < 2kb (minimal HTML5 wrapper)
- MediaGallery lightbox: zero external dependencies
- IntersectionObserver: O(1) per element, O(n) total — acceptable for n < 100

---

### Ripple Effect Behavior

- Desktop (`pointer: fine`): SVG feTurbulence filter activates on mouseenter
- Mobile (`pointer: coarse`): ripple disabled; video activates on first tap
- Reduced motion: no transition of any kind
- Video unmounts on: mouseLeave (desktop), second tap (mobile), scroll out of viewport
