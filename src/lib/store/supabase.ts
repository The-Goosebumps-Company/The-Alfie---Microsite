// Production store. Uses the service-role key, so it must only ever run on the server.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NewRegistration, Registration, RegistrationStore } from "./types";

type Row = {
  id: string;
  squad_number: number;
  first_name: string;
  surname: string;
  email: string;
  mobile: string | null;
  date_of_birth: string;
  sports: string[];
  fan_type: Registration["fanType"];
  email_opt_in: boolean;
  whatsapp_opt_in: boolean;
  consent_text_version: string;
  consent_at: string;
  source: string;
  box: string | null;
  user_agent: string | null;
  created_at: string;
};

const fromRow = (r: Row): Registration => ({
  id: r.id,
  squadNumber: r.squad_number,
  firstName: r.first_name,
  surname: r.surname,
  email: r.email,
  mobile: r.mobile,
  dateOfBirth: r.date_of_birth,
  sports: r.sports,
  fanType: r.fan_type,
  emailOptIn: r.email_opt_in,
  whatsappOptIn: r.whatsapp_opt_in,
  consentTextVersion: r.consent_text_version,
  consentAt: r.consent_at,
  source: r.source,
  box: r.box,
  userAgent: r.user_agent,
  createdAt: r.created_at,
});

let client: SupabaseClient | null = null;
function db(): SupabaseClient {
  client ??= createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  return client;
}

export const supabaseStore: RegistrationStore = {
  async create(reg: NewRegistration) {
    const { data, error } = await db()
      .from("registrations")
      .insert({
        first_name: reg.firstName,
        surname: reg.surname,
        email: reg.email,
        mobile: reg.mobile,
        date_of_birth: reg.dateOfBirth,
        sports: reg.sports,
        fan_type: reg.fanType,
        email_opt_in: reg.emailOptIn,
        whatsapp_opt_in: reg.whatsappOptIn,
        consent_text_version: reg.consentTextVersion,
        consent_at: reg.consentAt,
        source: reg.source,
        box: reg.box,
        user_agent: reg.userAgent,
      })
      .select()
      .single<Row>();
    if (!error) return { registration: fromRow(data), existing: false };
    if (error.code !== "23505") throw error; // anything but a duplicate email
    const existing = await db().from("registrations").select().eq("email", reg.email).single<Row>();
    if (existing.error) throw existing.error;
    return { registration: fromRow(existing.data), existing: true };
  },
  async get(id) {
    const { data, error } = await db().from("registrations").select().eq("id", id).maybeSingle<Row>();
    if (error) throw error;
    return data ? fromRow(data) : null;
  },
};
