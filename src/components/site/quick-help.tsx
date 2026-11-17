import { PhoneCall } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { publicContent, type Locale } from "@/lib/public-content";

const QUICK_HELP_NUMBERS = new Set(["116111", "800121212"]);

export function QuickHelp({ locale }: { locale: Locale }) {
  const { site, helplines } = publicContent[locale];
  const t = site.quickHelp;
  const items = helplines.items.filter(({ rawNumber }) => QUICK_HELP_NUMBERS.has(rawNumber));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={t.label}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-clay/25 bg-warm px-3 text-sm font-semibold whitespace-nowrap text-clay transition hover:border-clay hover:bg-clay-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <PhoneCall aria-hidden="true" className="h-4 w-4" />
          <span className="lg:hidden">{t.shortLabel}</span>
          <span className="hidden lg:inline">{t.label}</span>
        </button>
      </DialogTrigger>
      <DialogContent
        closeLabel={t.closeLabel}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl bg-warm"
      >
        <DialogHeader className="pr-6 text-left">
          <DialogTitle className="font-display text-2xl leading-tight">{t.label}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <ul className="grid gap-3">
          {items.map((item) => (
            <li key={item.rawNumber}>
              <a
                href={`tel:${item.rawNumber}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition hover:border-clay hover:bg-clay-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PhoneCall aria-hidden="true" className="h-5 w-5 shrink-0 text-clay" />
                <span className="grid gap-1">
                  <span className="text-xl leading-none font-bold text-clay">{item.number}</span>
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
