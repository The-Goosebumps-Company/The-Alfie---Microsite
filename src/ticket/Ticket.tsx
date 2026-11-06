// The bench ticket, written for Satori (next/og): every box is flex, every style inline.
// Rendered at 2× (1200 × 480) so the same PNG serves the download and the v2 email banner.
import type { CSSProperties, ReactNode } from "react";
import { copy } from "@/copy";
import { GOLD, GOLD_INK, H, INK, STUB_X, W, paperSvg } from "./paper";

const S = 2;

export type TicketData = {
  firstName: string;
  surname: string;
  squad: string; // zero-padded, e.g. "0427"
  squadNumber: number;
  fan: string | null; // e.g. "The Analyst"
};

const label: CSSProperties = { fontFamily: "Oswald", fontWeight: 500, color: GOLD_INK };
const value: CSSProperties = { fontFamily: "Oswald", fontWeight: 500, color: INK };

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
        paddingLeft: first ? 0 : 10 * S,
        marginRight: 10 * S,
        borderLeft: first ? "none" : `${S}px solid ${GOLD}`,
      }}
    >
      <div style={{ ...label, fontSize: 7.5 * S, letterSpacing: 1.6 * S }}>{name}</div>
      <div style={{ ...value, fontSize: 13 * S, marginTop: 2 * S }}>{val}</div>
    </div>
  );
}

export function Ticket({ t }: { t: TicketData }) {
  const name = `${t.firstName} ${t.surname}`.toUpperCase();
  const nameSize = Math.max(18, Math.min(40, Math.floor(390 / (name.length * 0.68))));
  const bg = `data:image/svg+xml;base64,${Buffer.from(paperSvg(t.squadNumber)).toString("base64")}`;
  const t2 = copy.ticket;

  return (
    <div style={{ display: "flex", position: "relative", width: W * S, height: H * S }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bg} width={W * S} height={H * S} style={{ position: "absolute", left: 0, top: 0 }} alt="" />

      <At x={48} y={22} style={{ ...value, fontSize: 10 * S, letterSpacing: 3 * S }}>{t2.brand}</At>
      <At x={30} y={42} style={{ ...label, fontSize: 10 * S, letterSpacing: 2.4 * S }}>{t2.event}</At>
      <At x={30} y={60} w={392} style={{ height: 50 * S, alignItems: "center" }}>
        <div style={{ fontFamily: "Cormorant Garamond", fontWeight: 500, fontSize: nameSize * S, color: INK, letterSpacing: 0.6 * S, lineHeight: 1 }}>
          {name}
        </div>
      </At>

      <At x={30} y={124} w={392}>
        <Field first name={t2.gate} val={t2.gateValue} />
        <Field name={t2.stand} val={t2.standValue} />
        <Field name={t2.squad} val={t.squad} />
        {t.fan ? <Field name={t2.fan} val={t.fan} /> : null}
      </At>

      <At x={30} y={181} style={{ ...value, fontSize: 9.5 * S, letterSpacing: 3 * S }}>{t2.venue}</At>
      <At x={30} y={211} w={400} style={{ fontFamily: "Jost", fontSize: 7 * S, color: INK, opacity: 0.75 }}>
        {t2.smallPrint}
      </At>

      {/* Stub */}
      <At x={STUB_X} y={30} w={W - STUB_X} style={{ flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...value, fontWeight: 600, fontSize: 14 * S, letterSpacing: 3 * S }}>{t2.admit}</div>
        <div style={{ ...label, fontSize: 9 * S, letterSpacing: 3 * S, marginTop: 2 * S }}>{t2.reserve}</div>
        <div style={{ ...label, fontSize: 7.5 * S, letterSpacing: 1.6 * S, marginTop: 20 * S }}>{t2.squad}</div>
        <div style={{ ...value, fontWeight: 600, fontSize: 34 * S, lineHeight: 1.1 }}>{t.squad}</div>
      </At>
      <At x={STUB_X} y={193} w={W - STUB_X} style={{ justifyContent: "center", ...label, fontSize: 6.5 * S, letterSpacing: 2 * S }}>
        {`${t2.barcodeCaption} · ${t.squad}`}
      </At>
    </div>
  );
}
