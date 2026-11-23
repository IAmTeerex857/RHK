"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Bus, Camera, Car, Check, HeartPulse, MessageCircleWarning, Phone, ShieldAlert, Siren, UserRoundX, X } from "lucide-react";
import { getChild } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Button } from "@rhk/ui/components/button";
import { SegmentBar } from "@rhk/ui/components/charts";
import { ChoiceChips } from "@rhk/ui/components/controls";
import { TextArea } from "@rhk/ui/components/field";
import { cn } from "@rhk/ui/lib/cn";
import { route, useMockTime, useRun } from "./run-store";

const kinds = [
  { id: "medical", label: "Child hurt or unwell", icon: HeartPulse },
  { id: "behavior", label: "Behaviour", icon: MessageCircleWarning },
  { id: "vehicle", label: "Van problem", icon: Bus },
  { id: "safety", label: "Crash or near miss", icon: Car },
  { id: "no_adult", label: "No approved adult", icon: UserRoundX },
  { id: "other", label: "Something else", icon: ShieldAlert },
] as const;

type Kind = (typeof kinds)[number]["id"];

export function ReportView() {
  const run = useRun();
  const time = useMockTime();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<Kind | null>(null);
  const [who, setWho] = useState<string[]>([]);
  const [safe, setSafe] = useState<"yes" | "no" | null>(null);
  const [severity, setSeverity] = useState<"low" | "medium" | "high" | null>(null);
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState(0);
  const riders = route.stops[0].childIds.map(getChild);
  const k = kinds.find((x) => x.id === kind);

  const next = () => setStep((s) => s + 1);

  if (step === 4) {
    return (
      <div className="mx-auto max-w-md pt-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-good text-white">
          <Check className="size-7 stroke-[2.5]" />
        </span>
        <h1 className="mt-5 font-display text-[28px] font-medium tracking-[-0.04em]">Sent to the office</h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          INC-105 · {time}. Clara and Jordan have it now and will call you if they need more. You can keep driving when it&apos;s safe.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" size="md" href="/messages" linkAs={Link}>
            Message the office
          </Button>
          <Button variant="ink" size="md" href={run.phase === "live" ? "/route" : "/"} linkAs={Link}>
            {run.phase === "live" ? "Back to the route" : "Done"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <a
        href="tel:911"
        className="mt-4 flex items-center gap-3 rounded-2xl bg-coral px-4 py-3.5 text-white transition-transform active:scale-[0.99] lg:mt-6"
      >
        <Siren className="size-5 shrink-0" />
        <span className="flex-1 text-[15px] font-medium">Anyone hurt or in danger? Call 911 first.</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-[14px] font-medium">
          <Phone className="size-3.5" /> 911
        </span>
      </a>

      <div className="flex items-center gap-3 pb-5 pt-6">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} aria-label="Back" className="grid size-9 place-items-center rounded-full border border-line bg-card hover:bg-raised">
            <ArrowLeft className="size-4" />
          </button>
        ) : (
          <Link href={run.phase === "live" ? "/route" : "/"} aria-label="Cancel" className="grid size-9 place-items-center rounded-full border border-line bg-card hover:bg-raised">
            <X className="size-4" />
          </Link>
        )}
        <div className="flex-1">
          <p className="mono-label text-ink-muted">Report an incident · {step + 1} of 4</p>
          <SegmentBar className="mt-2" value={step + 1} total={4} tone="ink" size="sm" label="Progress" />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -16 }}
          transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
        >
          {step === 0 ? (
            <>
              <Title>What happened?</Title>
              <div className="grid grid-cols-2 gap-2.5">
                {kinds.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => {
                      setKind(x.id);
                      next();
                    }}
                    className={cn(
                      "flex min-h-[112px] flex-col justify-between rounded-[20px] border bg-card p-4 text-left transition-colors active:scale-[0.99]",
                      kind === x.id ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-line-strong",
                    )}
                  >
                    <x.icon className={cn("size-6", x.id === "medical" || x.id === "safety" ? "text-bad" : "text-ink")} />
                    <span className="text-[16px] font-medium leading-tight">{x.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : step === 1 ? (
            <>
              <Title sub="Tap everyone involved.">Which children, and are they safe?</Title>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {riders.map((c) => {
                  const on = who.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setWho((w) => (on ? w.filter((x) => x !== c.id) : [...w.filter((x) => x !== "none"), c.id]))}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-colors",
                        on ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-line-strong",
                      )}
                    >
                      <Avatar seed={c.id} name={c.first} size={40} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium">
                          {c.first} {c.last}
                        </span>
                        <span className="block text-[13px] text-ink-muted">{run.kids[c.id]?.state === "on" || run.kids[c.id]?.state === "held" ? "On board" : "Not on board"}</span>
                      </span>
                      <span className={cn("grid size-5 place-items-center rounded-md border", on ? "border-ink bg-ink text-cream" : "border-line-strong")}>
                        {on ? <Check className="size-3 stroke-[3]" /> : null}
                      </span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-pressed={who.includes("none")}
                  onClick={() => setWho(["none"])}
                  className={cn(
                    "flex h-[66px] items-center justify-center rounded-2xl border border-dashed text-[15px] font-medium transition-colors",
                    who.includes("none") ? "border-ink bg-card" : "border-line-strong text-ink-muted hover:text-ink",
                  )}
                >
                  No child involved
                </button>
              </div>
              <p className="mb-2.5 mt-6 text-[15px] font-medium">Is every child safe right now?</p>
              <ChoiceChips
                aria-label="Children safe"
                size="lg"
                value={safe}
                onChange={setSafe}
                options={[
                  { value: "yes", label: "Yes, everyone's safe" },
                  { value: "no", label: "No" },
                ]}
              />
              {safe === "no" ? (
                <a href="tel:911" className="mt-3 flex items-center gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--color-bad)_30%,transparent)] bg-coral-soft p-4 text-[14px]">
                  <Siren className="size-5 shrink-0 text-bad" />
                  <span className="flex-1">
                    <span className="font-medium">Call 911 now.</span> Finish this report when everyone is safe.
                  </span>
                </a>
              ) : null}
              <Next disabled={!who.length || !safe} onClick={next} />
            </>
          ) : step === 2 ? (
            <>
              <Title sub="A few words is enough. The office will call you for the rest.">How serious, and what happened?</Title>
              <ChoiceChips
                aria-label="Severity"
                size="lg"
                value={severity}
                onChange={setSeverity}
                options={[
                  { value: "low", label: "Minor" },
                  { value: "medium", label: "Needs follow-up" },
                  { value: "high", label: "Serious" },
                ]}
              />
              <TextArea className="mt-5" label="What happened?" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
              <label className="mt-3 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-line-strong text-[15px] font-medium text-ink-soft transition-colors hover:bg-raised/60">
                <Camera className="size-4" />
                {photos ? `${photos} photo${photos > 1 ? "s" : ""} added` : "Add a photo"}
                <input type="file" accept="image/*" capture="environment" multiple className="sr-only" onChange={(e) => setPhotos((p) => p + (e.target.files?.length ?? 0))} />
              </label>
              <Next disabled={!severity || note.trim().length < 3} onClick={next} />
            </>
          ) : (
            <>
              <Title sub="Check it over, then send.">Send to the office</Title>
              <dl className="rounded-[20px] border border-line bg-card px-5">
                <Line label="What" value={k?.label} />
                <Line label="Who" value={who.includes("none") ? "No child involved" : who.map((id) => getChild(id).first).join(", ")} />
                <Line label="Children safe" value={safe === "yes" ? "Yes" : "No · 911 called"} />
                <Line label="How serious" value={{ low: "Minor", medium: "Needs follow-up", high: "Serious" }[severity ?? "low"]} />
                <Line label="Location" value={`Sent from your phone · ${run.stop ? `near ${run.stop.address}` : "after the last stop"}`} />
                <Line label="When" value={time} />
                <Line label="Note" value={note} />
                {photos ? <Line label="Photos" value={String(photos)} /> : null}
              </dl>
              <p className="mt-3 text-[13px] text-ink-muted">Parents aren&apos;t told automatically. The office decides who to call.</p>
              <Button variant="ink" size="lg" className="mt-5 w-full" icon={<ShieldAlert className="size-4" />} onClick={next}>
                Send report
              </Button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Title({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-display text-[28px] font-medium leading-[1.1] tracking-[-0.035em]">{children}</h1>
      {sub ? <p className="mt-1.5 text-[15px] text-ink-muted">{sub}</p> : null}
    </div>
  );
}

function Next({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <Button variant="ink" size="lg" className="mt-6 w-full" disabled={disabled} onClick={onClick}>
      Next
    </Button>
  );
}

function Line({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-4 border-b border-line py-3 text-[15px] last:border-0">
      <dt className="w-24 shrink-0 text-ink-muted">{label}</dt>
      <dd className="min-w-0 flex-1 text-ink">{value}</dd>
    </div>
  );
}
