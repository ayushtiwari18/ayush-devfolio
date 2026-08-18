# Specification: Executive Journal Spread Concept (`experience-layout.spec.md`)

## 1. Overview & Architecture

The **Executive Journal Spread** transforms each Work Experience record into a 2-page physical book spread within `react-pageflip`. Instead of cramming all details onto a single card, each experience record opens across a two-page spread:
- **Left Page (Context Page)**: Role branding, company name, dates, core mission summary, and tech stack pills.
- **Right Page (Impact Page)**: Technical deep dive, 3-4 engineering achievement bullets, infrastructure metrics, and testing methodologies.

This doubles the page count of the experience journal, providing generous whitespace, large scannable typography, zero internal scrollbars, and an authentic physical book feel.

---

## 2. EARS System Requirements

### Requirement 1: Data Splitting (Ubiquitous)
> **The system shall map a single experience record across two separate `<div className="page">` nodes to create a left-page/right-page spread.**

- For $N$ experience entries fetched from Supabase, `react-pageflip` shall render $2N$ total pages:
  - Page $2k$: Left Context Page for Entry $k$
  - Page $2k + 1$: Right Impact Page for Entry $k$

### Requirement 2: Left Page Layout — "The Context Page" (Ubiquitous)
> **The left page shall display the "Context": Company Name, Role Title, Dates, a 2-3 sentence project summary, and the primary application stack.**

- **Top Bar**:
  - Left: `Page 2k of 2N` badge + Employment Type badge (`Full-time`, `Contract`, etc.).
  - Right: Monospace Date Range (`Jan 2026 – Present`) styled with `font-mono-code`.
- **Role & Company Header**:
  - `h3` Role Title (`text-3xl font-extrabold text-foreground`).
  - Company Name (`text-primary font-bold text-lg`) with location / remote badge.
- **Mission Summary**:
  - A 2-3 sentence overview highlighting the core objective and project scope (`text-muted-foreground leading-relaxed`).
- **Tech Stack Grid**:
  - Categorized tech stack pills rendered cleanly at the bottom.
- **Spine Binding Seam**:
  - Right inner edge features a subtle dark linear gradient shadow (`bg-gradient-to-l from-black/40 via-black/10 to-transparent`) simulating the center book spine fold.

### Requirement 3: Right Page Layout — "The Impact Page" (Ubiquitous)
> **The right page shall display the "Impact": 3-4 bullet points of engineering achievements, infrastructure details, and specific testing methodologies used (e.g., Cypress/Jest implementations).**

- **Top Bar**:
  - Left: `Page 2k+1 of 2N` badge.
  - Right: `Executive Technical Impact` pill with active pulse indicator.
- **Key Architecture & Deliverables**:
  - 3-4 bullet points formatted with green checkmark icons (`CheckCircle2`).
  - Highlights engineering achievements, scalability metrics (e.g., *1.2M events/sec, <15ms latency*), and testing methodologies (e.g., *Cypress E2E & Jest unit testing*).
- **Core Impact Highlight Box**:
  - Prominent gold/emerald foil highlight box (`bg-gradient-to-r from-primary/15 via-accent/10 to-transparent border border-primary/30 rounded-2xl`).
- **Spine Binding Seam**:
  - Left inner edge features a subtle dark linear gradient shadow (`bg-gradient-to-r from-black/40 via-black/10 to-transparent`) matching the left page seam.

### Requirement 4: Typography and Spacing (Ubiquitous)
> **The system shall use generous line height (`leading-relaxed`) and large padding (`p-8` or `p-10`) to mimic a well-typeset physical book. The system shall strictly prevent internal scrollbars; text must fit within the physical dimensions of the page.**

- **Dimensions**: Page container size set to `w-[560px] h-[500px]` (single page width = 560px, open spread width = 1120px).
- **Zero Scrollbars**: Content density is strictly capped so no vertical or horizontal scrollbars are ever generated.
- **Typography Hierarchy**:
  - Section Label: Monospace 12px UPPERCASE.
  - Role Title: 28px/32px ExtraBold.
  - Deliverables: 14px/15px Medium with 1.625 line-height (`leading-relaxed`).

### Requirement 5: Visual Separation (Event-Driven)
> **When rendering the book binding seam, the system shall apply a subtle shadow and linear gradient on the inner edges (right edge of the left page, left edge of the right page) to simulate page depth.**

- Left Page Right Edge: `absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/35 via-black/10 to-transparent pointer-events-none`
- Right Page Left Edge: `absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none`
- Spine Center Stitching: Tactile journal seam dots running along the spine center.

---

## 3. Data Mapping & Component Schema

```tsx
// ExperienceEntry Schema from Supabase DB
interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  employment_type?: string;
  description: string;
  technologies?: string;
}

// Left Page Component Props
interface ContextPageProps {
  entry: ExperienceEntry;
  spreadIndex: number;
  totalSpreads: number;
}

// Right Page Component Props
interface ImpactPageProps {
  entry: ExperienceEntry;
  spreadIndex: number;
  totalSpreads: number;
}
```

---

## 4. Verification Plan

1. **Compilation Verification**: Run `npm run build` to ensure 64/64 static pages build cleanly with zero type or lint errors.
2. **Layout & Scrollbar Audit**: Verify that neither the Left Context Page nor the Right Impact Page generates internal scrollbars.
3. **Data Fidelity**: Verify that all Supabase DB fields map accurately across the 2-page spread.
