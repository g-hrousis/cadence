/**
 * CadenceLogo — angular, fast, metallic C with sharp fins and motion streaks.
 *
 * viewBox: 0 0 150 100
 * C center (107, 50), outer R=43, inner R=20, gap ±45° from 3 o'clock.
 * cos45°=sin45°=0.7071
 *
 * Key points:
 *   Outer upper gap (315°): (137.4, 19.6)
 *   Outer lower gap  (45°): (137.4, 80.4)
 *   Inner upper gap (315°): (121.1, 35.9)
 *   Inner lower gap  (45°): (121.1, 64.1)
 *   Top tip:               (148,   10  ) ← sharp fin pointing upper-right
 *   Bottom tip:            (148,   90  ) ← sharp fin pointing lower-right
 *
 * Angular C path — sharp fins at the opening:
 *   M 148,10 L 137.4,19.6 A 43,43 0 1,0 137.4,80.4
 *   L 148,90 L 121.1,64.1 A 20,20 0 1,1 121.1,35.9 Z
 *
 * Speed streaks — 3 tapered triangles (triangle point on left, full-width right):
 *   Top:    M 63,26 L 8,31  L 63,37 Z
 *   Middle: M 63,40 L 2,48  L 2,52  L 63,60 Z   (quad, extends furthest)
 *   Bottom: M 63,63 L 8,68  L 63,74 Z
 *
 * Gradient layers:
 *   cl-face   — chrome diagonal (bright upper-left → deep navy lower-right)
 *   cl-chrome — second specular band across the upper arm
 *   cl-rim    — radial outer-edge darkening
 *   cl-inner  — concave face glow from right-centre
 *   cl-streak — horizontal transparent-left → blue-right
 *   cl-glow   — blue ambient glow filter
 */

interface CadenceLogoProps {
  /** Rendered height in px. Width auto-scales at 150:100 aspect ratio. */
  size?: number
}

const VIEW_W = 150
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

        {/* ── Chrome face: bright top-left → deep navy bottom-right ─────────── */}
        <linearGradient
          id="cl-face"
          x1="72" y1="8"
          x2="148" y2="93"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#C4D0FF" />
          <stop offset="18%"  stopColor="#7E96F8" />
          <stop offset="45%"  stopColor="#3C52D8" />
          <stop offset="75%"  stopColor="#192090" />
          <stop offset="100%" stopColor="#060C2E" />
        </linearGradient>

        {/* ── Second chrome band — gloss across the upper arm ───────────────── */}
        <radialGradient
          id="cl-chrome"
          cx="93" cy="20" r="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.40" />
          <stop offset="55%"  stopColor="#A0B8FF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#7090F8" stopOpacity="0.0" />
        </radialGradient>

        {/* ── Outer rim: darkens the outer edge for depth ───────────────────── */}
        <radialGradient
          id="cl-rim"
          cx="107" cy="50" r="43"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="62%" stopColor="#000010" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#000010" stopOpacity="0.65" />
        </radialGradient>

        {/* ── Concave inner face glow: bright where opening faces right ─────── */}
        <radialGradient
          id="cl-inner"
          cx="148" cy="50" r="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#D8E6FF" stopOpacity="0.95" />
          <stop offset="40%"  stopColor="#9AB0F8" stopOpacity="0.50" />
          <stop offset="100%" stopColor="#6080F0" stopOpacity="0.0" />
        </radialGradient>

        {/* ── Speed streak: transparent tip (left) → vivid blue (right) ──────── */}
        <linearGradient
          id="cl-streak"
          x1="2" y1="0" x2="64" y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#2030B8" stopOpacity="0.0" />
          <stop offset="55%"  stopColor="#4055D8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5870F0" stopOpacity="0.90" />
        </linearGradient>

        {/* ── Ambient blue glow ─────────────────────────────────────────────── */}
        <filter id="cl-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feColorMatrix
            in="blur" type="matrix" result="blue-glow"
            values="0 0 0 0 0.15
                    0 0 0 0 0.25
                    0 0 0 0 0.90
                    0 0 0 0.55 0"
          />
          <feMerge>
            <feMergeNode in="blue-glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* ── Inner highlight strip clip (R 20 → 25) ───────────────────────── */}
        {/*    Outer of strip at ±45°: (125.7, 67.7) and (125.7, 32.3)         */}

      </defs>

      {/* ── 1. Speed streaks — tapered triangles pointing left ─────────────── */}
      {/* Top thin streak */}
      <path d="M 63,26 L 8,31 L 63,37 Z"         fill="url(#cl-streak)" />
      {/* Main bold streak — extends furthest, quad for extra height */}
      <path d="M 63,40 L 2,48 L 2,52 L 63,60 Z"  fill="url(#cl-streak)" />
      {/* Bottom thin streak */}
      <path d="M 63,63 L 8,68 L 63,74 Z"         fill="url(#cl-streak)" />

      {/* ── 2. Angular C with sharp fins ────────────────────────────────────── */}
      {/*                                                                        */}
      {/*  Top fin: (148,10)→(137.4,19.6) outer edge  ← sharp wedge            */}
      {/*  Outer arc: (137.4,19.6)→(137.4,80.4) CCW, 270° of arc               */}
      {/*  Bottom fin: (137.4,80.4)→(148,90)→(121.1,64.1)                      */}
      {/*  Inner arc: (121.1,64.1)→(121.1,35.9) CW, 270° of arc                */}
      {/*  Z closes: (121.1,35.9)→(148,10) straight — inner face of top fin     */}
      <path
        d="M 148,10 L 137.4,19.6 A 43,43 0 1,0 137.4,80.4 L 148,90 L 121.1,64.1 A 20,20 0 1,1 121.1,35.9 Z"
        fill="url(#cl-face)"
        filter="url(#cl-glow)"
      />

      {/* ── 3. Outer rim darkening ───────────────────────────────────────────── */}
      <path
        d="M 148,10 L 137.4,19.6 A 43,43 0 1,0 137.4,80.4 L 148,90 L 121.1,64.1 A 20,20 0 1,1 121.1,35.9 Z"
        fill="url(#cl-rim)"
      />

      {/* ── 4. Inner concave highlight strip (R 20 → 25) ─────────────────────── */}
      {/*    125.7 = 107 + 25*0.7071,  67.7 = 50 + 25*0.7071,  32.3 = 50-25*0.7071 */}
      <path
        d="M 125.7,67.7 A 25,25 0 1,0 125.7,32.3 L 121.1,35.9 A 20,20 0 1,1 121.1,64.1 Z"
        fill="url(#cl-inner)"
      />

      {/* ── 5. Chrome gloss overlay — second specular band ───────────────────── */}
      <path
        d="M 148,10 L 137.4,19.6 A 43,43 0 1,0 137.4,80.4 L 148,90 L 121.1,64.1 A 20,20 0 1,1 121.1,35.9 Z"
        fill="url(#cl-chrome)"
      />

    </svg>
  )
}
