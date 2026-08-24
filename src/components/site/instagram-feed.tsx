import {
  Instagram,
  Heart,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Layers,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { publicContent, type Locale } from "@/lib/public-content";
import { SectionLabel, SectionTitle } from "./shell";

export function InstagramFeed({ locale = "pl" }: { locale?: Locale }) {
  const t = publicContent[locale].instagram;

  const typeIcons: Record<string, React.ReactNode> = {
    Karuzela: <Layers className="h-3.5 w-3.5" />,
    Carousel: <Layers className="h-3.5 w-3.5" />,
    Rolka: <Video className="h-3.5 w-3.5" />,
    Reel: <Video className="h-3.5 w-3.5" />,
    Post: <ImageIcon className="h-3.5 w-3.5" />,
  };

  const gradients = [
    "from-amber-500/15 via-rose-500/10 to-purple-600/15",
    "from-purple-500/15 via-pink-500/10 to-amber-500/15",
    "from-rose-500/15 via-orange-500/10 to-amber-500/15",
    "from-indigo-500/15 via-purple-500/10 to-pink-500/15",
  ];

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="reveal mx-auto flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <SectionLabel>{t.label}</SectionLabel>
            <SectionTitle>
              {t.titleBefore}
              <em className="italic text-clay">{t.titleEmphasis}</em>
            </SectionTitle>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">{t.subtitle}</p>
          </div>

          <a
            href={t.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-6 py-3 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:opacity-95 hover:shadow-elev hover:-translate-y-0.5"
          >
            <Instagram className="h-4.5 w-4.5" />
            {t.followButton}
            <ExternalLink className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Siatka postów */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.posts.map((post, i) => (
            <a
              key={post.title}
              href={t.url}
              target="_blank"
              rel="noreferrer"
              className="reveal group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-clay/40 hover:shadow-elev"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div>
                {/* Nagłówek posta */}
                <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-clay text-xs font-black text-primary-foreground">
                      🍇
                    </div>
                    <span className="text-xs font-bold text-foreground">rodzynekedu</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warm px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
                    {typeIcons[post.type] ?? <Sparkles className="h-3 w-3" />}
                    {post.type}
                  </span>
                </div>

                {/* Graficzna miniatura / karta treści */}
                <div
                  className={`mt-4 flex flex-col justify-between rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} p-4 min-h-[140px] border border-border/50 transition-colors group-hover:border-clay/20`}
                >
                  <span className="inline-block w-fit rounded-full bg-card/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-clay backdrop-blur">
                    {post.tag}
                  </span>
                  <h4 className="mt-2 font-display text-base font-bold leading-snug text-foreground group-hover:text-clay transition-colors">
                    {post.title}
                  </h4>
                </div>

                {/* Krótki opis posta */}
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Dolna belka interakcji (lajki i komentarze) */}
              <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-rose-500 font-medium">
                    <Heart className="h-3.5 w-3.5 fill-rose-500" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-clay flex items-center gap-1 group-hover:underline">
                  Zobacz <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
