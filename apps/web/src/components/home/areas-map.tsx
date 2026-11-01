"use client";

import { motion, useReducedMotion } from "motion/react";
import { areas } from "@/content/site";

/*
 * A friendly, not-to-scale map of the five service areas: the counties as soft shapes, the
 * I-285 loop with I-20, I-75 and I-85 through it, the Chattahoochee, Lake Lanier, Stone Mountain
 * and downtown. A van drives round the loop. Area pins are HTML so their labels stay crisp.
 * Art is in a 600 × 420 box; areas[].x / y are percentages of a 100 × 72 grid.
 */

const INK = "#1d1a2f";
const W = 600;
const H = 420;
const px = (a: { x: number; y: number }) => ({ x: (a.x / 100) * W, y: (a.y / 72) * H });

const LOOP = "M290 150 C 372 150, 420 196, 420 252 C 420 312, 366 352, 290 352 C 214 352, 160 312, 160 252 C 160 196, 208 150, 290 150 Z";

function Highway({ d }: { d: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth="12" />
      <path d={d} stroke="#ffffff" strokeWidth="7.5" />
      <path d={d} stroke="#e8c45a" strokeWidth="1.3" strokeDasharray="6 7" />
    </g>
  );
}

function Shield({ x, y, n }: { x: number; y: number; n: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-15 -12 H15 V2 Q15 12 0 17 Q-15 12 -15 2 Z" fill="#2f6fd6" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M-15 -12 H15 V-6 H-15 Z" fill="#e8483b" />
      <text y="7" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff" style={{ fontFamily: "var(--font-display)" }}>
        {n}
      </text>
    </g>
  );
}

const tree = (x: number, y: number, k = 1) => (
  <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${k})`}>
    <path d="M0 0 v8" stroke={INK} strokeWidth="2" />
    <circle cy="-4" r="8" fill="#3fc48a" stroke={INK} strokeWidth="2" />
  </g>
);

export function AreasMap({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-line bg-[#d5ecfd] shadow-float ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label="Map of the five areas we drive: Gwinnett County, Fulton County, Decatur, Stone Mountain and Douglas County">
        {/* land */}
        <path d="M18 34 Q24 14 52 14 H548 Q586 14 586 50 V372 Q586 406 550 406 H48 Q16 406 16 374 Z" fill="#eaf6ee" stroke={INK} strokeWidth="2.5" />

        {/* counties */}
        <path d="M150 40 Q250 28 300 60 L330 150 Q330 250 300 300 L272 404 H190 L176 300 Q150 220 168 150 Z" fill="#dff0fb" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M330 40 H586 V200 Q520 214 452 196 Q392 182 340 146 Z" fill="#ece5ff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M340 160 Q400 196 470 206 Q540 214 586 206 V360 Q500 380 420 372 Q356 366 320 330 Q300 300 312 250 Z" fill="#fff3c9" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M16 270 Q80 250 150 268 L176 300 L190 404 H48 Q16 404 16 372 Z" fill="#ffe1d8" stroke={INK} strokeWidth="2" strokeLinejoin="round" />

        {/* Chattahoochee river and Lake Lanier */}
        <path d="M120 14 C 150 90, 120 150, 150 210 S 118 300, 70 406" fill="none" stroke="#7cc4f6" strokeWidth="8" strokeLinecap="round" />
        <path d="M120 14 C 150 90, 120 150, 150 210 S 118 300, 70 406" fill="none" stroke={INK} strokeWidth="1.4" strokeOpacity="0.35" strokeLinecap="round" />
        <path d="M486 30 Q540 22 566 44 Q574 66 548 72 Q520 64 500 74 Q478 70 486 30 Z" fill="#7cc4f6" stroke={INK} strokeWidth="2" />

        {/* Stone Mountain */}
        <path d="M486 262 Q500 226 534 226 Q566 230 572 262 Z" fill="#c9c5d6" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M500 250 Q512 236 528 236" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

        {/* parks and trees */}
        {[tree(210, 96), tree(226, 108, 0.8), tree(410, 120), tree(96, 318, 0.9), tree(450, 330), tree(470, 342, 0.8), tree(250, 380, 0.85)]}

        {/* interstates */}
        <Highway d="M16 300 C 180 286, 300 262, 420 262 S 560 252, 586 246" />
        <Highway d="M150 14 C 210 120, 262 196, 290 252 S 330 360, 316 406" />
        <Highway d="M586 60 C 470 120, 360 200, 290 252 S 170 340, 120 406" />
        <Highway d={LOOP} />

        {/* downtown */}
        <g transform="translate(276 264)">
          <rect x="-12" y="-26" width="11" height="26" rx="1.5" fill="#9b7bff" stroke={INK} strokeWidth="2" />
          <rect x="1" y="-40" width="12" height="40" rx="1.5" fill="#4fb3f6" stroke={INK} strokeWidth="2" />
          <rect x="15" y="-22" width="10" height="22" rx="1.5" fill="#ff6a4d" stroke={INK} strokeWidth="2" />
        </g>

        <Shield x={430} y={210} n="285" />
        <Shield x={200} y={282} n="20" />
        <Shield x={186} y={58} n="75" />
        <Shield x={530} y={104} n="85" />

        {/* a van going round the loop */}
        {reduce ? null : (
          <g>
            <rect x="-11" y="-7" width="22" height="14" rx="4" fill="#ffc629" stroke={INK} strokeWidth="2" />
            <rect x="5" y="-4" width="4" height="8" rx="1" fill="#d5ecfd" stroke={INK} strokeWidth="1.2" />
            <animateMotion dur="16s" repeatCount="indefinite" rotate="auto" path={LOOP} />
          </g>
        )}
      </svg>

      {areas.map((a, i) => {
        const p = px(a);
        return (
          <motion.div
            key={a.name}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
            initial={reduce ? false : { opacity: 0, y: -12, scale: 0.85 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.15 + i * 0.09, type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex flex-col items-center">
              <span className="whitespace-nowrap rounded-md border border-line bg-white px-1.5 py-0.5 font-display text-[10px] font-semibold shadow-subtle sm:rounded-lg sm:px-2.5 sm:py-1 sm:text-[12px] md:text-[13px]">
                {a.name}
              </span>
              <svg viewBox="0 0 24 30" className="mt-0.5 h-[18px] w-[15px] sm:mt-1 sm:h-[26px] sm:w-[21px]" aria-hidden>
                <path d="M12 28 C 12 28, 2 17, 2 11 A10 10 0 0 1 22 11 C 22 17, 12 28, 12 28 Z" fill="#ff6a4d" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
                <circle cx="12" cy="11" r="4" fill="#ffffff" stroke={INK} strokeWidth="1.8" />
              </svg>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
