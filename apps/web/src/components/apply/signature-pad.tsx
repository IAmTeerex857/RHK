"use client";

import { Eraser } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@rhk/ui/lib/cn";

/** Draw-to-sign box. Works with mouse, pen and finger. Emits a PNG data URL. */
export function SignaturePad({ value, onChange, error }: { value: string; onChange: (dataUrl: string) => void; error?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(Boolean(value));

  // size the canvas to its box and restore an existing signature
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const fit = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = "#1d1a2f";
      if (value) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height);
        img.src = value;
      }
    };
    fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    const mid = { x: (last.current.x + p.x) / 2, y: (last.current.y + p.y) / 2 };
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.quadraticCurveTo(last.current.x, last.current.y, mid.x, mid.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (!hasInk) setHasInk(true);
  };
  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    if (canvas.current) onChange(canvas.current.toDataURL("image/png"));
  };
  const clear = () => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.restore();
    setHasInk(false);
    onChange("");
  };

  return (
    <div data-error={error ? "true" : undefined}>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-display text-[15px] font-semibold">
          Signature <span className="text-coral">*</span>
        </p>
        <button type="button" onClick={clear} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-semibold text-ink-soft hover:bg-ink/5 hover:text-ink">
          <Eraser className="size-3.5" /> Clear
        </button>
      </div>
      <div
        className={cn(
          "relative h-40 overflow-hidden rounded-2xl border bg-[linear-gradient(transparent_calc(100%-42px),var(--color-sand)_calc(100%-42px),var(--color-sand)_calc(100%-40px),transparent_calc(100%-40px))] bg-white",
          error ? "border-coral" : "border-line",
        )}
      >
        {!hasInk ? (
          <span className="pointer-events-none absolute inset-0 grid place-items-center text-[15px] text-ink-muted">Sign here with your finger or mouse</span>
        ) : null}
        <canvas
          ref={canvas}
          aria-label="Signature box. Draw your signature."
          role="img"
          className="absolute inset-0 size-full touch-none cursor-crosshair"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
        />
      </div>
      {error ? <p role="alert" className="px-1 pt-1.5 text-[13px] font-medium text-coral">{error}</p> : null}
    </div>
  );
}
