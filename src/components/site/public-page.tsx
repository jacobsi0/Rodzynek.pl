import { SiteShell } from "@/components/site/shell";
import { Hero, Marquee } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Workshops } from "@/components/site/workshops";
import { Projekt } from "@/components/site/projekt";
import { Team } from "@/components/site/team";
import { InstagramFeed } from "@/components/site/instagram-feed";
import { Contact } from "@/components/site/contact";
import { publicSectionIds, type Locale, type PublicRouteKey } from "@/lib/public-content";

export function PublicHomePage({ locale }: { locale: Locale }) {
  const sections = publicSectionIds[locale];

  return (
    <SiteShell locale={locale} page="home">
      <Hero locale={locale} />
      <Marquee locale={locale} />
      <div id={sections.about}>
        <About locale={locale} />
      </div>
      <div id={sections.workshops}>
        <Workshops locale={locale} />
      </div>
      <div id={sections.project}>
        <Projekt locale={locale} />
      </div>
      <div id={sections.team}>
        <Team locale={locale} />
      </div>
      <InstagramFeed locale={locale} />
      <div id={sections.contact}>
        <Contact locale={locale} />
      </div>
    </SiteShell>
  );
}

export function PublicSectionPage({
  locale,
  page,
}: {
  locale: Locale;
  page: Exclude<PublicRouteKey, "home">;
}) {
  const Component = {
    about: About,
    workshops: Workshops,
    project: Projekt,
    team: Team,
    contact: Contact,
  }[page];

  return (
    <SiteShell locale={locale} page={page}>
      <Component locale={locale} />
    </SiteShell>
  );
}
