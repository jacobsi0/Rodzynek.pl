import { useState } from "react";
import { ChevronDown, MicVocal, Puzzle, Smartphone } from "lucide-react";
import { publicContent, type Locale } from "@/lib/public-content";
import { SectionLabel, SectionTitle } from "./shell";

export function Workshops({ locale = "pl" }: { locale?: Locale }) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const t = publicContent[locale].workshops;
  const icons = [
    <Puzzle className="h-6 w-6" />,
    <MicVocal className="h-6 w-6" />,
    <Smartphone className="h-6 w-6" />,
  ];
  const accents = ["bg-clay", "bg-honey", "bg-ink dark:bg-[#16110f]"] as const;

  const toggleExpanded = (index: number) => {
    setExpanded((current) => ({ ...current, [index]: !current[index] }));
  };

  return (
    <section className="bg-warm pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="reveal mx-auto max-w-2xl text-center">
          <SectionLabel center>{t.label}</SectionLabel>
          <SectionTitle center>
            {t.titleBefore}
            <em className="italic text-clay">{t.titleEmphasis}</em>
          </SectionTitle>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.intro.before}
            <em>{t.intro.firstEmphasis}</em>
            {t.intro.middle}
            <em>{t.intro.secondEmphasis}</em>
            {t.intro.after}
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.items.map((workshop, i) => (
            <article
              key={workshop.title}
              className="reveal group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-elev"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className={`absolute inset-x-0 top-0 h-1 ${accents[i]}`} />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-clay-soft text-clay">
                {icons[i]}
              </div>
              <h3 className="mt-5 font-display text-xl font-bold leading-snug">{workshop.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{workshop.intro}</p>
              <div
                id={`workshop-details-${i}`}
                className={`grid transition-all duration-300 ${
                  expanded[i] ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                    {workshop.body?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {workshop.details && (
                      <div>
                        <p className="font-semibold text-foreground">{workshop.detailsTitle}</p>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {workshop.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {workshop.format && (
                      <p>
                        <span className="font-semibold text-foreground">{t.formatLabel}</span>{" "}
                        {workshop.format}
                      </p>
                    )}
                    {workshop.audience && (
                      <p className="rounded-2xl bg-clay-soft px-4 py-3 text-clay">
                        <span className="font-bold">{t.audienceLabel}</span> {workshop.audience}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                aria-expanded={expanded[i] ?? false}
                aria-controls={`workshop-details-${i}`}
                onClick={() => toggleExpanded(i)}
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-clay transition hover:border-clay hover:bg-clay-soft"
              >
                {expanded[i] ? t.showLess : t.showMore}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${expanded[i] ? "rotate-180" : ""}`}
                />
              </button>
              {workshop.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {workshop.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
