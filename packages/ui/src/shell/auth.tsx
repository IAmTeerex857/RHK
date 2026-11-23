"use client";

/*
 * Sign-in for every app (docs/PLAN.md §2): email + password, then the 6-digit code emailed at
 * every sign-in. Also: the office-only "forgot password" page, the set-password page that the
 * office's invite and reset links open, and the change-password dialog for signed-in people.
 *
 * UI only for now. Every state the backend can produce can be reviewed with a query string:
 *   /sign-in?preview=wrong-password | wrong-code | expired-code | locked | wrong-app[&role=Driver]
 *   /sign-in?reason=signed-out | session-ended
 *   /set-password?type=reset   /set-password?preview=expired
 */

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, Lock, LogOut, Mail, Phone, ShieldAlert, ShieldCheck, TimerOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../components/button";
import { CodeInput } from "../components/controls";
import { Dialog } from "../components/dialog";
import { Field } from "../components/field";
import { LogoMark } from "../components/logo-mark";
import { toast } from "../components/toast";
import { APP_URLS, OFFICE_PHONE, type AppName } from "../lib/apps";
import { cn } from "../lib/cn";
import { useQuery } from "../lib/use-query";

/* ------------------------------------------------------------------ helpers */

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
};

const helpFooter = (
  <>
    Accounts are created by the Rush Hour Kids office. Need help? Call{" "}
    <a href={OFFICE_PHONE.href} className="font-medium text-ink-soft underline-offset-4 hover:underline">
      {OFFICE_PHONE.label}
    </a>
    .
  </>
);

