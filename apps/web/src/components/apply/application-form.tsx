"use client";

/*
 * Before & After School Application: the paper form, online. One application per child.
 * Submitting is free (docs/PLAN.md §6). The office calls to confirm a route, then emails a link
 * to pay the $25 fee by Zelle or Cash App. No card details are ever collected here.
 * FRONT-END ONLY for now: nothing is stored on a server yet. A draft is kept in this browser so
 * parents don't lose progress.
 */

import { LinkButton } from "@/components/site/link-button";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, CalendarDays, Mail, MapPin, Pencil, Phone, Send, User } from "lucide-react";
import { Button } from "@rhk/ui/components/button";
import { Checkbox, Field, TextArea, ToggleChip } from "@rhk/ui/components/field";
import { InlineLoader } from "@rhk/ui/loaders";
import { cn } from "@rhk/ui/lib/cn";
import { applicationFee, contact } from "@/content/site";
import { SignaturePad } from "./signature-pad";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
type Day = (typeof DAYS)[number];
type Slot = "before" | "after";

type Person = { name: string; phone: string; email: string; address: string };
type Data = {
  service: Record<Slot, Day[]>;
  parent: Person;
  child: { name: string; age: string; grade: string; school: string; schoolAddress: string; teacher: string; startDate: string };
  emergency: Person & { medical: string };
  signature: { image: string; typedName: string; confirm: boolean };
};

const empty: Data = {
  service: { before: [], after: [] },
  parent: { name: "", phone: "", email: "", address: "" },
  child: { name: "", age: "", grade: "", school: "", schoolAddress: "", teacher: "", startDate: "" },
  emergency: { name: "", phone: "", email: "", address: "", medical: "" },
  signature: { image: "", typedName: "", confirm: false },
};

const STEPS = [
  { key: "service", label: "Service" },
  { key: "parent", label: "You" },
  { key: "child", label: "Child" },
  { key: "emergency", label: "Emergency" },
  { key: "sign", label: "Sign" },
] as const;

const DRAFT_KEY = "rhk-application-draft-v1";

type Errors = Record<string, string>;

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const phoneOk = (v: string) => v.replace(/\D/g, "").length >= 10;

function validate(step: number, d: Data): Errors {
  const e: Errors = {};
  const req = (k: string, v: string, msg: string) => {
    if (!v.trim()) e[k] = msg;
  };
  if (step === 0) {
    if (!d.service.before.length && !d.service.after.length) e.service = "Choose at least one day before or after school.";
  }
  if (step === 1) {
    req("parent.name", d.parent.name, "Please enter your full name.");
    if (!phoneOk(d.parent.phone)) e["parent.phone"] = "Please enter a phone number we can reach you on.";
    if (!emailOk(d.parent.email)) e["parent.email"] = "Please enter a valid email address.";
    req("parent.address", d.parent.address, "Please enter your home address.");
  }
  if (step === 2) {
    req("child.name", d.child.name, "Please enter your child's full name.");
    req("child.age", d.child.age, "Age?");
    req("child.grade", d.child.grade, "Grade?");
    req("child.school", d.child.school, "Please enter the school's name.");
    req("child.schoolAddress", d.child.schoolAddress, "Please enter the school's address.");
    req("child.teacher", d.child.teacher, "Please enter the teacher's name.");
    req("child.startDate", d.child.startDate, "When should rides start?");
  }
  if (step === 3) {
    req("emergency.name", d.emergency.name, "Please enter an emergency contact.");
    if (!phoneOk(d.emergency.phone)) e["emergency.phone"] = "Please enter their phone number.";
    if (d.emergency.email && !emailOk(d.emergency.email)) e["emergency.email"] = "That email doesn't look right.";
    req("emergency.address", d.emergency.address, "Please enter their address.");
  }
  if (step === 4) {
    if (!d.signature.image) e["signature.image"] = "Please sign in the box.";
    req("signature.typedName", d.signature.typedName, "Please type your full name.");
    if (!d.signature.confirm) e["signature.confirm"] = "Please confirm the information is correct.";
  }
  return e;
}

