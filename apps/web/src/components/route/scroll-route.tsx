"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { BusTop } from "../illustrations/bus-top";

/*
 * The page route: a road that winds down the page through every <RoadPoint>, with a top-down bus
 * that drives along it as the visitor scrolls. The road sits *behind* page content, so it shows
 * through open areas and disappears under solid sections, which is how the bus "drives into" a
 * section and comes out the other side. Points placed off-screen make it leave and re-enter
 * from the sides.
 */

type Pt = { x: number; y: number };
type Stop = Pt & { n: number };
type Geometry = {
  d: string;
  width: number;
  cw: number;
  height: number;
  stops: Stop[];
  start: Pt;
  /** the measured road points, in order, for mapping scroll to distance along the road */
  pts: Pt[];
  segs: Seg[];
};
type Samples = { x: Float32Array; y: Float32Array; step: number; total: number; anchors: { y: number; len: number }[] };

const SAMPLE_STEP = 3;
const BUS_LEN_PER_W = 1.5; // bus length relative to road width
/** Where in the viewport the bus aims to be. The hero bus uses the same line. */
export const ROUTE_TARGET = 0.58;
/** How long the bus takes to catch up with the scroll, in seconds. Lower is snappier. */
const FOLLOW = 0.26;
/** How far the bus is lifted off the road start so it tucks under the hero road. */
const TUCK = 6;

/**
 * Catmull-Rom through the points. The first segment leaves along `startDir` (a unit vector), so
 * the road continues the hero road's direction with no kink.
 */
type Seg = [Pt, Pt, Pt, Pt];
function catmullRom(pts: Pt[], startDir?: Pt): { d: string; segs: Seg[] } {
  const segs: Seg[] = [];
  if (pts.length < 2) return { d: "", segs };
  const p = pts;
  let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p1 = p[i];
    const p2 = p[i + 1];
    const p0 = i === 0 ? p1 : p[i - 1];
    const p3 = i + 2 < p.length ? p[i + 2] : p2;
    let c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    if (i === 0 && startDir) {
      const k = Math.hypot(p2.x - p1.x, p2.y - p1.y) / 3;
      c1 = { x: p1.x + startDir.x * k, y: p1.y + startDir.y * k };
    }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    segs.push([p1, c1, c2, p2]);
  }
  return { d, segs };
}

/**
 * Evenly spaced points along the road, computed from the curve maths directly. (The browser's
 * getPointAtLength gets slower the longer the path is, which froze the page for half a second
 * whenever the layout changed.) Also returns the distance along the road where each segment
 * starts, i.e. at each road point.
 */
function sampleRoad(segs: Seg[], step: number) {
  const fine: number[] = [];
  const cum: number[] = [];
  const segStart: number[] = [];
  let len = 0;
  let px = segs[0][0].x;
  let py = segs[0][0].y;
  fine.push(px, py);
  cum.push(0);
  for (const [a, b, c, e] of segs) {
    segStart.push(len);
    const N = 48;
    for (let k = 1; k <= N; k++) {
      const t = k / N;
      const u = 1 - t;
      const x = u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * e.x;
      const y = u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * e.y;
      len += Math.hypot(x - px, y - py);
      fine.push(x, y);
      cum.push(len);
      px = x;
      py = y;
    }
  }
  segStart.push(len);
  const n = Math.max(2, Math.ceil(len / step));
  const st = len / n;
  const xs = new Float32Array(n + 1);
  const ys = new Float32Array(n + 1);
  let j = 0;
  for (let i = 0; i <= n; i++) {
    const L = i * st;
    while (j < cum.length - 2 && cum[j + 1] < L) j++;
    const span = cum[j + 1] - cum[j] || 1;
    const t = Math.min(1, Math.max(0, (L - cum[j]) / span));
    xs[i] = fine[j * 2] + (fine[j * 2 + 2] - fine[j * 2]) * t;
    ys[i] = fine[j * 2 + 1] + (fine[j * 2 + 3] - fine[j * 2 + 1]) * t;
  }
  return { x: xs, y: ys, step: st, total: len, segStart };
}

