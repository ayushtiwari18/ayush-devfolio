# 🚀 Ayush Devfolio

> **Production-ready, SEO-optimized developer portfolio + CMS**

Built with Next.js 15, JavaScript, Three.js, and Supabase.

## ✨ Features

- **SEO-First Architecture** - Server-side rendering, dynamic metadata, sitemap generation
- **Three.js Integration** - Subtle 3D enhancements throughout the site
- **Admin CMS** - Full content management system with authentication
- **Blog Platform** - Markdown-based blog with reading time estimation
- **Project Showcase** - Portfolio projects with detailed case studies
- **Certifications & Hackathons** - Professional achievements display
- **Contact Form** - Integrated message management system

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router) - React framework with SSR/SSG
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS
- **Shadcn UI** - Component library (JS version)
- **Three.js** - 3D graphics
- **Framer Motion** - Micro-animations
- **GSAP** - Hero animations (lazy-loaded)

### Backend
- **Supabase** - Auth, PostgreSQL, Storage
- **Row Level Security** - Database-level access control

## 📦 Installation

### Prerequisites
- Node.js 18+
- Supabase account

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/ayushtiwari18/ayush-devfolio.git
cd ayush-devfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run SQL scripts from `supabase/` directory in order:
     1. `schema.sql`
     2. `rls-policies.sql`
     3. `seed.sql` (optional)

4. **Set environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. **Run development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

See [DATABASE.md](DATABASE.md) for complete schema documentation.

### Core Tables
- `admin_access` - Admin user management
- `profile_settings` - Portfolio owner info (single row)
- `projects` - Portfolio projects
- `blog_posts` - Blog articles
- `certifications` - Professional certifications
- `hackathons` - Hackathon achievements
- `contact_messages` - Contact form submissions

## 🔐 Admin Access

After signing up, manually add your user ID to `admin_access` table:

```sql
INSERT INTO admin_access (user_id, role)
VALUES ('your-auth-user-id', 'admin');
```

Access admin panel at `/admin`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout with SEO
│   ├── page.js            # Homepage
│   ├── about/
│   ├── projects/
│   ├── blog/
│   ├── certifications/
│   ├── hackathons/
│   ├── contact/
│   └── admin/             # Admin CMS
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── sections/          # Hero, About, Skills
│   ├── cards/             # ProjectCard, BlogCard
│   └── ui/                # Shadcn components
├── lib/
│   ├── supabase.js        # Supabase client
│   ├── seo.js             # SEO utilities
│   └── constants.js       # App constants
├── services/              # Data fetching logic
├── styles/
│   └── globals.css        # Global styles + Tailwind
└── utils/                 # Helper functions
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📊 Development Phases

- [x] **Phase 1**: Foundation (Next.js, Tailwind, SEO base)
- [ ] **Phase 2**: Public Pages (Projects, Blog, etc.)
- [ ] **Phase 3**: Three.js Integration
- [ ] **Phase 4**: Admin Panel
- [ ] **Phase 5**: Supabase Wiring
- [ ] **Phase 6**: SEO & Performance Polish

## 🎯 SEO Features

- Dynamic metadata per page
- Automatic sitemap generation
- robots.txt configuration
- Open Graph tags
- Twitter Card support
- Semantic HTML
- Canonical URLs
- Structured data (JSON-LD)

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

## 🤝 Contributing

This is a personal portfolio project, but feel free to fork and customize for your own use.

## 📧 Contact

**Ayush Tiwari**
- GitHub: [@ayushtiwari18](https://github.com/ayushtiwari18)
- Portfolio: [ayusht.netlify.app](https://ayusht.netlify.app)

---

**Built with ❤️ by Ayush Tiwari**
