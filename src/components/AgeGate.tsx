"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { copy } from "@/copy";
import { checkAge } from "@/lib/client/api";
import { toIsoDate } from "@/lib/dates";
import { Logo } from "./Shell";
import { Underage } from "./Underage";

type Part = "day" | "month" | "year";
const PARTS: { key: Part; max: number; placeholder: string; label: string }[] = [
  { key: "day", max: 2, placeholder: copy.ageGate.day, label: copy.ageGate.dayLabel },
  { key: "month", max: 2, placeholder: copy.ageGate.month, label: copy.ageGate.monthLabel },
  { key: "year", max: 4, placeholder: copy.ageGate.year, label: copy.ageGate.yearLabel },
];

// onPassed: the static demo swaps screens itself; normally the server page re-renders.
export function AgeGate({ onPassed }: { onPassed?: () => void }) {
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
      const json = await checkAge(value);
      if (json.ok) return onPassed ? onPassed() : router.refresh();
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
      <form onSubmit={submit} noValidate className="panel mt-10 px-6 pb-8 pt-10 text-center">
        <h1 className="script-heading text-[50px]">{copy.ageGate.heading}</h1>
        <p className="mx-auto mt-3 max-w-[18rem] text-[16px] leading-relaxed text-white/80">{copy.ageGate.body}</p>

        <fieldset className="mt-8">
          <legend className="sr-only">Date of birth</legend>
          <div className="flex justify-center gap-3">
            {PARTS.map((p, i) => (
              <label key={p.key} className="flex flex-col items-center">
                <input
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
                  placeholder={p.placeholder}
                  aria-invalid={!!error}
                  aria-describedby={error ? "dob-error" : undefined}
                  className={`field h-[60px] px-0 text-center text-[20px] tracking-[0.14em] ${p.max === 4 ? "w-[108px]" : "w-[72px]"}`}
                />
                <span className="eyebrow mt-2 text-[10px] text-white/60">{p.label}</span>
              </label>
            ))}
          </div>
          <p id="dob-error" aria-live="polite" className="mt-3 min-h-[20px] text-[14px] text-alert">
            {error}
          </p>
        </fieldset>

        <button type="submit" disabled={busy} className="btn mt-3">
          {copy.ageGate.button}
        </button>
      </form>
    </div>
  );
}
