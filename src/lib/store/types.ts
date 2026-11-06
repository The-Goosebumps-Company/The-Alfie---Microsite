import type { FanType, Sport } from "@/config";

export type NewRegistration = {
  firstName: string;
  surname: string;
  email: string;
  mobile: string | null;
  dateOfBirth: string;
  sports: Sport[];
  fanType: FanType | null;
  fanAudience: string | null;
  emailOptIn: boolean;
  whatsappOptIn: boolean;
  consentTextVersion: string;
  consentAt: string;
  source: string;
  box: string | null;
  userAgent: string | null;
};

export type Registration = NewRegistration & {
  id: string;
  squadNumber: number;
  createdAt: string;
};

export interface RegistrationStore {
  /** Inserts, or returns the existing row when the email is already on the bench. */
  create(reg: NewRegistration): Promise<{ registration: Registration; existing: boolean }>;
  get(id: string): Promise<Registration | null>;
}
