-- =====================================================
-- SEED: timeline_events
-- 5 sample events covering all 6 event types.
-- Run AFTER timeline-events-migration.sql
-- =====================================================

INSERT INTO timeline_events
    (type, title, description, start_date, end_date, media, video_url, "order", featured, published)
VALUES

-- 1. College (ongoing)
(
    'college',
    'B.Tech in Computer Science — LNCT Bhopal',
    'Pursuing a Bachelor''s degree in Computer Science and Engineering. Core coursework spans data structures, operating systems, DBMS, and computer networks. Active in coding clubs and open-source initiatives.',
    '2022-08-01',
    '2026-05-31',
    '[]'::jsonb,
    NULL,
    0,
    TRUE,
    TRUE
),

-- 2. Hackathon
(
    'hackathon',
    'Smart India Hackathon 2023 — Top 10 Finalist',
    'Led a team of 6 to build a real-time disaster relief coordination platform using Next.js, WebSockets, and Google Maps API. Reached national finals from 12,000+ registered teams.',
    '2023-09-15',
    '2023-09-16',
    '[]'::jsonb,
    NULL,
    0,
    TRUE,
    TRUE
),

-- 3. Freelancing
(
    'freelancing',
    'Freelance Frontend Developer — Multiple Clients',
    'Delivered 4 production web applications for clients across e-commerce, SaaS, and education sectors. Stack: React, Next.js, Tailwind CSS, Supabase. Focused on performance and SEO from day one.',
    '2023-06-01',
    NULL,
    '[]'::jsonb,
    NULL,
    0,
    FALSE,
    TRUE
),

-- 4. Project
(
    'project',
    'ayush-devfolio — Production Portfolio Platform',
    'Designed and built a production-grade developer portfolio with CMS, admin panel, SEO-first architecture, and scroll-driven timeline. Built from scratch in JavaScript using Next.js 14 App Router and Supabase.',
    '2025-01-01',
    NULL,
    '[]'::jsonb,
    NULL,
    0,
    TRUE,
    TRUE
),

-- 5. Enjoyment
(
    'enjoyment',
    'Open Source Contributions & Community',
    'Contributed to developer tooling and documentation across GitHub. Participated in Hacktoberfest, reviewed PRs, and mentored juniors in college coding communities.',
    '2023-10-01',
    NULL,
    '[]'::jsonb,
    NULL,
    0,
    FALSE,
    TRUE
);
