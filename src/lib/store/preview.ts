// Preview store: saves nothing, so the team link needs no database.
import { createHash, randomUUID } from "node:crypto";
import type { NewRegistration, RegistrationStore } from "./types";

export const previewStore: RegistrationStore = {
  async create(reg: NewRegistration) {
    // A stable made-up reserve number, so the same email always gets the same number.
    const squadNumber = (createHash("sha256").update(reg.email).digest().readUInt16BE(0) % 9500) + 500; // 500–9999
    return { registration: { ...reg, id: randomUUID(), squadNumber, createdAt: new Date().toISOString() }, existing: false };
  },
};
