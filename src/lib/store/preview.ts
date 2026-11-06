// Preview store: saves nothing. The ticket's details travel in its id as a signed token,
// so the success screen and ticket PNG work on any server instance without a database.
import { createHash, timingSafeEqual } from "node:crypto";
import { sign } from "@/lib/ageCookie";
import type { NewRegistration, Registration, RegistrationStore } from "./types";

type Payload = Pick<Registration, "firstName" | "surname" | "squadNumber" | "fanType">;

function encode(p: Payload): string {
  const body = Buffer.from(JSON.stringify(p)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string): Payload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export const previewStore: RegistrationStore = {
  async create(reg: NewRegistration) {
    // A stable made-up squad number, so the same email always gets the same ticket.
    const squadNumber = (createHash("sha256").update(reg.email).digest().readUInt16BE(0) % 9000) + 1000;
    const payload: Payload = { firstName: reg.firstName, surname: reg.surname, squadNumber, fanType: reg.fanType };
    const registration: Registration = { ...reg, id: encode(payload), squadNumber, createdAt: new Date().toISOString() };
    return { registration, existing: false };
  },
  async get(id) {
    const p = decode(id);
    if (!p) return null;
    return {
      ...p,
      id,
      email: "",
      mobile: null,
      dateOfBirth: "",
      sports: [],
      emailOptIn: false,
      whatsappOptIn: false,
      consentTextVersion: "",
      consentAt: "",
      source: "preview",
      box: null,
      userAgent: null,
      createdAt: "",
    };
  },
};
