"use client";

// Static demo only: draws the bench ticket in the browser from the same layout the server
// renders to PNG, and saves it as a PNG with html-to-image.
import { forwardRef, useEffect, useRef, useState } from "react";
import { copy } from "@/copy";
import type { FanType } from "@/config";
import { asset } from "@/lib/staticDemo";
import { paperSvg } from "@/ticket/paper";
import { TicketLayout } from "@/ticket/TicketLayout";

export type DemoTicketData = { firstName: string; surname: string; squad: string; squadNumber: number; fanType: FanType | null };

const BROWSER_FONTS = { sans: "var(--font-body)", serif: "var(--font-heading)", script: "var(--font-script)" };

export const DemoTicket = forwardRef<HTMLDivElement, { t: DemoTicketData }>(function DemoTicket({ t }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  // The layout is drawn at 1200 × 480; scale it down to the panel's width.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / 1200);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="relative aspect-[5/2] w-full" role="img" aria-label={copy.success.ticketAlt(`${t.firstName} ${t.surname}`, t.squad)}>
      <div
        aria-hidden
        style={{ transform: `scale(${scale})`, transformOrigin: "0 0", width: 1200, height: 480 }}
        className="absolute left-0 top-0 drop-shadow-[0_16px_24px_rgba(0,0,0,0.4)]"
      >
        <div ref={ref}>
          <TicketLayout
            fonts={BROWSER_FONTS}
            paper={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(paperSvg(t.squadNumber))}`}
            wordmark={asset("/ticket-wordmark.png")}
            t={{
              firstName: t.firstName,
              surname: t.surname,
              squad: t.squad,
              squadNumber: t.squadNumber,
              fan: t.fanType ? copy.fanTypes[t.fanType].ticket : null,
            }}
          />
        </div>
      </div>
    </div>
  );
});

export async function saveDemoTicket(node: HTMLElement, squad: string) {
  const { toPng } = await import("html-to-image");
  const url = await toPng(node, { width: 1200, height: 480, pixelRatio: 1, cacheBust: true });
  const a = document.createElement("a");
  a.href = url;
  a.download = `the-alfie-bench-ticket-${squad}.png`;
  a.click();
}
