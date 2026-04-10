/**
 * CadenceLogo — SVG logo mark.
 *
 * The C is constructed as an annular arc:
 *   centre (50,50), outer R=44, inner R=25, gap ±38° from 3 o'clock.
 *   cos38°≈0.788  sin38°≈0.616
 *   Outer BR=(84.7,77.1)  Outer TR=(84.7,22.9)
 *   Inner BR=(69.7,65.4)  Inner TR=(69.7,34.6)
 *
 * Layers (bottom-up):
 *   1. Main C — diagonal linear gradient (lit upper-left → dark lower-right)
 *   2. Outer rim — radial overlay to deepen the outer edge
 *   3. Inner highlight strip — thin R=25→30 arc, bright on right, fading left
 *   4. Top-arm shine — small ellipse in upper-left for the specular pop
 */

interface CadenceLogoProps {
  /** Height in px — width matches automatically (square viewBox). */
  size?: number
}

export function CadenceLogo({ size = 28 }: CadenceLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* ── Main face: lit from upper-left ──────────────────────────────── */}
        <linearGradient
          id="cl-face"
          x1="22" y1="12"
          x2="78" y2="88"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#9AAAF8" />
          <stop offset="30%"  stopColor="#5A6EE8" />
          <stop offset="70%"  stopColor="#2C3D9C" />
          <stop offset="100%" stopColor="#0E1445" />
        </linearGradient>

        {/* ── Outer rim: radial darkening at edge ─────────────────────────── */}
        <radialGradient id="cl-rim" cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="#000010" stopOpacity="0" />
          <stop offset="100%" stopColor="#000010" stopOpacity="0.55" />
        </radialGradient>

        {/* ── Inner highlight: bright strip on concave face ────────────────── */}
        <radialGradient
          id="cl-inner"
          cx="88%" cy="50%" r="45%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%"   stopColor="#CDD8FF" stopOpacity="0.88" />
          <stop offset="45%"  stopColor="#9AAEF8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#7090F8" stopOpacity="0.0" />
        </radialGradient>

        {/* ── Specular pop: small bright ellipse top-left ──────────────────── */}
        <radialGradient id="cl-spec" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </radialGradient>

        {/* ── Drop shadow ─────────────────────────────────────────────────── */}
        <filter id="cl-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow
            dx="0" dy="1.5"
            stdDeviation="2.5"
            floodColor="#040820"
            floodOpacity="0.7"
          />
        </filter>
      </defs>

      {/* 1. Main C shape */}
      <path
        d="M 84.7,77.1 A 44,44 0 1,1 84.7,22.9 L 69.7,34.6 A 25,25 0 1,0 69.7,65.4 Z"
        fill="url(#cl-face)"
        filter="url(#cl-shadow)"
      />

      {/* 2. Outer rim darkening */}
      <path
        d="M 84.7,77.1 A 44,44 0 1,1 84.7,22.9 L 69.7,34.6 A 25,25 0 1,0 69.7,65.4 Z"
        fill="url(#cl-rim)"
      />

      {/* 3. Inner highlight strip  (R 25→30, same arc span) */}
      {/*    BR=(73.6,68.5) TR=(73.6,31.5) at R=30 */}
      <path
        d="M 73.6,68.5 A 30,30 0 1,0 73.6,31.5 L 69.7,34.6 A 25,25 0 1,1 69.7,65.4 Z"
        fill="url(#cl-inner)"
      />

      {/* 4. Specular pop — small bright ellipse on upper-left arm */}
      <ellipse
        cx="28" cy="26"
        rx="10" ry="6"
        transform="rotate(-40 28 26)"
        fill="url(#cl-spec)"
        opacity="0.7"
      />
    </svg>
  )
}
