# Phase 6 AI Guide

## Goal
Implement complete SEO strategy.

## SEO Requirements
- Metadata on every page
- Dynamic OG images
- Sitemap.xml generation
- robots.txt
- Structured data (JSON-LD)
- Canonical URLs

## Metadata Pattern
```javascript
export const metadata = {
  title: '',
  description: '',
  openGraph: {},
  twitter: {},
};
```

## Validation
- Google Rich Results Test
- Schema.org validator
- Lighthouse SEO = 100