import { Check, HeartHandshake, MessageCircle, Users } from "lucide-react";
import { getHomeSectionHref, publicContent, type Locale } from "@/lib/public-content";
import { SectionLabel, SectionTitle } from "./shell";

export function Projekt({ locale = "pl" }: { locale?: Locale }) {
  const t = publicContent[locale].project;
  const icons = [
    <Users className="h-5 w-5" />,
    <HeartHandshake className="h-5 w-5" />,
    <MessageCircle className="h-5 w-5" />,
  ];

  return (
    <section className="bg-background pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto grid max-w-7xl items-start gap-16 px-6 md:grid-cols-[1fr_1.15fr] md:px-10">
        <div className="reveal">
          <SectionLabel>{t.label}</SectionLabel>
          <SectionTitle>
            {t.titleBefore}
            <em className="italic text-clay">{t.titleEmphasis}</em>
          </SectionTitle>
          <div className="mt-5 space-y-5 text-lg leading-relaxed text-muted-foreground text-pretty">
            {t.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <a
            href={getHomeSectionHref(locale, "contact")}
            className="mt-8 inline-flex rounded-full bg-clay px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-elev"
          >
            {t.cta}
          </a>
        </div>

        <div className="reveal grid gap-6">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
            <SectionLabel>{t.approachLabel}</SectionLabel>
            <ul className="mt-5 grid gap-4">
              {t.approach.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-clay text-primary-foreground">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-base text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {t.actions.map(([name, desc], i) => (
              <div
                key={name}
                className="rounded-2xl border border-border bg-card p-5 transition hover:border-clay hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-clay-soft text-clay">
                  {icons[i]}
                </div>
                <h3 className="mt-4 font-semibold leading-tight">{name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl bg-ink p-7 text-warm shadow-elev dark:bg-[#16110f] dark:text-[#f4ead8]">
            <SectionLabel className="text-honey">{t.whatLabel}</SectionLabel>
            <p className="mt-4 text-lg leading-relaxed text-warm/80 text-pretty dark:text-[#f4ead8]/80">
              {t.whatBody}
            </p>
            {t.closing && (
              <p className="mt-5 font-display text-2xl font-light italic leading-snug text-warm dark:text-[#f4ead8]">
                {t.closing}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
