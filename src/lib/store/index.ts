import { isPreviewMode } from "@/lib/previewMode";
import { localStore } from "./local";
import { previewStore } from "./preview";
import { supabaseStore } from "./supabase";
import type { RegistrationStore } from "./types";

export function getStore(): RegistrationStore {
  if (isPreviewMode) return previewStore;
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return supabaseStore;
  if (process.env.VERCEL) throw new Error("Supabase is not configured");
  return localStore;
}

export type { Registration } from "./types";
