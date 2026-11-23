"use client";

/*
 * Sign-in for every app: email + password, then the 6-digit code emailed at every sign-in
 * (docs/PLAN.md §2). Also the "set your password" screen the office's invite link opens.
 * UI only for now: the steps advance locally; Supabase + Resend wire in during Phase 0.
 */

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../components/button";
import { CodeInput } from "../components/controls";
import { Field } from "../components/field";
import { LogoMark } from "../components/logo-mark";
import { ThemeToggle } from "../components/theme-toggle";

/** Full-screen frame for sign-in and first-time setup: logo, theme toggle, dot grid. */
export function AuthFrame({ app, children, footer, width = 400 }: { app: string; children: ReactNode; footer?: ReactNode; width?: number }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas">
      <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-70" aria-hidden />
      <header className="relative flex h-16 items-center justify-between px-5 sm:px-8">
        <span className="flex items-center gap-2.5">
          <LogoMark className="size-8" />
          <span className="font-display text-[15px] font-medium tracking-[-0.02em]">
            Rush Hour Kids <span className="font-normal text-ink-muted">{app}</span>
          </span>
        </span>
        <ThemeToggle />
      </header>
      <main className="relative flex flex-1 items-start justify-center px-5 pb-16 pt-[8vh] sm:items-center sm:pt-0">
        <div className="w-full" style={{ maxWidth: width }}>
          {children}
        </div>
      </main>
      {footer ? <footer className="relative px-5 pb-6 text-center text-[13px] text-ink-muted">{footer}</footer> : null}
    </div>
  );
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
};

export function SignIn({ app, audience, home = "/" }: { app: string; audience: string; home?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"password" | "code">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const submitPassword = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Enter the email the office has on file.");
    if (password.length < 8) return setError("Passwords are at least 8 characters.");
    setError(undefined);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setStep("code");
      setWait(30);
    }, 450);
  };

  const submitCode = (value = code) => {
    if (value.length < 6) return;
    setBusy(true);
    setTimeout(() => router.push(home), 500);
  };

  return (
    <AuthFrame app={app} footer={<>Accounts are created by the Rush Hour Kids office. Trouble signing in? Call (770) 555-0142.</>}>
      <AnimatePresence mode="wait" initial={false}>
        {step === "password" ? (
          <motion.div key="pw" {...fade}>
            <h1 className="font-display text-[28px] font-medium tracking-[-0.035em]">Sign in</h1>
            <p className="mt-2 text-[15px] text-ink-muted">{audience}</p>
            <form onSubmit={submitPassword} className="mt-8 flex flex-col gap-3" noValidate>
              <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="size-[17px]" />} required />
              <div className="relative">
                <Field
                  label="Password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="size-[17px]" />}
                  error={error}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-[9px] grid size-9 place-items-center rounded-lg text-ink-muted hover:bg-raised hover:text-ink"
                >
                  {show ? <EyeOff className="size-[17px]" /> : <Eye className="size-[17px]" />}
                </button>
              </div>
              <Button type="submit" variant="ink" size="md" className="mt-2 w-full" disabled={busy} arrow={!busy}>
                {busy ? "Checking…" : "Continue"}
              </Button>
            </form>
            <div className="mt-5 flex items-center justify-between text-[14px]">
              <Link href="/set-password" className="text-ink-muted underline-offset-4 hover:text-ink hover:underline">
                Forgot password?
              </Link>
              <span className="flex items-center gap-1.5 text-ink-muted">
                <ShieldCheck className="size-4" /> Code check every sign-in
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div key="code" {...fade}>
            <button type="button" onClick={() => setStep("password")} className="mb-6 inline-flex items-center gap-1.5 text-[14px] text-ink-muted hover:text-ink">
              <ArrowLeft className="size-4" /> Back
            </button>
            <span className="grid size-12 place-items-center rounded-2xl border border-line bg-card shadow-subtle">
              <Mail className="size-5" />
            </span>
            <h1 className="mt-5 font-display text-[28px] font-medium tracking-[-0.035em]">Check your email</h1>
            <p className="mt-2 text-[15px] text-ink-muted">
              We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>. It expires in 10 minutes.
            </p>
            <div className="mt-8">
              <CodeInput
                value={code}
                autoFocus
                onChange={(v) => {
                  setCode(v);
                  if (v.length === 6) submitCode(v);
                }}
              />
            </div>
            <Button variant="ink" className="mt-5 w-full" disabled={code.length < 6 || busy} onClick={() => submitCode()}>
              {busy ? "Signing in…" : "Verify and sign in"}
            </Button>
            <p className="mt-5 text-center text-[14px] text-ink-muted">
              Didn&apos;t get it?{" "}
              {wait > 0 ? (
                <span className="tabular">Resend in {wait}s</span>
              ) : (
                <button type="button" onClick={() => setWait(30)} className="font-medium text-ink underline-offset-4 hover:underline">
                  Send a new code
                </button>
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthFrame>
  );
}

export function SetPassword({ app, name }: { app: string; name?: string }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState<string | undefined>();
  const checks = [
    { ok: pw.length >= 8, label: "8 or more characters" },
    { ok: /\d/.test(pw), label: "A number" },
    { ok: /[A-Za-z]/.test(pw) && pw !== pw.toLowerCase(), label: "An uppercase letter" },
  ];
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!checks.every((c) => c.ok)) return setError("Your password needs everything in the list.");
    if (pw !== again) return setError("The two passwords don't match.");
    router.push("/sign-in");
  };
  return (
    <AuthFrame app={app}>
      <h1 className="font-display text-[28px] font-medium tracking-[-0.035em]">{name ? `Welcome, ${name}` : "Set your password"}</h1>
      <p className="mt-2 text-[15px] text-ink-muted">Choose a password for your Rush Hour Kids account. You&apos;ll also get a code by email each time you sign in.</p>
      <form onSubmit={submit} className="mt-8 flex flex-col gap-3" noValidate>
        <Field label="New password" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <Field label="Type it again" type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} error={error} />
        <ul className="mt-1 grid gap-1.5 text-[13px]">
          {checks.map((c) => (
            <li key={c.label} className={c.ok ? "text-good" : "text-ink-muted"}>
              <span className="mr-2 inline-block w-3">{c.ok ? "✓" : "·"}</span>
              {c.label}
            </li>
          ))}
        </ul>
        <Button type="submit" variant="ink" className="mt-3 w-full" arrow>
          Save password
        </Button>
      </form>
    </AuthFrame>
  );
}
