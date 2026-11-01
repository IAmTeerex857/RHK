"use client";

/*
 * The parent app on a real iPhone frame (Stageshow kit, MIT, vendored in src/vendor/stageshow).
 * Story, played once when it scrolls into view: the van drives the last stretch to school, the
 * tracker ticks over to "At school" and an alert drops in. The poster (and reduced motion) is
 * the arrived frame, so a still tells the whole story.
 */

import { Stage } from "@/vendor/stageshow/stage";
import type { Act } from "@/vendor/stageshow/act";
import { Notification, Phone } from "@/vendor/stageshow/phone";
import { LogoMark } from "../site/logo";
import "./app-phone.css";

type S = { arrived: boolean; banner: boolean };
const START: S = { arrived: false, banner: false };
const END: S = { arrived: true, banner: true };

const script = async (a: Act<S>) => {
  await a.wait(900);
  await a.set({ arrived: true });
  await a.wait(4300); // the van's drive (a CSS transition of the same length)
  await a.set({ banner: true });
  await a.wait(600);
};

// The route on the map, in map points (the map is 362 × 400)
const ROUTE = "M44 352 C 60 290, 128 300, 150 250 S 120 170, 182 140 S 290 120, 306 62";

function Map({ arrived }: { arrived: boolean }) {
  return (
    <div className="rhk-app__map">
      <svg viewBox="0 0 362 400" className="rhk-app__map-art" aria-hidden>
        {/* blocks and a park */}
        {[
          [14, 14, 96, 64],
          [128, 14, 70, 52],
          [222, 132, 124, 70],
          [14, 104, 104, 100],
          [222, 236, 124, 64],
          [14, 236, 92, 70],
          [128, 318, 70, 70],
          [222, 318, 124, 70],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="12" fill="#ffffff" opacity="0.75" />
        ))}
        <ellipse cx="282" cy="172" rx="40" ry="24" fill="#bfe9d2" />
        {/* streets */}
        <path d="M0 92 H362 M0 218 H362 M0 310 H362 M120 0 V400 M210 0 V400" stroke="#ffffff" strokeWidth="14" />
        {/* route: the full way faint, the driven part solid */}
        <path d={ROUTE} fill="none" stroke="#1d1a2f" strokeOpacity="0.18" strokeWidth="7" strokeLinecap="round" />
        <path
          d={ROUTE}
          pathLength={1}
          className="rhk-app__driven"
          data-arrived={arrived || undefined}
          fill="none"
          stroke="#1d1a2f"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* home */}
        <circle cx="44" cy="352" r="11" fill="#9b7bff" stroke="#1d1a2f" strokeWidth="3" />
        {/* school */}
        <g transform="translate(306 62)">
          <circle r="16" fill="#3fc48a" stroke="#1d1a2f" strokeWidth="3" />
          <path d="M-5 7 V-8 M-5 -8 H7 L3 -4 L7 0 H-5" fill="none" stroke="#1d1a2f" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
        </g>
      </svg>
      {/* the van, riding the same path */}
      <span className="rhk-app__van" data-arrived={arrived || undefined} style={{ offsetPath: `path("${ROUTE}")` }}>
        <svg viewBox="0 0 40 24" width="40" height="24" aria-hidden>
          <rect x="1.5" y="1.5" width="37" height="21" rx="6" fill="#ffd45f" stroke="#1d1a2f" strokeWidth="3" />
          <rect x="29" y="5" width="6" height="14" rx="2" fill="#d5ecfd" stroke="#1d1a2f" strokeWidth="1.8" />
          <path d="M8 6 V18 M15 6 V18 M22 6 V18" stroke="#1d1a2f" strokeWidth="1.6" strokeOpacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

const STEPS = ["Picked up", "On the way", "At school"];

function Tracker({ arrived }: { arrived: boolean }) {
  const at = arrived ? 2 : 1;
  return (
    <div className="rhk-app__sheet">
      <div className="rhk-app__eta">
        <span className="rhk-app__eta-label">{arrived ? "Arrived" : "Arrives"}</span>
        <span className="rhk-app__eta-time">{arrived ? "7:41" : "7:42"}</span>
      </div>
      <ol className="rhk-app__steps">
        {STEPS.map((label, i) => (
          <li key={label} data-done={i < at || (arrived && i === at) || undefined} data-now={(!arrived && i === at) || undefined}>
            <span className="rhk-app__dot" />
            <span className="rhk-app__step">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AppPhone() {
  return (
    <Stage<S>
      width={400}
      height={700}
      compact={{ below: 380, width: 340, height: 620 }}
      initial={START}
      poster={END}
      script={script}
      play="once"
      className="rhk-app"
      accent="#ffd45f"
    >
      {(s, _rect, layout) => (
        <Phone width={layout === "compact" ? 330 : 370} time="7:41" className="rhk-app__phone">
          <div className="rhk-app__screen">
            <div className="rhk-app__head">
              <span className="rhk-app__kicker">Morning ride</span>
              <span className="rhk-app__title">Ava&rsquo;s ride to school</span>
            </div>
            <Map arrived={s.arrived} />
            <Tracker arrived={s.arrived} />
          </div>
          {s.banner ? (
            <Notification
              banner
              icon={<LogoMark className="size-full" />}
              title="Rush Hour Kids"
              body="Ava arrived at school. Checked off by the driver at 7:41."
            />
          ) : null}
        </Phone>
      )}
    </Stage>
  );
}
