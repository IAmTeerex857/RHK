/**
 * Yellow school bus seen straight on, driving toward the viewer. Symmetric, so it reads as
 * driving straight down the road. No driver, no flashing lights.
 * viewBox 0 0 200 200; the wheels stand on y = 190, centred on x = 100.
 */

const INK = "#1d1a2f";

export function BusFront(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden {...props}>
      {/* ground shadow, under the wheels */}
      <ellipse cx="100" cy="190" rx="80" ry="7" fill={INK} opacity="0.18" />

      {/* wheels, behind the bumper */}
      <rect x="34" y="166" width="26" height="24" rx="6" fill={INK} />
      <rect x="140" y="166" width="26" height="24" rx="6" fill={INK} />

      {/* mirrors */}
      <path d="M32 74 H18 V100" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="11" y="94" width="14" height="24" rx="4" fill={INK} />
      <path d="M168 74 H182 V100" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="175" y="94" width="14" height="24" rx="4" fill={INK} />

      {/* body */}
      <path
        d="M30 168 V62 Q30 30 62 28 H138 Q170 30 170 62 V168 Z"
        fill="#ffc629"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* roof cap */}
      <path d="M44 40 Q48 32 62 31 H138 Q152 32 156 40 Z" fill="#ffd54f" />
      {/* destination sign */}
      <rect x="64" y="38" width="72" height="16" rx="4" fill={INK} />
      <text
        x="100"
        y="49.5"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.6"
        fill="#ffd54f"
        style={{ fontFamily: "var(--font-display)" }}
      >
        SCHOOL BUS
      </text>

      {/* windscreen, two panes */}
      <rect x="40" y="62" width="58" height="50" rx="8" fill="#d5ecfd" stroke={INK} strokeWidth="2.5" />
      <rect x="102" y="62" width="58" height="50" rx="8" fill="#d5ecfd" stroke={INK} strokeWidth="2.5" />
      <path d="M48 70 h10 l-10 18 z" fill="#fff" opacity="0.7" />
      <path d="M110 70 h10 l-10 18 z" fill="#fff" opacity="0.7" />
      {/* wipers */}
      <path d="M62 110 l14 -12 M124 110 l14 -12" stroke={INK} strokeWidth="2" strokeLinecap="round" />

      {/* black rub rail */}
      <path d="M31.5 124 H168.5" stroke={INK} strokeWidth="2.5" />

      {/* grille */}
      <rect x="74" y="132" width="52" height="26" rx="6" fill="#4a4660" stroke={INK} strokeWidth="2.5" />
      {[84, 94, 106, 116].map((x) => (
        <path key={x} d={`M${x} 137 v16`} stroke="#7a7690" strokeWidth="2" strokeLinecap="round" />
      ))}

      {/* headlights */}
      <circle cx="50" cy="145" r="10" fill="#fff9e6" stroke={INK} strokeWidth="2.5" />
      <circle cx="150" cy="145" r="10" fill="#fff9e6" stroke={INK} strokeWidth="2.5" />
      <circle cx="50" cy="145" r="4" fill="#ffe38a" />
      <circle cx="150" cy="145" r="4" fill="#ffe38a" />

      {/* bumper */}
      <rect x="22" y="164" width="156" height="14" rx="5" fill="#4a4660" stroke={INK} strokeWidth="2.5" />
    </svg>
  );
}
