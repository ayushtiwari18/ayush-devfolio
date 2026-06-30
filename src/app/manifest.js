export default function manifest() {
  return {
    name:             'Ayush Tiwari — Full Stack Developer',
    short_name:       'Ayush Tiwari',
    description:      'Portfolio of Ayush Tiwari — Full Stack Developer. MERN Stack, Next.js, AWS, Springer-published researcher. Jabalpur, India.',
    start_url:        '/?source=pwa',
    scope:            '/',
    display:          'standalone',
    orientation:      'portrait-primary',
    background_color: '#09090b',
    theme_color:      '#6366f1',
    lang:             'en-IN',
    categories:       ['portfolio', 'developer', 'technology'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name:       'Projects',
        short_name: 'Projects',
        url:        '/projects?source=pwa-shortcut',
        description:'View all projects by Ayush Tiwari',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name:       'Blog',
        short_name: 'Blog',
        url:        '/blog?source=pwa-shortcut',
        description:'Read technical articles by Ayush Tiwari',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name:       'Contact',
        short_name: 'Contact',
        url:        '/contact?source=pwa-shortcut',
        description:'Get in touch with Ayush Tiwari',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
    screenshots: [
      {
        src:          '/opengraph-image',
        sizes:        '1200x630',
        type:         'image/png',
        form_factor:  'wide',
        label:        'Ayush Tiwari Portfolio — Home',
      },
    ],
  };
}
