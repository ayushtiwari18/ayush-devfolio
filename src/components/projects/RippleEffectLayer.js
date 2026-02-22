'use client';

/**
 * RippleEffectLayer
 * -----------------
 * Renders the hidden SVG filter definition + the overlay div.
 * Parent (ProjectHero) toggles data-ripple="active" on mouseenter/leave.
 *
 * Zero JS executes in the hover loop — CSS handles everything.
 * GPU compositor thread only (filter property).
 *
 * Disabled on:
 *   - pointer: coarse (mobile) — via globals.css
 *   - prefers-reduced-motion   — via globals.css
 */
export default function RippleEffectLayer() {
  return (
    <>
      {/* SVG filter definition — hidden, 0×0, paint cost = 0 */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <filter id="project-hero-ripple">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.025"
              numOctaves="3"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Overlay — activated by parent toggling data-ripple */}
      <div
        className="project-ripple-overlay"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          filter: 'url(#project-hero-ripple)',
          willChange: 'filter',
        }}
      />
    </>
  );
}