/** Critically damped follow (no overshoot), frame-rate independent. */
export function smoothDamp(cur: number, target: number, vel: { v: number }, time: number, dt: number) {
  const omega = 2 / time;
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = cur - target;
  const temp = (vel.v + omega * change) * dt;
  vel.v = (vel.v - omega * temp) * exp;
  return target + (change + temp) * exp;
}

export function ScrollRoute({
  children,
  className,
  pace = 0,
}: {
  children: ReactNode;
  className?: string;
  /**
   * The least scroll (px) per px of road. 0 maps the bus straight to the scroll position; a
   * route that runs mostly sideways over a short scroll needs a pace so the bus doesn't race.
   */
  pace?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const busRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const samples = useRef<Samples | null>(null);
  /** the wrapper's top in page coordinates, so the per-frame loop never has to ask the browser for layout */
  const docTop = useRef(0);
  const reduce = useReducedMotion();

  /* ---- measure the markers and build the road ---- */
  const measure = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    docTop.current = box.top + window.scrollY;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-road-point]")).filter(
      (n) => n.getClientRects().length > 0 && getComputedStyle(n).display !== "none",
    );
    if (nodes.length < 2) return;
    let width = 90;
    const pts: Pt[] = [];
    const stopMeta: { idx: number; n: number }[] = [];
    nodes.forEach((n) => {
      const r = n.getBoundingClientRect();
      const pt = { x: r.left - box.left + r.width / 2, y: r.top - box.top };
      if (n.hasAttribute("data-road-start")) {
        width = Math.max(40, r.width);
        pt.y -= TUCK; // start a little inside the hero road, which is drawn on top
      }
      if (n.dataset.roadStop) stopMeta.push({ idx: pts.length, n: Number(n.dataset.roadStop) });
      pts.push(pt);
    });
    // Where the road leaves the hero it runs straight down under anything marked
    // data-road-clear (the stats band) and a little past it before it bends, so the stretch
    // above the band and the stretch below it line up.
    if (pts.length > 1) {
      const clear = el.querySelector<HTMLElement>("[data-road-clear]");
      if (clear && clear.getClientRects().length) {
        const r = clear.getBoundingClientRect();
        const y = r.bottom - box.top + 48;
        if (y > pts[0].y && y < pts[1].y - 40) {
          pts.splice(1, 0, { x: pts[0].x, y });
          stopMeta.forEach((sm) => (sm.idx += 1));
        }
      }
    }
    const { d, segs } = catmullRom(pts, { x: 0, y: 1 });
    setGeo((prev) =>
      prev && prev.d === d && prev.width === width && prev.height === box.height && prev.cw === box.width
        ? prev
        : {
            d,
            width,
            cw: box.width,
            height: box.height,
            start: pts[0],
            pts,
            segs,
            stops: stopMeta.map((s) => ({ ...pts[s.idx], n: s.n })),
          },
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    const el = wrap.current;
    if (!el) return;
    // Re-measure only once the layout has settled: an opening accordion changes the page height
    // every frame, and rebuilding the road on each of those frames is what made it stutter.
    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(measure, 160);
    });
    ro.observe(el);
    document.fonts?.ready.then(() => measure());
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, [measure]);

  /* ---- sample the road ---- */
  useEffect(() => {
    if (!geo || geo.segs.length === 0) return;
    const r = sampleRoad(geo.segs, SAMPLE_STEP);
    // Where each road point sits along the road. Scroll position maps to distance by
    // interpolating between these, so the bus never jumps across a sideways stretch.
    const anchors: { y: number; len: number }[] = [];
    geo.pts.forEach((pt, i) => {
      const prev = anchors[anchors.length - 1];
      const len = r.segStart[i];
      const y = prev ? Math.max(prev.y + 0.001, pt.y, prev.y + (len - prev.len) * pace) : pt.y;
      anchors.push({ y, len });
    });
    samples.current = { x: r.x, y: r.y, step: r.step, total: r.total, anchors };
  }, [geo, pace]);

  /* ---- drive the bus ---- */
  useEffect(() => {
    if (!geo) return;
    const bus = busRef.current;
    const el = wrap.current;
    if (!bus || !el) return;
    let raf = 0;
    let cur = -1; // distance along the road, px
    const vel = { v: 0 };
    let ang = Math.PI / 2;
    let last = performance.now();
    let lastTf = "";
    let lastOp = "";

    const lengthForY = (s: Samples, ty: number) => {
      const a = s.anchors;
      if (ty <= a[0].y) return a[0].len;
      for (let i = 1; i < a.length; i++) {
        if (ty <= a[i].y) {
          const t = (ty - a[i - 1].y) / (a[i].y - a[i - 1].y);
          return a[i - 1].len + (a[i].len - a[i - 1].len) * t;
        }
      }
      return a[a.length - 1].len;
    };
    const pointAt = (s: Samples, len: number) => {
      const f = Math.max(0, Math.min(s.x.length - 1.001, len / s.step));
      const i = Math.floor(f);
      const t = f - i;
      return { x: s.x[i] + (s.x[i + 1] - s.x[i]) * t, y: s.y[i] + (s.y[i + 1] - s.y[i]) * t };
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const s = samples.current;
      if (!s) return;
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      // page position from cache + scroll: reading layout here every frame forced the browser to
      // recalculate it mid-scroll, which is what made busy sections feel heavy
      const top = docTop.current - window.scrollY;
      const reach = -top + window.innerHeight * ROUTE_TARGET;
      const target = lengthForY(s, reach);
      if (cur < 0 || reduce) {
        cur = target;
        vel.v = 0;
      } else cur = smoothDamp(cur, target, vel, FOLLOW, dt);

      const p = pointAt(s, cur);
      // heading from a short chord around the bus, so it turns smoothly through bends
      const a = pointAt(s, cur - 10);
      const b = pointAt(s, cur + 10);
      const tgtAng = Math.atan2(b.y - a.y, b.x - a.x);
      let diff = tgtAng - ang;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      ang += reduce ? diff : diff * (1 - Math.exp(-dt * 14));

      const visibleFrom = geo.start.y + 40;
      const opacity = Math.max(0, Math.min(1, (reach - visibleFrom) / 140));
      const tf = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotate(${ang.toFixed(3)}rad)`;
      const op = opacity.toFixed(2);
      if (tf !== lastTf) bus.style.transform = lastTf = tf;
      if (op !== lastOp) bus.style.opacity = lastOp = op;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [geo, reduce]);

  const w = geo?.width ?? 90;
  const busLen = w * BUS_LEN_PER_W;

  return (
    <div ref={wrap} className={`relative overflow-x-clip ${className ?? ""}`}>
      {geo ? (
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-0 w-full"
          style={{ height: geo.height }}
          viewBox={`0 0 ${geo.cw} ${geo.height}`}
          preserveAspectRatio="none"
        >
          <g fill="none" strokeLinejoin="round">
            <path d={geo.d} stroke="var(--color-ink)" strokeWidth={w * 1.34 + 3} />
            <path d={geo.d} stroke="var(--color-sand)" strokeWidth={w * 1.34 - 3} />
            <path d={geo.d} stroke="var(--color-ink)" strokeWidth={w + 3} />
            <path d={geo.d} stroke="var(--color-road)" strokeWidth={w - 3} />
            <path
              d={geo.d}
              stroke="var(--color-road-line)"
              strokeWidth={Math.max(4, w * 0.075)}
              strokeDasharray={`${w * 0.42} ${w * 0.5}`}
              strokeDashoffset={-w * 0.25}
            />
          </g>
          {geo.stops.map((s) => (
            <g key={s.n} transform={`translate(${s.x} ${s.y})`}>
              <circle r={w * 0.34} fill="var(--color-bus-400)" stroke="var(--color-ink)" strokeWidth={3} />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={w * 0.34}
                fontWeight={600}
                fill="var(--color-ink)"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.n}
              </text>
            </g>
          ))}
        </svg>
      ) : null}

      {/* the bus */}
      <div
        ref={busRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 will-change-transform"
        // rotate around the point on the road, not the middle of this box
        style={{ opacity: 0, transformOrigin: "0 0" }}
      >
        <div style={{ width: busLen, height: busLen * (72 / 152), transform: "translate(-50%, -50%)" }}>
          <BusTop className="block size-full drop-shadow-[0_6px_6px_rgba(29,26,47,0.18)]" />
        </div>
      </div>

      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
