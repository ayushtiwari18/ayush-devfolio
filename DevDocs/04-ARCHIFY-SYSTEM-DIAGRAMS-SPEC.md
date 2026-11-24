# 📐 04 — Interactive Archify System Diagrams Spec

This document details how we adapt the core concepts from [`tt-a1i/archify`](https://github.com/tt-a1i/archify.git) to build native, interactive, beautifully branded system architecture diagrams for `ayush-devfolio`.

---

## 1. Motivation & Philosophy
* **The Problem with Standard Tools:** Mermaid diagrams render as basic, low-contrast SVG flowcharts that clash with our portfolio’s high-taste developer aesthetic. Static images (PNG/WebP) are non-interactive, blurry on retina screens, and difficult to update.
* **The Archify Solution:** Archify uses a declarative **JSON Intermediate Representation (JSON IR)** to render structured architecture diagrams with interactive elements.
* **Our Modification:** Rather than importing Archify's heavy 800KB standalone HTML bundle, we build a **custom, lightweight React component** (`<ArchifyDiagram />`) matching `ayush-devfolio` branding.

---

## 2. Declarative JSON IR Format

In a blog post, a system diagram is declared using a custom fenced code block:

````markdown
```diagram:arch
{
  "title": "Real-time AI Co-Authoring Pipeline",
  "components": [
    { "id": "client", "type": "frontend", "label": "Markdown Studio", "sublabel": "Next.js 14 Client", "pos": [50, 100], "size": [150, 56] },
    { "id": "server", "type": "backend", "label": "Edge API", "sublabel": "Server Actions", "pos": [260, 100], "size": [150, 56] },
    { "id": "db", "type": "database", "label": "Supabase Postgres", "sublabel": "Drafts & Notes", "pos": [470, 100], "size": [150, 56] },
    { "id": "ai", "type": "agent", "label": "Antigravity Agent", "sublabel": "MCP Server", "pos": [260, 220], "size": [150, 56] }
  ],
  "connections": [
    { "from": "client", "to": "server", "label": "Auto-save", "flow": "forward" },
    { "from": "server", "to": "db", "label": "Upsert Draft", "flow": "forward" },
    { "from": "ai", "to": "db", "label": "Inspect & Enhance", "flow": "bidirectional" }
  ]
}
```
````

---

## 3. Visual Branding & Component Styling

* **Container:** `#080B11` deep canvas with subtle grid dots and `#1E293B` borders.
* **Component Types & Colors:**
  * `frontend`: Indigo border (`rgba(99, 102, 241, 0.4)`), `#6366F1` pill glow.
  * `backend`: Emerald border (`rgba(16, 185, 129, 0.4)`), `#10B981` pill glow.
  * `database`: Amber border (`rgba(245, 158, 11, 0.4)`), `#F59E0B` pill glow.
  * `agent` / `ai`: Purple border (`rgba(168, 85, 247, 0.4)`), `#A855F7` pill glow.
  * `external`: Slate border (`rgba(148, 163, 184, 0.4)`).
* **Connections:** Smooth SVG Bézier curves with animated traveling pulses (`stroke-dasharray` animation) indicating active data flow.
* **Interactivity:**
  * Zoom and pan controls (`+`, `-`, reset).
  * Node hover highlights connected edges and dims unrelated components.
  * Tooltips displaying sublabels and metadata.

---

## 4. Antigravity Generation Protocol
Because the diagram is defined as structured JSON, Antigravity can:
1. Parse complex software architectures from raw text descriptions.
2. Calculate node positions (`pos: [x, y]`) and connect edges automatically.
3. Insert or update the ````diagram:arch```` block in the Markdown draft during co-authoring sessions via MCP.
