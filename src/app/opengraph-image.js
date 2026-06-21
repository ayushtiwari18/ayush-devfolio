import { ImageResponse } from 'next/og';

/**
 * B4 FIX: Generate the og-image dynamically via Next.js ImageResponse.
 * This produces /opengraph-image (used by Next.js as og:image automatically).
 *
 * !! ACTION REQUIRED: Replace this with a real 1200x630 PNG file at
 *    public/og-image.png before launch for best social share quality.
 *    A real PNG renders faster and supports custom fonts/photos.
 */
export const size     = { width: 1200, height: 630 };
export const alt      = 'Ayush Tiwari - Full Stack Developer';
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0f0e17',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Left accent bar */}
        <div style={{ position: 'absolute', left: 60, top: 60, width: 4, height: 510, background: '#6366f1', borderRadius: 2 }} />
        {/* Name */}
        <div style={{ fontSize: 80, fontWeight: 700, color: 'white', marginBottom: 16, paddingLeft: 30 }}>Ayush Tiwari</div>
        {/* Title */}
        <div style={{ fontSize: 40, color: '#a5b4fc', marginBottom: 24, paddingLeft: 30 }}>Full Stack Developer</div>
        {/* Stack */}
        <div style={{ fontSize: 28, color: '#6366f1', marginBottom: 40, paddingLeft: 30 }}>MERN · Next.js · Three.js · AWS</div>
        {/* URL */}
        <div style={{ fontSize: 24, color: '#4b5563', paddingLeft: 30 }}>ayush-devfolio.vercel.app</div>
      </div>
    ),
    { ...size }
  );
}
