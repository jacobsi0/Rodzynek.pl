import { useEffect, useState } from "react";
import { ChevronDown, Puzzle, Smartphone } from "lucide-react";
import { publicContent, type Locale } from "@/lib/public-content";
import { SectionLabel, SectionTitle } from "./shell";

const getAvailabilityTextPl = (remaining: number) => {
  if (remaining === 0) {
    return "Brak wolnych miejsc na warsztaty w nadchodzącym roku szkolnym (26-27).";
  }
  if (remaining === 1) {
    return "Pozostało 1 miejsce na warsztaty w nadchodzącym roku szkolnym (26-27).";
  }
  if (remaining >= 2 && remaining <= 4) {
    return `Pozostały ${remaining} miejsca na warsztaty w nadchodzącym roku szkolnym (26-27).`;
  }
  return `Pozostało ${remaining} miejsc na warsztaty w nadchodzącym roku szkolnym (26-27).`;
};

const getAvailabilityTextEn = (remaining: number) => {
  if (remaining === 0) {
    return "No spots left for workshops in the upcoming school year (26-27).";
  }
  if (remaining === 1) {
    return "Only 1 spot left for workshops in the upcoming school year (26-27).";
  }
  return `Only ${remaining} spots left for workshops in the upcoming school year (26-27).`;
};

export function Workshops({ locale = "pl" }: { locale?: Locale }) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [bookedCount, setBookedCount] = useState<number | null>(null);
  
  const t = publicContent[locale].workshops;
  const icons = [<Puzzle className="h-6 w-6" />, <Smartphone className="h-6 w-6" />];
  const accents = ["bg-clay", "bg-clay"] as const;

  const toggleExpanded = (index: number) => {
    setExpanded((current) => ({ ...current, [index]: !current[index] }));
  };

  useEffect(() => {
    let active = true;
    fetch("/api/availability")
      .then((res) => res.json())
      .then((data) => {
        if (active && typeof data.bookedCount === "number") {
          setBookedCount(data.bookedCount);
        }
      })
      .catch((err) => console.error("Failed to load availability", err));
    return () => {
      active = false;
    };
  }, []);

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
          <p className="mt-5 text-xl font-semibold leading-relaxed text-clay">
            {bookedCount !== null
              ? (locale === "pl"
                  ? getAvailabilityTextPl(Math.max(0, 4 - bookedCount))
                  : getAvailabilityTextEn(Math.max(0, 4 - bookedCount)))
              : t.availabilityNotice}
          </p>

          {/* Wizualny tracker slotów */}
          <div className="reveal mt-8 flex flex-wrap justify-center gap-3">
            {Array.from({ length: 4 }).map((_, idx) => {
              const isBooked = bookedCount !== null ? idx < bookedCount : idx < 1;
              return (
                <div
                  key={idx}
                  className={`flex h-14 w-full max-w-[210px] items-center justify-between rounded-2xl border px-4 py-3 shadow-soft transition-all duration-300 md:h-16 ${
                    isBooked
                      ? "border-clay/20 bg-clay-soft/40 text-clay"
                      : "border-dashed border-border bg-card text-muted-foreground hover:border-clay/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-6.5 w-6.5 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        isBooked
                          ? "bg-clay text-primary-foreground"
                          : "bg-sand text-ink-soft dark:bg-sand/20"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {isBooked
                        ? (locale === "pl" ? "Zajęte" : "Booked")
                        : (locale === "pl" ? "Wolne" : "Available")}
                    </span>
                  </div>
                  {isBooked ? (
                    <div className="h-2 w-2 rounded-full bg-clay animate-pulse" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-border" />
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-lg font-medium leading-relaxed text-muted-foreground">
            {t.capacityNotice}
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
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
