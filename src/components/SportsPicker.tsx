"use client";

// "Sports you follow": a searchable list that opens on tap, filters as you type, and lets
// guests add a sport that isn't listed. Picks show as chips. Follows the ARIA combobox pattern.
import { useId, useRef, useState } from "react";
import { MAX_SPORTS, SPORTS } from "@/config";
import { copy } from "@/copy";
import { cleanSport } from "@/lib/sports";

type Option = { kind: "sport"; name: string } | { kind: "add"; name: string };

export function SportsPicker({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const listId = `${id}-list`;

  const q = query.trim().toLowerCase();
  const isPicked = (s: string) => value.some((v) => v.toLowerCase() === s.toLowerCase());
  const matches = SPORTS.filter((s) => s.toLowerCase().includes(q)).sort(
    (a, b) => Number(!a.toLowerCase().startsWith(q)) - Number(!b.toLowerCase().startsWith(q)),
  );
  const custom = q.length >= 3 ? cleanSport(query) : null; // no "Add" while still typing the first letters
  const canAdd = custom && !SPORTS.some((s) => s.toLowerCase() === custom.toLowerCase()) && !isPicked(custom);
  const options: Option[] = [
    ...matches.map((name) => ({ kind: "sport" as const, name })),
    ...(canAdd ? [{ kind: "add" as const, name: custom }] : []),
  ];
  const full = value.length >= MAX_SPORTS;

  function toggle(name: string) {
    if (isPicked(name)) onChange(value.filter((v) => v.toLowerCase() !== name.toLowerCase()));
    else if (!full) onChange([...value, name]);
    setQuery("");
    setActive(0);
    input.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (options.length ? (i + step + options.length) % options.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault(); // never submit the form from here
      const pick = options[active];
      if (open && pick) toggle(pick.name);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && !query && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <label htmlFor={`${id}-input`} className="field-label">
        {copy.form.sports}
      </label>

      {value.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2" aria-label={copy.form.sports}>
          {value.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => toggle(s)}
                aria-label={copy.form.sportsRemove(s)}
                className="flex h-10 items-center gap-2 rounded-full bg-mint pl-4 pr-3 text-[15px] text-ink"
              >
                {s}
                <svg aria-hidden viewBox="0 0 10 10" className="h-[9px] w-[9px]">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={input}
        id={`${id}-input`}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && options[active] ? `${id}-opt-${active}` : undefined}
        autoComplete="off"
        enterKeyHint="done"
        placeholder={full ? copy.form.sportsFull : copy.form.sportsPlaceholder}
        disabled={full}
        value={query}
        maxLength={30}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className="field disabled:opacity-60"
      />

      {open && options.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          className="mt-2 max-h-[264px] overflow-y-auto overscroll-contain rounded-[12px] border border-white/20 bg-ink/70 py-1 backdrop-blur-sm"
        >
          {options.map((o, i) => {
            const picked = o.kind === "sport" && isPicked(o.name);
            return (
              <li
                key={`${o.kind}-${o.name}`}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={picked}
                // Keep focus in the input so the list stays open for more picks.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggle(o.name)}
                onMouseEnter={() => setActive(i)}
                className={`flex min-h-11 cursor-pointer items-center justify-between px-4 text-[15px] ${
                  i === active ? "bg-white/10" : ""
                } ${o.kind === "add" ? "text-mint" : "text-white"}`}
              >
                <span>{o.kind === "add" ? copy.form.sportsAdd(o.name) : o.name}</span>
                {picked && (
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 text-mint" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
