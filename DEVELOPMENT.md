# Development Guide

## 🚀 Phase 2 Complete: Public Pages & Components

### What's Built

#### Core Infrastructure
- ✅ **Navbar** - Responsive navigation with mobile menu
- ✅ **Footer** - Social links and site information
- ✅ **Three.js Background** - Animated particle system throughout site
- ✅ **Service Layer** - Clean data fetching from Supabase
- ✅ **SEO Infrastructure** - Dynamic metadata, sitemap, robots.txt

#### Public Pages
- ✅ **Homepage** - Hero with GSAP, featured projects, recent blog posts
- ✅ **About** - Profile information and skills
- ✅ **Projects** - Grid view with filtering
- ✅ **Project Detail** - Individual project pages with dynamic SEO
- ✅ **Blog** - Blog listing page
- ✅ **Blog Post Detail** - Individual blog posts with reading time
- ✅ **Certifications** - Professional certifications grid
- ✅ **Hackathons** - Hackathon achievements
- ✅ **Contact** - Working contact form with Supabase integration

#### UI Components
- ✅ Button, Card, Input, Textarea, Badge
- ✅ ProjectCard, BlogCard, CertificationCard, HackathonCard
- ✅ Hero section with lazy-loaded GSAP

---

## 🛠️ Setup Instructions

### 1. Environment Setup

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Database Setup

In Supabase SQL Editor, run these files **in order**:

```bash
1. supabase/schema.sql      # Tables, indexes, triggers
2. supabase/rls-policies.sql # Security policies
3. supabase/functions.sql    # View counting functions
4. supabase/seed.sql         # (Optional) Sample data
```

### 3. Create Admin User

After signing up via `/admin/login`, add yourself to admin_access:

```sql
-- Find your user ID in auth.users table
SELECT id, email FROM auth.users;

-- Add admin access
INSERT INTO admin_access (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

### 4. Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🏛️ Architecture Overview

### Data Flow

```
Browser Request
    ↓
Next.js App Router (Server Component)
    ↓
Service Layer (services/*.service.js)
    ↓
Supabase Client (lib/supabase.js)
    ↓
PostgreSQL + RLS Policies
    ↓
Data Response
```

### Key Patterns

#### Server Components (Default)
All pages are Server Components by default, enabling:
- SEO-friendly HTML
- Direct database queries
- No client-side JavaScript for static content

#### Client Components (When Needed)
Used for:
- Interactive forms (`'use client'` directive)
- Three.js animations
- GSAP hero animations
- State management

#### Service Layer
Centralized data fetching:
- `services/projects.service.js` - Project CRUD
- `services/blog.service.js` - Blog CRUD
- `services/contact.service.js` - Contact form

Example:
```javascript
import { getPublishedProjects } from '@/services/projects.service';

const projects = await getPublishedProjects();
```

---

## 🎨 Styling System

### Tailwind CSS
Utility-first CSS with custom theme in `tailwind.config.js`

### CSS Variables
Defined in `src/styles/globals.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... */
}
```

### Component Utilities
```javascript
import { cn } from '@/utils/cn';

// Merge Tailwind classes safely
className={cn('base-class', conditionalClass, props.className)}
```

---

## 🌐 Three.js Integration

### Global Background
`ThreeBackground` component in layout:
- Particle system with 1000 points
- Mouse interaction
- Performance optimized
- Automatically cleaned up on unmount

### Performance Considerations
- Pixel ratio capped at 2
- Alpha transparency enabled
- Geometry/material disposal on cleanup
- Positioned with `position: fixed` and `-z-10`

---

## 🔍 SEO Strategy

### Static Metadata (layout.js)
```javascript
export const metadata = {
  title: {
    default: 'Ayush Tiwari',
    template: '%s | Ayush Tiwari',
  },
  description: '...',
  openGraph: { /* ... */ },
  twitter: { /* ... */ },
};
```

### Dynamic Metadata (pages)
```javascript
export async function generateMetadata({ params }) {
  const project = await getProjectBySlug(params.slug);
  
  return {
    title: project.title,
    description: project.description,
    // ...
  };
}
```

### SEO Files
- **sitemap.js** - Auto-generated from database
- **robots.js** - Search engine directives

---

## 📝 Content Management

### Adding Projects
```sql
INSERT INTO projects (
  title, slug, description, content,
  technologies, cover_image, github_url, live_url,
  featured, published
) VALUES (
  'Project Name',
  'project-slug',
  'Short description',
  'Full markdown content',
  ARRAY['Next.js', 'React', 'Tailwind'],
  'https://image-url.com/cover.jpg',
  'https://github.com/user/repo',
  'https://live-demo.com',
  true,  -- featured on homepage
  true   -- visible to public
);
```

### Adding Blog Posts
```sql
INSERT INTO blog_posts (
  title, slug, excerpt, content,
  tags, cover_image, reading_time, published
) VALUES (
  'Blog Title',
  'blog-slug',
  'Short excerpt for cards',
  '# Full Markdown Content\n\nParagraph...',
  ARRAY['JavaScript', 'Tutorial'],
  'https://image-url.com/cover.jpg',
  8,    -- reading time in minutes
  true  -- published
);
```

---

## 🐛 Common Issues & Solutions

### Issue: "Missing env variables"
**Solution:** Create `.env.local` with all required Supabase credentials

### Issue: "Failed to fetch data"
**Solution:** 
1. Check Supabase is running
2. Verify RLS policies are applied
3. Ensure data exists in tables

### Issue: "Three.js not appearing"
**Solution:** Check browser console for WebGL errors. Some browsers/devices may not support WebGL.

### Issue: "Hydration errors"
**Solution:** Ensure client components have `'use client'` directive and don't rely on `window` in initial render.

---

## 📦 Deployment Checklist

### Pre-Deployment
- [ ] Update `NEXT_PUBLIC_SITE_URL` in production env
- [ ] Verify all Supabase credentials
- [ ] Test all pages locally
- [ ] Check mobile responsiveness
- [ ] Run `npm run build` successfully

### Vercel Deployment
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Post-Deployment
- [ ] Test all public routes
- [ ] Verify SEO metadata (view page source)
- [ ] Check sitemap: `yourdomain.com/sitemap.xml`
- [ ] Submit sitemap to Google Search Console
- [ ] Test contact form submission

---

## 📊 Next Steps: Phase 3 - Admin Panel

Upcoming features:
- Admin authentication
- CRUD interfaces for projects/blog/certifications
- Rich text editor for content
- Image upload to Supabase Storage
- Analytics dashboard

---

## 📝 Best Practices

### JavaScript Conventions
- Use descriptive variable names
- Defensive null checks
- Clear function purposes
- Minimal comments (self-documenting code)

### Component Structure
```javascript
// 1. Imports
import { ... } from '...';

// 2. Component
export function Component({ props }) {
  // 3. Hooks (if client component)
  const [state, setState] = useState();
  
  // 4. Handlers
  const handleClick = () => { };
  
  // 5. Render
  return <div>...</div>;
}
```

### Data Fetching
- Always use try/catch
- Provide fallback UI
- Log errors for debugging

```javascript
let data = [];
try {
  data = await fetchData();
} catch (error) {
  console.error('Failed to fetch:', error);
}
```

---

## 🔗 Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
# Run in Supabase SQL Editor
```

---

## 📧 Support

For issues or questions:
- Check [DATABASE.md](DATABASE.md) for schema details
- Review [README.md](README.md) for overview
- Open GitHub issue for bugs

---

**Built with production-grade architecture by Ayush Tiwari**
