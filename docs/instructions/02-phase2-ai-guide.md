# Phase 2 AI Guide

## Goal
Learn from old project mistakes.

## Critical Learnings
1. Admin panel existed (was broken)
2. TypeScript slowed development
3. SEO was completely missing
4. GSAP loaded globally (slow)
5. No error handling

## Anti-Patterns to Avoid
- Weak authentication
- Client-side data fetching
- Missing metadata
- Global GSAP imports
- No loading states

## Correct Patterns
- Server Components for data
- admin_access table
- Lazy load GSAP
- Error boundaries
- Optimistic updates