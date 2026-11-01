/**
 * Yellow school bus from the side (door side), facing right. Flat colour with ink outlines,
 * after the flat side-view bus references. No people, no flashing lights.
 * viewBox 0 0 380 230: wheels stand on y = 216; the ground shadow sits right under them.
 */

const INK = "#1d1a2f";
const ink = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const WHEELS = [80, 314];
const GROUND = 216;
const WHEEL_R = 28;

export function BusSide({ label = "RUSH HOUR KIDS", ...props }: React.SVGProps<SVGSVGElement> & { label?: string }) {
  const wy = GROUND - WHEEL_R;
  return (
    <svg viewBox="0 0 380 230" aria-hidden {...props}>
      {/* ground shadow, from wheel to wheel, right under the tyres */}
      <ellipse cx="186" cy={GROUND + 1} rx="176" ry="7" fill={INK} opacity="0.16" />

      {/* body */}
      <path
        d="M14 196 V58 Q14 30 42 30 H272 Q290 30 296 46 L308 82 H346 Q362 82 362 98 V188 Q362 196 354 196 Z"
        fill="#ffd45f"
        {...ink}
      />
      {/* roof cap */}
      <path d="M34 30 V22 Q34 16 40 16 H264 Q270 16 270 22 V30" fill="#ffe07b" {...ink} />
      {/* lower shade */}
      <path d="M15.5 176 H360.5 V188 Q360.5 194.5 354 194.5 H15.5 Z" fill="#f8c641" />
      {/* rub rails */}
      <path d="M15.5 112 H360.5 M15.5 124 H360.5" stroke={INK} strokeWidth="2.5" />

      {/* side windows */}
      {[30, 76, 122, 168].map((x) => (
        <g key={x}>
          <rect x={x} y="44" width="38" height="50" rx="7" fill="#d5ecfd" stroke={INK} strokeWidth="2.5" />
          <path d={`M${x + 7} 50 h9 l-9 16 z`} fill="#fff" opacity="0.75" />
        </g>
      ))}
      {/* door */}
      <rect x="216" y="40" width="50" height="146" rx="6" fill="#ffe07b" stroke={INK} strokeWidth="2.5" />
      <rect x="223" y="48" width="16" height="58" rx="4" fill="#d5ecfd" stroke={INK} strokeWidth="2" />
      <rect x="243" y="48" width="16" height="58" rx="4" fill="#d5ecfd" stroke={INK} strokeWidth="2" />
      <path d="M241 112 V180" stroke={INK} strokeWidth="2" />
      {/* windscreen */}
      <path d="M286 44 H290 Q295 44 297 50 L306 82 H286 Z" fill="#d5ecfd" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />

      {/* name, centred in the band between the rails and the shade with even room above and below */}
      <text
        x="115"
        y="156"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        letterSpacing="1"
        fill={INK}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {label}
      </text>

      {/* lights and bumpers */}
      <rect x="20" y="70" width="8" height="18" rx="3" fill="#ff6a4d" stroke={INK} strokeWidth="2" />
      <circle cx="352" cy="140" r="8" fill="#fff9e6" stroke={INK} strokeWidth="2.5" />
      {/* mirror */}
      <path d="M348 84 L362 66" fill="none" {...ink} />
      <rect x="357" y="46" width="11" height="22" rx="4" fill={INK} />

      {/* wheels: a dark wheel well cut into the body, then the tyre, rim and hub */}
      {WHEELS.map((x) => (
        <g key={x}>
          <path d={`M${x - 38} 196 A38 38 0 0 1 ${x + 38} 196 Z`} fill={INK} />
          <circle cx={x} cy={wy} r={WHEEL_R} fill="#2b2840" stroke={INK} strokeWidth="3" />
          <circle cx={x} cy={wy} r="13" fill="#e3e1ea" stroke={INK} strokeWidth="2.5" />
          <circle cx={x} cy={wy} r="4" fill={INK} />
        </g>
      ))}
      {/* bumpers, in front of the wheel wells */}
      <rect x="340" y="182" width="32" height="16" rx="5" fill="#4a4660" {...ink} />
      <rect x="4" y="182" width="22" height="16" rx="5" fill="#4a4660" {...ink} />
    </svg>
  );
}
