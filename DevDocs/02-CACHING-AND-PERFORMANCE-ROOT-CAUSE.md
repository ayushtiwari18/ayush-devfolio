# ⚡ 02 — Caching & Performance Root Cause Analysis

This document details the exact technical reasons why `ayush-devfolio` experienced slow compilation times, high memory usage, sluggish page transitions, and caching issues requiring incognito windows in development mode.

---

## 1. Problem A: The Dev Cache / Incognito Nightmare

### Symptoms
* Author edits a blog post or profile setting in the admin interface.
* Navigating to the public page shows stale data.
* Author has to hard refresh (`Ctrl+F5`) or open multiple Incognito tabs to see changes.

### Root Causes
1. **Global Server-Side ISR Cache in `src/lib/supabase.js`:**
   In `src/lib/supabase.js`, the custom fetch wrapper was injecting `next: { revalidate: 60 }` into every server-side `GET` query unconditionally:
   ```javascript
   // src/lib/supabase.js (FLAWED LOGIC)
   return fetch(url, {
     ...restOptions,
     next: { revalidate: 60, ...(options.next || {}) },
   });
   ```
   In Next.js App Router, this forces Server Components to cache Supabase database responses in the Next.js Data Cache for 60 seconds. In local development (`process.env.NODE_ENV === 'development'`), caching database reads causes immediate frustration because mutations appear ignored for up to 1 minute.

2. **Next.js Client-Side Router Cache:**
   Next.js 14 stores visited page segments in browser memory for 30 seconds (dynamic routes) or 5 minutes (static routes). When navigating via `<Link>` or `router.push`, the browser serves the client cache without hitting the server unless `router.refresh()` or `revalidatePath` is invoked.

### Permanent Fix
* In `src/lib/supabase.js`, detect `process.env.NODE_ENV === 'development'`. When running locally, set `cache: 'no-store'` and `revalidate: 0` so every database read is 100% fresh in real time.
* On post/profile mutation, trigger Next.js cache invalidation (`revalidatePath`) and client-side `router.refresh()`.

---

## 2. Problem B: Painfully Slow Dev Compilation & Navigation Lag

### Symptoms
* Compiling a route takes 10–30+ seconds.
* Navigating between pages in dev mode freezes the browser or shows a spinning loading icon.
* Node.js crashes with heap out-of-memory unless invoked with `--max-old-space-size=2048`.

### Root Causes
1. **Aggressive Page Eviction in `next.config.js`:**
   ```javascript
   // next.config.js (FLAWED CONFIGURATION)
   onDemandEntries: {
     maxInactiveAge: 15 * 1000,
     pagesBufferLength: 2,
   },
   ```
   * `maxInactiveAge: 15000` tells Next.js to drop compiled page bundles from memory after just 15 seconds of inactivity.
   * `pagesBufferLength: 2` restricts the memory buffer to only 2 pages.
   * **Consequence:** Navigating between Home -> About -> Blog -> Home forced Next.js to throw away previous compilations and recompile every page from scratch every single time you clicked a link!

2. **Crippled Webpack Cache:**
   ```javascript
   if (dev) {
     config.cache = {
       type: 'memory',
       maxGenerations: 1,
     };
   }
   ```
   Limiting Webpack cache to 1 generation in memory prevents incremental compilation.

3. **Dead / Bulky Client Dependencies:**
   * `novel`: ~400KB bundle importing heavy ProseMirror AST schemas and Radix UI primitives.
   * `page-flip` / `react-pageflip`: Heavy canvas animation libraries.
   * `mermaid`: Multi-megabyte diagram parsing bundle loaded into the main bundle rather than code-split on demand.

### Permanent Fix
* Remove the aggressive `onDemandEntries` eviction from `next.config.js`.
* Allow Next.js / Webpack / Turbopack to use standard persistent filesystem caching.
* Prune `novel` and unused dependencies from `package.json`.
