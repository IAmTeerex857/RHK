"use client";

/*
 * Contact form. Sends from the page (docs/PLAN.md §6). The request to the backend (Resend) is
 * wired in with the backend; until then the send is simulated so the states can be reviewed.
 */

import { useState } from "react";
import { Check, Mail, Phone, Send, User } from "lucide-react";
import { Button } from "@rhk/ui/components/button";
import { Field, TextArea } from "@rhk/ui/components/field";
import { contact } from "@/content/site";

const topics = ["A quote", "Service areas", "My application", "Something else"];

export function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", email: "", topic: topics[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "Please tell us your name.";
    if (!f.phone.trim() && !f.email.trim()) er.phone = "Give us a phone number or an email so we can reply.";
    if (!f.message.trim()) er.message = "What would you like to ask?";
    setErrors(er);
    if (Object.keys(er).length) return;
    setState("sending");
    // TODO: POST to the backend, which emails the office through Resend.
    setTimeout(() => setState("sent"), 900);
  };

  if (state === "sent") {
    return (
      <div className="rounded-3xl border border-line bg-card p-6 shadow-float md:p-9">
        <span className="grid size-12 place-items-center rounded-full bg-mint text-ink">
          <Check className="size-6" strokeWidth={2.75} />
        </span>
        <h2 className="mt-5 font-display text-[26px] font-semibold tracking-[-0.03em]">Message sent</h2>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
          Thanks, {f.name.split(" ")[0]}. The office will reply by {f.email ? "email" : "phone"}. If it&rsquo;s urgent, call{" "}
          <a href={contact.phoneHref} className="font-semibold text-ink underline">
            {contact.phone}
          </a>
          .
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => {
            setF({ name: "", phone: "", email: "", topic: topics[0], message: "" });
            setState("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-line bg-card p-6 shadow-float md:p-9">
      <h2 className="font-display text-[26px] font-semibold tracking-[-0.03em]">Send us a message</h2>
      <p className="mt-1.5 text-[15px] text-ink-soft">The office replies by phone or email, whichever you give us.</p>
      <fieldset className="mt-6">
        <legend className="mb-2.5 text-[14px] font-semibold text-ink-soft">What&rsquo;s it about?</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={f.topic === t}
              onClick={() => setF((x) => ({ ...x, topic: t }))}
              className={
                f.topic === t
                  ? "rounded-lg border border-line bg-bus-400 px-3.5 py-1.5 text-[14px] font-semibold shadow-subtle"
                  : "rounded-lg border border-line bg-card px-3.5 py-1.5 text-[14px] font-semibold text-ink-soft hover:border-ink/40"
              }
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field className="sm:col-span-2" label="Your name" autoComplete="name" icon={<User className="size-4" />} value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} error={errors.name} />
        <Field label="Phone" type="tel" autoComplete="tel" icon={<Phone className="size-4" />} value={f.phone} onChange={(e) => setF((x) => ({ ...x, phone: e.target.value }))} error={errors.phone} />
        <Field label="Email" type="email" autoComplete="email" icon={<Mail className="size-4" />} value={f.email} onChange={(e) => setF((x) => ({ ...x, email: e.target.value }))} />
        <TextArea className="sm:col-span-2" label="Your message" value={f.message} onChange={(e) => setF((x) => ({ ...x, message: e.target.value }))} error={errors.message} />
      </div>
      <div className="mt-6">
        <Button type="submit" icon={<Send className="size-4" />} disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
