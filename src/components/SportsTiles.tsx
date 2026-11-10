"use client";

// "Sports you follow": the six featured sports as tiles (pick as many as you like), plus an
// "Other" tile that opens a text box for anything else, comma-separated.
import { useId, useState } from "react";
import { MAX_SPORTS, SPORTS } from "@/config";
import { copy } from "@/copy";
import { cleanSport, cleanSports } from "@/lib/sports";

const tile = (on: boolean) =>
  // Sans, not the serif: the serif's old-style figures make "F1" read as "FI".
  `relative flex min-h-[56px] items-center justify-center rounded-[12px] border px-2 text-center font-body text-[13px] font-medium uppercase tracking-[0.18em] transition ${
    on ? "border-mint bg-white/10 text-mint" : "border-white/25 text-white hover:border-white/60"
  }`;

function Tick() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="absolute right-1.5 top-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SportsTiles({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const featured = value.filter((s) => SPORTS.includes(s));
  const [otherOpen, setOtherOpen] = useState(value.some((s) => !SPORTS.includes(s)));
  const [otherText, setOtherText] = useState(value.filter((s) => !SPORTS.includes(s)).join(", "));
  const otherId = useId();

  // A typed entry that is really a featured sport ("football" → Soccer) belongs on its tile.
  const featuredMatch = (raw: string) => {
    const c = cleanSport(raw);
    return c && SPORTS.includes(c) ? c : null;
  };

  // The saved list: featured picks in tile order, then anything else typed under "Other" (if open).
  const combine = (picked: string[], open: boolean, text: string) =>
    cleanSports([
      ...SPORTS.filter((s) => picked.includes(s)),
      ...(open ? text.split(",").filter((t) => !featuredMatch(t)) : []),
    ]).slice(0, MAX_SPORTS);

  // On leaving the box, move typed featured sports onto their tiles and out of the text.
  function tidyOther() {
    const items = otherText.split(",");
    const moved = items.map(featuredMatch).filter((s): s is string => !!s);
    if (!moved.length) return;
    const rest = items.filter((t) => !featuredMatch(t)).map((t) => t.trim()).filter(Boolean).join(", ");
    setOtherText(rest);
    onChange(combine([...featured, ...moved], true, rest));
  }

  function toggle(sport: string) {
    const picked = featured.includes(sport) ? featured.filter((s) => s !== sport) : [...featured, sport];
    onChange(combine(picked, otherOpen, otherText));
  }

  function toggleOther() {
    setOtherOpen(!otherOpen);
    onChange(combine(featured, !otherOpen, otherText));
  }

  return (
    <fieldset>
      <legend className="w-full">
        <span className="field-label mb-1">{copy.form.sports}</span>
        <span className="mb-3 block text-[13px] text-white/60">{copy.form.sportsHint}</span>
      </legend>

      <div className="grid grid-cols-3 gap-2">
        {SPORTS.map((s) => {
          const on = featured.includes(s);
          return (
            <button key={s} type="button" aria-pressed={on} onClick={() => toggle(s)} className={tile(on)}>
              {s}
              {on && <Tick />}
            </button>
          );
        })}
        <button type="button" aria-pressed={otherOpen} aria-controls={otherId} onClick={toggleOther} className={`col-span-3 ${tile(otherOpen)}`}>
          {copy.form.sportsOther}
          {otherOpen && <Tick />}
        </button>
      </div>

      {otherOpen && (
        <div id={otherId} className="mt-3">
          <label htmlFor={`${otherId}-input`} className="mb-2 block text-[13px] text-white/70">
            {copy.form.sportsOtherLabel}
          </label>
          <input
            id={`${otherId}-input`}
            value={otherText}
            maxLength={120}
            autoComplete="off"
            placeholder={copy.form.sportsOtherPlaceholder}
            onChange={(e) => {
              setOtherText(e.target.value);
              onChange(combine(featured, true, e.target.value));
            }}
            onBlur={tidyOther}
            className="field"
          />
        </div>
      )}
    </fieldset>
  );
}
