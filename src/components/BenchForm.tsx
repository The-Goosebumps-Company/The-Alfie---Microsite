"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COUNTRY_CODES, FAN_TYPES, config, type FanType } from "@/config";
import { copy } from "@/copy";
import { register } from "@/lib/client/api";
import { suggestEmail } from "@/lib/emailTypos";
import { validateForm, type Errors, type FieldKey, type FormInput } from "@/lib/validate";
import { Hero } from "./Hero";
import { SportsTiles } from "./SportsTiles";
import { Success, type Reserve } from "./Success";

const ORDER: FieldKey[] = ["firstName", "surname", "email", "mobile"];

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="field-label">
      {children}
    </label>
  );
}

function ErrorText({ id, error }: { id: string; error?: string | null }) {
  return (
    <p id={id} aria-live="polite" className={`text-[14px] text-alert ${error ? "mt-2" : ""}`}>
      {error}
    </p>
  );
}

export function BenchForm({ src, box }: { src: string; box: string | null }) {
  const router = useRouter();
  const [v, setV] = useState<FormInput>({
    firstName: "",
    surname: "",
    email: "",
    countryCode: "+27",
    mobile: "",
    sports: [],
    fanType: null,
    emailOptIn: false,
    whatsappOptIn: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ reserve: Reserve; existing: boolean } | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (result) return <Success reserve={result.reserve} existing={result.existing} />;

  const set = <K extends keyof FormInput>(key: K, value: FormInput[K]) => {
    setV((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "mobile" && !String(value).trim()) next.whatsappOptIn = false;
      return next;
    });
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
    if (key === "email") setNotice(null);
  };

  const message = (k: FieldKey) => {
    const e = errors[k];
    return e ? (e === "required" ? copy.errors.required : copy.errors[e]) : null;
  };

  const focusFirst = (errs: Errors) => {
    const first = ORDER.find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setNotice(null);
    const check = validateForm(v);
    if (!check.data) {
      setErrors(check.errors);
      focusFirst(check.errors);
      return;
    }

    setBusy(true);
    try {
      const json = await register({ ...v, src, box, website: honeypot.current?.value ?? "" });
      if (json.ok && json.reserve) {
        setResult({ reserve: json.reserve, existing: !!json.existing });
        window.scrollTo({ top: 0 });
      } else if (json.ok) {
        setNotice(copy.errors.already);
      } else if (json.error === "age") {
        router.refresh();
      } else if (json.errors) {
        setErrors(json.errors);
        focusFirst(json.errors);
      } else {
        setServerError(json.error === "tooMany" ? copy.errors.tooMany : copy.errors.server);
      }
    } catch {
      setServerError(copy.errors.server);
    } finally {
      setBusy(false);
    }
  }

  const hasMobile = v.mobile.trim().length > 0;

  return (
    <>
      <Hero />

      {/* The green block, in the deck's signature gradient. */}
      <form ref={formRef} onSubmit={submit} noValidate className="panel mt-7 px-5 pb-8 pt-7">
        <div className="grid gap-6">
          <div>
            <Label htmlFor="firstName">{copy.form.firstName}</Label>
            <input id="firstName" name="firstName" autoComplete="given-name" value={v.firstName}
              onChange={(e) => set("firstName", e.target.value)} aria-invalid={!!errors.firstName}
              aria-describedby="firstName-error" className="field" />
            <ErrorText id="firstName-error" error={message("firstName")} />
          </div>

          <div>
            <Label htmlFor="surname">{copy.form.surname}</Label>
            <input id="surname" name="surname" autoComplete="family-name" value={v.surname}
              onChange={(e) => set("surname", e.target.value)} aria-invalid={!!errors.surname}
              aria-describedby="surname-error" className="field" />
            <ErrorText id="surname-error" error={message("surname")} />
          </div>

          <div>
            <Label htmlFor="email">{copy.form.email}</Label>
            <input id="email" name="email" type="email" inputMode="email" autoComplete="email"
              autoCapitalize="none" spellCheck={false} placeholder={copy.form.emailPlaceholder}
              value={v.email} onChange={(e) => { set("email", e.target.value); setSuggestion(null); }}
              onBlur={() => setSuggestion(suggestEmail(v.email.trim()))} aria-invalid={!!errors.email}
              aria-describedby="email-error" className="field" />
            <ErrorText id="email-error" error={message("email") ?? notice} />
            {suggestion && !errors.email && (
              <button type="button" onClick={() => { set("email", suggestion); setSuggestion(null); }}
                className="mt-1 min-h-11 text-left text-[15px] text-white underline decoration-mint underline-offset-4">
                {copy.errors.suggestion(suggestion)}
              </button>
            )}
          </div>

          <div>
            <Label htmlFor="mobile">{copy.form.mobile}</Label>
            <div className="flex gap-2">
              <select aria-label={copy.form.countryCode} value={v.countryCode}
                onChange={(e) => set("countryCode", e.target.value)}
                className="field w-[104px] shrink-0 px-2 text-[15px] [&>option]:text-ink">
                {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
              <input id="mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel-national"
                placeholder={copy.form.mobilePlaceholder} value={v.mobile}
                onChange={(e) => set("mobile", e.target.value)} aria-invalid={!!errors.mobile}
                aria-describedby="mobile-error" className="field" />
            </div>
            <ErrorText id="mobile-error" error={message("mobile")} />
          </div>

          <SportsTiles value={v.sports} onChange={(next) => set("sports", next)} />

          {/* Laid out like the deck's "The elevated sports fan" page. */}
          <fieldset>
            {/* A legend must be the fieldset's first child, so the script heading lives inside it. */}
            <legend className="w-full">
              <span aria-hidden className="script-heading mb-1 block text-[34px] text-white">{copy.fanSection.heading}</span>
              <span className="field-label">{copy.form.fanType}</span>
            </legend>
            <div className="grid gap-2">
              {FAN_TYPES.map((f: FanType, i) => {
                const on = v.fanType === f;
                return (
                  <button key={f} type="button" aria-pressed={on} onClick={() => set("fanType", on ? null : f)}
                    className={`flex items-start gap-3 rounded-[12px] border px-4 py-3.5 text-left transition ${
                      on ? "border-mint bg-white/10" : "border-white/25 hover:border-white/60"
                    }`}>
                    <span aria-hidden className={`w-6 shrink-0 font-script text-[26px] leading-none ${on ? "text-mint" : "text-white/80"}`}>
                      {i + 1}.
                    </span>
                    <span>
                      <span className="block font-heading text-[17px] uppercase leading-tight tracking-[0.08em] text-white">
                        {copy.fanTypes[f].title}
                      </span>
                      <span className={`mt-1 block text-[14px] leading-snug ${on ? "text-mint" : "text-white/70"}`}>{copy.fanTypes[f].line}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-1">
            <label className="flex min-h-12 cursor-pointer items-start gap-3 py-1">
              <input type="checkbox" checked={v.emailOptIn} onChange={(e) => set("emailOptIn", e.target.checked)}
                className="check mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded-[6px] border border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint/60" />
              <span className="text-[15px] leading-snug text-white/90">{copy.form.emailOptIn}</span>
            </label>
            {hasMobile && (
              <label className="flex min-h-12 cursor-pointer items-start gap-3 py-1">
                <input type="checkbox" checked={v.whatsappOptIn} onChange={(e) => set("whatsappOptIn", e.target.checked)}
                  className="check mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded-[6px] border border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint/60" />
                <span className="text-[15px] leading-snug text-white/90">{copy.form.whatsappOptIn}</span>
              </label>
            )}
          </div>

          {/* Honeypot: hidden from people and screen readers. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Website<input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>

          <p className="text-[13px] leading-relaxed text-white/70">
            {copy.form.privacyBefore}
            <Link href={config.privacyUrl} className="text-white underline decoration-mint/60 underline-offset-2">{copy.form.privacyLink}</Link>
            {copy.form.privacyAnd}
            <Link href={config.termsUrl} className="text-white underline decoration-mint/60 underline-offset-2">{copy.form.termsLink}</Link>
            {copy.form.privacyAfter}
          </p>

          {serverError && <p role="alert" className="text-[14px] text-alert">{serverError}</p>}

          <button type="submit" disabled={busy} aria-busy={busy} className="btn">
            {busy ? copy.form.loading : copy.form.button}
          </button>
        </div>
      </form>
    </>
  );
}
