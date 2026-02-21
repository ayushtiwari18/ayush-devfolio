# Feature Specifications — Phase 2 Timeline

> **Status**: Approved & Locked
> **Version**: 2.0.0

---

## AI Instructions

- Every feature must have clear acceptance criteria
- Mobile-first design approach
- Accessibility built-in from start
- Performance budgets defined per feature

---

## Timeline Feature Specification

### Acceptance Criteria

- [ ] Timeline renders from real Supabase data (`timeline_events` table)
- [ ] Events displayed in reverse chronological order (newest at top)
- [ ] Sorting enforced at DB layer (`start_date DESC, order ASC`) — never in UI
- [ ] Scroll entrance animations fire once per element, then stop
- [ ] All IntersectionObserver instances disconnect after first trigger
- [ ] No `window.addEventListener('scroll')` exists in the timeline system
- [ ] Mobile layout: single column, image above content
- [ ] Desktop layout: alternating left/right (even=image-left, odd=image-right)
- [ ] `prefers-reduced-motion`: all animations suppressed (CSS + JS layer)
- [ ] No hydration mismatch errors in browser console
- [ ] Timeline section visible and functional without JavaScript (SEO fallback)
- [ ] VideoPlayer never loads until user hover (desktop) or tap (mobile)
- [ ] VideoPlayer unmounts when element leaves viewport
- [ ] MediaGallery lightbox closes on Escape key
- [ ] ProgressIndicator only visible on `md:` breakpoint and above

### Event Types & Colors

| Type        | Label     | Dot Color     |
|-------------|-----------|---------------|
| hackathon   | Hackathon | violet-500    |
| work        | Work      | blue-500      |
| freelancing | Freelance | emerald-500   |
| college     | Education | amber-500     |
| project     | Project   | pink-500      |
| enjoyment   | Life      | orange-500    |

### Date Display Rules

- `end_date = null` → show "Ongoing" badge + "– Present" in date range
- `end_date` present → show formatted range: "March 2024 – June 2024"
- Use `formatDate()` from `@/utils/formatDate` — consistent with rest of site

### Admin Panel Requirements (Future — Phase 3)

- CRUD for `timeline_events` table
- `order` field: number input with helper text: "Lower number = shown first within same month"
- `type` field: dropdown with 6 options
- `media` field: multi-image upload to Supabase Storage, returns JSONB array
- `video_url` field: text input (URL to hosted video)
- `published` toggle: default OFF

### Performance Budget

- Timeline component tree initial JS: < 10kb gzipped (Framer Motion excluded — already loaded)
- VideoPlayer chunk: < 2kb (minimal HTML5 wrapper)
- MediaGallery lightbox: zero external dependencies
- IntersectionObserver: O(1) per element, O(n) total — acceptable for n < 100

### Ripple Effect Behavior

- Desktop (`pointer: fine`): SVG feTurbulence filter activates on mouseenter
- Mobile (`pointer: coarse`): ripple disabled; video activates on first tap
- Reduced motion: no transition of any kind
- Video unmounts on: mouseLeave (desktop), second tap (mobile), scroll out of viewport
