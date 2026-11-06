// Server wrapper: feeds the shared ticket layout its paper and wordmark for next/og.
import { readFileSync } from "node:fs";
import path from "node:path";
import { paperSvg } from "./paper";
import { TicketLayout, type TicketData } from "./TicketLayout";

export type { TicketData } from "./TicketLayout";

// Grid's horizontal "The ALFIE ★" in forest green (made by scripts/prepare-logos.mjs).
const WORDMARK = `data:image/png;base64,${readFileSync(path.join(process.cwd(), "src/ticket/alfie-wordmark.png")).toString("base64")}`;

export function Ticket({ t }: { t: TicketData }) {
  const paper = `data:image/svg+xml;base64,${Buffer.from(paperSvg(t.squadNumber)).toString("base64")}`;
  return <TicketLayout t={t} paper={paper} wordmark={WORDMARK} />;
}
