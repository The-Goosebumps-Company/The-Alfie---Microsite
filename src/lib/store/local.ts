// Development store: a JSON file in .data/. Not for production (Vercel's disk is read-only).
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { NewRegistration, Registration, RegistrationStore } from "./types";

const FILE = path.join(process.cwd(), ".data", "registrations.json");
let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Registration[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

// Writes go one at a time so squad numbers never collide.
function serial<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

export const localStore: RegistrationStore = {
  create(reg: NewRegistration) {
    return serial(async () => {
      const rows = await load();
      const found = rows.find((r) => r.email === reg.email);
      if (found) return { registration: found, existing: true };
      const registration: Registration = {
        ...reg,
        id: randomUUID(),
        squadNumber: rows.reduce((max, r) => Math.max(max, r.squadNumber), 0) + 1,
        createdAt: new Date().toISOString(),
      };
      rows.push(registration);
      await mkdir(path.dirname(FILE), { recursive: true });
      await writeFile(FILE, JSON.stringify(rows, null, 2));
      return { registration, existing: false };
    });
  },
};
