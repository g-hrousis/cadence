/**
 * CadenceLogo — SVG logo mark with motion streaks.
 *
 * viewBox: 0 0 145 100  (wider to accommodate left-side speed lines)
 *
 * C geometry — centre (100, 50), outer R=44, inner R=25, gap ±38° from 3 o'clock:
 *   cos38°≈0.788  sin38°≈0.616
 *   Outer BR=(134.7,77.1)  Outer TR=(134.7,22.9)
 *   Inner BR=(119.7,65.4)  Inner TR=(119.7,34.6)
 *
 *   Inner highlight strip R=25→30:
 *   Outer of strip: BR=(123.6,68.5)  TR=(123.6,31.5)
 *
 * Speed streaks — 3 horizontal bars left of the C body (x=4→55),
 *   gradient: transparent on left → C-blue on right.
 *
 * Layers (bottom-up):
 *   1. Speed streaks (3 rounded rects, opacity-faded)
 *   2. Main C — diagonal linear gradient
 *   3. Outer rim — radial darkening overlay
 *   4. Inner highlight strip — thin annular arc, bright on concave face
 *   5. Specular ellipse — glossy pop on upper-left arm
 */

interface CadenceLogoProps {
  /**
   * Rendered height in px. Width is computed from the 145:100 aspect ratio.
   * (e.g. size=28 → 40×28px)
   */
  size?: number
}

const VIEW_W = 145
const VIEW_H = 100

export function CadenceLogo({ size = 28 }: CadenceLogoProps) {
  const h = size
  const w = Math.round((h * VIEW_W) / VIEW_H)

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* ── Main C face: lit from upper-left ────────────────────────────── */}
        <linearGradient
          id="cl-face"
          x1="72" y1="12"
          x2="135" y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#9AAAF8" />
          <stop offset="28%"  stopColor="#5A6EE8" />
          <stop offset="68%"  stopColor="#2C3D9C" />
          <stop offset="100%" stopColor="#0E1445" />
        </linearGradient>

        {/* ── Outer rim: radial darkening ──────────────────────────────────── */}
        <radialGradient
          id="cl-rim"
          cx="100" cy="50" r="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="72%" stopColor="#000010" stopOpacity="0" />
          <stop offset="100%" stopColor="#000010" stopOpacity="0.55" />
        </radialGradient>

        {/* ── Inner highlight: concave face glow ───────────────────────────── */}
        <radialGradient
          id="cl-inner"
          cx="136" cy="50" r="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#CDD8FF" stopOpacity="0.88" />
          <stop offset="45%"  stopColor="#9AAEF8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7090F8" stopOpacity="0.0" />
        </radialGradient>

        {/* ── Specular pop: gloss on upper-left arm ────────────────────────── */}
        <radialGradient id="cl-spec" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </radialGradient>

        {/* ── Speed streak: transparent left → C-blue right ────────────────── */}
        <linearGradient
          id="cl-streak"
          x1="4" y1="0" x2="56" y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#3D52D0" stopOpacity="0" />
          <stop offset="65%"  stopColor="#4F66DE" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5A70E8" stopOpacity="0.8" />
        </linearGradient>

        {/* ── Drop shadow ──────────────────────────────────────────────────── */}
        <filter id="cl-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0" dy="1.5"
            stdDeviation="2.5"
            floodColor="#040820"
            floodOpacity="0.7"
          />
        </filter>
      </defs>

      {/* ── 1. Speed streaks ─────────────────────────────────────────────── */}
      {/* Top streak  — shorter */}
      <rect x="13"  y="31" width="43" height="4"   rx="2"   fill="url(#cl-streak)" />
      {/* Middle streak — longest, boldest */}
      <rect x="4"   y="46" width="52" height="5.5" rx="2.75" fill="url(#cl-streak)" />
      {/* Bottom streak — shorter */}
      <rect x="15"  y="63" width="41" height="4"   rx="2"   fill="url(#cl-streak)" />

      {/* ── 2. Main C shape ─────────────────────────────────────────────── */}
      <path
        d="M 134.7,77.1 A 44,44 0 1,1 134.7,22.9 L 119.7,34.6 A 25,25 0 1,0 119.7,65.4 Z"
        fill="url(#cl-face)"
        filter="url(#cl-shadow)"
      />

      {/* ── 3. Outer rim darkening ───────────────────────────────────────── */}
      <path
        d="M 134.7,77.1 A 44,44 0 1,1 134.7,22.9 L 119.7,34.6 A 25,25 0 1,0 119.7,65.4 Z"
        fill="url(#cl-rim)"
      />

      {/* ── 4. Inner highlight strip (R 25 → 30) ────────────────────────── */}
      <path
        d="M 123.6,68.5 A 30,30 0 1,0 123.6,31.5 L 119.7,34.6 A 25,25 0 1,1 119.7,65.4 Z"
        fill="url(#cl-inner)"
      />

      {/* ── 5. Specular pop — ellipse on upper-left arm of C ────────────── */}
      <ellipse
        cx="76" cy="26"
        rx="11" ry="6"
        transform="rotate(-38 76 26)"
        fill="url(#cl-spec)"
        opacity="0.65"
      />
    </svg>
  )
}
