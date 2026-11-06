// The ticket PNG is drawn on the server and needs TTF/OTF files (Satori can't read woff2).
// They live in src/fonts/ticket; swap them for Grid's files alongside src/fonts/index.ts.
import { readFile } from "node:fs/promises";
import path from "node:path";

type Weight = 400 | 500 | 600;
const FILES: { name: string; weight: Weight; file: string }[] = [
  { name: "Cormorant Garamond", weight: 500, file: "cormorant-500.ttf" },
  { name: "Oswald", weight: 500, file: "oswald-500.ttf" },
  { name: "Oswald", weight: 600, file: "oswald-600.ttf" },
  { name: "Jost", weight: 400, file: "jost-400.ttf" },
];

const DIR = path.join(process.cwd(), "src", "fonts", "ticket");
let cache: ReturnType<typeof load> | null = null;

function load() {
  return Promise.all(
    FILES.map(async ({ name, weight, file }) => ({
      name,
      weight,
      style: "normal" as const,
      data: await readFile(path.join(DIR, file)),
    })),
  );
}

export function ticketFonts() {
  cache ??= load();
  return cache;
}
