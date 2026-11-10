# 14. Events & Pehel Case Study Modernization

## Overview
This document specifies the architectural and visual modernization of:
1. `http://localhost:3000/events`: The Events & Hackathons catalog hub.
2. `http://localhost:3000/events/pehel`: The cinematic case study for *Pehel – Ek Nayi Subha | 8th Edition (Video Production Lead & Core Organizer)*.

## Principles & Design Standards
- **Design Taste Frontend (`tasteskill 2.5`)**: Deep Space Obsidian theme (`#05070B`, `#090D16`), cyan/emerald accents, crisp 1px borders (`border-white/10`), anti-slop typography, balanced whitespace, and purposeful micro-interactions.
- **Narrative Storytelling**: Transform raw event listings into engaging editorial case studies featuring the human, technical, and creative impact.
- **Media-First**: 16:9 embedded YouTube theater frame, ambient backlight, and interactive photo gallery with full-screen lightbox.

## Architecture

### 1. Unified Event Service (`src/services/events.service.js`)
- Harmonize data between the `events` table (rich case studies like Pehel) and `hackathons` / `timeline_events` (SIH 2024, HackByte 2.0 & 4.0, IBM Hack, etc.).
- Allow `/events` to render a comprehensive, rich journey with accurate stats: Total Milestones, Podium Wins, Hackathons, and Community Leadership initiatives.

### 2. Events Catalog (`src/app/events/page.js` & `EventsCatalogClient.js`)
- Obsidian command masthead with category filter pills (`All`, `Hackathons`, `Leadership & Creative`, `Competitions`).
- Instant client-side search by title, tech stack, or organizer.
- Uniform cards with 16:10 poster/media framing, role badges, date, result tag, and deep links.
- Verified navbar clearance (`pt-28 sm:pt-36`) to avoid overlap.

### 3. Pehel Case Study (`src/app/events/[slug]/page.js` & `PehelStoryView.js`)
- Editorial layout replacing the broken, content-blocking `ZoomParallax`.
- Sticky minimal reading bar with back navigation to `/events`.
- Embedded 16:9 YouTube video player (`https://youtu.be/zhoe5JBrwJ4`) inside an obsidian theater frame.
- 4-chapter narrative structure:
  1. *The Vision & Auxiliary Staff Tribute*
  2. *Live Coverage & Production Challenges*
  3. *The Standout Moment ("Main Shayar Toh Nahi" standing ovation)*
  4. *Leadership & Fast Turnaround Takeaways*
- Full-screen interactive modal lightbox for photo gallery with keyboard navigation (`Esc`, `ArrowLeft`, `ArrowRight`).
- Production toolkit grid (Premiere Pro, Photography, Event Management, Audio & Stage Coordination).

## Verification
- Babel AST offline syntax check.
- Jest test suite (`npm test`).
- Verified responsive layout on mobile, tablet, and desktop.
