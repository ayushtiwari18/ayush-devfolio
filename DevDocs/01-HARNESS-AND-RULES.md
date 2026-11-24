# 🛡️ 01 — Agent Harness & Engineering Protocol

This document outlines the strict operational and technical rules that every AI agent and developer must abide by while contributing to `ayush-devfolio`.

---

## 1. Branch Strategy & Release Protocol
* **Permanent Working Branch:** `feat/in-context-admin`.
* **Zero Production Touches:** Under no circumstances should an agent push to `origin/main` or merge into `main` without explicit, unambiguous user confirmation.
* All development, testing, and fixes occur locally on `feat/in-context-admin`.

---

## 2. Zero-Hallucination Verification Standard
* **Do not trust mocked tests alone:** While `npm test` checks unit isolation, it does not prove runtime behavior, DOM layout, or network communication.
* **Mandatory Verification Checklist before reporting a task complete:**
  1. `npm run lint` passes without fatal errors.
  2. The code compiles successfully without infinite loops or memory crashes.
  3. Real data flow is verified (e.g., verifying that Supabase API endpoints return expected payloads and that client components render without hydration mismatches).
  4. Any simulated or assumed behaviour is explicitly documented with `shortcut: <the limit>, <when to upgrade>`.

---

## 3. Engineering Paradigm: `/ponytail` (Lazy Senior Dev)
1. **Minimal Diff Wins:** The best code is the code never written. Solve the whole problem with the least new code.
2. **No Speculative Abstractions:** Do not create wrappers, utility layers, or configuration managers unless multiple existing files urgently require them.
3. **Respect Established Code Patterns:** Follow the existing patterns in `src/services`, `src/components`, and `src/lib`.
4. **End Every Reply with Accountability:** Always specify what was skipped/untested and any known risks.

---

## 4. Design Standards: `design-taste-frontend` (`tasteskill 2.5`)
1. **One Section Per Screen:** Sections at 1440x900 viewport must feel intentional, well-spaced, and not cramped.
2. **Equal Edges:** Left and right content margins must align strictly with the grid and `.wrap` boundaries.
3. **Developer-First Aesthetic:** Clean dark themes (`#080B11`, `#0D111A`), high contrast typography, authentic IDE code blocks, and subtle glowing accents.
4. **No Slop:** Never use generic AI placeholder cards, low-contrast washed-out text, or unstyled default buttons.

---

## 5. Communications & Brainstorming Protocol
* The user is the strategic decision maker and brainstorming partner.
* The agent takes complete ownership of code implementation, architecture, and bug resolution.
* Explain trade-offs clearly: "We are using X because Y; the benefit is A, the trade-off is B."
