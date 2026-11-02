/*
 * Inner-page hero illustrations. Flat colour with ink outlines, no people, no road.
 * Each is a 480 × 400 SVG on a soft colour blob, with a few floating pieces.
 */

import type { ReactNode } from "react";
import { cn } from "@rhk/ui/lib/cn";
import { BusSide } from "./bus-side";
import { House, RoundTree, School } from "./scene-parts";

const INK = "#1d1a2f";
const C = {
  yellow: "#ffc629",
  yellowLight: "#ffd54f",
  yellowPale: "#fff9e6",
  coral: "#ff6a4d",
  sky: "#4fb3f6",
  skySoft: "#d5ecfd",
  mint: "#3fc48a",
  mintSoft: "#d3f4e4",
  lilac: "#9b7bff",
  lilacSoft: "#e6ddff",
  coralSoft: "#ffd9cf",
  butter: "#fff0bf",
  sand: "#f6e7c8",
  grey: "#e3e1ea",
  steel: "#4a4660",
  white: "#ffffff",
};

const BLOB =
  "M86 112 C122 46 238 30 320 54 C406 80 456 148 444 232 C432 318 354 366 252 362 C150 358 64 326 44 246 C30 188 56 146 86 112 Z";

function Frame({
  label,
  tint,
  className,
  children,
}: {
  label: string;
  tint: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg viewBox="0 0 480 400" role="img" aria-label={label} className={cn("block h-auto w-full overflow-visible", className)}>
      <path d={BLOB} fill={tint} />
      {children}
    </svg>
  );
}

/** Gentle bob. SVG groups need fill-box so they turn around their own middle. */
function Float({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  return (
    <g className="rhk-float" style={{ animationDelay: `${delay}s`, transformBox: "fill-box", transformOrigin: "center" }}>
      {children}
    </g>
  );
}

function Sparkle({ x, y, s = 1, fill = C.yellow }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -13 Q2.4 -2.4 13 0 Q2.4 2.4 0 13 Q-2.4 2.4 -13 0 Q-2.4 -2.4 0 -13 Z"
      fill={fill}
      stroke={INK}
      strokeWidth={2.5 / s}
      strokeLinejoin="round"
    />
  );
}

function Dot({ x, y, r = 5, fill = C.coral }: { x: number; y: number; r?: number; fill?: string }) {
  return <circle cx={x} cy={y} r={r} fill={fill} stroke={INK} strokeWidth="2.5" />;
}

const ink = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/* ------------------------------------------------------------------------------------------ */
/* Services: a side-view school bus between morning and afternoon, with the week planned      */
/* ------------------------------------------------------------------------------------------ */

export function ServicesArt({ className }: { className?: string }) {
  return (
    <Frame label="A yellow school bus between a morning sun and an afternoon moon, with a weekly calendar" tint={C.mintSoft} className={className}>
      {/* morning sun */}
      <Float delay={0.2}>
        <g transform="translate(92 96)">
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M0 -40 V-50" transform={`rotate(${i * 45})`} {...ink} />
          ))}
          <circle r="28" fill={C.yellowLight} {...ink} />
        </g>
      </Float>
      {/* afternoon moon */}
      <Float delay={1.4}>
        <path
          transform="translate(432 86)"
          d="M8 -24 A26 26 0 1 0 22 14 A20 20 0 1 1 8 -24 Z"
          fill={C.lilacSoft}
          {...ink}
        />
      </Float>
      {/* the week */}
      <Float delay={0.8}>
        <g transform="translate(232 28) rotate(4)">
          <rect width="104" height="86" rx="12" fill={C.white} {...ink} />
          <path d="M0 26 V12 Q0 0 12 0 H92 Q104 0 104 12 V26 Z" fill={C.coral} {...ink} />
          <path d="M28 -8 V8 M76 -8 V8" {...ink} strokeWidth={4} />
          {[0, 1, 2].map((c) =>
            [0, 1].map((r) => {
              const x = 14 + c * 28;
              const y = 36 + r * 24;
              const on = (c + r) % 2 === 0;
              return (
                <g key={`${c}-${r}`}>
                  <rect x={x} y={y} width="20" height="18" rx="5" fill={on ? C.yellow : C.grey} stroke={INK} strokeWidth="2" />
                  {on ? <path d={`M${x + 5} ${y + 9} l4 4 l7 -8`} fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /> : null}
                </g>
              );
            }),
          )}
        </g>
      </Float>

      {/* speed lines */}
      <path d="M22 214 H58 M10 238 H52 M26 262 H60" {...ink} fill="none" />

      {/* the bus */}
      <BusSide x={56} y={112} width={380} height={230} />

      <Sparkle x={196} y={92} s={0.9} fill={C.sky} />
      <Sparkle x={448} y={258} s={0.75} />
      <Dot x={378} y={62} r={6} fill={C.mint} />
      <Dot x={34} y={160} r={5} fill={C.lilac} />
    </Frame>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* About: home and school joined by a dotted route, with a twenty-year rosette                */
