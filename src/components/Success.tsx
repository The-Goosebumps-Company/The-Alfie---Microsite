"use client";

import { useState } from "react";
import { config } from "@/config";
import { copy } from "@/copy";
import { Logo } from "./Shell";

export type TicketResult = { id: string; squad: string; firstName: string; surname: string };

export function Success({ ticket, existing }: { ticket: TicketResult; existing: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const src = `/api/ticket/${ticket.id}`;

  return (
    <section className="text-center" aria-live="polite">
      <Logo className="w-[96px]" />
      {existing && <p className="mt-8 font-label text-[13px] uppercase tracking-[0.16em] text-gold">{copy.errors.already}</p>}
      <h1 className={`${existing ? "mt-3" : "mt-8"} font-heading text-[42px] font-medium leading-[1.02] text-cream`}>
        {copy.success.heading(ticket.firstName)}
      </h1>
      <p className="mx-auto mt-4 max-w-[22rem] text-[17px] leading-relaxed text-muted">{copy.success.body}</p>

      <div className="ticket-in relative -mx-3 mt-9">
        <div className={`aspect-[5/2] w-full ${loaded ? "" : "animate-pulse rounded-lg bg-cream/10"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            width={1200}
            height={480}
            onLoad={() => setLoaded(true)}
            alt={copy.success.ticketAlt(`${ticket.firstName} ${ticket.surname}`, ticket.squad)}
            className={`h-auto w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)] transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </div>

      <a
        href={`${src}?download=1`}
        download={`the-alfie-bench-ticket-${ticket.squad}.png`}
        className="mt-9 flex h-14 w-full items-center justify-center rounded-md bg-gold font-label text-[16px] font-semibold uppercase tracking-[0.2em] text-deep transition hover:bg-[#d6b46d] focus:outline-none focus-visible:ring-2 focus-visible:ring-cream"
      >
        {copy.success.button}
      </a>
      <a
        href={config.socialUrl}
        className="mt-5 inline-flex min-h-12 items-center font-label text-[14px] uppercase tracking-[0.18em] text-gold underline-offset-4 hover:underline"
      >
        {copy.success.follow}
      </a>
    </section>
  );
}
