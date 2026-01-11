# Ayush DevFolio - Modern Developer Portfolio

> A clean, SEO-optimized, production-ready developer portfolio built with **Next.js 15**, **Tailwind CSS**, and **Supabase**.

![Portfolio Preview](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### 🎨 Design
- **Dark Purple Theme** - Modern purple accent colors with dark backgrounds
- **Glass Morphism** - Subtle transparent card effects
- **Card Glows** - Purple glow effects on hover
- **Smooth Animations** - Framer Motion & custom CSS animations
- **Three.js Background** - Interactive 3D particle background
- **Responsive Design** - Mobile-first, works on all devices

### 📄 Pages
- ✅ **Home** - Hero section with Three.js background
- ✅ **About** - Skills, experience, education, achievements
- ✅ **Projects** - Grid view with featured projects
- ✅ **Project Detail** - Individual project pages with slug-based URLs
- ✅ **Blog** - Article listing with tags and reading time
- ✅ **Blog Post** - Full blog posts with markdown support
- ✅ **Certifications** - Professional certifications showcase
- ✅ **Hackathons** - Competition participation and achievements
- ✅ **Contact** - Functional contact form with Supabase

### 🔧 Technical Features
- **Server Components** - SEO-optimized by default
- **Dynamic Metadata** - Per-page SEO configuration
- **Sitemap & Robots.txt** - Automatic generation
- **Image Optimization** - Next.js Image component
- **Database Integration** - Supabase PostgreSQL
- **API Routes** - Contact form endpoint
- **Error Handling** - Graceful error states

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/ayushtiwari18/ayush-devfolio.git
cd ayush-devfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations (see Database Setup below)

# Start development server
npm run dev
```

Visit http://localhost:3000

---

## 🗄️ Database Setup

### Supabase Configuration

1. Create a new project on [Supabase](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. Run the following SQL in Supabase SQL Editor:

```sql
-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  technologies TEXT[],
  cover_image TEXT,
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  views INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT true,
  reading_time INT,
  views INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications table
CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  image TEXT,
  url TEXT,
  date DATE NOT NULL
);

-- Hackathons table
CREATE TABLE hackathons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  result TEXT,
  description TEXT,
  technologies TEXT[],
  image TEXT,
  date DATE NOT NULL
);

-- Contact messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enable Row Level Security (Optional for Production)

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "public_read_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_blog_posts" ON blog_posts FOR SELECT TO anon, authenticated USING (true);
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── blog/              # Blog listing & detail pages
│   ├── certifications/    # Certifications page
│   ├── contact/           # Contact form page
│   ├── hackathons/        # Hackathons page
│   ├── projects/          # Projects listing & detail
│   ├── api/               # API routes
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   ├── robots.js          # Robots.txt
│   └── sitemap.js         # Dynamic sitemap
│
├── components/
│   ├── layout/            # Navbar, Footer, ThreeBackground
│   ├── sections/          # Hero, About, Skills sections
│   ├── cards/             # Reusable card components
│   └── ui/                # Shadcn UI components
│
├── lib/
│   ├── supabase.js        # Supabase client
│   ├── seo.js             # SEO utilities
│   └── constants.js       # App constants
│
├── services/
│   ├── projects.service.js  # Project data fetching
│   ├── blog.service.js      # Blog data fetching
│   └── contact.service.js   # Contact form handling
│
└── styles/
    └── globals.css        # Global styles & theme
```

---

## 🎨 Customization

### Theme Colors

Edit `src/styles/globals.css` to customize colors:

```css
.dark {
  --primary: 217.2 91.2% 59.8%;  /* Purple accent */
  --background: 222.2 47.4% 11.2%; /* Dark background */
  /* ... more colors */
}
```

### Content

- **Profile Info**: Update `src/lib/constants.js`
- **Projects**: Add via database or admin panel
- **Blog Posts**: Add via database or admin panel

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📊 SEO Features

- ✅ Dynamic metadata per page
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Sitemap generation
- ✅ Robots.txt
- ✅ Semantic HTML
- ✅ Image optimization

---

## 🔜 Coming Soon

- [ ] Admin panel for content management
- [ ] Blog post markdown editor
- [ ] Image upload to Supabase Storage
- [ ] Project filtering and search
- [ ] Dark/Light mode toggle
- [ ] Analytics integration

---

## 📝 License

MIT License - feel free to use this for your own portfolio!

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

---

## 📧 Contact

- **Email**: ayush@example.com
- **GitHub**: [@ayushtiwari18](https://github.com/ayushtiwari18)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com)

---

**Built with ❤️ by Ayush Tiwari**
