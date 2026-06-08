import { HeartHandshake, MessageCircle, Quote, Users } from "lucide-react";
import { publicContent, type Locale } from "@/lib/public-content";
import { SectionLabel, SectionTitle } from "./shell";

export function About({ locale = "pl" }: { locale?: Locale }) {
  const t = publicContent[locale].about;
  const icons = [
    <Users className="h-5 w-5" />,
    <MessageCircle className="h-5 w-5" />,
    <HeartHandshake className="h-5 w-5" />,
  ];

  return (
    <section className="bg-background pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto grid max-w-7xl items-start gap-16 px-6 md:grid-cols-[0.95fr_1.05fr] md:px-10">
        <div className="reveal relative">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-9 text-warm shadow-elev dark:bg-[#16110f] dark:text-[#f4ead8]">
            <Quote className="absolute right-6 top-6 h-16 w-16 text-warm/5 dark:text-[#f4ead8]/5" />
            <p className="font-display text-2xl font-light italic leading-snug text-warm/95 dark:text-[#f4ead8]/95 md:text-[1.7rem]">
              {t.quoteTitle}
            </p>
            <p className="mt-5 text-base leading-relaxed text-warm/75 dark:text-[#f4ead8]/75">
              {t.quoteBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {t.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-warm/15 bg-warm/10 px-3.5 py-1 text-xs font-semibold text-warm/85 dark:border-[#f4ead8]/15 dark:bg-[#f4ead8]/10 dark:text-[#f4ead8]/85"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5 rounded-3xl border border-border bg-card p-7 shadow-soft">
            <SectionLabel>{t.whyLabel}</SectionLabel>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.whyBody}</p>
          </div>
        </div>

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
          <div className="mt-8 grid gap-3">
            {t.highlights.map(([name, desc], i) => (
              <div
                key={name}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:border-clay hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-clay-soft text-clay transition group-hover:bg-clay group-hover:text-primary-foreground">
                    {icons[i]}
                  </div>
                  <div>
                    <h3 className="font-semibold">{name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