/** Full-screen frame for sign-in and first-time setup: logo and dot grid. */
export function AuthFrame({ app, children, footer, width = 400 }: { app: string; children: ReactNode; footer?: ReactNode; width?: number }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas">
      <div className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-70" aria-hidden />
      <header className="relative flex h-16 items-center px-5 sm:px-8">
        <span className="flex items-center gap-2.5">
          <LogoMark className="size-8" />
          <span className="font-display text-[15px] font-medium tracking-[-0.02em]">
            Rush Hour Kids <span className="font-normal text-ink-muted">{app}</span>
          </span>
        </span>
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

/** Icon tile + title + body, the top of every auth state. */
function Head({ icon, title, children, tone = "default" }: { icon?: ReactNode; title: ReactNode; children?: ReactNode; tone?: "default" | "bad" }) {
  return (
    <>
      {icon ? (
        <span
          className={cn(
            "mb-5 grid size-12 place-items-center rounded-2xl border shadow-subtle [&_svg]:size-5",
            tone === "bad" ? "border-[color-mix(in_oklab,var(--color-bad)_18%,transparent)] bg-coral-soft text-bad" : "border-line bg-card text-ink",
          )}
        >
          {icon}
        </span>
      ) : null}
      <h1 className="font-display text-[28px] font-medium tracking-[-0.035em]">{title}</h1>
      {children ? <p className="mt-2 text-[15px] text-ink-muted">{children}</p> : null}
    </>
  );
}

/** Quiet note above a form ("You're signed out."). */
function Note({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <p className="mb-6 flex items-start gap-2.5 rounded-xl border border-line bg-card px-3.5 py-3 text-[14px] text-ink-soft shadow-subtle [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-muted">
      {icon}
      <span>{children}</span>
    </p>
  );
}

function PasswordField({ label, value, onChange, autoComplete, error }: { label: string; value: string; onChange: (v: string) => void; autoComplete: string; error?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Field
        label={label}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={<Lock className="size-[17px]" />}
        error={error}
        className="[&_input]:pr-12"
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
  );
}

/* ------------------------------------------------------------------ sign in */

type Step = "password" | "code" | "locked" | "wrong-app";

export function SignIn({
  app,
  audience,
  home = "/",
  session,
}: {
  app: AppName;
  audience: string;
  home?: string;
  /** How long a session lasts in this app ("12 hours", "30 days"), for the signed-out note. */
  session: string;
}) {
  const router = useRouter();
  const q = useQuery();
  const preview = q.get("preview");
  const reason = q.get("reason");
  const otherApp = ((q.get("role") as AppName | null) ?? (app === "Parents" ? "Office" : "Parents")) as AppName;

  const [stepState, setStep] = useState<Step | null>(null);
  const step: Step = stepState ?? (preview === "locked" ? "locked" : preview === "wrong-app" ? "wrong-app" : preview === "wrong-code" || preview === "expired-code" ? "code" : "password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [codeError, setCodeError] = useState<string | undefined>();
  const [tries, setTries] = useState(0);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const submitPassword = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Enter the email the office has on file.");
    if (!password) return setError("Enter your password.");
    setError(undefined);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (preview === "wrong-password" && tries === 0) {
        setTries(1);
        return setError("That email and password don't match. Check them and try again.");
      }
      if (preview === "wrong-app") return setStep("wrong-app");
      setStep("code");
      setWait(30);
    }, 450);
  };

  const submitCode = (value = code) => {
    if (value.length < 6) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if ((preview === "wrong-code" || preview === "expired-code") && tries === 0) {
        setTries(1);
        setCode("");
        return setCodeError(preview === "expired-code" ? "This code has expired. Send a new one below." : "That code isn't right. Check the latest email and try again.");
      }
      router.push(home);
    }, 500);
  };

  const shownEmail = email || "you@example.com";

  return (
    <AuthFrame app={app} footer={helpFooter}>
      <AnimatePresence mode="wait" initial={false}>
        {step === "password" ? (
          <motion.div key="pw" {...fade}>
            {reason === "signed-out" ? <Note icon={<LogOut />}>You&apos;re signed out. Sign in again whenever you need to.</Note> : null}
            {reason === "session-ended" ? (
              <Note icon={<TimerOff />}>For your safety, this app signs you out after {session}. Sign in again to carry on.</Note>
            ) : null}
            <Head title="Sign in">{audience}</Head>
            <form onSubmit={submitPassword} className="mt-8 flex flex-col gap-3" noValidate>
              <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="size-[17px]" />} required />
              <PasswordField label="Password" autoComplete="current-password" value={password} onChange={setPassword} error={error} />
              <Button type="submit" variant="ink" size="md" className="mt-2 w-full" disabled={busy} arrow={!busy}>
                {busy ? "Checking…" : "Continue"}
              </Button>
            </form>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[14px]">
              <Link href="/forgot-password" className="text-ink-muted underline-offset-4 hover:text-ink hover:underline">
                Forgot password?
              </Link>
              <span className="flex items-center gap-1.5 text-ink-muted">
                <ShieldCheck className="size-4" /> Code check every sign-in
              </span>
            </div>
          </motion.div>
        ) : step === "code" ? (
          <motion.div key="code" {...fade}>
            <button
              type="button"
              onClick={() => {
                setStep("password");
                setCode("");
                setCodeError(undefined);
              }}
              className="mb-6 inline-flex items-center gap-1.5 text-[14px] text-ink-muted hover:text-ink"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <Head icon={<Mail />} title="Check your email">
              We sent a 6-digit code to <span className="font-medium text-ink">{shownEmail}</span>. It expires in 10 minutes.
            </Head>
            <div className="mt-8">
              <CodeInput
                value={code}
                autoFocus
                error={Boolean(codeError)}
                onChange={(v) => {
                  setCode(v);
                  setCodeError(undefined);
                  if (v.length === 6) submitCode(v);
                }}
              />
              {codeError ? (
                <p role="alert" className="mt-3 text-[13px] font-medium text-bad">
                  {codeError}
                </p>
              ) : null}
            </div>
            <Button variant="ink" className="mt-5 w-full" disabled={code.length < 6 || busy} onClick={() => submitCode()}>
              {busy ? "Signing in…" : "Verify and sign in"}
            </Button>
            <p className="mt-5 text-center text-[14px] text-ink-muted">
              Didn&apos;t get it? Check spam, or{" "}
              {wait > 0 ? (
                <span className="tabular">send a new code in {wait}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setWait(30);
                    setCodeError(undefined);
                    toast("New code sent", { body: `Check ${shownEmail}`, tone: "info" });
                  }}
                  className="font-medium text-ink underline-offset-4 hover:underline"
                >
                  send a new code
                </button>
              )}
            </p>
          </motion.div>
        ) : step === "locked" ? (
          <motion.div key="locked" {...fade}>
            <Head icon={<ShieldAlert />} tone="bad" title="Sign-in is paused">
              There were too many tries for this account, so we&apos;ve paused sign-in for a few minutes to keep it safe. Wait a little, then try again, or call the office.
            </Head>
            <div className="mt-8 flex flex-col gap-2.5">
              <Button href={OFFICE_PHONE.href} variant="ink" className="w-full" icon={<Phone className="size-4" />}>
                Call {OFFICE_PHONE.label}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setStep("password")}>
                Back to sign in
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="wrong" {...fade}>
            <Head icon={<KeyRound />} title={`This is a${otherApp === "Office" ? "n" : ""} ${otherApp.toLowerCase()} account`}>
              {email ? <span className="font-medium text-ink">{email}</span> : "This account"} signs in to the Rush Hour Kids {otherApp} app, not the {app} app.
            </Head>
            <div className="mt-8 flex flex-col gap-2.5">
              <Button href={`${APP_URLS[otherApp]}/sign-in`} variant="ink" className="w-full" arrow>
                Open the {otherApp} app
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep("password");
                  setPassword("");
                }}
              >
                Use a different account
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthFrame>
  );
}

