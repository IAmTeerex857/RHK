"use client";

/*
 * Our App hero: the ride as a Live Activity in the Dynamic Island, on the top of an iPhone that
 * runs off the foot of the stage (Stageshow kit, MIT, vendored in src/vendor/stageshow; after
 * its dynamic-island example). Played once when it first shows:
 *
 *   1.4s  the minutes roll down in the compact island
 *   2.6s  a finger presses the island; it springs open into the Live Activity
 *   4.4s  the van gets closer: the minutes roll and the van rides up the track
 *   6.2s  "Arriving", 1 min
 *   8.0s  Ava is on board: the badge turns to a check, the track fills
 *   9.0s  the boarding alert lands on the lock screen, and the frame holds
 *
 * The poster (thumbnails, reduced motion) is that last frame. Island units are screen points on
 * the kit's iPhone (402 × 874), round the screen's island: x 153.5 to 248.5, y 14.5, 95 × 37.
 *
 * Real strings: the minutes, the status line, "On board", "Pick-up at home", "Van 2" and the
 * alert. Everything else is a shape.
 */

import type { CSSProperties } from "react";
import { Stage } from "@/vendor/stageshow/stage";
import type { Act } from "@/vendor/stageshow/act";
import { LockScreen, Notification, Phone } from "@/vendor/stageshow/phone";
import { Roll, Swap } from "@/vendor/stageshow/motion";
import { LogoMark } from "../site/logo";
import "./app-hero.css";

/** A damped spring as a CSS linear() easing */
function spring(zeta: number, omega: number, ms: number, n = 48) {
  const wd = omega * Math.sqrt(1 - zeta * zeta);
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * (ms / 1000);
    const x = i === n ? 1 : 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t));
    pts.push(x.toFixed(4));
  }
  return `linear(${pts.join(", ")})`;
}

const GROW = { ease: spring(0.7, 15, 500), ms: 500 };
const SHRINK = { ease: spring(0.98, 19, 380), ms: 380 };

type Mode = "compact" | "open";
type Box = { l: number; t: number; w: number; h: number; r: number };

const CX = 201;
const BASE: Box = { l: 153.5, t: 14.5, w: 95, h: 37, r: 18.5 };
const GEO: Record<Mode, Box> = {
  compact: { l: CX - 103, t: 14.5, w: 206, h: 37, r: 18.5 },
  open: { l: 13, t: 10, w: 376, h: 172, r: 52 },
};

type S = { mode: Mode; eta: number; prog: number; label: string; aboard: boolean; alert: boolean; press: boolean };
const START: S = { mode: "compact", eta: 8, prog: 0.18, label: "Van 2 is on the way", aboard: false, alert: false, press: false };
const END: S = { mode: "open", eta: 0, prog: 1, label: "Picked up at 7:13", aboard: true, alert: true, press: false };

// A school bus seen from the front, solid (small glyphs are filled), windscreen and lamps cut out
const BUS =
  "M6.5 2.5h11A3.5 3.5 0 0 1 21 6v11a1.5 1.5 0 0 1-1.5 1.5H19v1.75a1.25 1.25 0 0 1-2.5 0V18.5h-9v1.75a1.25 1.25 0 0 1-2.5 0V18.5h-.5A1.5 1.5 0 0 1 3 17V6a3.5 3.5 0 0 1 3.5-3.5ZM5.5 7v4.5h13V7ZM6 14.5a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM15.5 14.5a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0Z";
const CHECK = "M5 12.5l4.5 4.5L19 7.5";

