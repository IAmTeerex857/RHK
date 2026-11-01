"use client";

/*
 * Contact form. There is no backend yet, so "Send" opens the parent's email app with the
 * message filled in, addressed to the office. Swap for a real endpoint when the portals exist.
 */

import { useState } from "react";
import { Mail, Phone, Send, User } from "lucide-react";
import { Button } from "@rhk/ui/components/button";
import { Field, TextArea } from "@rhk/ui/components/field";
import { contact } from "@/content/site";

const topics = ["A quote", "Service areas", "My application", "Something else"];

export function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", email: "", topic: topics[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "Please tell us your name.";
    if (!f.phone.trim() && !f.email.trim()) er.phone = "Give us a phone number or an email so we can reply.";
    if (!f.message.trim()) er.message = "What would you like to ask?";
    setErrors(er);
    if (Object.keys(er).length) return;
    const subject = `Website enquiry: ${f.topic}`;
    const body = `${f.message}\n\n${f.name}\n${f.phone}\n${f.email}`.trim();
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-line bg-white p-6 shadow-float md:p-9">
      <h2 className="font-display text-[26px] font-semibold tracking-[-0.03em]">Send us a message</h2>
      <p className="mt-1.5 text-[15px] text-ink-soft">This opens your email app with your message ready to send.</p>
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
                  : "rounded-lg border border-line bg-white px-3.5 py-1.5 text-[14px] font-semibold text-ink-soft hover:border-ink/40"
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
        <Button type="submit" icon={<Send className="size-4" />}>
          Send message
        </Button>
      </div>
    </form>
  );
}