/* ------------------------------------------------------------------ forgot password (office only) */

export function ForgotPassword({ app }: { app: AppName }) {
  const office = app === "Office";
  return (
    <AuthFrame app={app} footer={helpFooter}>
      <Link href="/sign-in" className="mb-6 inline-flex items-center gap-1.5 text-[14px] text-ink-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Back to sign in
      </Link>
      <Head icon={<KeyRound />} title="Forgot your password?">
        {office ? "For your safety, only an owner can reset an office password." : "For your safety, only the Rush Hour Kids office can reset a password."}
      </Head>
      <ol className="mt-8 flex flex-col gap-3">
        {(office
          ? ["Ask an owner to send you a reset link from Settings, Team", "Open the email and choose a new password", "Sign in with it, then enter the emailed code"]
          : ["Call the office and ask for a reset link", "Open the email and choose a new password", "Sign in with it, then enter the emailed code"]
        ).map((t, i) => (
          <li key={t} className="flex items-center gap-3 text-[15px]">
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line bg-card font-mono text-[12px] text-ink-muted tabular">{i + 1}</span>
            {t}
          </li>
        ))}
      </ol>
      {!office ? (
        <Button href={OFFICE_PHONE.href} variant="ink" className="mt-8 w-full" icon={<Phone className="size-4" />}>
          Call {OFFICE_PHONE.label}
        </Button>
      ) : null}
    </AuthFrame>
  );
}

/* ------------------------------------------------------------------ set password (invite or reset link) */

function usePasswordChecks(pw: string) {
  return [
    { ok: pw.length >= 8, label: "8 or more characters" },
    { ok: /\d/.test(pw), label: "A number" },
    { ok: /[A-Z]/.test(pw), label: "An uppercase letter" },
  ];
}

function Checks({ checks }: { checks: { ok: boolean; label: string }[] }) {
  return (
    <ul className="mt-1 grid gap-1.5 text-[13px]">
      {checks.map((c) => (
        <li key={c.label} className={cn("flex items-center gap-2 transition-colors", c.ok ? "text-good" : "text-ink-muted")}>
          <span className={cn("grid size-4 place-items-center rounded-full border transition-colors", c.ok ? "border-transparent bg-mint-soft" : "border-line-strong")}>
            {c.ok ? <Check className="size-2.5 stroke-[3]" /> : null}
          </span>
          {c.label}
        </li>
      ))}
    </ul>
  );
}

