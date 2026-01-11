# 🔧 Troubleshooting Guide - Supabase Connection

This guide will help you diagnose and fix connection issues between your Next.js app and Supabase.

## 📋 Quick Checklist

- [ ] `.env.local` file exists in root directory (not in `src/`)
- [ ] All three environment variables are set correctly
- [ ] Service role key is the actual key (not placeholder text)
- [ ] Development server was restarted after `.env.local` changes
- [ ] RLS policies are enabled and configured
- [ ] At least one test project exists in database

---

## 🚀 Step-by-Step Fix

### Step 1: Verify Environment Variables

**Location**: Create/check `.env.local` in ROOT directory

```
ayush-devfolio/
├── src/
├── .env.local          ← HERE (root level)
├── package.json
└── ...
```

**Content** of `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tzsonumsxavkscaowxto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6c29udW1zeGF2a3NjYW93eHRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NjI4NjEsImV4cCI6MjA2MTAzODg2MX0.sVk214daSHqAvXbOGIYADaLrM29D-TFoKB8gO8-vii4
SUPABASE_SERVICE_ROLE_KEY=<YOUR_ACTUAL_SERVICE_ROLE_KEY>

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Get Your Service Role Key**:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `tzsonumsxavkscaowxto`
3. Go to **Settings** → **API**
4. Copy the **`service_role`** key (long JWT token)
5. Replace `<YOUR_ACTUAL_SERVICE_ROLE_KEY>` with it

### Step 2: Set Up RLS Policies

**IMPORTANT**: This is likely your main issue!

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy contents from `supabase/setup-rls-policies.sql`
5. Paste and click **Run**

Or directly run this SQL:

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Public read access to projects"
ON projects FOR SELECT
TO anon, authenticated
USING (true);

-- Admin write access
CREATE POLICY "Admin full access to projects"
ON projects FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_access
    WHERE admin_access.user_id = auth.uid()
  )
);
```

### Step 3: Add Test Data

Run this in Supabase SQL Editor:

```sql
-- Insert test project
INSERT INTO projects (
  id,
  title,
  slug,
  description,
  technologies,
  featured,
  published,
  created_at
) VALUES (
  gen_random_uuid(),
  'Test Project',
  'test-project',
  'This is a test project to verify connection',
  ARRAY['Next.js', 'Tailwind CSS', 'Supabase'],
  true,
  true,
  NOW()
);

-- Verify
SELECT * FROM projects WHERE featured = true;
```

### Step 4: Restart Development Server

```bash
# Stop server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Start fresh
npm run dev
```

### Step 5: Run Diagnostic Test

Once server is running, visit:

```
http://localhost:3000/api/test-db
```

You should see a JSON response with test results.

**Expected Output** (when working):
```json
{
  "overall_status": "HEALTHY",
  "environment": {
    "NEXT_PUBLIC_SUPABASE_URL": true,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": true,
    "SUPABASE_SERVICE_ROLE_KEY": true
  },
  "tests": {
    "connection": {
      "status": "PASS"
    },
    "projects_table": {
      "status": "PASS",
      "total_count": 1,
      "projects": [{
        "title": "Test Project",
        "featured": true
      }]
    }
  }
}
```

---

## 🔍 Debugging Common Errors

### Error: "Failed to fetch featured projects: {}"

**Cause**: RLS policies blocking access or no data

**Fix**:
1. Run Step 2 (RLS policies)
2. Run Step 3 (Add test data)
3. Restart server

### Error: "Missing env.NEXT_PUBLIC_SUPABASE_URL"

**Cause**: Environment variables not loaded

**Fix**:
1. Verify `.env.local` is in root directory
2. Check file is named exactly `.env.local` (not `.env` or `env.local`)
3. Restart server

### Error: "Invalid API key"

**Cause**: Wrong anon key or service role key

**Fix**:
1. Go to Supabase Dashboard → Settings → API
2. Copy fresh keys
3. Ensure no spaces or line breaks in keys
4. Restart server

### Error: "new row violates row-level security policy"

**Cause**: RLS enabled but no policies created

**Fix**: Run the SQL in Step 2

---

## 🧪 Manual Testing Commands

### Test Supabase Connection (Node.js)

Create `test-connection.js` in root:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tzsonumsxavkscaowxto.supabase.co',
  'your_anon_key'
);

async function test() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .limit(5);

  console.log('Data:', data);
  console.log('Error:', error);
}

test();
```

Run: `node test-connection.js`

### Check Environment Variables in Browser

Create `src/app/api/debug-env/route.js`:

```javascript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}
```

Visit: `http://localhost:3000/api/debug-env`

---

## 📊 Checking Server Logs

### What to Look For

When you run `npm run dev`, you should see:

```
✅ Supabase URL configured: https://tzsonumsxavkscaowxto.supabase.co
✅ Supabase Anon Key configured: Yes
✅ Supabase Service Key configured: Yes
⭐ Fetching featured projects...
✅ Fetched 1 featured projects
```

### Red Flags

```
❌ NEXT_PUBLIC_SUPABASE_URL is missing
❌ Error fetching featured projects: {...}
```

---

## 🎯 Final Verification

### All Systems Should Be Green

1. **Environment**: ✅ All 3 variables set
2. **RLS Policies**: ✅ Created and enabled
3. **Test Data**: ✅ At least 1 featured project exists
4. **API Test**: ✅ `/api/test-db` returns HEALTHY
5. **Homepage**: ✅ Featured projects display

---

## 🆘 Still Not Working?

### Collect Debug Info

1. Run diagnostic: `http://localhost:3000/api/test-db`
2. Check server logs (terminal where `npm run dev` is running)
3. Check browser console (F12 → Console tab)
4. Share this info when asking for help

### Reset Everything

```bash
# Stop server
# Remove cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall (if needed)
npm install

# Start fresh
npm run dev
```

---

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

**Need Help?** Open an issue with:
- Output from `/api/test-db`
- Server logs
- Browser console errors