function Bus({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d={BUS} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
function Tick({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d={CHECK} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const boxStyle = (b: Box, grow: boolean): CSSProperties => ({
  left: b.l,
  top: b.t,
  width: b.w,
  height: b.h,
  borderRadius: b.r,
  transitionDuration: `${grow ? GROW.ms : SHRINK.ms}ms`,
  transitionTimingFunction: grow ? GROW.ease : SHRINK.ease,
  transitionDelay: grow ? "0ms" : "120ms",
});

function Island({ s }: { s: S }) {
  // grows into the activity, shrinks back to the pill (only ever these two)
  const grow = s.mode === "open";
  const min = (n: number) => `${n} min`;
  return (
    <div className="rhk-di" data-mode={s.mode} data-press={s.press || undefined}>
      <span className="rhk-di__shape" style={boxStyle(GEO[s.mode], grow)} />

      {/* compact: the bus leading, the minutes trailing */}
      <span className="rhk-di__item rhk-di__lead" data-on={s.mode === "compact" || undefined} style={{ left: GEO.compact.l + 12, top: 14.5 + 7.5 }}>
        <Bus size={22} />
      </span>
      <span
        className="rhk-di__item rhk-di__trail"
        data-on={s.mode === "compact" || undefined}
        style={{ right: 402 - (GEO.compact.l + GEO.compact.w) + 14, top: 14.5 }}
      >
        <Roll>{min(s.eta)}</Roll>
      </span>

      {/* expanded: the whole body as one group, in once the shape is mostly there */}
      <div
        className="rhk-di__item rhk-di__body"
        data-on={s.mode === "open" || undefined}
        style={{ left: GEO.open.l, top: GEO.open.t, width: GEO.open.w, height: GEO.open.h }}
      >
        <div className="rhk-di__top">
          <span className="rhk-di__words">
            <Swap id={s.label} className="rhk-di__label">
              {s.label}
            </Swap>
            <span className="rhk-di__eta">
              <Swap id={s.aboard ? "aboard" : "eta"}>{s.aboard ? "On board" : <Roll>{min(s.eta)}</Roll>}</Swap>
            </span>
          </span>
          <span className="rhk-di__badge" data-aboard={s.aboard || undefined}>
            <Swap id={s.aboard ? "tick" : "bus"} className="rhk-di__glyph">
              {s.aboard ? <Tick size={26} /> : <Bus size={28} />}
            </Swap>
          </span>
        </div>
        <span className="rhk-di__track" style={{ ["--p" as string]: s.prog }}>
          <span className="rhk-di__fill" />
          <span className="rhk-di__end" />
          <span className="rhk-di__rider">
            <Bus size={14} />
          </span>
        </span>
        <span className="rhk-di__foot">
          <span>Pick-up at home</span>
          <span className="rhk-di__van">Van 2</span>
        </span>
      </div>
    </div>
  );
}

const script = async (a: Act<S>) => {
  await a.wait(1400);
  a.put({ eta: 7 });
  await a.wait(1200);
  const r = a.rect("island");
  const point = r ? { x: r.x + r.width * 0.5, y: r.y + r.height * 0.55 } : "island";
  await a.move(point, { duration: 420 });
  a.put({ press: true });
  await a.drag(point, undefined, { duration: 380 });
  a.put({ press: false, mode: "open" });
  void a.move(a.layout === "compact" ? { x: 300, y: 420 } : { x: 440, y: 540 }, { duration: 300 });
  await a.wait(1800);
  a.put({ eta: 4, prog: 0.55 });
  await a.wait(1800);
  a.put({ label: "Arriving", eta: 1, prog: 0.86 });
  await a.wait(1800);
  a.put({ label: "Picked up at 7:13", aboard: true, prog: 1 });
  await a.wait(1000);
  a.put({ alert: true });
  await a.wait(800);
};

export function AppHero() {
  return (
    <Stage<S>
      width={480}
      height={560}
      compact={{ below: 400, width: 340, height: 440 }}
      initial={START}
      poster={END}
      play="once"
      script={script}
      cursor={{ at: { wide: { x: 440, y: 540 }, compact: { x: 300, y: 420 } }, style: "touch" }}
      accent="#ffc629"
      className="rhk-apphero"
    >
      {(s, _rect, layout) => {
        const compact = layout === "compact";
        const pw = compact ? 316 : 420;
        const w = compact ? 340 : 480;
        return (
          <div className="rhk-apphero__device ss-fade-b" style={{ left: Math.round((w - pw) / 2), top: compact ? 12 : 24 }}>
            <Phone width={pw} frame="pro" island={false} time="7:13" dark wallpaper="var(--rhk-wall)">
              <LockScreen className="rhk-apphero__lock" data-obscured={s.mode === "open" || undefined} date="Tuesday, September 8" time="7:13" controls={false} stack="top">
                <div className="rhk-apphero__alert" data-on={s.alert || undefined}>
                  <Notification icon={<LogoMark className="size-full" />} title="Rush Hour Kids" body="Ava boarded safely. Checked on by the driver at 7:13." />
                </div>
              </LockScreen>
              <span className="rhk-apphero__hit" data-target="island" style={{ left: BASE.l, top: BASE.t, width: BASE.w, height: BASE.h }} />
              <Island s={s} />
            </Phone>
          </div>
        );
      }}
    </Stage>
  );
}
