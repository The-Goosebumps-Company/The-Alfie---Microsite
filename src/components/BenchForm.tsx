"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COUNTRY_CODES, FAN_TYPES, SPORTS, config, type FanType } from "@/config";
import { copy } from "@/copy";
import { suggestEmail } from "@/lib/emailTypos";
import { validateForm, type Errors, type FieldKey, type FormInput } from "@/lib/validate";
import { Hero } from "./Hero";
import { Success, type TicketResult } from "./Success";

const ORDER: FieldKey[] = ["firstName", "surname", "email", "mobile"];

const inputClass = (bad: boolean) =>
  `h-[52px] w-full rounded-md border bg-deep/80 px-4 text-[17px] text-cream placeholder:text-muted/45 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 ${
    bad ? "border-alert" : "border-gold/40"
  }`;

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-label text-[13px] font-medium uppercase tracking-[0.14em] text-gold">
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
  const [result, setResult] = useState<{ ticket: TicketResult; existing: boolean } | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (result) return <Success ticket={result.ticket} existing={result.existing} />;

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

  const toggleSport = (s: string) =>
    set("sports", v.sports.includes(s) ? v.sports.filter((x) => x !== s) : [...v.sports, s]);

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
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, src, box, website: honeypot.current?.value ?? "" }),
      });
      const json = await res.json().catch(() => ({ ok: false, error: "server" }));
      if (json.ok && json.ticket) {
        setResult({ ticket: json.ticket, existing: json.existing });
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

      {/* The dugout: the form sits along the touchline. */}
      <form
        ref={formRef}
        onSubmit={submit}
        noValidate
        className="relative -mx-3 mt-10 rounded-t-[28px] border border-b-0 border-gold/45 bg-deep/85 px-5 pb-7 pt-8 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] backdrop-blur-[2px]"
      >
        <span aria-hidden className="absolute inset-x-8 top-0 h-[2px] -translate-y-px bg-gold" />

        <div className="grid gap-5">
          <div>
            <Label htmlFor="firstName">{copy.form.firstName}</Label>
            <input id="firstName" name="firstName" autoComplete="given-name" value={v.firstName}
              onChange={(e) => set("firstName", e.target.value)} aria-invalid={!!errors.firstName}
              aria-describedby="firstName-error" className={inputClass(!!errors.firstName)} />
            <ErrorText id="firstName-error" error={message("firstName")} />
          </div>

          <div>
            <Label htmlFor="surname">{copy.form.surname}</Label>
            <input id="surname" name="surname" autoComplete="family-name" value={v.surname}
              onChange={(e) => set("surname", e.target.value)} aria-invalid={!!errors.surname}
              aria-describedby="surname-error" className={inputClass(!!errors.surname)} />
            <ErrorText id="surname-error" error={message("surname")} />
          </div>

          <div>
            <Label htmlFor="email">{copy.form.email}</Label>
            <input id="email" name="email" type="email" inputMode="email" autoComplete="email"
              autoCapitalize="none" spellCheck={false} placeholder={copy.form.emailPlaceholder}
              value={v.email} onChange={(e) => { set("email", e.target.value); setSuggestion(null); }}
              onBlur={() => setSuggestion(suggestEmail(v.email.trim()))} aria-invalid={!!errors.email}
              aria-describedby="email-error" className={inputClass(!!errors.email)} />
            <ErrorText id="email-error" error={message("email") ?? notice} />
            {suggestion && !errors.email && (
              <button type="button" onClick={() => { set("email", suggestion); setSuggestion(null); }}
                className="mt-1 min-h-11 text-left text-[15px] text-cream underline decoration-gold underline-offset-4">
                {copy.errors.suggestion(suggestion)}
              </button>
            )}
          </div>

          <div>
            <Label htmlFor="mobile">{copy.form.mobile}</Label>
            <div className="flex gap-2">
              <select aria-label={copy.form.countryCode} value={v.countryCode}
                onChange={(e) => set("countryCode", e.target.value)}
                className="h-[52px] w-[104px] shrink-0 rounded-md border border-gold/40 bg-deep/80 px-2 font-label text-[15px] text-cream focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40">
                {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
              <input id="mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel-national"
                placeholder={copy.form.mobilePlaceholder} value={v.mobile}
                onChange={(e) => set("mobile", e.target.value)} aria-invalid={!!errors.mobile}
                aria-describedby="mobile-error" className={inputClass(!!errors.mobile)} />
            </div>
            <ErrorText id="mobile-error" error={message("mobile")} />
          </div>

          <fieldset>
            <legend className="mb-2 font-label text-[13px] font-medium uppercase tracking-[0.14em] text-gold">{copy.form.sports}</legend>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((s) => {
                const on = v.sports.includes(s);
                return (
                  <button key={s} type="button" aria-pressed={on} onClick={() => toggleSport(s)}
                    className={`h-12 rounded-full border px-5 font-label text-[15px] font-medium tracking-[0.06em] transition ${
                      on ? "border-gold bg-gold text-deep" : "border-gold/40 text-cream hover:border-gold"
                    }`}>
                    {s}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-label text-[13px] font-medium uppercase tracking-[0.14em] text-gold">{copy.form.fanType}</legend>
            <div className="grid grid-cols-2 gap-2">
              {FAN_TYPES.map((f: FanType) => {
                const on = v.fanType === f;
                return (
                  <button key={f} type="button" aria-pressed={on} onClick={() => set("fanType", on ? null : f)}
                    className={`flex min-h-[84px] flex-col justify-start rounded-lg border px-3 py-3 text-left transition ${
                      on ? "border-gold bg-gold/15" : "border-gold/30 hover:border-gold/70"
                    }`}>
                    <span className="block font-heading text-[21px] leading-tight text-cream">{copy.fanTypes[f].title}</span>
                    <span className="mt-1 block text-[13px] leading-snug text-muted">{copy.fanTypes[f].line}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-1">
            <label className="flex min-h-12 cursor-pointer items-start gap-3 py-1">
              <input type="checkbox" checked={v.emailOptIn} onChange={(e) => set("emailOptIn", e.target.checked)}
                className="check mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded border border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60" />
              <span className="text-[15px] leading-snug text-cream">{copy.form.emailOptIn}</span>
            </label>
            {hasMobile && (
              <label className="flex min-h-12 cursor-pointer items-start gap-3 py-1">
                <input type="checkbox" checked={v.whatsappOptIn} onChange={(e) => set("whatsappOptIn", e.target.checked)}
                  className="check mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded border border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60" />
                <span className="text-[15px] leading-snug text-cream">{copy.form.whatsappOptIn}</span>
              </label>
            )}
          </div>

          {/* Honeypot: hidden from people and screen readers. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Website<input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>

          <p className="text-[13px] leading-relaxed text-muted">
            {copy.form.privacyBefore}
            <Link href={config.privacyUrl} className="text-cream underline underline-offset-2">{copy.form.privacyLink}</Link>
            {copy.form.privacyAnd}
            <Link href={config.termsUrl} className="text-cream underline underline-offset-2">{copy.form.termsLink}</Link>
            {copy.form.privacyAfter}
          </p>

          {serverError && <p role="alert" className="text-[14px] text-alert">{serverError}</p>}

          <button type="submit" disabled={busy} aria-busy={busy}
            className="h-14 w-full rounded-md bg-gold font-label text-[16px] font-semibold uppercase tracking-[0.2em] text-deep transition hover:bg-[#d6b46d] focus:outline-none focus-visible:ring-2 focus-visible:ring-cream disabled:opacity-75">
            {busy ? copy.form.loading : copy.form.button}
          </button>
        </div>
      </form>
    </>
  );
}
