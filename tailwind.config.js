/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // ------------------------------------------------------------------
      // FONT FAMILIES
      // display — Clash Display via CSS var (loaded in layout.js)
      // mono    — JetBrains Mono via CSS var (loaded in layout.js)
      // sans    — Inter (existing, unchanged)
      // ------------------------------------------------------------------
      fontFamily: {
        sans:    ['var(--font-inter)',    'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
        mono:    ['var(--font-mono)',    'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      // ------------------------------------------------------------------
      // COLORS — semantic tokens from CSS variables (unchanged structure)
      // accent now maps to a separate violet token in globals.css dark mode
      // ------------------------------------------------------------------
      colors: {
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ------------------------------------------------------------------
      // SPACING SCALE — section rhythm tokens
      // ------------------------------------------------------------------
      spacing: {
        'section':    '7rem',   // py-section = 112px — default section padding
        'section-sm': '5rem',   // py-section-sm = 80px — tight sections
        'section-lg': '9rem',   // py-section-lg = 144px — hero-level breathing room
      },

      // ------------------------------------------------------------------
      // TYPOGRAPHY — prose overrides
      // ------------------------------------------------------------------
      typography: {
        DEFAULT: {
          css: {
            color:      'hsl(var(--muted-foreground))',
            fontFamily: 'var(--font-inter)',
            a:          { color: 'hsl(var(--primary))' },
            strong:     { color: 'hsl(var(--foreground))' },
            h1: { color: 'hsl(var(--foreground))', fontFamily: 'var(--font-display)' },
            h2: { color: 'hsl(var(--foreground))', fontFamily: 'var(--font-display)' },
            h3: { color: 'hsl(var(--foreground))' },
            h4: { color: 'hsl(var(--foreground))' },
            code: {
              color:      'hsl(var(--primary))',
              fontFamily: 'var(--font-mono)',
            },
            blockquote: { color: 'hsl(var(--muted-foreground))' },
          },
        },
      },

      // ------------------------------------------------------------------
      // KEYFRAMES + ANIMATIONS
      // ------------------------------------------------------------------
      keyframes: {
        // Existing (unchanged)
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },

        // NEW — shimmer for skeleton loaders
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },

        // NEW — subtle scale-in for cards appearing
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },

        // NEW — text reveal via clip-path
        'reveal-text': {
          '0%':   { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0% 0 0)' },
        },

        // NEW — gentle border pulse for active cards
        'border-pulse': {
          '0%, 100%': { borderColor: 'hsl(var(--primary) / 0.3)' },
          '50%':      { borderColor: 'hsl(var(--primary) / 0.8)' },
        },

        // NEW — gradient sweep (hero badge, CTA buttons)
        'gradient-sweep': {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },

        // NEW — count-up flash (highlights number at end of CountUp)
        'count-flash': {
          '0%':   { color: 'hsl(var(--primary))' },
          '50%':  { color: 'hsl(var(--accent))' },
          '100%': { color: 'inherit' },
        },
      },

      animation: {
        // Existing (unchanged)
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fade-in 0.5s ease-out',
        'fade-in-up':     'fade-in-up 0.6s ease-out',
        'slide-in':       'slide-in 0.5s ease-out',
        'glow':           'glow 2s ease-in-out infinite',
        'float':          'float 3s ease-in-out infinite',

        // NEW
        'shimmer':       'shimmer 2s linear infinite',
        'scale-in':      'scale-in 0.4s cubic-bezier(0.16,1,0.3,1)',
        'reveal-text':   'reveal-text 0.8s cubic-bezier(0.16,1,0.3,1)',
        'border-pulse':  'border-pulse 2s ease-in-out infinite',
        'gradient-sweep':'gradient-sweep 4s ease infinite',
        'count-flash':   'count-flash 0.6s ease-out',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
