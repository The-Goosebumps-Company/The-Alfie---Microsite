// The ticket's paper as one SVG: cream stock, guilloche security lines, a faint pitch
// watermark, green rules, the perforation with notches and a decorative barcode.
// Drawn on a 600 × 240 grid; text is laid over it in Ticket.tsx.

export const W = 600;
export const H = 240;
export const STUB_X = 450;
const NOTCH = 11;

// Alfie palette from Grid's brand deck.
export const INK = "#003a2a"; // forest: names, values, guilloche
export const ACCENT = "#005a42"; // emerald: labels, rules, perforation
export const PAPER = "#F0E8D4";

const f = (n: number) => n.toFixed(1);

function wave(y0: number, phase: number): string {
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 6) {
    pts.push(`${x},${f(y0 + 5 * Math.sin(x / 34 + phase) + 2 * Math.sin(x / 11 + phase * 2))}`);
  }
  return `M${pts.join("L")}`;
}

function guilloche(): string {
  const paths: string[] = [];
  for (let k = 0; k < 17; k++) {
    const y0 = 6 + k * 14;
    paths.push(wave(y0, k * 0.6), wave(y0, k * 0.6 + Math.PI));
  }
  return `<g fill="none" stroke="${INK}" stroke-width="0.45" opacity="0.08">${paths
    .map((d) => `<path d="${d}"/>`)
    .join("")}</g>`;
}

function pitchWatermark(): string {
  const x0 = 34, y0 = 30, w = 384, h = 180;
  const at = (p: number) => f(x0 + (w * p) / 100);
  const solid = [22, 50, 78].map((p) => `<line x1="${at(p)}" y1="${y0}" x2="${at(p)}" y2="${y0 + h}"/>`);
  const dashed = [40, 60].map(
    (p) => `<line x1="${at(p)}" y1="${y0}" x2="${at(p)}" y2="${y0 + h}" stroke-dasharray="5 5"/>`,
  );
  return `<g fill="none" stroke="${INK}" stroke-width="1" opacity="0.07">
    <rect x="${x0}" y="${y0}" width="${w}" height="${h}"/>${solid.join("")}${dashed.join("")}</g>`;
}

/** Decorative only: bar widths come from the squad number, nothing encodes or scans. */
function barcode(seed: number): string {
  let s = (seed * 2654435761) >>> 0 || 1;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const bars: string[] = [];
  for (let x = 470; x < 580; ) {
    const w = [1, 1, 1.5, 2, 3][Math.floor(rand() * 5)];
    if (x + w > 580) break;
    bars.push(`<rect x="${f(x)}" y="152" width="${w}" height="36"/>`);
    x += w + [1, 1.5, 2, 2.5][Math.floor(rand() * 4)];
  }
  return `<g fill="${INK}">${bars.join("")}</g>`;
}

export function paperSvg(squadNumber: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 2}" height="${H * 2}" viewBox="0 0 ${W} ${H}">
  <defs>
    <mask id="notches">
      <rect width="${W}" height="${H}" fill="#fff"/>
      <circle cx="${STUB_X}" cy="0" r="${NOTCH}" fill="#000"/>
      <circle cx="${STUB_X}" cy="${H}" r="${NOTCH}" fill="#000"/>
    </mask>
    <clipPath id="card"><rect width="${W}" height="${H}" rx="10"/></clipPath>
  </defs>
  <g mask="url(#notches)">
    <g clip-path="url(#card)">
      <rect width="${W}" height="${H}" fill="${PAPER}"/>
      ${guilloche()}
      ${pitchWatermark()}
    </g>
    <rect x="7" y="7" width="${W - 14}" height="${H - 14}" rx="6" fill="none" stroke="${ACCENT}" stroke-opacity="0.45" stroke-width="0.9"/>
    <line x1="30" y1="114" x2="420" y2="114" stroke="${ACCENT}" stroke-opacity="0.5" stroke-width="0.8"/>
    <line x1="30" y1="170" x2="420" y2="170" stroke="${ACCENT}" stroke-opacity="0.5" stroke-width="0.8"/>
    <line x1="${STUB_X}" y1="${NOTCH + 6}" x2="${STUB_X}" y2="${H - NOTCH - 6}" stroke="${ACCENT}" stroke-opacity="0.6" stroke-width="1.2" stroke-dasharray="4 4"/>
    ${barcode(squadNumber)}
  </g>
</svg>`;
}
