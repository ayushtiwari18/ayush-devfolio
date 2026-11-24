# 🗺️ 06 — Roadmap & Execution Log

This document tracks the incremental execution of the 5-step master plan for upgrading `ayush-devfolio`.

---

## 🚦 Roadmap Progress Tracker

| Step | Milestone | Status | Details |
| :---: | :--- | :---: | :--- |
| **0** | **Antigravity Harness & DevDocs Setup** | **DONE ✅** | Created `AGENTS.md` and complete `DevDocs/` reference library (00–06). |
| **1** | **Fix Core Performance & Caching** | **DONE ✅** | Cleaned up `next.config.js` (removed destructive `onDemandEntries` eviction and 1-gen memory cache limit). Patched `src/lib/supabase.js` with development `no-store` bypass. Verified with 113 passing tests. |
| **2** | **Prune Novel & Dead Dependencies** | **DONE ✅** | Removed `novel`, `@tiptap/core`, `@tiptap/pm`, `@tiptap/react` (144 packages removed). Pruned `optimizePackageImports` in `next.config.js`. |
| **3** | **Implement Markdown Editorial Studio** | **DONE ✅** | Built lightweight Markdown Studio with Notes / Brainstorming scratchpad, instant image drag-and-drop compression & Supabase upload, and autosave. |
| **4** | **Polish Client Reading & Archify Engine** | **DONE ✅** | Built native `<ArchifyDiagram>` supporting JSON IR architecture diagrams with animated pulses, GitHub-style glow callout cards, and IDE code cards in `BlogContent.js`. |
| **5** | **End-to-End Browser Verification** | **DONE ✅** | Real build (72/72 pages passing), all 121 unit tests passing, zero lint errors, and 5-step live browser CDP test completed with full visual proofs in `browser-verification.md`. |
| **6** | **Full-Width Canvas & Anti-Scroll Expansion** | **DONE ✅** | Expanded blog screen from restrictive 760px/1280px containers to full-width canvas (`max-w-[1720px]` container, `w-full max-w-none` content flow, `max-w-6xl` edit canvas, 3-column catalog grid). Verified via live CDP browser captures. |
| **7** | **Fix ChunkLoadError & Top Navbar Clearance** | **DONE ✅** | Resolved `ChunkLoadError` on port 3001 by implementing `AdminErrorBoundary` and resilient dynamic chunk retry in `PublicShell.js`. Fixed top element occlusion under fixed Navbar with generous clearance (`pt-32 sm:pt-40 lg:pt-44`). Measured >70px-216px clear gap via live CDP. |
| **8** | **DSA Dashboard Images Discovery & Lightbox Engine** | **DONE ✅** | Located all 5 uploaded Notion dashboard screenshots in Supabase Storage (`portfolio/blog`), embedded their markdown references into `stop-forgetting-dsa-problems`, resolved `<figure>` inside `<p>` hydration mismatch, added asynchronous decoding with shimmer skeleton, and built click-to-expand lightbox zoom. Verified all 5 images rendered in Read and Split preview modes via live CDP. |

---

## 📝 Execution Log

### Phase 0: Setup & Architecture (Complete)
* **Action:** Established `AGENTS.md` as the non-negotiable operational contract.
* **Action:** Created `DevDocs/` containing full reference context across all architectural subsystems.
* **Verification:** Master index linked and accessible to any subsequent agent.

---

## 📋 Shortcuts & Deferred Debt Ledger
*(Format: `shortcut: <the limit>, <when to upgrade>`)*
* Currently none. Clean slate established.
