/* Small flat illustrations used in the hero scene and around the site. All in SVG user units. */

const INK = "#1d1a2f";

export function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M10 40 q-14 0 -14 -13 q0 -13 15 -13 q4 -16 22 -16 q16 0 21 13 q4 -3 10 -3 q15 0 15 16 q0 16 -16 16 z"
        fill="#fff"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M20 31 q8 4 16 0" stroke="#d5ecfd" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function RoundTree({ x, y, s = 1, tone = "#3fc48a" }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="26" ry="7" fill={INK} opacity="0.14" />
      <path d="M-4 0 v-30 h8 v30 z" fill="#8d5a3b" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M0 -26 l-8 -9 M0 -22 l7 -7" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="0" cy="-56" r="30" fill={tone} stroke={INK} strokeWidth="3" />
      <path d="M-16 -64 q4 -12 16 -14" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.55" />
      <circle cx="12" cy="-48" r="3" fill={INK} opacity="0.25" />
      <circle cx="-10" cy="-44" r="2.4" fill={INK} opacity="0.25" />
    </g>
  );
}

export function PineTree({ x, y, s = 1, tone = "#2fae78" }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="20" ry="6" fill={INK} opacity="0.14" />
      <rect x="-4" y="-16" width="8" height="16" fill="#8d5a3b" stroke={INK} strokeWidth="2.5" />
      <path d="M0 -92 L22 -46 H12 L28 -16 H-28 L-12 -46 H-22 Z" fill={tone} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M-6 -70 l-6 12" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

export function House({
  x,
  y,
  s = 1,
  wall = "#fff0bf",
  roof = "#ff6a4d",
  door = "#4fb3f6",
  flip = false,
}: {
  x: number;
  y: number;
  s?: number;
  wall?: string;
  roof?: string;
  door?: string;
  flip?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="3" rx="62" ry="9" fill={INK} opacity="0.14" />
      {/* side wall */}
      <path d="M30 0 V-50 L58 -64 V-12 Z" fill="#f6e7c8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* front wall */}
      <path d="M-48 0 V-50 H30 V0 Z" fill={wall} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* roof */}
      <path d="M-58 -46 L-9 -92 L40 -46 Z" fill={roof} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M-9 -92 L22 -104 L68 -60 L40 -46 Z" fill={roof} stroke={INK} strokeWidth="3" strokeLinejoin="round" opacity="0.88" />
      <path d="M-9 -92 L22 -104" stroke={INK} strokeWidth="3" />
      {/* chimney */}
      <path d="M34 -88 v-16 h10 v22" fill="#f6e7c8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {/* door */}
      <path d="M-18 0 V-30 a8 8 0 0 1 16 0 V0 Z" fill={door} stroke={INK} strokeWidth="2.5" />
      <circle cx="-6" cy="-14" r="1.6" fill={INK} />
      {/* windows */}
      <rect x="-40" y="-38" width="16" height="16" rx="2" fill="#ffeaa7" stroke={INK} strokeWidth="2.5" />
      <path d="M-32 -38 v16 M-40 -30 h16" stroke={INK} strokeWidth="1.6" />
      <rect x="6" y="-38" width="16" height="16" rx="2" fill="#ffeaa7" stroke={INK} strokeWidth="2.5" />
      <path d="M14 -38 v16 M6 -30 h16" stroke={INK} strokeWidth="1.6" />
      <circle cx="-9" cy="-62" r="6" fill="#d5ecfd" stroke={INK} strokeWidth="2.5" />
      {/* side window */}
      <path d="M40 -40 L50 -45 V-30 L40 -25 Z" fill="#ffeaa7" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </g>
  );
}

export function StopSign({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="10" ry="3.5" fill={INK} opacity="0.18" />
      <rect x="-2.5" y="-62" width="5" height="62" fill="#7a7690" stroke={INK} strokeWidth="2" />
      <path
        d="M-9 -88 h18 l13 13 v18 l-13 13 h-18 l-13 -13 v-18 z"
        fill="#ff6a4d"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M-7.5 -84 h15 l10.5 10.5 v15 l-10.5 10.5 h-15 l-10.5 -10.5 v-15 z" fill="none" stroke="#fffaf0" strokeWidth="1.6" />
      <text x="0" y="-62" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fffaf0" fontFamily="var(--font-display)">
        STOP
      </text>
    </g>
  );
}

/** A child waiting at the stop with a backpack, waving. */
export function School({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="150" ry="12" fill={INK} opacity="0.12" />
      {/* wings */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <path
            d={`M${d * 50} 0 V-70 H${d * 132} V0 Z`}
            fill="#ffd9cf"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d={`M${d * 44} -70 H${d * 138} V-80 H${d * 44} Z`} fill="#ff6a4d" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          {[0, 1].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={d > 0 ? 60 + c * 24 : -132 + 10 + c * 24}
                y={-60 + r * 28}
                width="14"
                height="18"
                rx="2"
                fill="#d5ecfd"
                stroke={INK}
                strokeWidth="2.2"
              />
            )),
          )}
        </g>
      ))}
      {/* main block */}
      <path d="M-50 0 V-96 H50 V0 Z" fill="#fff0bf" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* pediment */}
      <path d="M-62 -94 L0 -138 L62 -94 Z" fill="#ff6a4d" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* clock */}
      <circle cx="0" cy="-110" r="12" fill="#fffaf0" stroke={INK} strokeWidth="2.5" />
      <path d="M0 -110 v-7 M0 -110 l5 3" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      {/* bell tower + flag */}
      <path d="M-8 -138 v-14 h16 v14" fill="#fff0bf" stroke={INK} strokeWidth="2.5" />
      <path d="M-12 -152 L0 -164 L12 -152 Z" fill="#9b7bff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M0 -164 v-26" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path className="rhk-flag" d="M0 -190 q10 -4 20 0 q-4 6 0 12 q-10 -4 -20 0 z" fill="#4fb3f6" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {/* door */}
      <path d="M-20 0 V-40 a20 20 0 0 1 40 0 V0 Z" fill="#9b7bff" stroke={INK} strokeWidth="3" />
      <path d="M0 0 V-58" stroke={INK} strokeWidth="2" />
      <circle cx="-5" cy="-22" r="1.8" fill={INK} />
      <circle cx="5" cy="-22" r="1.8" fill={INK} />
      {/* top windows */}
      <rect x="-38" y="-86" width="16" height="20" rx="2" fill="#d5ecfd" stroke={INK} strokeWidth="2.2" />
      <rect x="22" y="-86" width="16" height="20" rx="2" fill="#d5ecfd" stroke={INK} strokeWidth="2.2" />
      {/* sign */}
      <rect x="-34" y="-62" width="68" height="14" rx="3" fill={INK} />
      <text x="0" y="-51.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ffe07b" fontFamily="var(--font-display)" letterSpacing="1">
        SCHOOL
      </text>
      {/* steps */}
      <path d="M-30 0 h60 v6 h-60 z" fill="#f6e7c8" stroke={INK} strokeWidth="2.5" />
    </g>
  );
}
