# ✅ DEPENDENCY FIX

## 🐛 Issue

```
Module not found: Can't resolve 'clsx'
Module not found: Can't resolve 'tailwind-merge'
```

## ✅ Solution

Missing dependencies have been added to `package.json`:

1. ✅ `clsx` - Utility for constructing className strings
2. ✅ `tailwind-merge` - Merge Tailwind CSS classes
3. ✅ `react-markdown` - Render Markdown content

---

## 🚀 How to Fix

### Step 1: Stop Dev Server
```bash
# Press Ctrl+C to stop the server
```

### Step 2: Pull Latest Code
```bash
git pull origin main
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Clear Cache
```bash
rm -rf .next
```

### Step 5: Start Dev Server
```bash
npm run dev
```

### Step 6: Visit Pages
```bash
# Home
http://localhost:3000

# Projects
http://localhost:3000/projects

# Blog
http://localhost:3000/blog
```

---

## 📦 What Was Installed

### `clsx` (^2.1.0)
**Purpose:** Utility for constructing className strings conditionally

**Used in:** `src/utils/cn.js`, Button component

**Example:**
```javascript
import { clsx } from 'clsx';

clsx('base-class', condition && 'conditional-class')
// Result: 'base-class conditional-class'
```

---

### `tailwind-merge` (^2.2.1)
**Purpose:** Merge Tailwind CSS classes without conflicts

**Used in:** `src/utils/cn.js`, UI components

**Example:**
```javascript
import { twMerge } from 'tailwind-merge';

twMerge('px-4 py-2', 'px-6') 
// Result: 'py-2 px-6' (px-4 overridden)
```

---

### `react-markdown` (^9.0.1)
**Purpose:** Render Markdown content as React components

**Used in:** Blog modal reader

**Example:**
```javascript
import ReactMarkdown from 'react-markdown';

<ReactMarkdown>
  # Hello World
  This is **bold** text
</ReactMarkdown>
```

---

## ✅ Expected Result

After running `npm install`, you should see:

```bash
added 3 packages, and audited 234 packages in 5s

56 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

---

## 🧪 Verify Installation

### Check Dependencies
```bash
npm list clsx tailwind-merge react-markdown
```

**Expected output:**
```
ayush-devfolio@1.0.0
├── clsx@2.1.0
├── react-markdown@9.0.1
└── tailwind-merge@2.2.1
```

---

## 🐛 If Still Getting Errors

### Option 1: Clean Install
```bash
# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall everything
npm install

# Clear Next.js cache
rm -rf .next

# Start dev server
npm run dev
```

### Option 2: Check Node Version
```bash
# Check your Node version
node -v

# Should be v18 or higher
# If not, update Node.js
```

### Option 3: Manual Install
```bash
# Install dependencies manually
npm install clsx@^2.1.0
npm install tailwind-merge@^2.2.1
npm install react-markdown@^9.0.1

# Then restart
rm -rf .next
npm run dev
```

---

## ✅ Quick Fix Command

**One command to fix everything:**

```bash
git pull origin main && npm install && rm -rf .next && npm run dev
```

This will:
1. ✅ Pull latest code
2. ✅ Install dependencies
3. ✅ Clear cache
4. ✅ Start dev server

---

## 📝 Why These Dependencies?

### cn() Utility Function

The `cn()` function in `src/utils/cn.js` combines `clsx` and `tailwind-merge`:

```javascript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

**Benefits:**
- ✅ Conditional class names
- ✅ Merge conflicting Tailwind classes
- ✅ Clean, readable code

**Usage:**
```javascript
import { cn } from '@/utils/cn';

<button
  className={cn(
    'px-4 py-2 rounded',
    variant === 'primary' && 'bg-blue-500',
    variant === 'secondary' && 'bg-gray-500',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
  Click me
</button>
```

---

## ✅ Status

**Dependencies**: ✅ **FIXED**

- ✅ `clsx` added
- ✅ `tailwind-merge` added
- ✅ `react-markdown` added
- ✅ All sorted alphabetically
- ✅ Ready to install

**Next steps:**
```bash
git pull origin main
npm install
rm -rf .next
npm run dev
```

---

Last Updated: January 11, 2026, 10:57 PM IST
