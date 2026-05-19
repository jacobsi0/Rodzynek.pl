import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, ArrowRight, Check, Loader2 } from "lucide-react";
import { publicContent, type Locale } from "@/lib/public-content";
import { SectionLabel } from "./shell";

function getContactSchema(locale: Locale) {
  const validation = publicContent[locale].contact.validation;
  return z.object({
    name: z.string().trim().min(2, validation.name).max(200),
    email: z.string().trim().email(validation.email).max(320),
    org: z.string().trim().min(2, validation.org).max(200),
    topic: z.string().trim().min(1).max(200),
    message: z.string().trim().max(4000).optional().or(z.literal("")),
    website: z.string().max(0, validation.spam).optional().or(z.literal("")),
  });
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-xl border bg-warm px-4 py-3 text-sm outline-none transition focus:bg-card focus-visible:ring-2 focus-visible:ring-ring/40 ${error ? "border-destructive focus:border-destructive" : "border-border focus:border-clay"}`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function Contact({ locale = "pl" }: { locale?: Locale }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const t = publicContent[locale].contact;
  const contactSchema = useMemo(() => getContactSchema(locale), [locale]);
  const infoIcons = [
    <Mail className="h-5 w-5" />,
    <MapPin className="h-5 w-5" />,
  ];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      org: String(fd.get("org") ?? ""),
      topic: String(fd.get("topic") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrs[key]) fieldErrs[key] = issue.message;
      }
      setErrors(fieldErrs);
      toast.error(t.toasts.invalidTitle, { description: t.toasts.invalidDescription });
      return;
    }

    if (parsed.data.website) {
      setStatus("sent");
      formRef.current?.reset();
      return;
    }

    setStatus("sending");
    let response: Response;
    try {
      response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          organization: parsed.data.org,
          topic: parsed.data.topic,
          message: parsed.data.message?.trim() ? parsed.data.message : null,
          website: parsed.data.website,
        }),
      });
    } catch (error) {
      console.error("contact submit network error", error);
      setStatus("idle");
      toast.error(t.toasts.errorTitle, {
        description: t.toasts.errorDescription,
      });
      return;
    }

    if (!response.ok) {
      let details: unknown;
      try {
        details = await response.json();
      } catch {
        details = await response.text().catch(() => undefined);
      }
      console.error("contact submit error", response.status, details);
      setStatus("idle");
      toast.error(t.toasts.errorTitle, {
        description: t.toasts.errorDescription,
      });
      return;
    }

    setStatus("sent");
    formRef.current?.reset();
    toast.success(t.toasts.successTitle, { description: t.toasts.successDescription });
    setTimeout(() => setStatus("idle"), 6000);
  };

  const sending = status === "sending";
  const sent = status === "sent";

  return (
    <section className="relative overflow-hidden bg-clay pt-32 pb-24 text-warm md:pt-40 md:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 right-[-2rem] select-none font-display text-[14rem] font-black leading-none tracking-tighter text-warm/[0.06] md:text-[18rem]"
      >
        Rodzynek
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-[1.1fr_1fr] md:px-10">
        <div>
          <SectionLabel className="text-warm/70">{t.label}</SectionLabel>
          <h1 className="mt-3 font-display text-4xl font-black leading-[1.05] tracking-tight text-balance md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-lg text-warm/80 text-pretty">{t.intro}</p>
          <ul className="mt-10 space-y-4">
            {t.info.map(([label, value], i) => (
              <li key={label} className="flex items-center gap-4">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-warm/15">
                  {infoIcons[i]}
                </div>
                <div>
                  <div className="text-xs text-warm/65">{label}</div>
                  {label === "E-mail" ? (
                    <a
                      href={`mailto:${value}`}
                      className="text-base font-semibold underline-offset-4 hover:underline"
                    >
                      {value}
                    </a>
                  ) : (
                    <div className="text-base font-semibold">{value}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          aria-label={t.formAria}
          noValidate
          className="rounded-3xl bg-card p-7 text-foreground shadow-elev md:p-9"
        >
          <h2 className="font-display text-xl font-bold">{t.formTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.responseTime}</p>
          <fieldset disabled={sending || sent} className="mt-6 grid gap-4 disabled:opacity-70">
            <Field
              label={t.fields.name[0]}
              name="name"
              placeholder={t.fields.name[1]}
              required
              error={errors.name}
            />
            <Field
              label={t.fields.email[0]}
              name="email"
              type="email"
              placeholder={t.fields.email[1]}
              required
              error={errors.email}
            />
            <Field
              label={t.fields.org[0]}
              name="org"
              placeholder={t.fields.org[1]}
              required
              error={errors.org}
            />
            <div>
              <label
                htmlFor="topic"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft"
              >
                {t.fields.topic}
              </label>
              <select
                id="topic"
                name="topic"
                defaultValue={t.options[0]}
                className="w-full rounded-xl border border-border bg-warm px-4 py-3 text-sm outline-none transition focus:border-clay focus:bg-card focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {t.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft"
              >
                {t.fields.message[0]}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full resize-none rounded-xl border border-border bg-warm px-4 py-3 text-sm outline-none transition focus:border-clay focus:bg-card focus-visible:ring-2 focus-visible:ring-ring/40"
                placeholder={t.fields.message[1]}
              />
              {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
            </div>
            <div aria-hidden className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
              <label htmlFor="website">{t.fields.website}</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <button
              type="submit"
              disabled={sending || sent}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-clay px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-100"
            >
              {sent ? (
                <>
                  <Check className="h-4 w-4" /> {t.buttons.sent}
                </>
              ) : sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t.buttons.sending}
                </>
              ) : (
                <>
                  {t.buttons.submit} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.privacy}</p>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
