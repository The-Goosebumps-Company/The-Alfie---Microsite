import Image from "next/image";
import { copy } from "@/copy";
import { Logo } from "./Shell";

// The halfway-line markings from the hoarding: 22 · 10 · 50 · 10 · 22.
function Markings() {
  return (
    <div aria-hidden className="flex justify-between px-1">
      {["22", "10", "50", "10", "22"].map((n, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="font-label text-[13px] font-medium text-gold/80">{n}</span>
          <span className={`mt-1 h-5 border-l border-gold/50 ${n === "10" ? "border-dashed" : ""}`} />
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <header className="text-center">
      <Markings />
      <div className="mt-4">
        <Logo className="w-[112px]" />
      </div>
      <p className="mt-7 font-label text-[12px] font-medium tracking-[0.24em] text-gold">{copy.hero.eyebrow}</p>
      <h1 className="mt-3 font-heading text-[52px] font-medium leading-[0.98] text-cream">{copy.hero.headline}</h1>
      <p className="mx-auto mt-4 max-w-[22rem] text-[17px] leading-relaxed text-muted">{copy.hero.subhead}</p>
      <p className="mt-4 font-label text-[13px] font-medium uppercase tracking-[0.18em] text-gold">{copy.hero.small}</p>
      <Image
        src="/sport-icons-row.png"
        alt=""
        width={1100}
        height={160}
        className="mx-auto mt-6 h-auto w-[230px] opacity-90"
      />
    </header>
  );
}
