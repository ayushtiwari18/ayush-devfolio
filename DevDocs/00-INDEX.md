# 📚 DevDocs Master Index

Welcome to the central architectural documentation and reference base for `ayush-devfolio`.
This folder serves as the single source of truth for planning, technical designs, root-cause analyses, and feature discussions.

---

## 🗂️ Documentation Directory

| Document | Title | Description |
| :--- | :--- | :--- |
| [**01-HARNESS-AND-RULES.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/01-HARNESS-AND-RULES.md) | Agent Harness & Engineering Protocol | Branch isolation, zero-hallucination verification, `/ponytail` minimal diffs, and taste standards. |
| [**02-CACHING-AND-PERFORMANCE-ROOT-CAUSE.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/02-CACHING-AND-PERFORMANCE-ROOT-CAUSE.md) | Performance & Caching Diagnostic | In-depth root causes of dev slowness, `next.config.js` cache eviction, Supabase 60s cache, and client navigation router cache. |
| [**03-BLOG-EDITORIAL-ENGINE-SPEC.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/03-BLOG-EDITORIAL-ENGINE-SPEC.md) | Markdown Editorial Studio & Authoring Spec | Dual-pane studio, Brainstorming & Notes scratchpad, image auto-compression & Supabase upload, and dual-tier auto-save. |
| [**04-ARCHIFY-SYSTEM-DIAGRAMS-SPEC.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/04-ARCHIFY-SYSTEM-DIAGRAMS-SPEC.md) | Interactive Archify System Diagrams Spec | Adaptation of `tt-a1i/archify` JSON IR for custom dark-mode, animated pulse architecture diagrams. |
| [**05-CLIENT-READING-EXPERIENCE-SPEC.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/05-CLIENT-READING-EXPERIENCE-SPEC.md) | Client Reading Experience & Component Mappings | Markdown to custom React component mappings (IDE code cards, glow callouts, tech pills, TOC navigation). |
| [**06-ROADMAP-AND-EXECUTION-LOG.md**](file:///run/media/ayush5410/Ayush/Portfolio/ayush-devfolio/DevDocs/06-ROADMAP-AND-EXECUTION-LOG.md) | 5-Step Execution Roadmap & Debt Ledger | Chronological progress tracker, task statuses, test gates, and deferred shortcut logs. |

---

## 💡 How Agents Must Use This Directory

1. **Before Starting:** Read `00-INDEX.md` and the document relevant to the feature being modified.
2. **When Uncertain:** Do not guess or hallucinate. Check the corresponding spec in `DevDocs/`. If the doc does not resolve the question, stop and consult the user directly.
3. **When Completing Work:** Update `06-ROADMAP-AND-EXECUTION-LOG.md` with what was changed, what was skipped, and any known risks.
