import { PhoneCall, ShieldCheck, HeartHandshake, Lock, Clock } from "lucide-react";
import { publicContent, type Locale } from "@/lib/public-content";
import { SectionLabel, SectionTitle } from "./shell";

export function Helplines({ locale = "pl" }: { locale?: Locale }) {
  const t = publicContent[locale].helplines;

  return (
    <section className="relative overflow-hidden bg-warm py-20 md:py-28">
      {/* Subtelne tło dekoracyjne */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-clay-soft/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-honey/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="reveal mx-auto max-w-2xl text-center">
          <SectionLabel center>{t.badge}</SectionLabel>
          <SectionTitle center>
            {t.titleBefore}
            <em className="italic text-clay">{t.titleEmphasis}</em>
          </SectionTitle>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {t.subtitle}
          </p>

          {/* Cechy pomocy: Bezpłatnie, Anonimowo, 24/7 */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-ink-soft">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-soft">
              <ShieldCheck className="h-4 w-4 text-clay" />
              {t.features.free}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-soft">
              <Lock className="h-3.5 w-3.5 text-clay" />
              {t.features.anonymous}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-soft">
              <Clock className="h-3.5 w-3.5 text-clay" />
              {t.features.available247}
            </span>
          </div>
        </div>

        {/* Lista telefonów zaufania */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.items.map((item, i) => (
            <div
              key={item.rawNumber}
              className="reveal group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-clay/40 hover:shadow-elev md:p-7"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-block w-fit rounded-full bg-clay-soft px-3 py-1 text-xs font-bold text-clay">
                      {item.badge}
                    </span>
                    {item.hours && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                        <Clock className="h-3.5 w-3.5 text-clay shrink-0" />
                        {item.hours}
                      </span>
                    )}
                  </div>
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-warm text-clay transition-colors group-hover:bg-clay group-hover:text-primary-foreground">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-5">
                  <a
                    href={`tel:${item.rawNumber}`}
                    className="font-display text-3xl font-black tracking-tight text-foreground transition-colors group-hover:text-clay"
                  >
                    {item.number}
                  </a>
                  <h3 className="mt-1 font-semibold text-foreground">{item.name}</h3>
                  <p className="text-xs font-medium text-muted-foreground">{item.operator}</p>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <a
                  href={`tel:${item.rawNumber}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-warm py-3 text-sm font-bold text-foreground transition hover:bg-clay hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay"
                >
                  <PhoneCall className="h-4 w-4" />
                  {t.callAction} ({item.number})
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