export function SetPassword({ app, name }: { app: AppName; name?: string }) {
  const q = useQuery();
  const reset = q.get("type") === "reset";
  const expired = q.get("preview") === "expired";
  const [pw, setPw] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [done, setDone] = useState(false);
  const checks = usePasswordChecks(pw);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!checks.every((c) => c.ok)) return setError("Your password needs everything in the list.");
    if (pw !== again) return setError("The two passwords don't match.");
    setError(undefined);
    setDone(true);
  };

  if (expired) {
    return (
      <AuthFrame app={app} footer={helpFooter}>
        <Head icon={<TimerOff />} title="This link has expired">
          Password links work once and only for a short time. Ask the office to send you a new one.
        </Head>
        <div className="mt-8 flex flex-col gap-2.5">
          <Button href={OFFICE_PHONE.href} variant="ink" className="w-full" icon={<Phone className="size-4" />}>
            Call {OFFICE_PHONE.label}
          </Button>
          <Button href="/sign-in" variant="outline" className="w-full">
            Back to sign in
          </Button>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame app={app} footer={helpFooter}>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div key="done" {...fade}>
            <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-mint-soft text-good">
              <Check className="size-5 stroke-[2.5]" />
            </span>
            <h1 className="font-display text-[28px] font-medium tracking-[-0.035em]">Password saved</h1>
            <p className="mt-2 text-[15px] text-ink-muted">Sign in with your new password. We&apos;ll email you a 6-digit code to finish, like every time.</p>
            <Button href="/sign-in" variant="ink" className="mt-8 w-full" arrow>
              Sign in
            </Button>
          </motion.div>
        ) : (
          <motion.div key="form" {...fade}>
            <Head title={reset ? "Choose a new password" : name ? `Welcome, ${name}` : "Set your password"}>
              {reset
                ? "The office sent you this link. Your old password stops working once you save a new one."
                : "Choose a password for your Rush Hour Kids account. You'll also get a code by email each time you sign in."}
            </Head>
            <form onSubmit={submit} className="mt-8 flex flex-col gap-3" noValidate>
              <PasswordField label="New password" autoComplete="new-password" value={pw} onChange={setPw} />
              <PasswordField label="Type it again" autoComplete="new-password" value={again} onChange={setAgain} error={error} />
              <Checks checks={checks} />
              <Button type="submit" variant="ink" className="mt-3 w-full" arrow>
                Save password
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthFrame>
  );
}

/* ------------------------------------------------------------------ change password (signed in) */

export function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [pw, setPw] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState<string | undefined>();
  const checks = usePasswordChecks(pw);
  const close = () => {
    setCurrent("");
    setPw("");
    setAgain("");
    setError(undefined);
    onClose();
  };
  const save = () => {
    if (!current) return setError("Enter your current password first.");
    if (!checks.every((c) => c.ok)) return setError("Your new password needs everything in the list.");
    if (pw !== again) return setError("The two new passwords don't match.");
    toast("Password changed", { body: "Use it the next time you sign in." });
    close();
  };
  return (
    <Dialog
      open={open}
      onClose={close}
      size="sm"
      icon={<KeyRound className="size-5" />}
      title="Change password"
      description="Forgot your current one? The office can send you a reset link."
      footer={
        <>
          <Button variant="soft" size="sm" onClick={close}>
            Cancel
          </Button>
          <Button variant="ink" size="sm" onClick={save}>
            Save password
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <PasswordField label="Current password" autoComplete="current-password" value={current} onChange={setCurrent} />
        <PasswordField label="New password" autoComplete="new-password" value={pw} onChange={setPw} />
        <PasswordField label="Type the new one again" autoComplete="new-password" value={again} onChange={setAgain} error={error} />
        <Checks checks={checks} />
      </div>
    </Dialog>
  );
}
