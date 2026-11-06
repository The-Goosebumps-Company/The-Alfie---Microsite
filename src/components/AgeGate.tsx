"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { copy } from "@/copy";
import { toIsoDate } from "@/lib/dates";
import { Logo } from "./Shell";
import { Underage } from "./Underage";

type Part = "day" | "month" | "year";
const PARTS: { key: Part; max: number; label: string }[] = [
  { key: "day", max: 2, label: copy.ageGate.day },
  { key: "month", max: 2, label: copy.ageGate.month },
  { key: "year", max: 4, label: copy.ageGate.year },
];

export function AgeGate() {
  const router = useRouter();
  const [value, setValue] = useState<Record<Part, string>>({ day: "", month: "", year: "" });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  if (blocked) return <Underage />;

  // Extra digits spill into the next box, so fast typing or "14031990" all lands.
  function change(i: number, raw: string) {
    let rest = raw.replace(/\D/g, "");
    const next = { ...value };
    let j = i;
    for (;;) {
      const { key, max } = PARTS[j];
      next[key] = rest.slice(0, max);
      rest = rest.slice(max);
      if (!rest || j === PARTS.length - 1) break;
      j++;
    }
    setValue(next);
    setError(null);
    const full = next[PARTS[j].key].length === PARTS[j].max;
    refs.current[full ? Math.min(j + 1, PARTS.length - 1) : j]?.focus();
  }

  function paste(e: React.ClipboardEvent) {
    const m = e.clipboardData.getData("text").match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/);
    if (!m) return;
    e.preventDefault();
    setValue({ day: m[1], month: m[2], year: m[3] });
    refs.current[2]?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!toIsoDate(value)) {
      setError(copy.ageGate.invalid);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/age", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const json = await res.json();
      if (json.ok) return router.refresh();
      if (json.underage) return setBlocked(true);
      setError(copy.ageGate.invalid);
    } catch {
      setError(copy.errors.server);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center">
      <Logo />
      <form onSubmit={submit} noValidate className="mt-10 text-center">
        <p className="font-label text-[12px] font-medium tracking-[0.28em] text-gold">{copy.ageGate.eyebrow}</p>
        <h1 className="mt-3 font-heading text-[40px] leading-[1.05] text-cream">{copy.ageGate.heading}</h1>
        <p className="mx-auto mt-3 max-w-[20rem] text-[16px] leading-relaxed text-muted">{copy.ageGate.body}</p>

        <fieldset className="mt-8">
          <legend className="sr-only">Date of birth</legend>
          <div className="flex justify-center gap-3">
            {PARTS.map((p, i) => (
              <input
                key={p.key}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                value={value[p.key]}
                onChange={(e) => change(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !value[p.key]) refs.current[i - 1]?.focus();
                }}
                onPaste={paste}
                inputMode="numeric"
                autoComplete={i === 0 ? "bday-day" : i === 1 ? "bday-month" : "bday-year"}
                placeholder={p.label}
                aria-label={p.label}
                aria-invalid={!!error}
                aria-describedby={error ? "dob-error" : undefined}
                className={`h-[60px] rounded-md border bg-deep/70 text-center font-label text-[22px] tracking-[0.12em] text-cream placeholder:text-muted/45 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                  p.max === 4 ? "w-[112px]" : "w-[76px]"
                } ${error ? "border-alert" : "border-gold/45"}`}
              />
            ))}
          </div>
          <p id="dob-error" aria-live="polite" className="mt-3 min-h-[20px] text-[14px] text-alert">
            {error}
          </p>
        </fieldset>

        <button
          type="submit"
          disabled={busy}
          className="mt-4 h-14 w-full rounded-md bg-gold font-label text-[16px] font-semibold uppercase tracking-[0.2em] text-deep transition hover:bg-[#d6b46d] focus:outline-none focus-visible:ring-2 focus-visible:ring-cream disabled:opacity-70"
        >
          {copy.ageGate.button}
        </button>
      </form>
    </div>
  );
}
