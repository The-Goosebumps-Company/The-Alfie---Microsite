import { copy } from "@/copy";
import { Logo } from "./Shell";

// Kept compact so the first form field peeks in on a phone: it signals "this is quick".
export function Hero() {
  return (
    <header className="px-2 text-center">
      <Logo className="w-[100px]" />
      <p className="eyebrow mt-8 text-balance tracking-[0.2em] text-emerald">{copy.hero.eyebrow}</p>
      <h1 className="script-heading mt-3 text-[54px] text-forest">{copy.hero.headline}</h1>
      <p className="mx-auto mt-3 max-w-[22rem] text-[16px] leading-relaxed text-slate">{copy.hero.subhead}</p>
    </header>
  );
}
