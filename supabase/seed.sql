-- =====================================================
-- SEED DATA FOR DEVELOPMENT
-- Sample data to test the application
-- =====================================================

-- Sample Projects
INSERT INTO projects (title, slug, description, content, technologies, cover_image, github_url, live_url, featured, published)
VALUES 
(
    'E-Commerce Platform',
    'ecommerce-platform',
    'A full-stack e-commerce solution with payment integration',
    'Detailed project description with markdown support...',
    ARRAY['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    'https://images.unsplash.com/photo-1557821552-17105176677c',
    'https://github.com/ayushtiwari18/ecommerce',
    'https://ecommerce-demo.vercel.app',
    true,
    true
),
(
    'AI Content Generator',
    'ai-content-generator',
    'OpenAI-powered content generation tool for marketers',
    'Built with Next.js and OpenAI API...',
    ARRAY['Next.js', 'OpenAI', 'React', 'Tailwind CSS'],
    'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    'https://github.com/ayushtiwari18/ai-content',
    'https://ai-content.vercel.app',
    true,
    true
);

-- Sample Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, tags, cover_image, published, reading_time)
VALUES 
(
    'Building SEO-Optimized Next.js Applications',
    'nextjs-seo-guide',
    'A comprehensive guide to implementing SEO best practices in Next.js 15',
    '# Introduction\n\nNext.js is a powerful framework...\n\n## Key Points\n\n1. Metadata API\n2. Server Components\n3. Dynamic Sitemaps',
    ARRAY['Next.js', 'SEO', 'Web Development'],
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    true,
    8
),
(
    'Three.js Performance Optimization',
    'threejs-performance',
    'Tips and tricks for building performant 3D web experiences',
    '# Three.js Performance\n\nOptimizing 3D graphics is crucial...',
    ARRAY['Three.js', 'WebGL', 'Performance'],
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    true,
    6
);

-- Sample Certifications
INSERT INTO certifications (title, issuer, description, image_url, certificate_url, issued_date, credential_id)
VALUES 
(
    'AWS Certified Solutions Architect',
    'Amazon Web Services',
    'Professional-level certification for cloud architecture',
    'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2',
    'https://aws.amazon.com/certification',
    '2024-06-15',
    'AWS-CSA-PRO-2024'
),
(
    'Meta Front-End Developer',
    'Meta (Coursera)',
    'Professional Certificate in Front-End Development',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    'https://coursera.org/verify/professional-cert',
    '2023-12-10',
    'META-FED-2023'
);

-- Sample Hackathons
INSERT INTO hackathons (name, organizer, role, result, description, image_url, project_url, event_date)
VALUES 
(
    'HackMIT 2024',
    'MIT',
    'Full Stack Developer',
    'Winner - Best Healthcare Solution',
    'Built an AI-powered health diagnosis platform in 36 hours',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
    'https://devpost.com/software/healthai',
    '2024-09-20'
),
(
    'Google Solution Challenge',
    'Google Developers',
    'Team Lead',
    'Top 50 Global',
    'Created a sustainable agriculture platform using ML',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    'https://github.com/ayushtiwari18/agritech',
    '2024-03-15'
);
