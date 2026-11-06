import { localStore } from "./local";
import { supabaseStore } from "./supabase";
import type { RegistrationStore } from "./types";

export function getStore(): RegistrationStore {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return supabaseStore;
  if (process.env.VERCEL) throw new Error("Supabase is not configured");
  return localStore;
}

export type { Registration } from "./types";
