/**
 * Top-down yellow school bus, drawn facing +x (right) so it can be rotated to the road's tangent.
 * Local box: 0..140 × 0..56, centre at (70, 28).
 */
export function BusTop({ className }: { className?: string }) {
  return (
    <svg viewBox="-6 -8 152 72" className={className} aria-hidden>
      {/* soft shadow */}
      <rect x="4" y="6" width="134" height="52" rx="12" fill="#1d1a2f" opacity="0.18" />
      {/* wheels peeking out */}
      {[22, 104].map((x) => (
        <g key={x}>
          <rect x={x} y="-4" width="20" height="9" rx="3" fill="#1d1a2f" />
          <rect x={x} y="51" width="20" height="9" rx="3" fill="#1d1a2f" />
        </g>
      ))}
      {/* mirrors */}
      <rect x="124" y="-6" width="6" height="8" rx="2" fill="#1d1a2f" />
      <rect x="124" y="54" width="6" height="8" rx="2" fill="#1d1a2f" />
      {/* body */}
      <rect x="0" y="0" width="140" height="56" rx="10" fill="#ffd45f" stroke="#1d1a2f" strokeWidth="3" />
      {/* hood */}
      <path d="M118 3 h12 a7 7 0 0 1 7 7 v36 a7 7 0 0 1 -7 7 h-12 z" fill="#f8c641" stroke="#1d1a2f" strokeWidth="2.5" />
      <path d="M124 14 v28" stroke="#1d1a2f" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* windshield edge */}
      <path d="M112 6 q5 22 0 44" fill="none" stroke="#1d1a2f" strokeWidth="3" strokeLinecap="round" />
      <path d="M112 8 q4 20 0 40 l-6 0 q3 -20 0 -40 z" fill="#4fb3f6" opacity="0.9" />
      {/* roof panel */}
      <rect x="10" y="9" width="92" height="38" rx="6" fill="#ffe07b" stroke="#1d1a2f" strokeWidth="2" />
      {/* roof ribs */}
      {[26, 42, 58, 74, 90].map((x) => (
        <path key={x} d={`M${x} 10 v36`} stroke="#e3b340" strokeWidth="1.6" />
      ))}
      {/* hatches */}
      <rect x="18" y="19" width="16" height="18" rx="3" fill="#fffaf0" stroke="#1d1a2f" strokeWidth="2" />
      <rect x="66" y="19" width="16" height="18" rx="3" fill="#fffaf0" stroke="#1d1a2f" strokeWidth="2" />
      {/* black stripe */}
      <path d="M2 4 H116 M2 52 H116" stroke="#1d1a2f" strokeWidth="2" />
      {/* lights */}
      <circle cx="134" cy="7" r="3.2" fill="#fff9e6" stroke="#1d1a2f" strokeWidth="1.5" />
      <circle cx="134" cy="49" r="3.2" fill="#fff9e6" stroke="#1d1a2f" strokeWidth="1.5" />
      <circle cx="5" cy="7" r="2.6" fill="#ff6a4d" />
      <circle cx="5" cy="49" r="2.6" fill="#ff6a4d" />
    </svg>
  );
}