/* ------------------------------------------------------------------------------------------ */

function Rosette({ x, y }: { x: number; y: number }) {
  const n = 14;
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 === 0 ? 56 : 47;
    return `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  });
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* ribbon tails */}
      <path d="M-28 30 L-44 96 L-26 86 L-14 102 L0 40 Z" fill={C.coral} {...ink} />
      <path d="M28 30 L44 96 L26 86 L14 102 L0 40 Z" fill={C.sky} {...ink} />
      <path d={`M${pts.join(" L")} Z`} fill={C.yellow} {...ink} />
      <circle r="38" fill={C.yellowPale} {...ink} />
      <text y="10" textAnchor="middle" fontSize="34" fontWeight="700" fill={INK} style={{ fontFamily: "var(--font-display)" }}>
        20
      </text>
      <text y="27" textAnchor="middle" fontSize="11" fontWeight="600" fill={INK} style={{ fontFamily: "var(--font-display)" }}>
        years
      </text>
    </g>
  );
}

export function AboutArt({ className }: { className?: string }) {
  return (
    <Frame label="A family home and a school joined by a dotted route, under a twenty years rosette" tint={C.butter} className={className}>
      {/* hill */}
      <path d="M40 300 Q240 252 452 300 V318 H40 Z" fill={C.mintSoft} {...ink} />
      {/* dotted route from the front door to the school gate */}
      <path
        d="M118 322 C170 368 296 366 352 324"
        fill="none"
        stroke={INK}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray="0.5 13"
      />
      <House x={118} y={306} s={1.05} roof={C.coral} wall={C.butter} door={C.lilac} />
      <School x={356} y={306} s={0.58} />
      <RoundTree x={226} y={300} s={0.7} tone={C.mint} />
      {/* start and finish pins */}
      <g transform="translate(118 336)">
        <circle r="9" fill={C.yellow} {...ink} />
      </g>
      <g transform="translate(352 336)">
        <circle r="9" fill={C.mint} {...ink} />
      </g>

      <Float delay={0.3}>
        <Rosette x={238} y={102} />
      </Float>
      <Float delay={1.1}>
        <path
          transform="translate(76 96) scale(1.1)"
          d="M0 10 C-18 -2 -22 -16 -12 -22 C-6 -26 0 -22 0 -16 C0 -22 6 -26 12 -22 C22 -16 18 -2 0 10 Z"
          fill={C.coral}
          {...ink}
        />
      </Float>
      <Sparkle x={398} y={74} s={1} fill={C.sky} />
      <Sparkle x={150} y={150} s={0.6} />
      <Dot x={430} y={170} r={6} fill={C.lilac} />
      <Dot x={58} y={204} r={5} fill={C.mint} />
    </Frame>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Application: the form on a clipboard, a pencil, and the $25 fee tag                        */
/* ------------------------------------------------------------------------------------------ */

export function ApplicationArt({ className, fee = 25 }: { className?: string; fee?: number }) {
  const rows = [146, 190, 234];
  return (
    <Frame label={`A clipboard with the application form, a pencil and a $${fee} fee tag`} tint={C.lilacSoft} className={className}>
      <ellipse cx="248" cy="352" rx="120" ry="11" fill={INK} opacity="0.12" />
      <g transform="rotate(-4 245 200)">
        {/* board */}
        <rect x="150" y="62" width="196" height="282" rx="20" fill={C.yellow} {...ink} />
        {/* paper */}
        <rect x="168" y="94" width="160" height="232" rx="10" fill={C.white} {...ink} strokeWidth={2.5} />
        {/* clip */}
        <path d="M208 76 V60 Q208 46 222 46 H274 Q288 46 288 60 V76 Q288 86 278 86 H218 Q208 86 208 76 Z" fill={C.steel} {...ink} />
        <circle cx="248" cy="58" r="6" fill={C.lilacSoft} stroke={INK} strokeWidth="2.5" />
        {/* title */}
        <rect x="186" y="112" width="96" height="11" rx="5.5" fill={INK} />
        {rows.map((y, i) => {
          const done = i < 2;
          return (
            <g key={y}>
              <rect x="186" y={y} width="24" height="24" rx="6" fill={done ? C.mint : C.white} stroke={INK} strokeWidth="2.5" />
              {done ? (
                <path d={`M192 ${y + 12} l5 5 l9 -10`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              ) : null}
              <rect x="220" y={y + 4} width={i === 1 ? 70 : 88} height="7" rx="3.5" fill={C.grey} />
              <rect x="220" y={y + 15} width={i === 1 ? 50 : 60} height="6" rx="3" fill={C.grey} />
            </g>
          );
        })}
        {/* signature line */}
        <path d="M186 304 H310" stroke={C.grey} strokeWidth="3" strokeLinecap="round" />
        <path
          d="M190 296 c8 -18 14 -18 12 -2 c-2 12 10 -16 18 -10 c6 4 -2 14 6 10 c8 -4 12 -12 20 -6 c4 3 8 2 14 -2"
          fill="none"
          stroke={C.sky}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* pencil */}
      <g transform="translate(330 318) rotate(36)">
        <path d="M0 0 L-11 -26 H11 Z" fill={C.sand} {...ink} />
        <path d="M0 0 L-4 -9 H4 Z" fill={INK} />
        <rect x="-11" y="-126" width="22" height="100" fill={C.yellowLight} {...ink} />
        <path d="M-3.5 -122 V-30" stroke="#f5b301" strokeWidth="3" />
        <rect x="-11" y="-140" width="22" height="14" fill="#b9b5c9" {...ink} />
        <path d="M-11 -140 V-152 Q-11 -160 -3 -160 H3 Q11 -160 11 -152 V-140 Z" fill={C.coral} {...ink} />
      </g>

      {/* fee tag on a string */}
      <path d="M150 196 C128 196 120 214 108 224" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <Float delay={0.6}>
        <g transform="translate(26 222) rotate(-10)">
          <path d="M0 8 Q0 0 8 0 H86 L106 24 L86 48 H8 Q0 48 0 40 Z" fill={C.mint} {...ink} />
          <circle cx="88" cy="24" r="5" fill={C.white} stroke={INK} strokeWidth="2.5" />
          <text x="14" y="34" fontSize="26" fontWeight="700" fill={INK} style={{ fontFamily: "var(--font-display)" }}>
            ${fee}
          </text>
        </g>
      </Float>

      {/* approved stamp */}
      <Float delay={1.3}>
        <g transform="translate(392 92)">
          <circle r="32" fill={C.coral} {...ink} />
          <path d="M-13 1 l9 9 l18 -20" fill="none" stroke={C.white} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </Float>
      <Sparkle x={104} y={110} s={1} />
      <Sparkle x={448} y={300} s={0.65} fill={C.sky} />
      <Dot x={360} y={36} r={5} fill={C.mint} />
      <Dot x={62} y={320} r={6} fill={C.yellow} />
    </Frame>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* FAQ: a question bubble and an answer bubble                                                */
/* ------------------------------------------------------------------------------------------ */

export function FaqArt({ className }: { className?: string }) {
  return (
    <Frame label="A speech bubble with a question mark and a reply bubble with an answer" tint={C.skySoft} className={className}>
      {/* question */}
      <Float delay={0}>
        <g>
          <path
            d="M96 64 H262 Q300 64 300 102 V182 Q300 220 262 220 H136 L96 256 L104 220 Q64 214 64 180 V102 Q64 64 96 64 Z"
            fill={C.sky}
            {...ink}
          />
          <text
            x="182"
            y="190"
            textAnchor="middle"
            fontSize="124"
            fontWeight="700"
            fill={C.white}
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
            paintOrder="stroke"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ?
          </text>
        </g>
      </Float>
      {/* answer */}
      <Float delay={1.2}>
        <g>
          <path
            d="M224 196 H398 Q432 196 432 230 V296 Q432 330 398 330 H392 L404 366 L362 330 H224 Q190 330 190 296 V230 Q190 196 224 196 Z"
            fill={C.white}
            {...ink}
          />
          <rect x="214" y="224" width="150" height="14" rx="7" fill={C.yellow} stroke={INK} strokeWidth="2" />
          <rect x="214" y="252" width="190" height="10" rx="5" fill={C.grey} />
          <rect x="214" y="274" width="160" height="10" rx="5" fill={C.grey} />
          <rect x="214" y="296" width="110" height="10" rx="5" fill={C.grey} />
          <g transform="translate(426 202)">
            <circle r="20" fill={C.mint} {...ink} />
            <path d="M-8 0 l6 6 l11 -12" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </Float>
      {/* typing */}
      <Float delay={0.7}>
        <g transform="translate(340 66)">
          <path d="M22 0 H86 Q108 0 108 22 V34 Q108 56 86 56 H34 L14 70 L18 54 Q0 48 0 30 V22 Q0 0 22 0 Z" fill={C.lilacSoft} {...ink} />
          {[34, 54, 74].map((x) => (
            <circle key={x} cx={x} cy="28" r="6" fill={C.lilac} stroke={INK} strokeWidth="2" />
          ))}
        </g>
      </Float>
      <Sparkle x={46} y={300} s={1} />
      <Sparkle x={330} y={160} s={0.6} fill={C.coral} />
      <Dot x={150} y={318} r={6} fill={C.coral} />
      <Dot x={438} y={150} r={5} fill={C.yellow} />
    </Frame>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Contact: a phone with a chat, an envelope and a call badge                                  */
/* ------------------------------------------------------------------------------------------ */

function Phone({ children, tilt = 0 }: { children: ReactNode; tilt?: number }) {
  return (
    <g transform={`rotate(${tilt} 245 196)`}>
      <rect x="170" y="36" width="150" height="316" rx="28" fill={INK} {...ink} />
      <rect x="181" y="48" width="128" height="292" rx="20" fill={C.white} />
      {children}
      <rect x="222" y="56" width="46" height="11" rx="5.5" fill={INK} />
    </g>
  );
}

export function ContactArt({ className }: { className?: string }) {
  return (
    <Frame label="A phone with a text conversation, an envelope and a call badge" tint={C.coralSoft} className={className}>
      <ellipse cx="246" cy="364" rx="96" ry="10" fill={INK} opacity="0.12" />
      <Phone tilt={-3}>
        {/* received */}
        <rect x="194" y="92" width="88" height="40" rx="14" fill="#f5f5f3" stroke={INK} strokeWidth="2.5" />
        <rect x="206" y="104" width="56" height="6" rx="3" fill={C.grey} />
        <rect x="206" y="116" width="38" height="6" rx="3" fill={C.grey} />
        {/* sent */}
        <rect x="214" y="146" width="84" height="52" rx="14" fill={C.yellow} stroke={INK} strokeWidth="2.5" />
        <rect x="226" y="160" width="58" height="6" rx="3" fill={INK} opacity="0.55" />
        <rect x="226" y="172" width="44" height="6" rx="3" fill={INK} opacity="0.55" />
        {/* received */}
        <rect x="194" y="212" width="74" height="40" rx="14" fill="#f5f5f3" stroke={INK} strokeWidth="2.5" />
        <rect x="206" y="224" width="46" height="6" rx="3" fill={C.grey} />
        <rect x="206" y="236" width="30" height="6" rx="3" fill={C.grey} />
        {/* typing */}
        <rect x="236" y="266" width="58" height="30" rx="14" fill={C.yellow} stroke={INK} strokeWidth="2.5" />
        {[252, 265, 278].map((x) => (
          <circle key={x} cx={x} cy="281" r="3.6" fill={INK} />
        ))}
        {/* compose bar */}
        <rect x="192" y="310" width="106" height="20" rx="10" fill="#f5f5f3" stroke={INK} strokeWidth="2" />
      </Phone>

      {/* envelope */}
      <Float delay={0.5}>
        <g transform="translate(40 196) rotate(-10)">
          <rect width="124" height="84" rx="10" fill={C.white} {...ink} />
          <path d="M6 76 L50 40 M118 76 L74 40" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M2 10 Q2 2 12 2 H112 Q122 2 122 10 L62 52 Z" fill={C.coral} {...ink} />
          <circle cx="62" cy="40" r="8" fill={C.yellow} stroke={INK} strokeWidth="2.5" />
        </g>
      </Float>

      {/* call badge with sound waves */}
      <Float delay={1.2}>
        <g transform="translate(384 112)">
          <circle r="40" fill={C.mint} {...ink} />
          <path
            d="M-17 -18 Q-22 -13 -19 -4 Q-12 14 6 20 Q15 23 19 17 L20 13 Q21 10 18 8 L10 3 Q7 1 4 4 L1 7 Q-9 2 -13 -8 L-10 -11 Q-7 -14 -9 -17 L-14 -24 Q-16 -27 -19 -25 Z"
            fill={C.white}
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M50 -20 Q62 0 50 20 M62 -32 Q80 0 62 32" fill="none" {...ink} />
        </g>
      </Float>
      <Sparkle x={100} y={92} s={1} fill={C.sky} />
      <Sparkle x={404} y={300} s={0.75} />
      <Dot x={140} y={320} r={6} fill={C.lilac} />
      <Dot x={444} y={210} r={5} fill={C.yellow} />
    </Frame>
  );
}
