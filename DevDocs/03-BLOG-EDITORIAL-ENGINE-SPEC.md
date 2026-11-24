# ✍️ 03 — Blog Editorial Engine Specification

This document details the architectural specification for the in-context Markdown Editorial Studio, designed for deep technical writing, brainstorming, and MCP-assisted authoring.

---

## 1. Design Principles

1. **Markdown-First, Zero Notion Slash Bloat:**
   - Authoring occurs in clean, standard GitHub-Flavored Markdown (GFM).
   - No rigid block structures, no ProseMirror cursor lock-in, no slash-command popups interrupting the flow.
2. **Scratchpad for Continuous Brainstorming:**
   - A dedicated slide-out drawer / sidebar for notes, outlines, reference links, and draft ideas.
   - Saves alongside the post so raw thoughts are never lost.
3. **Frictionless Media:**
   - Paste or drag-and-drop an image directly into the editor.
   - Automatically compressed in a background WebWorker via `browser-image-compression`.
   - Uploaded to Supabase Storage bucket (`blog`).
   - Inserts `![Image description](https://...supabase.co/...)` at the cursor position.
4. **Resilient Auto-Save:**
   - **Tier 1 (Instant):** Debounced write to browser `localStorage` every 1 second (zero keystroke loss on tab close).
   - **Tier 2 (Database):** Background save to Supabase `blog_posts` table (status: `draft` or `published`) every 15 seconds of inactivity or on explicit save.
5. **Antigravity / MCP Synergy:**
   - Antigravity connects directly via MCP to Supabase or reads local drafts.
   - Because content is stored as clean Markdown, Antigravity can critique, rewrite, add deep engineering context, or generate Archify system diagrams with zero formatting corruption.

---

## 2. Editor Layout Architecture

```
+-----------------------------------------------------------------------------+
| Header: [Back to Blog]  Title Input (H1)  [Status: Saved]  [Notes] [Publish]|
+-----------------------------------------------------------------------------+
| Formatting Toolbar: [B] [I] [Link] [Code] [Callout] [Diagram] [Upload Img]  |
+------------------------------------+----------------------------------------+
|                                    |                                        |
|  LEFT PANE: Raw Markdown Editor    |  RIGHT PANE: Live Synchronized Preview |
|  - JetBrains Mono font             |  - Rendered with BlogContent.js        |
|  - Line numbers                    |  - Live IDE code syntax highlighting   |
|  - Quick shortcuts                 |  - Interactive Archify diagrams        |
|  - Image drop zone                 |  - Table of Contents updates live      |
|                                    |                                        |
+------------------------------------+----------------------------------------+
| Collapsible Drawer: Brainstorming & Notes Scratchpad                        |
+-----------------------------------------------------------------------------+
```

---

## 3. Data Schema in Supabase (`blog_posts`)

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary key |
| `title` | `text` | Post title |
| `slug` | `text` | Unique URL slug (auto-generated or custom) |
| `content` | `text` | Raw Markdown content containing GFM and custom blocks |
| `notes` | `text` | Brainstorming notes, outlines, and scratchpad data |
| `excerpt` | `text` | 1–2 sentence summary for SEO and previews |
| `cover_image` | `text` | Hero cover image URL |
| `tags` | `text[]` | Array of topic tags (e.g., `['Next.js', 'Architecture', 'AI']`) |
| `published` | `boolean` | `true` if public, `false` if draft |
| `reading_time`| `text` | Estimated reading duration |
| `created_at` | `timestamptz` | Post creation timestamp |
| `updated_at` | `timestamptz` | Last updated timestamp |
