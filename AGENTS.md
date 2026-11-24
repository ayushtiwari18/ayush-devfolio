# 🤖 Antigravity Agent Harness (`AGENTS.md`)

Welcome, Antigravity Agent. You are operating on the `ayush-devfolio` repository.
This document is your **strict, non-negotiable operational contract**. Every agent entering this repository must read this file first and strictly follow every rule.

---

## 🛑 1. Core Mandates & Non-Negotiable Rules

1. **Active Branch Isolation:**
   - **Current Branch:** `feat/in-context-admin`
   - **Rule:** Stay strictly on `feat/in-context-admin`.
   - **Never push to `main`**, merge to `main`, or trigger production deployment without explicit user permission and 100% verification.
2. **Zero Hallucination & Ground-Truth Verification:**
   - **Never claim a feature works without empirical proof.**
   - A passing Jest unit test with mocks is **NOT** proof that a feature works.
   - Always run `npm run lint` and verify real builds.
   - Check real browser DOM, network requests, and console logs.
3. **No Assumptions — Refer to DevDocs First:**
   - Before guessing requirements, architecture, or configurations, read [`DevDocs/`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs).
   - If an edge case or business logic is ambiguous, ask the user directly—never make silent assumptions.
4. **Engineering Standards (`/ponytail` + `design-taste-frontend`):**
   - **Smallest complete diff:** Never add speculative wrappers, unused utility files, or unasked-for complexity.
   - **Anti-slop UI:** Adhere to `tasteskill 2.5` (one section per screen at 1440x900, equal left/right margins, no generic low-contrast AI cards, authentic developer aesthetics).
   - **No Notion-like Slash Bloat:** Do not introduce heavy slash-command block libraries (`novel`, `@blocknote`). Clean Markdown + custom React components is the standard.

---

## 🗂️ 2. Entry Point & File Registry

| Domain / Route | Primary Entry Files | Purpose |
| :--- | :--- | :--- |
| **Blog Reader** | [`src/app/blog/page.js`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/src/app/blog/page.js)<br>[`src/app/blog/[slug]/page.js`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/src/app/blog/[slug]/page.js) | Public blog catalog & article view. Server Component with dynamic metadata. |
| **Blog Content Engine** | [`src/components/blog/BlogContent.js`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/src/components/blog/BlogContent.js)<br>[`src/components/blog/BlogSidebar.js`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/src/components/blog/BlogSidebar.js) | Markdown renderer, IDE code cards, Callout blocks, Archify diagrams, and Table of Contents. |
| **Blog Editorial Studio** | [`src/components/blog/BlogEditor.js`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/src/components/blog/BlogEditor.js)<br>[`src/components/blog/BlogPostClient.js`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/src/components/blog/BlogPostClient.js) | Dual-pane Markdown Studio, Scratchpad / Brainstorming drawer, image drop-zone, and auto-save. |
| **Data Layer & Services** | [`src/lib/supabase.js`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/src/lib/supabase.js)<br>[`src/services/blog.service.js`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/src/services/blog.service.js) | Supabase client, caching controls, and database queries. |
| **Global Configs** | [`next.config.js`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/next.config.js)<br>[`package.json`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/package.json) | Webpack / Turbopack build options, package imports, and optimization rules. |

---

## 📚 3. Knowledge Base Index (`DevDocs/`)

All architectural decisions, deep diagnostics, and feature specs are stored in [`DevDocs/`](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs). Refer to them before beginning any task:

1. [**00-INDEX.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/00-INDEX.md) — Master map of documentation.
2. [**01-HARNESS-AND-RULES.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/01-HARNESS-AND-RULES.md) — Detailed agent execution rules, branch guidelines, and verification workflows.
3. [**02-CACHING-AND-PERFORMANCE-ROOT-CAUSE.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/02-CACHING-AND-PERFORMANCE-ROOT-CAUSE.md) — Root cause analysis of dev compilation slowness and 60-second caching bugs.
4. [**03-BLOG-EDITORIAL-ENGINE-SPEC.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/03-BLOG-EDITORIAL-ENGINE-SPEC.md) — Specifications for the Markdown Studio, Brainstorm Scratchpad, image compression, and auto-save.
5. [**04-ARCHIFY-SYSTEM-DIAGRAMS-SPEC.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/04-ARCHIFY-SYSTEM-DIAGRAMS-SPEC.md) — Architecture and branding for interactive HTML system diagrams.
6. [**05-CLIENT-READING-EXPERIENCE-SPEC.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/05-CLIENT-READING-EXPERIENCE-SPEC.md) — Component mappings, typography, syntax highlighting, and reading UX.
7. [**06-ROADMAP-AND-EXECUTION-LOG.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/06-ROADMAP-AND-EXECUTION-LOG.md) — 5-step roadmap tracking, current status, and deferred debt ledger.

---

## 🔄 4. Standard Agent Loop

Whenever an agent begins a task:
1. **Load Context:** Read `AGENTS.md` and the relevant file in `DevDocs/`.
2. **Execute Smallest Diff:** Apply changes according to `/ponytail` principles.
3. **Verify Empirically:** Run `npm test`, `npm run lint`, and check live runtime behavior.
4. **Log Progress:** Update `DevDocs/06-ROADMAP-AND-EXECUTION-LOG.md` with what was completed, what was skipped, and known risks.
