// Form validation shared by the browser (instant feedback) and the server (the real check).
import { COUNTRY_CODES, FAN_TYPES, SPORTS, type FanType, type Sport } from "@/config";
import { toE164 } from "./phone";

export type FormInput = {
  firstName: string;
  surname: string;
  email: string;
  countryCode: string;
  mobile: string;
  sports: string[];
  fanType: string | null;
  emailOptIn: boolean;
  whatsappOptIn: boolean;
};

export type FieldKey = "firstName" | "surname" | "email" | "mobile";
export type FieldError = "required" | "email" | "mobile" | "name";
export type Errors = Partial<Record<FieldKey, FieldError>>;

export type CleanForm = {
  firstName: string;
  surname: string;
  email: string;
  mobile: string | null;
  sports: Sport[];
  fanType: FanType | null;
  emailOptIn: boolean;
  whatsappOptIn: boolean;
};

const NAME = /^[\p{L}\p{M}][\p{L}\p{M}' .\-’]{0,59}$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function tidyName(v: unknown): string {
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "";
}

export function validateForm(input: Partial<FormInput>): { errors: Errors; data?: CleanForm } {
  const errors: Errors = {};

  const firstName = tidyName(input.firstName);
  const surname = tidyName(input.surname);
  if (!firstName) errors.firstName = "required";
  else if (!NAME.test(firstName)) errors.firstName = "name";
  if (!surname) errors.surname = "required";
  else if (!NAME.test(surname)) errors.surname = "name";

  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!email) errors.email = "required";
  else if (email.length > 254 || !EMAIL.test(email)) errors.email = "email";

  let mobile: string | null = null;
  const rawMobile = typeof input.mobile === "string" ? input.mobile.trim() : "";
  if (rawMobile) {
    const cc = COUNTRY_CODES.some((c) => c.code === input.countryCode) ? input.countryCode! : "+27";
    mobile = toE164(cc, rawMobile);
    if (!mobile) errors.mobile = "mobile";
  }

  const sports = Array.isArray(input.sports)
    ? SPORTS.filter((s) => input.sports!.includes(s))
    : [];
  const fanType = FAN_TYPES.find((f) => f === input.fanType) ?? null;

  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    data: {
      firstName,
      surname,
      email,
      mobile,
      sports,
      fanType,
      emailOptIn: input.emailOptIn === true,
      whatsappOptIn: input.whatsappOptIn === true && mobile !== null,
    },
  };
}
