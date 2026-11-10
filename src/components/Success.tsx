"use client";

// After joining: a waitlist confirmation, not a ticket or booking. Invitations to book are
// emailed only to guests who get the call-up, so nothing here can be used to get in.
import { config } from "@/config";
import { copy } from "@/copy";
import { Logo } from "./Shell";

export type Reserve = { number: string; firstName: string };

export function Success({ reserve, existing }: { reserve: Reserve; existing: boolean }) {
  const s = copy.success;
  return (
    <section className="text-center" aria-live="polite">
      <Logo />
      {existing && <p className="eyebrow mt-10 text-emerald">{copy.errors.already}</p>}
      <h1 className={`script-heading ${existing ? "mt-4" : "mt-10"} text-[54px] text-forest`}>{s.heading(reserve.firstName)}</h1>
      <p className="mx-auto mt-4 max-w-[21rem] text-[17px] leading-relaxed text-slate">{s.body}</p>

      <div className="panel rise-in mt-9 px-6 pb-7 pt-8 text-left">
        <div className="text-center">
          <p className="eyebrow text-mint">{s.reserveLabel}</p>
          <p className="mt-1 font-body text-[56px] font-normal leading-none tracking-[0.08em]">{reserve.number}</p>
          <p className="mt-3 text-[13px] text-white/60">{s.reserveNote}</p>
        </div>

        <div aria-hidden className="my-7 h-px bg-white/15" />

        <h2 className="script-heading text-[34px]">{s.nextHeading}</h2>
        <ol className="mt-4 grid gap-4">
          {s.steps.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span aria-hidden className="w-6 shrink-0 font-script text-[26px] leading-none text-mint">
                {i + 1}.
              </span>
              <span>
                <span className="block font-heading text-[17px] uppercase leading-tight tracking-[0.08em]">{step.title}</span>
                <span className="mt-1 block text-[14px] leading-snug text-white/75">{step.line}</span>
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-7 border-t border-white/15 pt-5 text-center text-[13px] leading-relaxed text-white/60">{s.disclaimer}</p>
      </div>

      <a href={config.socialUrl} className="eyebrow mt-6 inline-flex min-h-12 items-center text-emerald underline-offset-4 hover:underline">
        {s.follow}
      </a>
    </section>
  );
}
