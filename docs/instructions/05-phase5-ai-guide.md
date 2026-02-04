# Phase 5 AI Guide

## Goal
Implement atomic timeline components.

## Implementation Order
1. ScrollProvider (context)
2. useWaypoint hook
3. TimelineContainer
4. TimelineTrack
5. TimelineEvent
6. EventCard variants
7. MediaGallery
8. VideoPlayer + RippleEffect

## Critical Rules
- GSAP lazy loaded
- 'use client' only when needed
- Cleanup animations
- Handle empty states
- Mobile responsive

## Performance
- 60fps scroll
- prefers-reduced-motion
- next/image for all images