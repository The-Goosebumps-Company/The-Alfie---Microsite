// The bench ticket layout, written for Satori (next/og): every box is flex, every style inline.
// Drawn at 2× (1200 × 480). The server renders it to PNG (Ticket.tsx); the static demo renders
// the same layout in the browser (DemoTicket.tsx), so it must not use Node APIs.
import type { CSSProperties, ReactNode } from "react";
import { copy } from "@/copy";
import { ACCENT, H, INK, STUB_X, W } from "./paper";

const S = 2;
const WORDMARK_RATIO = 1242 / 180;

/** Font families: Satori's registered names on the server, CSS variables in the browser. */
export type TicketFonts = { sans: string; serif: string; script: string };
const SATORI_FONTS: TicketFonts = { sans: "Jost", serif: "Cormorant Garamond", script: "Pinyon Script" };
let F = SATORI_FONTS;

export type TicketData = {
  firstName: string;
  surname: string;
  squad: string; // zero-padded, e.g. "0427"
  squadNumber: number;
  fan: string | null; // e.g. "The Analyst"
};

// Small spaced capitals, as on the deck's page titles.
const caps = (size: number, color = ACCENT): CSSProperties => ({
  fontFamily: F.sans,
  fontWeight: 500,
  fontSize: size * S,
  letterSpacing: size * 0.24 * S,
  color,
});
const value = (): CSSProperties => ({ fontFamily: F.sans, fontWeight: 500, fontSize: 12.5 * S, color: INK });

function At({ x, y, w, children, style }: { x: number; y: number; w?: number; children: ReactNode; style?: CSSProperties }) {
  return (
    // Satori chokes on undefined style values, so width is only set when given.
    <div style={{ position: "absolute", left: x * S, top: y * S, ...(w ? { width: w * S } : {}), display: "flex", ...style }}>
      {children}
    </div>
  );
}

function Field({ name, val, first }: { name: string; val: string; first?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingLeft: first ? 0 : 11 * S,
        marginRight: 11 * S,
        borderLeft: first ? "none" : `${S}px solid rgba(0, 90, 66, 0.35)`,
      }}
    >
      <div style={caps(6.5)}>{name}</div>
      <div style={{ ...value(), marginTop: 3 * S }}>{val}</div>
    </div>
  );
}

/** `paper` is paperSvg() as a data URI; `wordmark` is the green "The ALFIE ★" PNG's URL. */
export function TicketLayout({ t, paper, wordmark, fonts = SATORI_FONTS }: { t: TicketData; paper: string; wordmark: string; fonts?: TicketFonts }) {
  F = fonts; // read by the style helpers above during this render
  const name = `${t.firstName} ${t.surname}`.toUpperCase();
  const nameSize = Math.max(18, Math.min(36, Math.floor(390 / (name.length * 0.68))));
  const tk = copy.ticket;
  const markH = 17;

  return (
    <div style={{ display: "flex", position: "relative", width: W * S, height: H * S, textAlign: "left" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={paper} width={W * S} height={H * S} style={{ position: "absolute", left: 0, top: 0 }} alt="" />

      {/* The Alfie · by Heineken */}
      <At x={30} y={17} style={{ alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmark} width={markH * WORDMARK_RATIO * S} height={markH * S} alt="" />
        <div style={{ width: S, height: 11 * S, background: "rgba(0, 90, 66, 0.4)", marginLeft: 9 * S, marginRight: 9 * S }} />
        <div style={caps(7)}>{tk.byline}</div>
      </At>

      {/* Opening Night · May 2027 */}
      <At x={30} y={46} style={{ alignItems: "baseline" }}>
        <div style={{ fontFamily: F.script, fontSize: 21 * S, color: INK, lineHeight: 1 }}>{tk.event}</div>
        <div style={{ ...caps(7.5), marginLeft: 10 * S }}>{tk.eventDate}</div>
      </At>

      <At x={30} y={71} w={392} style={{ height: 41 * S, alignItems: "center" }}>
        <div style={{ fontFamily: F.serif, fontWeight: 500, fontSize: nameSize * S, color: INK, letterSpacing: 0.6 * S, lineHeight: 1 }}>
          {name}
        </div>
      </At>

      <At x={30} y={125} w={392}>
        <Field first name={tk.gate} val={tk.gateValue} />
        <Field name={tk.stand} val={tk.standValue} />
        <Field name={tk.squad} val={t.squad} />
        {t.fan ? <Field name={tk.fan} val={t.fan} /> : null}
      </At>

      <At x={30} y={182} style={caps(8, INK)}>{tk.venue}</At>
      <At x={30} y={211} w={400} style={{ fontFamily: F.sans, fontSize: 7 * S, color: INK, opacity: 0.7 }}>
        {tk.smallPrint}
      </At>

      {/* Stub */}
      <At x={STUB_X} y={28} w={W - STUB_X} style={{ flexDirection: "column", alignItems: "center" }}>
        <div style={caps(11, INK)}>{tk.admit}</div>
        <div style={{ ...caps(7.5), marginTop: 4 * S }}>{tk.reserve}</div>
        <div style={{ ...caps(6.5), marginTop: 22 * S }}>{tk.squad}</div>
        {/* Jost, not Cormorant: Cormorant's old-style figures make 0001 read as OOOI. */}
        <div style={{ fontFamily: F.sans, fontWeight: 400, fontSize: 34 * S, color: INK, letterSpacing: 1.5 * S, lineHeight: 1.15 }}>
          {t.squad}
        </div>
      </At>
      <At x={STUB_X} y={193} w={W - STUB_X} style={{ justifyContent: "center", ...caps(5.5) }}>
        {`${tk.barcodeCaption} · ${t.squad}`}
      </At>
    </div>
  );
}
