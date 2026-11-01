"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef } from "react";
import { BusFront } from "../illustrations/bus-front";
import { Cloud, House, PineTree, RoundTree, School, StopSign } from "../illustrations/scene-parts";
import { RoadPoint } from "../route/road-point";
import { ROUTE_TARGET, smoothDamp } from "../route/scroll-route";

/* ---------------------------------------------------------------------------------------------
 * Scene geometry, in SVG user units (viewBox 0 0 800 760).
 * The road starts at the school door and widens toward the viewer, leaving the bottom edge at
 * ROAD_EXIT with width ROAD_EXIT_W. The page's scroll route picks up from there.
 * ------------------------------------------------------------------------------------------- */

const VB_W = 800;
const VB_H = 760;
export const ROAD_EXIT = { x: 452, y: VB_H };
export const ROAD_EXIT_W = 132;

type P = [number, number];
const segs: [P, P, P, P][] = [
  [[400, 292], [372, 360], [548, 400], [512, 486]],
  [[512, 486], [484, 570], [ROAD_EXIT.x, 650], [ROAD_EXIT.x, ROAD_EXIT.y]],
];

function bez(seg: [P, P, P, P], t: number): P {
  const [a, b, c, d] = seg;
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
}
function centre(s: number): P {
  const k = Math.min(segs.length - 1e-6, Math.max(0, s * segs.length));
  const i = Math.floor(k);
  return bez(segs[i], k - i);
}
// starts as wide as the school door (40 × 0.82 ≈ 33 with its verges), widening toward the viewer
const widthAt = (s: number) => 25 + (ROAD_EXIT_W - 25) * Math.pow(s, 1.35);
function normal(s: number): P {
  const e = 0.002;
  const a = centre(Math.max(0, s - e));
  const b = centre(Math.min(1, s + e));
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  return [-dy / l, dx / l];
}
function ribbon(s0: number, s1: number, wScale: number, n = 60) {
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= n; i++) {
    const s = s0 + ((s1 - s0) * i) / n;
    const [cx, cy] = centre(s);
    const [nx, ny] = normal(s);
    const h = (widthAt(s) * wScale) / 2;
    left.push(`${(cx + nx * h).toFixed(1)} ${(cy + ny * h).toFixed(1)}`);
    right.push(`${(cx - nx * h).toFixed(1)} ${(cy - ny * h).toFixed(1)}`);
  }
  return `M${left.join(" L")} L${right.reverse().join(" L")} Z`;
}
function edge(side: 1 | -1, wScale: number, n = 80) {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const [cx, cy] = centre(s);
    const [nx, ny] = normal(s);
    const h = (widthAt(s) * wScale) / 2;
    pts.push(`${(cx + side * nx * h).toFixed(1)} ${(cy + side * ny * h).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

const ROAD = ribbon(0, 1, 1);
const KERB = ribbon(0, 1, 1.34);
const EDGE_L = edge(1, 1);
const KERB_L = edge(1, 1.34);
const KERB_R = edge(-1, 1.34);
const EDGE_R = edge(-1, 1);

const DASHES = 9;
function dashPath(phase: number) {
  let d = "";
  for (let i = 0; i < DASHES; i++) {
    const u = (i + phase) / DASHES;
    const s = Math.pow(u, 0.85);
    const len = 0.022 + 0.03 * s;
    const s0 = Math.max(0.03, s - len / 2);
    const s1 = Math.min(1, s + len / 2);
    if (s1 <= s0) continue;
    d += ribbon(s0, s1, 0.075, 6);
  }
  return d;
}

const DASH_D = dashPath(0.4);

/** Road centre y is monotone in s, so a lookup table maps a y back to its s. */
const S_TABLE = Array.from({ length: 201 }, (_, i) => ({ s: i / 200, y: centre(i / 200)[1] }));
function sAtY(y: number) {
  if (y <= S_TABLE[0].y) return 0;
  for (let i = 1; i < S_TABLE.length; i++) {
    const b = S_TABLE[i];
    if (y <= b.y) {
      const a = S_TABLE[i - 1];
      return a.s + ((b.s - a.s) * (y - a.y)) / (b.y - a.y || 1);
    }
  }
  return 1;
}

const BUS_S = 0.62;
const [BUS_X, BUS_Y] = centre(BUS_S);
const BUS_W = widthAt(BUS_S) * 1.18;

/* -------------------------------------------------------------------------------------------- */

function useParallax(px: MotionValue<number>, py: MotionValue<number>, depth: number) {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth * 0.6);
  return { x, y };
}

export function HeroScene({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();

  // Pointer parallax.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 18 });
  const py = useSpring(rawY, { stiffness: 60, damping: 18 });
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, rawX, rawY]);

  const far = useParallax(px, py, -6);
  const mid = useParallax(px, py, -12);
  const near = useParallax(px, py, -22);

  // Scroll: far layers drift apart a little.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const farScroll = useTransform(prog, [0, 1], [0, 60]);
  const midScroll = useTransform(prog, [0, 1], [0, 30]);

  // The bus drives down this road with the same rule as the page route below: it sits where the
  // line at ROUTE_TARGET of the viewport crosses the road, so it reaches the bottom edge exactly
  // when the page bus takes over there.
  const svgRef = useRef<SVGSVGElement>(null);
  const busRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const svg = svgRef.current;
    const bus = busRef.current;
    if (!svg || !bus) return;
    let raf = 0;
    let cur = BUS_S;
    // The scene's page position, cached: reading layout every frame forced extra work mid-scroll
    const box = { top: 0, h: 1 };
    const cache = () => {
      const r = svg.getBoundingClientRect();
      box.top = r.top + window.scrollY;
      box.h = r.height;
    };
    cache();
    const ro = new ResizeObserver(cache);
    ro.observe(svg);
    window.addEventListener("resize", cache);
    const settle = window.setTimeout(cache, 1200);
    let lastT = "";
    let lastO = "";
    const vel = { v: 0 };
    let last = performance.now();
    const place = (sv: number, opacity: number) => {
      const [cx, cy] = centre(sv);
      const k = widthAt(sv) / widthAt(BUS_S);
      // lean with the road: angle of the road's direction away from straight down
      const [ax, ay] = centre(Math.max(0, sv - 0.01));
      const [bx, by] = centre(Math.min(1, sv + 0.01));
      const lean = (-Math.atan2(bx - ax, by - ay) * 180) / Math.PI;
      const t = `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${(lean * 0.8).toFixed(2)}) scale(${k.toFixed(3)}) translate(${-BUS_X} ${-BUS_Y})`;
      const o = opacity.toFixed(2);
      if (t !== lastT) bus.setAttribute("transform", (lastT = t));
      if (o !== lastO) bus.style.opacity = lastO = o;
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const r = { top: box.top - window.scrollY, height: box.h, bottom: box.top + box.h - window.scrollY };
      if (r.bottom < -400 || r.top > window.innerHeight) return;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      const unit = r.height / VB_H;
      const line = window.innerHeight * ROUTE_TARGET;
      const target = Math.max(BUS_S, sAtY((line - r.top) / unit));
      cur = reduce ? target : smoothDamp(cur, target, vel, 0.26, dt);
      // past the bottom edge: hand over to the page bus (same fade as the page route)
      const beyond = line - r.bottom;
      place(cur, Math.max(0, Math.min(1, 1 - (beyond - 40) / 140)));
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", cache);
      window.clearTimeout(settle);
    };
  }, [reduce]);

  return (
    <div className="relative w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        ref={svgRef}
        className="absolute inset-0 size-full overflow-visible"
        role="img"
        aria-label="A yellow Rush Hour Kids school bus driving down a winding road from the school, past houses and a bus stop."
      >
        <defs>
          <linearGradient id="hero-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d3f4e4" />
            <stop offset="0.72" stopColor="#e9f8ee" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id="hero-fade-x" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VB_W} y2="0">
            <stop offset="0" stopColor="#000" />
            <stop offset="0.12" stopColor="#fff" />
            <stop offset="0.88" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="hero-fade" maskUnits="userSpaceOnUse" x="-100" y="-100" width={VB_W + 200} height={VB_H + 200}>
            <rect x="-100" y="-100" width={VB_W + 200} height={VB_H + 200} fill="url(#hero-fade-x)" />
          </mask>
          <linearGradient id="hero-road-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a3654" />
            <stop offset="0.75" stopColor="#2b2840" />
            <stop offset="1" stopColor="#2b2840" />
          </linearGradient>
        </defs>

        <g mask="url(#hero-fade)">
        {/* far: sun, clouds, hills */}
        <motion.g style={{ x: far.x, y: far.y, translateY: farScroll }}>
          <circle cx="640" cy="120" r="64" fill="#ffe38a" />
          <circle cx="640" cy="120" r="46" fill="#ffd54f" />
          <g className="rhk-drift">
            <Cloud x={110} y={70} s={1} />
            <Cloud x={500} y={40} s={0.7} />
          </g>
          <g className="rhk-drift-slow">
            <Cloud x={690} y={210} s={0.8} />
          </g>
          <path d="M-60 330 Q120 210 300 290 T640 250 T880 300 V420 H-60 Z" fill="#e6ddff" stroke="#1d1a2f" strokeWidth="3" />
          <path d="M-60 360 Q160 280 380 330 T880 320 V460 H-60 Z" fill="#d5ecfd" stroke="#1d1a2f" strokeWidth="3" />
        </motion.g>

        {/* ground */}
        <path d="M-60 300 Q200 262 420 284 T880 280 V800 H-60 Z" fill="url(#hero-ground)" />
        <path d="M-60 300 Q200 262 420 284 T880 280" fill="none" stroke="#1d1a2f" strokeWidth="3" />
        </g>

        {/* mid: school, houses, distant trees */}
        <motion.g style={{ x: mid.x, y: mid.y, translateY: midScroll }}>
          <PineTree x={232} y={300} s={0.62} />
          <RoundTree x={578} y={300} s={0.62} tone="#2fae78" />
          <House x={152} y={420} s={0.9} roof="#4fb3f6" door="#ff6a4d" />
          <House x={686} y={392} s={0.78} roof="#9b7bff" wall="#ffd9cf" door="#3fc48a" flip />
          <PineTree x={92} y={372} s={0.7} tone="#3fc48a" />
        </motion.g>

        {/* the school stays still (no parallax) so the road always leaves from its door */}
        <School x={400} y={292} s={0.82} />

        {/* road (static, so it lines up with the page route below) */}
        {/* outlines keep a fixed 3px so they match the page road exactly where it takes over */}
        <path d={KERB} fill="#f6e7c8" />
        <path d={KERB_L} fill="none" stroke="#1d1a2f" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d={KERB_R} fill="none" stroke="#1d1a2f" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d={ROAD} fill="url(#hero-road-fade)" />
        <path d={EDGE_L} fill="none" stroke="#1d1a2f" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d={EDGE_R} fill="none" stroke="#1d1a2f" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <path d={DASH_D} fill="#ffe38a" />

        {/* near: trees, bus stop */}
        <motion.g style={{ x: near.x, y: near.y }}>
          <RoundTree x={286} y={560} s={0.95} tone="#3fc48a" />
          <StopSign x={600} y={560} s={0.95} />
          <RoundTree x={736} y={700} s={1.25} tone="#2fae78" />
          <PineTree x={78} y={720} s={1.3} />
          <House x={150} y={612} s={1.05} roof="#ff6a4d" wall="#fff0bf" door="#9b7bff" />
        </motion.g>

        {/* the bus (placed by the effect above) */}
        <g ref={busRef}>
          <g>
            <BusFront
              className="overflow-visible"
              // the bus's wheels sit on the road centre
              {...{ x: BUS_X - BUS_W / 2, y: BUS_Y - BUS_W * (190 / 200), width: BUS_W, height: BUS_W }}
            />
          </g>
        </g>
      </svg>

      {/* where the page route picks up */}
      <RoadPoint
        id="hero-exit"
        className="absolute bottom-0"
        style={{
          left: `${(ROAD_EXIT.x / VB_W) * 100}%`,
          width: `${(ROAD_EXIT_W / VB_W) * 100}%`,
        }}
        start
      />
    </div>
  );
}
