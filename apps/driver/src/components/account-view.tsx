"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, KeyRound, Lock, LogOut, Phone, Share, ShieldCheck, Smartphone, SquarePlus } from "lucide-react";
import { getVan } from "@rhk/fixtures";
import { Avatar } from "@rhk/ui/components/avatar";
import { Button } from "@rhk/ui/components/button";
import { Card, CardHeader, Row } from "@rhk/ui/components/card";
import { Switch } from "@rhk/ui/components/controls";
import { Field } from "@rhk/ui/components/field";
import { toast } from "@rhk/ui/components/toast";
import { PageHeader } from "@rhk/ui/shell/app-shell";
import { ChangePasswordDialog } from "@rhk/ui/shell/auth";
import { me } from "./run-store";

const myVan = me.vanId ? getVan(me.vanId) : null;
const digits = (s: string) => s.replace(/\D/g, "");

export function AccountView() {
  const [savedPhone, setSavedPhone] = useState(me.phone);
  const [phone, setPhone] = useState(me.phone);
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [pwOpen, setPwOpen] = useState(false);
  const [n, setN] = useState({ messages: true, news: true, timeoff: true, training: true });
  const changed = digits(phone) !== digits(savedPhone);

  const savePhone = () => {
    if (digits(phone).length !== 10) return setPhoneError("Enter a 10-digit US phone number.");
    setPhoneError(undefined);
    setSavedPhone(phone);
    toast("Phone number updated", { body: "The office has been told." });
  };

  return (
    <>
      <PageHeader title="Account" description="Your details, alerts and sign-in." />
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex items-center gap-3.5">
              <Avatar seed={me.id} name={me.name} size={52} />
              <div className="min-w-0">
                <p className="text-[16px] font-medium">{me.name}</p>
                <p className="truncate text-[14px] text-ink-muted">Driver since {me.since}</p>
              </div>
            </div>
            <div className="mt-4">
              <Row label="Email" value={<span className="block max-w-[220px] truncate">{me.email}</span>} />
              <Row label="Van" value={myVan ? `${myVan.name} · ${myVan.plate}` : "Substitute, no set van"} />
              <Row label="License expires" value={me.licenseExpires} />
            </div>
            <p className="mt-3 flex items-start gap-2 text-[13px] text-ink-muted">
              <Lock className="mt-0.5 size-3.5 shrink-0" />
              Name, email, van and license are kept by the office. Message them to change these.
            </p>
          </Card>
          <Card>
            <CardHeader title="Your phone number" icon={<Phone className="size-4" />} subtitle="The office calls this number about your runs. Families never see it." />
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start">
              <Field label="Mobile number" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={phoneError} className="sm:flex-1" />
              <Button variant="ink" size="md" className="sm:mt-[5px]" disabled={!changed} onClick={savePhone}>
                Save
              </Button>
            </div>
          </Card>
          <Card>
            <CardHeader title="Add the app to your home screen" icon={<Smartphone className="size-4" />} subtitle="So it opens full screen and alerts reach you." />
            <ol className="mt-4 flex flex-col gap-3 text-[14px]">
              {[
                { icon: <Share className="size-4" />, text: "Tap Share in Safari, or the menu in Chrome" },
                { icon: <SquarePlus className="size-4" />, text: "Choose “Add to Home Screen”" },
                { icon: <Download className="size-4" />, text: "Open Rush Hour Kids Driver from your home screen" },
              ].map((s) => (
                <li key={s.text} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-raised">{s.icon}</span>
                  {s.text}
                </li>
              ))}
            </ol>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Alerts" subtitle="Sent to this phone once the app is on your home screen" />
            <div className="mt-5 flex flex-col gap-5">
              <Switch checked disabled onChange={() => {}} label="Route changes and emergencies" description="Safety alerts are always on" />
              <Switch checked={n.messages} onChange={(v) => setN((x) => ({ ...x, messages: v }))} label="Messages from the office" />
              <Switch checked={n.news} onChange={(v) => setN((x) => ({ ...x, news: v }))} label="Announcements" />
              <Switch checked={n.timeoff} onChange={(v) => setN((x) => ({ ...x, timeoff: v }))} label="Answers to time-off requests" />
              <Switch checked={n.training} onChange={(v) => setN((x) => ({ ...x, training: v }))} label="New training to finish" />
            </div>
          </Card>
          <Card>
            <CardHeader title="Sign-in" icon={<ShieldCheck className="size-4" />} />
            <div className="mt-3">
              <Row label="Method" value="Password + emailed code" />
              <Row label="Stay signed in" value="30 days" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" icon={<KeyRound className="size-4" />} onClick={() => setPwOpen(true)}>
                Change password
              </Button>
              <Button variant="ghost" size="sm" icon={<LogOut className="size-4" />} href="/sign-in?reason=signed-out" linkAs={Link}>
                Sign out
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <ChangePasswordDialog open={pwOpen} onClose={() => setPwOpen(false)} />
    </>
  );
}
