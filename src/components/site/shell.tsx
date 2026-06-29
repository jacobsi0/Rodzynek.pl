import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import {
  getHomeSectionHref,
  getPublicPath,
  publicContent,
  type Locale,
  type PublicRouteKey,
} from "@/lib/public-content";

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function getNavLinks(locale: Locale) {
  const t = publicContent[locale].site.nav;
  return [
    { href: getHomeSectionHref(locale, "about"), label: t.about },
    { href: getHomeSectionHref(locale, "workshops"), label: t.workshops },
    { href: getHomeSectionHref(locale, "project"), label: t.project },
    { href: getHomeSectionHref(locale, "team"), label: t.team },
  ] as const;
}

export function ThemeToggle({ locale }: { locale: Locale }) {
  const readCurrentTheme = () =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const [dark, setDark] = useState(false);
  const t = publicContent[locale].site.theme;

  useEffect(() => {
    setDark(readCurrentTheme());
  }, [locale]);

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
    try {
      localStorage.setItem("rodzynek-theme", next ? "dark" : "light");
    } catch {
      // Theme persistence is progressive enhancement.
    }
  };

  const active = dark;

  return (
    <button
      type="button"
      aria-label={active ? t.switchToLight : t.switchToDark}
      aria-pressed={active}
      title={active ? t.switchToLight : t.switchToDark}
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-warm text-ink-soft shadow-soft transition hover:border-clay hover:text-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      {active ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </button>
  );
}

function Nav({
  scrolled,
  locale,
  page,
}: {
  scrolled: boolean;
  locale: Locale;
  page: PublicRouteKey;
}) {
  const [open, setOpen] = useState(false);
  const t = publicContent[locale].site;
  const navLinks = getNavLinks(locale);
  const alternateLocale: Locale = locale === "pl" ? "en" : "pl";
  const alternateHref = getPublicPath(alternateLocale, page);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "backdrop-blur-xl bg-warm/85 border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">
        <a
          href={getPublicPath(locale, "home")}
          aria-label={t.homeAria}
          className="flex items-center gap-2"
        >
          <img src="/logo-icon.png" alt="Rodzynek.pl" className="h-10 w-auto" />
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-sm font-medium text-ink-soft transition hover:text-clay"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a
            href={alternateHref}
            aria-label={t.languageAria}
            className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-warm px-4 text-sm font-bold text-ink-soft shadow-soft transition hover:border-clay hover:text-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            {t.languageLabel}
          </a>
          <ThemeToggle locale={locale} />
          <Link
            href={getHomeSectionHref(locale, "contact")}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-clay px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90"
          >
            {t.invite} <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-warm text-ink md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-border bg-warm/95 backdrop-blur-xl md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-ink-soft transition hover:bg-clay-soft/60 hover:text-clay"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <Link
                href={getHomeSectionHref(locale, "contact")}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                {t.invite} <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function Footer({ locale }: { locale: Locale }) {
  const t = publicContent[locale].site;
  const navLinks = getNavLinks(locale);

  return (
    <footer className="bg-ink text-warm/65 dark:bg-[#16110f] dark:text-[#f4ead8]/65">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-10 text-center md:flex-row md:px-10 md:text-left">
        <a href={getPublicPath(locale, "home")} className="flex items-center gap-3">
          <img src="/logo-full.png" alt="Rodzynek.pl" className="h-12 w-auto rounded-lg" />
        </a>
        <ul className="flex flex-wrap items-center justify-center gap-6 text-sm">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-warm dark:hover:text-[#f4ead8]">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={getHomeSectionHref(locale, "contact")}
              className="transition hover:text-warm dark:hover:text-[#f4ead8]"
            >
              {t.contact}
            </a>
          </li>
        </ul>
        <span className="text-xs text-warm/45 dark:text-[#f4ead8]/45">{t.copyright}</span>
        <span className="text-xs text-warm/45 dark:text-[#f4ead8]/45">{t.madeBy}</span>
      </div>
    </footer>
  );
}

export function SiteShell({
  children,
  locale = "pl",
  page = "home",
}: {
  children: React.ReactNode;
  locale?: Locale;
  page?: PublicRouteKey;
}) {
  useReveal();
  const [scrolled, setScrolled] = useState(false);
  const t = publicContent[locale].site;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-clay focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        {t.skipLink}
      </a>
      <Nav scrolled={scrolled} locale={locale} page={page} />
      <main id="main">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}

export function SectionLabel({
  children,
  center,
  className = "",
}: {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-xs font-bold uppercase tracking-[0.16em] text-clay ${center ? "text-center" : ""} ${className}`}
    >
      {children}
    </p>
  );
}

export function SectionTitle({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <h1
      className={`mt-3 font-display text-4xl font-black leading-[1.05] tracking-[-0.025em] text-balance md:text-5xl ${center ? "text-center" : ""}`}
    >
      {children}
    </h1>
  );
}
