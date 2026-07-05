import { getHomeSectionHref, publicContent, type Locale } from "@/lib/public-content";
import { SectionLabel, SectionTitle } from "./shell";

const memberImages: Record<string, string> = {
  "Kornelia Łabieniec": "/team/kornelia-labieniec.jpg",
  "Iwo Nalbach": "/team/iwo-nalbach.jpg",
  "Zuzanna Malinowska": "/team/zuzanna-malinowska.jpg",
  "Lena Drogosz": "/team/lena-dlogosz.png",
};

export function Team({ locale = "pl" }: { locale?: Locale }) {
  const t = publicContent[locale].team;
  const tones = [
    "bg-clay-soft text-clay",
    "bg-honey/30 text-ink",
    "bg-sand text-ink-soft",
    "bg-clay-soft text-clay",
  ];

  return (
    <section className="bg-warm pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="reveal mx-auto max-w-xl text-center">
          <SectionLabel center>{t.label}</SectionLabel>
          <SectionTitle center>
            {t.titleBefore}
            <em className="italic text-clay">{t.titleEmphasis}</em>
          </SectionTitle>
          {t.intro && <p className="mt-4 text-muted-foreground">{t.intro}</p>}
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {t.members.map(([name, initials], i) => {
            const image = memberImages[name];
            return (
              <article
                key={name}
                className="reveal group overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-elev"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div
                  className={`relative flex aspect-square items-center justify-center overflow-hidden ${tones[i]}`}
                >
                  {image ? (
                    <img src={image} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-6 rounded-full bg-card/40 ring-1 ring-inset ring-warm/40" />
                      <span className="relative font-display text-5xl font-black tracking-tight">
                        {initials}
                      </span>
                      <span className="absolute bottom-3 right-3 rounded-full bg-card/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-soft backdrop-blur">
                        {t.photoSoon}
                      </span>
                    </>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold">{name}</h3>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          {t.contactLead}{" "}
          <a
            href={getHomeSectionHref(locale, "contact")}
            className="font-semibold text-clay underline-offset-4 hover:underline"
          >
            {t.contactLink}
          </a>
        </p>
      </div>
    </section>
  );
}
