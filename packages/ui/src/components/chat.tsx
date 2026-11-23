"use client";

/*
 * Messaging pieces shared by all three apps: a thread of grouped bubbles and a composer.
 */

import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Paperclip, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { Avatar } from "./avatar";

export type ChatMessage = { id: string; mine: boolean; author: string; seed: string; body: string; at: string; images?: string[] };

export function Thread({ messages, className }: { messages: ChatMessage[]; className?: string }) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <AnimatePresence initial={false}>
        {messages.map((m, i) => {
          const first = i === 0 || messages[i - 1].mine !== m.mine || messages[i - 1].author !== m.author;
          return (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={cn("flex items-end gap-2.5", m.mine ? "flex-row-reverse" : "flex-row", first && i > 0 && "mt-3")}
            >
              <span className="w-8 shrink-0">{first && !m.mine ? <Avatar seed={m.seed} name={m.author} size={30} /> : null}</span>
              <div className={cn("flex max-w-[78%] flex-col", m.mine ? "items-end" : "items-start")}>
                {first ? (
                  <span className="mb-1 px-1 text-[12px] text-ink-muted">
                    {m.mine ? "You" : m.author} · <span className="tabular">{m.at}</span>
                  </span>
                ) : null}
                {m.images?.length ? (
                  <div className={cn("mb-1 flex flex-wrap gap-1.5", m.mine ? "justify-end" : "justify-start")}>
                    {m.images.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt="Attached photo" className="h-32 max-w-[200px] rounded-2xl border border-line object-cover" />
                    ))}
                  </div>
                ) : null}
                {m.body ? (
                  <p
                    className={cn(
                      "whitespace-pre-wrap rounded-[18px] px-3.5 py-2.5 text-[14px] leading-relaxed",
                      m.mine ? "rounded-br-md bg-ink text-cream" : "rounded-bl-md border border-line bg-card text-ink",
                    )}
                  >
                    {m.body}
                  </p>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={end} />
    </div>
  );
}

export function Composer({ onSend, placeholder = "Write a message…", className }: { onSend: (text: string, images?: string[]) => void; placeholder?: string; className?: string }) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const ready = Boolean(text.trim() || images.length);
  const send = () => {
    if (!ready) return;
    onSend(text.trim(), images.length ? images.map((i) => i.url) : undefined);
    setText("");
    setImages([]);
  };
  return (
    <div className={cn("rounded-[22px] border border-line bg-card p-2 shadow-subtle focus-within:shadow-[0_0_0_4px_var(--color-bus-100)]", className)}>
      {images.length ? (
        <ul className="flex flex-wrap gap-2 px-1 pb-2 pt-1">
          {images.map((img, i) => (
            <li key={img.url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.name} className="size-14 rounded-xl border border-line object-cover" />
              <button
                type="button"
                aria-label={`Remove ${img.name}`}
                onClick={() => setImages((l) => l.filter((_, k) => k !== i))}
                className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-cream"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex items-end gap-2">
        <label
          title="Attach a photo"
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:bg-raised hover:text-ink"
        >
          <Paperclip className="size-[18px]" />
          <input
            type="file"
            accept="image/*"
            multiple
            aria-label="Attach a photo"
            className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setImages((l) => [...l, ...files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))].slice(0, 6));
              e.target.value = "";
            }}
          />
        </label>
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={placeholder}
          aria-label="Message"
          className="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-2 text-[15px] outline-none [field-sizing:content] placeholder:text-ink-muted"
        />
        <button
          type="button"
          onClick={send}
          disabled={!ready}
          aria-label="Send"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-cream transition-opacity disabled:opacity-30"
        >
          <ArrowUp className="size-[18px]" />
        </button>
      </div>
    </div>
  );
}
