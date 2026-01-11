# Database Documentation

## Overview
This document describes the database schema for ayush-devfolio, a production-ready developer portfolio platform.

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and anon key

### 2. Run SQL Scripts
Execute the following SQL files in order in the Supabase SQL Editor:

```bash
1. supabase/schema.sql       # Create tables and functions
2. supabase/rls-policies.sql # Enable security policies
3. supabase/seed.sql         # (Optional) Add sample data
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Create Admin User
After signing up via the application, manually add your user to admin_access:

```sql
INSERT INTO admin_access (user_id, role)
VALUES ('your-auth-user-id', 'admin');
```

## Database Schema

### Tables

#### admin_access
Manages admin users with role-based access control.

| Column     | Type      | Description                    |
|------------|-----------|--------------------------------|
| id         | uuid      | Primary key                    |
| user_id    | uuid      | References auth.users          |
| role       | text      | 'admin' or 'super_admin'       |
| created_at | timestamp | Record creation time           |
| updated_at | timestamp | Last update time               |

#### profile_settings
Single-row table containing portfolio owner information.

| Column        | Type      | Description                  |
|---------------|-----------|------------------------------|
| id            | uuid      | Primary key                  |
| name          | text      | Full name                    |
| title         | text      | Professional title           |
| description   | text      | Short bio                    |
| bio           | text      | Detailed biography           |
| github_url    | text      | GitHub profile link          |
| linkedin_url  | text      | LinkedIn profile link        |
| twitter_url   | text      | Twitter profile link         |
| resume_url    | text      | Resume file URL              |
| avatar_url    | text      | Profile picture URL          |
| updated_at    | timestamp | Last update time             |

#### projects
Portfolio projects with SEO optimization.

| Column        | Type      | Description                  |
|---------------|-----------|------------------------------|
| id            | uuid      | Primary key                  |
| title         | text      | Project title                |
| slug          | text      | URL-friendly identifier      |
| description   | text      | Short description            |
| content       | text      | Detailed markdown content    |
| technologies  | text[]    | Array of tech stack items    |
| cover_image   | text      | Cover image URL              |
| github_url    | text      | GitHub repository link       |
| live_url      | text      | Live demo link               |
| featured      | boolean   | Show on homepage             |
| published     | boolean   | Visible to public            |
| view_count    | integer   | Number of views              |
| created_at    | timestamp | Creation time                |
| updated_at    | timestamp | Last update time             |

#### blog_posts
Blog articles with markdown support.

| Column        | Type      | Description                  |
|---------------|-----------|------------------------------|
| id            | uuid      | Primary key                  |
| title         | text      | Post title                   |
| slug          | text      | URL-friendly identifier      |
| excerpt       | text      | Short summary                |
| content       | text      | Full markdown content        |
| cover_image   | text      | Cover image URL              |
| tags          | text[]    | Array of tags                |
| published     | boolean   | Visible to public            |
| reading_time  | integer   | Estimated reading time (min) |
| view_count    | integer   | Number of views              |
| created_at    | timestamp | Creation time                |
| updated_at    | timestamp | Last update time             |

#### certifications
Professional certifications and courses.

| Column          | Type      | Description                |
|-----------------|-----------|----------------------------|
| id              | uuid      | Primary key                |
| title           | text      | Certification title        |
| issuer          | text      | Issuing organization       |
| description     | text      | Details                    |
| image_url       | text      | Certificate image          |
| certificate_url | text      | Verification link          |
| issued_date     | date      | Date of issuance           |
| expiry_date     | date      | Expiration date (optional) |
| credential_id   | text      | Credential identifier      |
| published       | boolean   | Visible to public          |
| created_at      | timestamp | Creation time              |

#### hackathons
Hackathon participations and achievements.

| Column       | Type      | Description                  |
|--------------|-----------|------------------------------|
| id           | uuid      | Primary key                  |
| name         | text      | Hackathon name               |
| organizer    | text      | Organizing body              |
| role         | text      | Your role in team            |
| result       | text      | Achievement/result           |
| description  | text      | Project details              |
| image_url    | text      | Event/project image          |
| project_url  | text      | Project link                 |
| event_date   | date      | Event date                   |
| published    | boolean   | Visible to public            |
| created_at   | timestamp | Creation time                |

#### contact_messages
Contact form submissions.

| Column     | Type      | Description                          |
|------------|-----------|--------------------------------------|
| id         | uuid      | Primary key                          |
| name       | text      | Sender name                          |
| email      | text      | Sender email                         |
| subject    | text      | Message subject                      |
| message    | text      | Message content                      |
| status     | text      | 'unread', 'read', 'replied', 'archived' |
| created_at | timestamp | Submission time                      |

## Security

### Row Level Security (RLS)
All tables have RLS enabled with the following rules:

- **Public Access**: SELECT on published content only
- **Admin Access**: Full CRUD operations
- **Contact Messages**: Anyone can INSERT, only admins can read

### Admin Function
The `is_admin()` function checks if the current user exists in the `admin_access` table:

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_access 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Indexes
Optimized indexes are created for:
- Slug lookups (unique)
- Published status filtering
- Date-based sorting
- Tag searches (GIN index)

## Best Practices

1. **Always use slugs** for public-facing URLs
2. **Validate published status** before displaying content
3. **Use parameterized queries** to prevent SQL injection
4. **Leverage RLS** - never bypass it with service role key in client code
5. **Keep profile_settings as single row** - use UPDATE, not INSERT

## Maintenance

### Backup
Supabase provides automatic daily backups. For manual backups:
```bash
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

### Migration
For schema changes, create new SQL files in `supabase/migrations/` and apply them in order.
