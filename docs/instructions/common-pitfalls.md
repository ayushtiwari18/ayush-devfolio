# Common Pitfalls to Avoid

## ❌ NEVER DO

### Language & Framework
- Don't use TypeScript (project is JavaScript-only)
- Don't use Pages Router (use App Router)
- Don't use CSS-in-JS (Tailwind only)
- Don't create CSS modules (except globals.css)

### Components
- Don't fetch data in Client Components
- Don't use 'use client' unnecessarily
- Don't create new state management (use Context)
- Don't forget to cleanup effects
- Don't ignore error boundaries

### Data & API
- Don't call Supabase from Client Components
- Don't expose API keys in client code
- Don't skip error handling
- Don't forget loading states
- Don't trust client-side validation only

### Performance
- Don't import GSAP globally
- Don't load all images eagerly
- Don't skip code splitting
- Don't ignore bundle size
- Don't block main thread

### SEO
- Don't skip metadata on any page
- Don't use regular <img> tags
- Don't forget alt text
- Don't ignore structured data
- Don't skip sitemap generation

### Admin Panel
- Don't skip admin role verification
- Don't trust client-side auth checks
- Don't hardcode admin emails
- Don't skip form validation
- Don't forget optimistic updates

### Security
- Don't commit secrets to GitHub
- Don't skip input sanitization
- Don't expose sensitive data in logs
- Don't skip RLS policies
- Don't trust user input

## ✅ ALWAYS DO

### Code Quality
- Use Server Components by default
- Add JSDoc comments
- Handle all error cases
- Add loading states
- Test on mobile

### Performance
- Use next/image for all images
- Lazy load heavy components
- Code split large libraries
- Optimize bundle size
- Monitor Core Web Vitals

### SEO
- Add metadata to every page
- Use semantic HTML
- Include structured data
- Generate dynamic sitemaps
- Optimize images

### Accessibility
- Add ARIA labels
- Ensure keyboard navigation
- Maintain color contrast
- Test with screen readers
- Respect reduced-motion

### Admin
- Verify admin role server-side
- Validate forms with Zod
- Use optimistic updates
- Provide user feedback
- Log admin actions

## Common Mistakes

### Mistake #1: Mixing Server/Client
```javascript
// ❌ WRONG
'use client';
export default async function Page() {
  const data = await fetch();
}

// ✅ CORRECT
export default async function Page() {
  const data = await fetch(); // Server Component
}
```

### Mistake #2: Global GSAP
```javascript
// ❌ WRONG
import gsap from 'gsap';

// ✅ CORRECT
const { gsap } = await import('gsap');
```

### Mistake #3: Missing Metadata
```javascript
// ❌ WRONG
export default function Page() {}

// ✅ CORRECT
export const metadata = { title: '' };
export default function Page() {}
```

### Mistake #4: Weak Admin Check
```javascript
// ❌ WRONG
if (user) { /* admin access */ }

// ✅ CORRECT
const { data } = await supabase
  .from('admin_access')
  .select('role')
  .eq('user_id', user.id)
  .single();
if (data?.role === 'admin') {}
```

### Mistake #5: No Error Handling
```javascript
// ❌ WRONG
const data = await fetch();
setData(data);

// ✅ CORRECT
try {
  const data = await fetch();
  setData(data);
} catch (error) {
  setError(error.message);
}
```

## When in Doubt

1. Check Space instructions first
2. Review phase documentation
3. Look at existing implementations
4. Ask for clarification (don't assume)
5. Validate with decision framework

## Recovery from Mistakes

If you realize you made a mistake:
1. Stop immediately
2. Revert changes
3. Review correct pattern
4. Re-implement properly
5. Test thoroughly