function loadDraft(): { data: Data; step: number; maxReached: number } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { data: Data; step: number; maxReached: number };
    return { ...saved, data: { ...empty, ...saved.data } };
  } catch {
    return null;
  }
}

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  const x = d.length === 11 && d.startsWith("1") ? d.slice(1) : d.slice(0, 10);
  if (x.length < 4) return x;
  if (x.length < 7) return `(${x.slice(0, 3)}) ${x.slice(3)}`;
  return `(${x.slice(0, 3)}) ${x.slice(3, 6)}-${x.slice(6)}`;
}

/* ---------------------------------------------------------------------------------------------- */

function Stepper({ step, onJump, maxReached }: { step: number; onJump: (i: number) => void; maxReached: number }) {
  return (
    <ol className="flex items-center" aria-label="Application progress">
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        const reachable = i <= maxReached;
        return (
          <li key={s.key} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
            <button
              type="button"
              disabled={!reachable || i === step}
              onClick={() => onJump(i)}
              aria-current={active ? "step" : undefined}
              className="group flex flex-col items-center gap-1.5 disabled:cursor-default"
            >
              <motion.span
                className={cn(
                  "grid size-9 place-items-center rounded-full border font-display text-[14px] font-semibold",
                  active ? "border-bus-500 bg-bus-400" : done ? "border-ink bg-ink text-cream" : "border-ink/20 bg-card text-ink-muted",
                )}
                animate={{ scale: active ? 1.08 : 1 }}
              >
                {done ? (
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </motion.span>
              <span className={cn("hidden text-[13px] font-semibold sm:block", active ? "text-ink" : "text-ink-muted")}>{s.label}</span>
            </button>
            {i < STEPS.length - 1 ? (
              <span className="relative mx-1.5 h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10 sm:mx-2 sm:-mt-6">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-ink"
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ type: "spring", stiffness: 140, damping: 22 }}
                />
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function StepTitle({ n, title, body }: { n: number; title: string; body?: ReactNode }) {
  return (
    <div className="mb-7">
      <p className="font-display text-[13px] font-semibold text-ink-muted">
        Step {n} of {STEPS.length}
      </p>
      <h2 className="mt-1.5 font-display text-[28px] font-semibold leading-tight tracking-[-0.025em] md:text-[32px]">{title}</h2>
      {body ? <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{body}</p> : null}
    </div>
  );
}

function ReviewBlock({ title, onEdit, rows }: { title: string; onEdit: () => void; rows: [string, string][] }) {
  return (
    <div className="rounded-2xl border border-line bg-cream p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-[16px] font-semibold">{title}</h3>
        <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[13px] font-semibold text-ink-soft hover:bg-ink/5 hover:text-ink">
          <Pencil className="size-3.5" /> Edit
        </button>
      </div>
      <dl className="grid gap-x-6 gap-y-2 text-[15px] sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-[13px] font-semibold text-ink-muted">{k}</dt>
            <dd className={cn("break-words font-medium", !v && "text-ink-muted")}>{v || "Not given"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function daysLabel(days: Day[]) {
  if (!days.length) return "None";
  if (days.length === 5) return "Every weekday";
  return DAYS.filter((d) => days.includes(d)).map((d) => d.slice(0, 3)).join(", ");
}

/* ---------------------------------------------------------------------------------------------- */

export function ApplicationForm() {
  const reduce = useReducedMotion();
  // This component only renders in the browser (see ClientOnly on the page), so the saved
  // draft can be read straight into the first render.
  const [draft] = useState(loadDraft);
  const [data, setData] = useState<Data>(draft?.data ?? empty);
  const [step, setStep] = useState(draft ? Math.min(draft.step, 4) : 0);
  const [maxReached, setMaxReached] = useState(draft ? Math.min(draft.maxReached, 4) : 0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<null | { childName: string; ref: string }>(null);
  const [restored, setRestored] = useState(Boolean(draft));
  const topRef = useRef<HTMLDivElement>(null);

  // persist the draft in this browser
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step, maxReached }));
      } catch {
        /* storage may be unavailable */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [data, step, maxReached, done]);

  const set = useCallback(<K extends keyof Data>(k: K, patch: Partial<Data[K]>) => {
    setData((d) => ({ ...d, [k]: { ...(d[k] as object), ...patch } }));
    setErrors((e) => {
      const keys = Object.keys(patch).map((f) => `${String(k)}.${f}`);
      if (!keys.some((x) => e[x]) && !(k === "service" && e.service)) return e;
      const next = { ...e };
      keys.forEach((x) => delete next[x]);
      if (k === "service") delete next.service;
      return next;
    });
  }, []);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setErrors({});
    setStep(to);
    setMaxReached((m) => Math.max(m, to));
    scrollTop();
  };

  const next = () => {
    const e = validate(step, data);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = document.querySelector<HTMLElement>("[aria-invalid='true'], [data-error='true']");
      first?.focus?.();
      return;
    }
    go(step + 1);
  };

  const submit = async () => {
    const e = validate(step, data);
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true'], [data-error='true']")?.focus?.();
      return;
    }
    setSending(true);
    // TODO: send the application to the office (Supabase) once the backend exists.
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    const ref = `RHK-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    setDone({ childName: data.child.name.split(" ")[0] || "your child", ref });
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    scrollTop();
  };

  const anotherChild = () => {
    setData((d) => ({ ...empty, parent: d.parent, emergency: { ...d.emergency, medical: "" }, service: d.service }));
    setDone(null);
    setStep(2);
    setMaxReached(2);
    scrollTop();
  };

  const toggleDay = (slot: Slot, day: Day, on: boolean) => {
    if (on && errors.service) setErrors((e) => ({ ...e, service: "" }));
    setDayList(slot, day, on);
  };
  const setDayList = (slot: Slot, day: Day, on: boolean) =>
    set("service", { [slot]: on ? [...data.service[slot], day] : data.service[slot].filter((d) => d !== day) } as Partial<Data["service"]>);

  const ridesPerWeek = data.service.before.length + data.service.after.length;

  const variants = useMemo(
    () => ({
      enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 40 }),
      center: { opacity: 1, x: 0 },
      exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -40 }),
    }),
    [reduce],
  );

  /* ---------------- success ---------------- */
  if (done) {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-3xl border border-line bg-card p-7 text-center shadow-float md:p-12"
        >
          <Confetti />
          <div className="relative mx-auto grid size-20 place-items-center rounded-full border border-line bg-mint shadow-card">
            <svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <motion.path d="M20 6L9 17l-5-5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.5 }} />
            </svg>
          </div>
          <h2 className="relative mt-6 font-display text-[32px] font-semibold tracking-[-0.025em] md:text-[40px]">Application received</h2>
          <p className="relative mx-auto mt-3 max-w-md text-[17px] leading-relaxed text-ink-soft">
            Thank you. We&rsquo;ve got {done.childName}&rsquo;s application, and it&rsquo;s free to apply. Your reference is{" "}
            <span className="rounded-md bg-bus-100 px-1.5 py-0.5 font-mono text-[15px] font-semibold text-ink">{done.ref}</span>.
          </p>
          <ol className="relative mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            {[
              ["We call you", "The office checks your address and finds a seat on a van, then calls to confirm the route."],
              [`Pay the $${applicationFee} fee`, "We email you a link. Pay by Zelle or Cash App to hold the seat. It's non-refundable once paid."],
              ["Set up the parent app", "Once you're approved, you get an email to set your password, add photos and approved adults."],
            ].map(([t, b], i) => (
              <li key={t} className="rounded-2xl border border-line bg-cream p-4">
                <span className="grid size-7 place-items-center rounded-full bg-bus-400 font-display text-[13px] font-semibold">{i + 1}</span>
                <p className="mt-3 font-display text-[16px] font-semibold">{t}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{b}</p>
              </li>
            ))}
          </ol>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={anotherChild} arrow>
              Apply for another child
            </Button>
            <LinkButton href="/" variant="outline" size="lg">
              Back to home
            </LinkButton>
          </div>
          <p className="relative mt-6 text-[14px] text-ink-muted">
            Questions? Call <a className="font-semibold text-ink underline" href={contact.phoneHref}>{contact.phone}</a>
          </p>
        </motion.div>
      </div>
    );
  }

  /* ---------------- steps ---------------- */
  const err = (k: string) => errors[k];

  return (
    <div ref={topRef} className="scroll-mt-28">
      <div className="rounded-3xl border border-line bg-card shadow-float">
        <div className="border-b border-line px-5 pb-5 pt-6 md:px-10 md:pt-8">
          <Stepper step={step} onJump={go} maxReached={maxReached} />
          {restored ? (
            <p className="mt-4 rounded-xl bg-bus-50 px-3 py-2 text-[14px] text-ink-soft">
              We saved your progress on this device.{" "}
              <button
                type="button"
                className="font-semibold text-ink underline"
                onClick={() => {
                  setData(empty);
                  setStep(0);
                  setMaxReached(0);
                  setRestored(false);
                  localStorage.removeItem(DRAFT_KEY);
                }}
              >
                Start over
              </button>
            </p>
          ) : null}
        </div>

        <div className="relative overflow-hidden px-5 py-8 md:px-10 md:py-10">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              {step === 0 ? (
                <section>
                  <StepTitle n={1} title="Which rides do you need?" body="Tap the days for before school, after school, or both. This is your schedule for the school year. Changes later go to the office to approve." />
                  <div data-error={errors.service ? "true" : undefined} tabIndex={-1} className="flex flex-col gap-6 outline-none">
                    {(["before", "after"] as Slot[]).map((slot) => (
                      <fieldset key={slot}>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <legend className="font-display text-[17px] font-semibold">{slot === "before" ? "Before school" : "After school"}</legend>
                          <button
                            type="button"
                            className="text-[14px] font-semibold text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                            onClick={() => set("service", { [slot]: data.service[slot].length === 5 ? [] : [...DAYS] } as Partial<Data["service"]>)}
                          >
                            {data.service[slot].length === 5 ? "Clear" : "Every weekday"}
                          </button>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {DAYS.map((d) => (
                            <ToggleChip
                              key={d}
                              pressed={data.service[slot].includes(d)}
                              onChange={(on) => toggleDay(slot, d, on)}
                              aria-label={`${slot === "before" ? "Before" : "After"} school on ${d}`}
                              className="w-full px-0 sm:px-4"
                            >
                              <span className="sm:hidden">{d.slice(0, 2)}</span>
                              <span className="hidden sm:inline">{d.slice(0, 3)}</span>
                            </ToggleChip>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                    <AnimatePresence>
                      {errors.service ? (
                        <motion.p role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[14px] font-medium text-coral">
                          {errors.service}
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                    <div className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3 text-[15px]">
                      <CalendarDays className="size-5 text-ink-muted" />
                      <span>
                        <strong className="font-display">{ridesPerWeek}</strong> {ridesPerWeek === 1 ? "ride" : "rides"} a week · we&rsquo;ll call you with a quote
                      </span>
                    </div>
                  </div>
                </section>
              ) : null}

              {step === 1 ? (
                <section>
                  <StepTitle n={2} title="Your details" body="The parent or guardian we should contact about rides and payments." />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field className="sm:col-span-2" label="Full name" autoComplete="name" required icon={<User className="size-4" />} value={data.parent.name} onChange={(e) => set("parent", { name: e.target.value })} error={err("parent.name")} />
                    <Field label="Phone" type="tel" inputMode="tel" autoComplete="tel" required icon={<Phone className="size-4" />} value={data.parent.phone} onChange={(e) => set("parent", { phone: formatPhone(e.target.value) })} error={err("parent.phone")} />
                    <Field label="Email" type="email" autoComplete="email" required icon={<Mail className="size-4" />} value={data.parent.email} onChange={(e) => set("parent", { email: e.target.value })} error={err("parent.email")} />
                    <Field className="sm:col-span-2" label="Home address" autoComplete="street-address" required icon={<MapPin className="size-4" />} value={data.parent.address} onChange={(e) => set("parent", { address: e.target.value })} error={err("parent.address")} hint="Street, city and ZIP" />
                  </div>
                </section>
              ) : null}

              {step === 2 ? (
                <section>
                  <StepTitle n={3} title="About your child" body="One application per child. You can add a brother or sister after you finish." />
                  <div className="grid gap-4 sm:grid-cols-6">
                    <Field className="sm:col-span-4" label="Child's full name" required value={data.child.name} onChange={(e) => set("child", { name: e.target.value })} error={err("child.name")} />
                    <Field className="sm:col-span-1" label="Age" inputMode="numeric" required value={data.child.age} onChange={(e) => set("child", { age: e.target.value.replace(/\D/g, "").slice(0, 2) })} error={err("child.age")} />
                    <Field className="sm:col-span-1" label="Grade" required value={data.child.grade} onChange={(e) => set("child", { grade: e.target.value.slice(0, 12) })} error={err("child.grade")} />
                    <Field className="sm:col-span-3" label="School name" required value={data.child.school} onChange={(e) => set("child", { school: e.target.value })} error={err("child.school")} />
                    <Field className="sm:col-span-3" label="Teacher's name" required value={data.child.teacher} onChange={(e) => set("child", { teacher: e.target.value })} error={err("child.teacher")} />
                    <Field className="sm:col-span-4" label="School address" required icon={<MapPin className="size-4" />} value={data.child.schoolAddress} onChange={(e) => set("child", { schoolAddress: e.target.value })} error={err("child.schoolAddress")} />
                    <Field className="sm:col-span-2" label="Start date" type="date" required value={data.child.startDate} onChange={(e) => set("child", { startDate: e.target.value })} error={err("child.startDate")} />
                  </div>
                </section>
              ) : null}

              {step === 3 ? (
                <section>
                  <StepTitle n={4} title="Emergency contact" body="Someone other than you we can call if we can't reach you." />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field className="sm:col-span-2" label="Full name" required icon={<User className="size-4" />} value={data.emergency.name} onChange={(e) => set("emergency", { name: e.target.value })} error={err("emergency.name")} />
                    <Field label="Phone" type="tel" inputMode="tel" required icon={<Phone className="size-4" />} value={data.emergency.phone} onChange={(e) => set("emergency", { phone: formatPhone(e.target.value) })} error={err("emergency.phone")} />
                    <Field label="Email (optional)" type="email" icon={<Mail className="size-4" />} value={data.emergency.email} onChange={(e) => set("emergency", { email: e.target.value })} error={err("emergency.email")} />
                    <Field className="sm:col-span-2" label="Address" required icon={<MapPin className="size-4" />} value={data.emergency.address} onChange={(e) => set("emergency", { address: e.target.value })} error={err("emergency.address")} />
                    <TextArea className="sm:col-span-2" label="Medical concerns (optional)" value={data.emergency.medical} onChange={(e) => set("emergency", { medical: e.target.value })} hint="Allergies, conditions or anything your driver should know. Your driver sees these notes." />
                  </div>
                </section>
              ) : null}

              {step === 4 ? (
                <section>
                  <StepTitle n={5} title="Check and sign" body={`Make sure everything looks right, then sign below. Applying is free. The $${applicationFee} fee comes later, once we've confirmed a route.`} />
                  <div className="flex flex-col gap-3">
                    <ReviewBlock title="Rides" onEdit={() => go(0)} rows={[["Before school", daysLabel(data.service.before)], ["After school", daysLabel(data.service.after)]]} />
                    <ReviewBlock title="You" onEdit={() => go(1)} rows={[["Name", data.parent.name], ["Phone", data.parent.phone], ["Email", data.parent.email], ["Address", data.parent.address]]} />
                    <ReviewBlock
                      title="Child"
                      onEdit={() => go(2)}
                      rows={[
                        ["Name", data.child.name],
                        ["Age · Grade", data.child.age || data.child.grade ? `${data.child.age || "Age not given"} · ${data.child.grade || "grade not given"}` : ""],
                        ["School", data.child.school],
                        ["School address", data.child.schoolAddress],
                        ["Teacher", data.child.teacher],
                        ["Start date", data.child.startDate ? new Date(`${data.child.startDate}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""],
                      ]}
                    />
                    <ReviewBlock
                      title="Emergency contact"
                      onEdit={() => go(3)}
                      rows={[["Name", data.emergency.name], ["Phone", data.emergency.phone], ["Email", data.emergency.email], ["Address", data.emergency.address], ["Medical concerns", data.emergency.medical || "None given"]]}
                    />
                  </div>
                  <div className="mt-8 grid gap-4">
                    <SignaturePad value={data.signature.image} onChange={(image) => set("signature", { image })} error={err("signature.image")} />
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                      <Field label="Type your full name" required value={data.signature.typedName} onChange={(e) => set("signature", { typedName: e.target.value })} error={err("signature.typedName")} />
                      <div className="flex h-14 items-center rounded-xl border border-line bg-cream px-4 text-[15px] text-ink-soft">
                        Date:&nbsp;<strong className="text-ink"><TodayDate /></strong>
                      </div>
                    </div>
                    <div data-error={errors["signature.confirm"] ? "true" : undefined}>
                      <Checkbox
                        checked={data.signature.confirm}
                        onChange={(confirm) => set("signature", { confirm })}
                        error={Boolean(errors["signature.confirm"])}
                        label="I confirm the information on this application is correct"
                      />
                      {errors["signature.confirm"] ? <p role="alert" className="pl-9 pt-1 text-[13px] font-medium text-coral">{errors["signature.confirm"]}</p> : null}
                    </div>
                  </div>
                </section>
              ) : null}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* actions */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 rounded-b-3xl border-t border-line bg-card/95 px-5 py-4 backdrop-blur md:static md:px-10 md:py-6">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => go(step - 1)} icon={<ArrowLeft className="size-[18px]" />}>
              Back
            </Button>
          ) : (
            <span className="text-[13px] text-ink-muted">1 application per child</span>
          )}
          {step < 4 ? (
            <Button onClick={next} arrow>
              Continue
            </Button>
          ) : (
            <Button onClick={submit} disabled={sending} variant="ink" icon={sending ? <InlineLoader variant="orbit" color="var(--color-bus-400)" label="Sending application" /> : <Send className="size-4" />}>
              {sending ? "Sending…" : "Submit application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function TodayDate() {
  return <>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</>;
}

function Confetti() {
  const reduce = useReducedMotion();
  const bits = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        x: (i * 37) % 100,
        delay: (i % 7) * 0.08,
        color: ["#ffc629", "#ff6a4d", "#4fb3f6", "#3fc48a", "#9b7bff"][i % 5],
        rot: (i * 53) % 360,
        round: i % 3 === 0,
      })),
    [],
  );
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className={cn("absolute top-0 size-2.5", b.round ? "rounded-full" : "rounded-[2px]")}
          style={{ left: `${b.x}%`, background: b.color }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: 420, opacity: [0, 1, 1, 0], rotate: b.rot + 360 }}
          transition={{ duration: 2.2, delay: b.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
