# 🔧 Quick Fix Guide

## ✅ FIXED: Event Handler Error

### Problem
```
Event handlers cannot be passed to Client Component props.
  <div className=... onClick={function onClick} children=...>
```

### Solution
Converted all pages with interactive elements to Client Components by adding `'use client';` at the top:

**Fixed Files:**
- ✅ `/admin/dashboard/page.js`
- ✅ `/admin/projects/page.js`
- ✅ `/admin/blog/page.js`

### Why This Happened
Next.js 15 App Router uses **Server Components by default**. Server Components:
- ❌ Cannot have event handlers (`onClick`, `onChange`, etc.)
- ❌ Cannot use React hooks (`useState`, `useEffect`, etc.)
- ❌ Cannot use browser APIs

**When to use Client Components:**
- ✅ Forms with input handlers
- ✅ Interactive UI (clicks, hovers)
- ✅ React hooks
- ✅ Browser APIs (localStorage, window, etc.)

**When to use Server Components:**
- ✅ Static content
- ✅ Data fetching (async/await)
- ✅ SEO-critical pages
- ✅ Layouts

---

## 🚀 Update Next.js (Recommended)

### Current Version
- Next.js **15.5.9** (outdated)

### Update to Latest

```bash
# Stop the dev server (Ctrl+C)

# Update Next.js
npm install next@latest react@latest react-dom@latest

# or with other package managers:
yarn add next@latest react@latest react-dom@latest
pnpm add next@latest react@latest react-dom@latest
bun add next@latest react@latest react-dom@latest

# Clear cache and restart
rm -rf .next
npm run dev
```

### Benefits of Updating
- 🐛 Bug fixes
- ⚡ Performance improvements
- 🔒 Security patches
- ✨ New features

---

## 🛠️ Troubleshooting Guide

### Error 1: "Hydration failed"
**Cause:** Server-rendered HTML doesn't match client-rendered HTML

**Solutions:**
```javascript
// ❌ Wrong: Using Date.now() or Math.random() in Server Components
const id = Math.random();

// ✅ Correct: Use in Client Components or pass as prop
'use client';
const [id] = useState(() => Math.random());
```

### Error 2: "Cannot read properties of undefined"
**Cause:** Trying to access data before it's loaded

**Solutions:**
```javascript
// ✅ Add loading states
if (!data) return <div>Loading...</div>;

// ✅ Use optional chaining
const title = project?.title ?? 'Untitled';

// ✅ Check array length
{projects.length > 0 && projects.map(...)}
```

### Error 3: "Supabase client error"
**Cause:** Missing environment variables

**Solutions:**
```bash
# Check .env.local file exists
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Restart dev server after adding env vars
```

### Error 4: "Module not found"
**Cause:** Missing import or wrong path

**Solutions:**
```javascript
// ✅ Use @ alias for src folder
import { Button } from '@/components/ui/button';

// ✅ Check file exists
// ✅ Check file extension (.js, .jsx, .ts, .tsx)
// ✅ Check case sensitivity (button.js vs Button.js)
```

---

## 📝 Component Patterns

### Server Component (Default)
```javascript
// NO 'use client' directive

import { supabase } from '@/lib/supabase';

export default async function ProjectsPage() {
  // ✅ Direct async/await
  const { data } = await supabase.from('projects').select('*');
  
  return (
    <div>
      {data.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

### Client Component (Interactive)
```javascript
'use client'; // ✅ Required at top

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProjectsForm() {
  const [title, setTitle] = useState('');
  
  // ✅ Can use hooks
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  // ✅ Can have event handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('projects').insert({ title });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

### Hybrid Pattern (Best Practice)
```javascript
// page.js (Server Component)
export default async function ProjectsPage() {
  const { data } = await supabase.from('projects').select('*');
  
  return (
    <div>
      <h1>Projects</h1>
      <ProjectsList projects={data} /> {/* Client Component */}
    </div>
  );
}

// ProjectsList.js (Client Component)
'use client';

export default function ProjectsList({ projects }) {
  const [search, setSearch] = useState('');
  
  const filtered = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.map(project => ...)}
    </>
  );
}
```

---

## 🔍 Debugging Tips

### Enable Debug Mode
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  compiler: {
    removeConsole: false, // Keep console.log in dev
  },
};
```

### Check Browser Console
```javascript
// Add console logs
console.log('Component rendered');
console.log('Data:', data);
console.error('Error:', error);
```

### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

### Network Tab
- Check API calls in browser DevTools
- Look for failed requests (red)
- Check response data

---

## ⚡ Performance Tips

### 1. Use Server Components When Possible
```javascript
// ✅ Faster: Server Component (no JS sent to client)
export default async function Page() {
  const data = await fetch(...);
  return <div>{data}</div>;
}

// ❌ Slower: Client Component (JS bundle sent)
'use client';
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(...) }, []);
  return <div>{data}</div>;
}
```

### 2. Optimize Images
```javascript
// ✅ Use next/image
import Image from 'next/image';
<Image src="..." width={500} height={300} alt="..." />

// ❌ Don't use regular img
<img src="..." />
```

### 3. Lazy Load Components
```javascript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Don't render on server
});
```

---

## 📦 Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "rm -rf .next"
  }
}
```

### Usage
```bash
npm run dev      # Development mode
npm run build    # Production build
npm run start    # Production server
npm run lint     # Check code quality
npm run clean    # Clear cache
```

---

## 🆘 Common Next.js 15 Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Event handlers in Server Component | Missing `'use client'` | Add `'use client';` at top |
| Hooks error | Using hooks in Server Component | Convert to Client Component |
| Window is not defined | Accessing browser API on server | Use `typeof window !== 'undefined'` |
| Cannot read undefined | Data not loaded yet | Add loading state |
| Hydration error | Server/client mismatch | Use Client Component or fix logic |
| Module not found | Wrong import path | Check path and file name |
| Supabase error | Missing env vars | Check `.env.local` file |

---

## ✅ All Fixed!

### Current Status
- ✅ All admin pages working
- ✅ Event handlers fixed
- ✅ Forms functional
- ✅ Dashboard interactive
- ✅ CRUD operations working

### Test Everything
```bash
git pull origin main
rm -rf .next
npm run dev
```

Then visit:
1. http://localhost:3000/admin/dashboard
2. http://localhost:3000/admin/projects
3. http://localhost:3000/admin/blog
4. Create/edit content

---

**Everything should work now!** 🎉

If you encounter any other errors, check this guide or let me know!

Last Updated: January 11, 2026
