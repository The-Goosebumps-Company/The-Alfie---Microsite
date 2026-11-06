"use client";

import { useEffect, useRef, useState } from "react";
import { config, type FanType } from "@/config";
import { copy } from "@/copy";
import { isStaticDemo } from "@/lib/staticDemo";
import { DemoTicket, saveDemoTicket } from "./DemoTicket";
import { Logo } from "./Shell";

// squadNumber and fanType come back only from the static demo, which draws the ticket itself.
export type TicketResult = {
  id: string;
  squad: string;
  firstName: string;
  surname: string;
  squadNumber?: number;
  fanType?: string | null;
};

export function Success({ ticket, existing }: { ticket: TicketResult; existing: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const demoTicket = useRef<HTMLDivElement>(null);
  // A cached ticket can finish loading before React attaches onLoad, so check on mount too.
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth) setLoaded(true);
  }, []);
  const src = `/api/ticket/${ticket.id}?v=${config.ticketVersion}`;

  return (
    <section className="text-center" aria-live="polite">
      <Logo />
      {existing && <p className="eyebrow mt-10 text-emerald">{copy.errors.already}</p>}
      <h1 className={`script-heading ${existing ? "mt-4" : "mt-10"} text-[54px] text-forest`}>
        {copy.success.heading(ticket.firstName)}
      </h1>
      <p className="mx-auto mt-4 max-w-[21rem] text-[17px] leading-relaxed text-slate">{copy.success.body}</p>

      {/* The ticket sits on the green block so the cream paper reads against it. */}
      <div className="panel mt-9 px-4 pb-7 pt-8">
        <div className="ticket-in">
          {isStaticDemo ? (
            <DemoTicket
              ref={demoTicket}
              t={{ ...ticket, squadNumber: ticket.squadNumber ?? 0, fanType: (ticket.fanType ?? null) as FanType | null }}
            />
          ) : (
          <div className={`aspect-[5/2] w-full ${loaded ? "" : "animate-pulse rounded-lg bg-white/10"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={img}
              src={src}
              width={1200}
              height={480}
              onLoad={() => setLoaded(true)}
              alt={copy.success.ticketAlt(`${ticket.firstName} ${ticket.surname}`, ticket.squad)}
              className={`h-auto w-full drop-shadow-[0_16px_24px_rgba(0,0,0,0.4)] transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
            />
          </div>
          )}
        </div>
        {isStaticDemo ? (
          <button type="button" onClick={() => demoTicket.current && saveDemoTicket(demoTicket.current, ticket.squad)} className="btn mt-8">
            {copy.success.button}
          </button>
        ) : (
          <a href={`${src}&download=1`} download={`the-alfie-bench-ticket-${ticket.squad}.png`} className="btn mt-8">
            {copy.success.button}
          </a>
        )}
      </div>

      <a href={config.socialUrl} className="eyebrow mt-6 inline-flex min-h-12 items-center text-emerald underline-offset-4 hover:underline">
        {copy.success.follow}
      </a>
    </section>
  );
}
