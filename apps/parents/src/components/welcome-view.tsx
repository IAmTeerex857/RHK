"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, BellRing, Camera, Check, Download, MapPin, Share, SquarePlus, UserCheck } from "lucide-react";
import { Avatar } from "@rhk/ui/components/avatar";
import { Button } from "@rhk/ui/components/button";
import { SegmentBar } from "@rhk/ui/components/charts";
import { AuthFrame } from "@rhk/ui/shell/auth";
import { cn } from "@rhk/ui/lib/cn";
import { family, kids, parent } from "./family";

const steps = ["Photos", "Approved adults", "Address", "Home screen", "Alerts"] as const;

export function WelcomeView() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [addressOk, setAddressOk] = useState(false);
  const [alerts, setAlerts] = useState<"idle" | "on" | "blocked">("idle");
  const done = step >= steps.length;

  const ask = async () => {
    try {
      const r = typeof Notification !== "undefined" ? await Notification.requestPermission() : "denied";
      setAlerts(r === "granted" ? "on" : "blocked");
    } catch {
      setAlerts("blocked");
    }
  };

  return (
    <AuthFrame app="Parents" width={460}>
      {!done ? (
        <div className="mb-6 flex items-center gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} aria-label="Back" className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-card hover:bg-raised">
              <ArrowLeft className="size-4" />
            </button>
          ) : null}
          <div className="flex-1">
            <p className="mono-label text-ink-muted">
              Setup · {step + 1} of {steps.length} · {steps[step]}
            </p>
            <SegmentBar className="mt-2" value={step + 1} total={steps.length} tone="ink" size="sm" label="Setup progress" />
          </div>
        </div>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 ? (
            <>
              <H title={`Welcome, ${parent.name.split(" ")[0]}`} sub="Add a clear photo of each child. Drivers use it to check the right child gets on the van." />
              <div className="grid grid-cols-2 gap-3">
                {kids.map((k) => (
                  <label key={k.id} className="group flex cursor-pointer flex-col items-center gap-3 rounded-[22px] border border-line bg-card p-5 transition-colors hover:border-line-strong">
                    <span className="relative">
                      <Avatar seed={k.id} name={k.first} photo={photos[k.id]} size={84} />
                      <span className={cn("absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-card", photos[k.id] ? "bg-good text-white" : "bg-ink text-cream")}>
                        {photos[k.id] ? <Check className="size-4 stroke-[3]" /> : <Camera className="size-3.5" />}
                      </span>
                    </span>
                    <span className="text-[15px] font-medium">{k.first}</span>
                    <span className="text-[12.5px] text-ink-muted">{photos[k.id] ? "Change photo" : "Add photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setPhotos((p) => ({ ...p, [k.id]: URL.createObjectURL(f) }));
                      }}
                    />
                  </label>
                ))}
              </div>
              <Next onClick={() => setStep(1)} label={Object.keys(photos).length === kids.length ? "Continue" : "Skip for now"} ink={Object.keys(photos).length === kids.length} />
            </>
          ) : step === 1 ? (
            <>
              <H title="Who else can receive them?" sub="Only you and these people can take a child off the van at home. You can change this any time." />
              <div className="flex flex-col gap-3">
                {kids.map((k) => (
                  <div key={k.id} className="rounded-[20px] border border-line bg-card p-4">
                    <p className="flex items-center gap-2.5 text-[14.5px] font-medium">
                      <Avatar seed={k.id} name={k.first} photo={photos[k.id]} size={28} /> {k.first}
                    </p>
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {k.approvedAdults.map((a) => (
                        <li key={a.id} className="flex items-center gap-2.5 text-[14px]">
                          <UserCheck className="size-4 text-good" />
                          <span className="font-medium">{a.name}</span>
                          <span className="text-ink-muted">· {a.relationship}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[13px] text-ink-muted">These came from the office. Add or remove people from each child&apos;s page.</p>
              <Next onClick={() => setStep(2)} label="Looks right" ink />
            </>
          ) : step === 2 ? (
            <>
              <H title="Is this where we drop off?" sub="The van picks up and drops off here unless you ask for a change." />
              <button
                type="button"
                aria-pressed={addressOk}
                onClick={() => setAddressOk((v) => !v)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-[20px] border bg-card p-4 text-left transition-colors",
                  addressOk ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-line-strong",
                )}
              >
                <MapPin className="mt-0.5 size-5 shrink-0" />
                <span className="flex-1">
                  <span className="block text-[15.5px] font-medium">{family.address}</span>
                  <span className="block text-[13.5px] text-ink-muted">
                    {family.city}, GA · {family.area}
                  </span>
                </span>
                <span className={cn("grid size-6 place-items-center rounded-full border", addressOk ? "border-ink bg-ink text-cream" : "border-line-strong")}>
                  {addressOk ? <Check className="size-3.5 stroke-[3]" /> : null}
                </span>
              </button>
              <p className="mt-3 text-[13px] text-ink-muted">Wrong address? Message the office after setup. Routes are planned around it.</p>
              <Next onClick={() => setStep(3)} label="Confirm address" ink disabled={!addressOk} />
            </>
          ) : step === 3 ? (
            <>
              <H title="Put the app on your home screen" sub="On iPhone, ride alerts only arrive when the app is on the home screen. It takes 20 seconds." />
              <ol className="flex flex-col gap-2">
                {[
                  { icon: Share, text: "Tap the Share button in Safari" },
                  { icon: SquarePlus, text: "Choose “Add to Home Screen”" },
                  { icon: Download, text: "Open Rush Hour Kids from the new icon" },
                ].map((s, i) => (
                  <li key={s.text} className="flex items-center gap-3.5 rounded-2xl border border-line bg-card p-3.5">
                    <span className="font-mono text-[12px] text-ink-muted">{i + 1}</span>
                    <span className="grid size-9 place-items-center rounded-xl bg-raised">
                      <s.icon className="size-4" />
                    </span>
                    <span className="text-[14.5px]">{s.text}</span>
                  </li>
                ))}
              </ol>
              <Next onClick={() => setStep(4)} label="I've done it" ink />
            </>
          ) : step === 4 ? (
            <>
              <H title="Turn on ride alerts" sub="We'll tell you when the van is 10 minutes away, a few minutes away, and when your children are picked up and dropped off." />
              <div className="rounded-[22px] border border-line bg-card p-4 shadow-subtle">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bus-400 text-[#1d1a2f]">
                    <BellRing className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex justify-between text-[14px] font-semibold">
                      Rush Hour Kids <span className="font-normal text-ink-muted">now</span>
                    </p>
                    <p className="text-[14px] text-ink-soft">Van 2 is about 5 minutes away. Maya and Eli are on board.</p>
                  </div>
                </div>
              </div>
              {alerts === "blocked" ? <p className="mt-3 text-[13px] text-bad">Alerts are blocked. Turn them on in Settings → Notifications → Rush Hour Kids.</p> : null}
              {alerts === "on" ? <p className="mt-3 text-[13px] text-good">Alerts are on.</p> : null}
              <Button variant="ink" size="lg" className="mt-6 w-full" icon={<BellRing className="size-4" />} onClick={alerts === "on" ? () => setStep(5) : ask}>
                {alerts === "on" ? "Continue" : "Allow alerts"}
              </Button>
              {alerts !== "on" ? (
                <button type="button" onClick={() => setStep(5)} className="mt-3 w-full text-center text-[13.5px] text-ink-muted hover:text-ink">
                  Not now
                </button>
              ) : null}
            </>
          ) : (
            <div className="text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-good text-white">
                <Check className="size-7 stroke-[2.5]" />
              </span>
              <h1 className="mt-5 font-display text-[30px] font-medium tracking-[-0.04em]">You&apos;re all set</h1>
              <p className="mt-2 text-[15px] text-ink-muted">You&apos;ll see the van live on school days, your bills on Fridays, and messages from the office.</p>
              <Button variant="primary" size="lg" className="mt-6 w-full" href="/" linkAs={Link} arrow>
                Go to the app
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </AuthFrame>
  );
}

function H({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-[28px] font-medium leading-[1.1] tracking-[-0.035em]">{title}</h1>
      <p className="mt-2 text-[14.5px] text-ink-muted">{sub}</p>
    </div>
  );
}

function Next({ onClick, label, ink, disabled }: { onClick: () => void; label: string; ink?: boolean; disabled?: boolean }) {
  return (
    <Button variant={ink ? "ink" : "outline"} size="lg" className="mt-6 w-full" disabled={disabled} onClick={onClick} arrow>
      {label}
    </Button>
  );
}
