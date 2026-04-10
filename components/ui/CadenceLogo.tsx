/**
 * CadenceLogo — angular metallic C with forward lean and motion streaks.
 *
 * viewBox: 0 0 160 100
 *
 * C geometry — centre (108,50), outer R=42, inner R=22, gap ±45° from right:
 *   cos45°=sin45°=0.7071
 *   Outer upper (315°): (137.7, 20.3)   Outer lower (45°): (137.7, 79.7)
 *   Inner upper (315°): (123.6, 34.4)   Inner lower (45°): (123.6, 65.6)
 *   Inner strip outer (R=27): upper (127.1,30.9)  lower (127.1,69.1)
 *   Top fin tip: (150, 10)    Bottom fin tip: (150, 90)
 *
 * Forward lean — skewX(-8) around centre (108,50):
 *   <g transform="translate(108 50) skewX(-8) translate(-108 -50)">
 *   At 8°: top y=10 shifts +5.6px right; bottom y=90 shifts -5.6px left.
 *   Top tip after skew ≈ x 155.6  (fits inside viewBox 160) ✓
 *
 * Speed streaks — 3 rounded rects, no skew applied (stay horizontal):
 *   Gradient: transparent (x=2) → vivid blue (x=64)
 *   Top:    x=8  y=29 w=52 h=5
 *   Middle: x=2  y=44 w=60 h=7   (boldest, extends furthest)
 *   Bottom: x=8  y=64 w=52 h=5
 */

interface CadenceLogoProps {
  /** Rendered height in px. Width auto-scales at 160:100 aspect ratio. */
  size?: number
}

const VIEW_W = 160
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

        {/* ── Chrome face: bright white-blue top → deep navy bottom ──────────
            Vertical gradient mimics a lit metallic tube surface.            */}
        <linearGradient
          id="cl-face"
          x1="108" y1="7"
          x2="108" y2="94"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#D8EAFF" />
          <stop offset="12%"  stopColor="#A0C0FF" />
          <stop offset="30%"  stopColor="#6090F8" />
          <stop offset="55%"  stopColor="#3056D8" />
          <stop offset="78%"  stopColor="#1826A0" />
          <stop offset="100%" stopColor="#060C30" />
        </linearGradient>

        {/* ── Chrome gloss band — bright radial highlight on upper-left arm ── */}
        <radialGradient
          id="cl-gloss"
          cx="88" cy="20" r="45"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="50%"  stopColor="#C0D8FF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8AAAF8" stopOpacity="0.0" />
        </radialGradient>

        {/* ── Outer rim: darkens the outer edge for cylindrical depth ────────── */}
        <radialGradient
          id="cl-rim"
          cx="108" cy="50" r="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="60%" stopColor="#000010" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000010" stopOpacity="0.70" />
        </radialGradient>

        {/* ── Concave inner face: bright where the C opening faces right ──────
            Radial centred well past the right edge — creates a band of
            light on the inner concave surface, as if catching reflected
            light from the opening.                                          */}
        <radialGradient
          id="cl-inner"
          cx="156" cy="50" r="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#E0EEFF" stopOpacity="1.0" />
          <stop offset="35%"  stopColor="#A8C4FF" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#7090F8" stopOpacity="0.0" />
        </radialGradient>

        {/* ── Speed streak: transparent (left) → vivid blue (right) ─────────── */}
        <linearGradient
          id="cl-streak"
          x1="2" y1="0" x2="64" y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#1828B0" stopOpacity="0.0" />
          <stop offset="50%"  stopColor="#3C58D8" stopOpacity="0.60" />
          <stop offset="100%" stopColor="#5878F0" stopOpacity="0.92" />
        </linearGradient>

        {/* ── Blue ambient glow (applied to C group) ───────────────────────── */}
        <filter id="cl-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur" type="matrix" result="blue-glow"
            values="0 0 0 0 0.12
                    0 0 0 0 0.22
                    0 0 0 0 0.85
                    0 0 0 0.50 0"
          />
          <feMerge>
            <feMergeNode in="blue-glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

      </defs>

      {/* ── Speed streaks — horizontal, no skew (they stay perfectly level) ── */}
      <rect x="8"  y="29" width="52" height="5"   rx="2.5" fill="url(#cl-streak)" />
      <rect x="2"  y="44" width="60" height="7"   rx="3.5" fill="url(#cl-streak)" />
      <rect x="8"  y="64" width="52" height="5"   rx="2.5" fill="url(#cl-streak)" />

      {/* ── Angular C with forward lean ──────────────────────────────────────
          skewX(-8) around centre (108,50) creates the italic forward lean.
          The streaks above are OUTSIDE this group so they stay horizontal.  */}
      <g transform="translate(108 50) skewX(-8) translate(-108 -50)" filter="url(#cl-glow)">

        {/* Layer 1: main C body — chrome metallic face */}
        <path
          d="M 150,10 L 137.7,20.3 A 42,42 0 1,0 137.7,79.7 L 150,90 L 123.6,65.6 A 22,22 0 1,1 123.6,34.4 Z"
          fill="url(#cl-face)"
        />

        {/* Layer 2: outer rim darkening — deepens the outer curved edge */}
        <path
          d="M 150,10 L 137.7,20.3 A 42,42 0 1,0 137.7,79.7 L 150,90 L 123.6,65.6 A 22,22 0 1,1 123.6,34.4 Z"
          fill="url(#cl-rim)"
        />

        {/* Layer 3: concave inner highlight strip (R 22→27)
            Makes the inner face of the C ring glow, as if lit from the right. */}
        <path
          d="M 127.1,69.1 A 27,27 0 1,0 127.1,30.9 L 123.6,34.4 A 22,22 0 1,1 123.6,65.6 Z"
          fill="url(#cl-inner)"
        />

        {/* Layer 4: chrome gloss overlay — specular pop on the upper-left arm */}
        <path
          d="M 150,10 L 137.7,20.3 A 42,42 0 1,0 137.7,79.7 L 150,90 L 123.6,65.6 A 22,22 0 1,1 123.6,34.4 Z"
          fill="url(#cl-gloss)"
        />

      </g>

    </svg>
  )
}
