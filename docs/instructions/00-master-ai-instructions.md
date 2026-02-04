# Master AI Instructions for Ayush DevFolio

## Project Identity
- **Language**: JavaScript (NOT TypeScript)
- **Framework**: Next.js 14+ App Router
- **Database**: Supabase
- **Styling**: Tailwind CSS + Shadcn UI

## Core Principles
1. SEO-First
2. Performance-First (Lighthouse > 90)
3. Mobile-First
4. Accessibility-First (WCAG 2.1 AA)

## Architecture Rules
- Server Components by default
- Client Components only for: hooks, events, animations
- Service layer for all data fetching
- Row Level Security on all tables

## Code Standards
- File naming: kebab-case
- Component naming: PascalCase
- Always 'use client' when needed
- JSDoc comments required
- Error boundaries everywhere

## Performance Budget
- First Load JS: < 200KB
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

## When Stuck
1. Check Space instructions
2. Review phase documentation
3. Ask for clarification

## Red Flags
- Adding npm packages
- Changing database schema
- Modifying authentication
- Breaking public API
- Lighthouse score drops