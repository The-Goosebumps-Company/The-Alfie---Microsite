"use client";

import { useEffect, useRef, useState } from "react";

const PHONE = { w: 375, h: 812 };
const GAP = 28;
const SCREENS = [
  { name: "age", label: "1 · Age gate" },
  { name: "form", label: "2 · Landing + form" },
  { name: "success", label: "3 · On the bench" },
];

export function ScreensBoard() {
  const [scale, setScale] = useState(1);
  const [stamp, setStamp] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  // Shrink the three phones to fit the pane's width.
  useEffect(() => {
    const fit = () => {
      const width = box.current?.clientWidth ?? window.innerWidth;
      setScale(Math.min(1, (width - GAP * 2) / (PHONE.w * 3 + GAP * 2)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div ref={box} className="min-h-dvh bg-[#e4e2dc] px-7 py-6 font-body text-ink">
      <div className="mb-5 flex items-center justify-between">
        <p className="eyebrow text-emerald">The Bench · screens</p>
        <button onClick={() => setStamp(Date.now())} className="eyebrow rounded-full border border-forest/30 px-4 py-2 text-forest hover:bg-white/50">
          Reload all
        </button>
      </div>
      <div className="flex items-start justify-center" style={{ gap: GAP * scale }}>
        {SCREENS.map((s) => (
          <figure key={s.name} className="m-0 shrink-0" style={{ width: PHONE.w * scale }}>
            <figcaption className="mb-2 flex items-baseline justify-between text-[12px] text-slate">
              <span className="font-medium">{s.label}</span>
              <a href={`/dev/screen/${s.name}`} target="_blank" className="underline underline-offset-2">
                open
              </a>
            </figcaption>
            <div
              className="overflow-hidden rounded-[22px] bg-ivory shadow-[0_20px_40px_-20px_rgba(3,28,31,0.45)] ring-1 ring-black/10"
              style={{ width: PHONE.w * scale, height: PHONE.h * scale }}
            >
              <iframe
                key={`${s.name}-${stamp}`}
                src={`/dev/screen/${s.name}`}
                title={s.label}
                width={PHONE.w}
                height={PHONE.h}
                style={{ transform: `scale(${scale})`, transformOrigin: "0 0", border: 0 }}
              />
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
