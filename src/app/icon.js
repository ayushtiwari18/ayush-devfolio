import { ImageResponse } from 'next/og';

/**
 * B5 FIX: Generate a favicon programmatically via Next.js ImageResponse.
 * This produces /icon (served as favicon.ico equivalent by Next.js).
 * Replace with a static icon.png in src/app/ for best browser support.
 */
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
