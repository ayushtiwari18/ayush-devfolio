# 📖 05 — Client Reading Experience & Component Mappings

This document outlines the visual design, typography, and interactive component mappings that power the reader-facing blog engine in `src/components/blog/BlogContent.js`.

---

## 1. Typography & Layout Standards

* **Content Width:** Optimal reading line length capped at `max-w-[760px] mx-auto`.
* **Type Hierarchy:**
  * **H1:** Handled by hero section (`text-4xl sm:text-5xl font-extrabold tracking-tight`).
  * **H2:** `text-2xl sm:text-3xl font-bold mt-12 mb-4 tracking-tight text-white border-b border-white/[0.08] pb-3`.
  * **H3:** `text-xl sm:text-2xl font-semibold mt-8 mb-3 text-gray-100`.
  * **Body:** `text-base sm:text-lg leading-relaxed text-gray-300 font-normal`.
* **Anchor Slugs:** Every H2 and H3 automatically receives an HTML `id` attribute via `rehype-slug` to power the sticky Table of Contents sidebar.

---

## 2. Rich Component Mappings in Markdown

`BlogContent.js` maps standard Markdown syntax to specialized React components:

### 1. IDE Code Block Card
* **Trigger:** Standard fenced code block (````javascript ... ````).
* **Rendered UI:**
  * Top bar styled like an IDE editor (macOS red/yellow/green window dots).
  * Monospaced language indicator (e.g., `TYPESCRIPT // source`).
  * 1-Click "Copy" button with "Copied!" checkmark feedback.
  * Code highlighted with Prism `oneDark` theme using JetBrains Mono font.

### 2. Glowing Callout Cards
* **Trigger:** GitHub-style alert quotes:
  ```markdown
  > [!NOTE] Useful technical context
  > [!TIP] Performance recommendation
  > [!WARNING] Critical pitfall or deprecation
  ```
* **Rendered UI:**
  * Frosted glass card (`backdrop-blur-md bg-white/[0.02]`).
  * Colored left accent border and glowing icon (`lucide-react`).
  * Cyan for Note, Emerald for Tip, Amber for Warning, Rose for Caution.

### 3. Interactive Archify System Diagrams
* **Trigger:** Fenced block ````diagram:arch ... ````.
* **Rendered UI:** Interactive visual diagram canvas with zoom/pan and animated data-flow pulses.

### 4. Interactive Table of Contents (`BlogSidebar.js`)
* Dynamically extracts all H2 and H3 headings from the rendered Markdown AST.
* Smooth-scrolls to the target heading on click.
* Highlights the currently active section as the reader scrolls down the page.

---

## 3. Responsive Verification Viewports
Every blog post must render cleanly without overflow or horizontal scroll across standard viewports:
* **Desktop:** 1440 × 900
* **Laptop:** 1024 × 768
* **Tablet:** 768 × 1024
* **Mobile:** 390 × 844
