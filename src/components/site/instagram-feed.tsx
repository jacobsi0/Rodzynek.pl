import { useState, useEffect, useRef } from "react";
import {
  Instagram,
  Heart,
  MessageCircle,
  Send,
  ExternalLink,
  Sparkles,
  Layers,
  Video,
  Image as ImageIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { publicContent, type Locale } from "@/lib/public-content";
import { SectionLabel, SectionTitle } from "./shell";

function CarouselMedia({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900">
      {images.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt={`Zdjęcie ${idx + 1}`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
            idx === currentIndex
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105 pointer-events-none"
          }`}
        />
      ))}

      {/* Wskaźnik kropek karuzeli */}
      <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Przejdź do zdjęcia ${idx + 1}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-5 bg-white shadow" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Znacznik liczby zdjęć */}
      <div className="absolute top-2.5 right-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
        {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
}

function ReelMedia({ videoSrc }: { videoSrc: string }) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-950 group/reel">
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted={muted}
        playsInline
        className="h-full w-full object-cover"
      />

      {/* Przycisk wyciszania / włączania dźwięku */}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Włącz dźwięk" : "Wycisz dźwięk"}
        title={muted ? "Włącz dźwięk" : "Wycisz dźwięk"}
        className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur transition hover:scale-110 hover:bg-black/85"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-clay" />}
      </button>

      {/* Wskaźnik wideo / rolki */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
        <Video className="h-3 w-3" />
        <span>Rolka</span>
      </div>
    </div>
  );
}

function StaticMedia({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900">
      <img
        src={imageSrc}
        alt="Post na Instagramie"
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

export function InstagramFeed({ locale = "pl" }: { locale?: Locale }) {
  const t = publicContent[locale].instagram;

  const typeIcons: Record<string, React.ReactNode> = {
    Karuzela: <Layers className="h-3.5 w-3.5" />,
    Carousel: <Layers className="h-3.5 w-3.5" />,
    Rolka: <Video className="h-3.5 w-3.5" />,
    Reel: <Video className="h-3.5 w-3.5" />,
    Post: <ImageIcon className="h-3.5 w-3.5" />,
  };

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
              href={post.url ?? t.url}
              target="_blank"
              rel="noreferrer"
              className="reveal group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-clay/40 hover:shadow-elev"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div>
                {/* Nagłówek posta */}
                <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-clay text-xs font-black text-primary-foreground">
                      🍇
                    </div>
                    <div>
                      <span className="block text-xs font-bold leading-none text-foreground">
                        rodzynekedu
                      </span>
                      {post.date && (
                        <span className="text-[10px] text-muted-foreground">{post.date}</span>
                      )}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warm px-2 py-0.5 text-[10px] font-semibold text-ink-soft">
                    {typeIcons[post.type] ?? <Sparkles className="h-3 w-3" />}
                    {post.type}
                  </span>
                </div>

                {/* Multimedia: Karuzela / Rolka Wideo / Zdjęcie statyczne */}
                <div className="mt-3">
                  {post.media?.type === "carousel" && <CarouselMedia images={post.media.images} />}
                  {post.media?.type === "video" && <ReelMedia videoSrc={post.media.video} />}
                  {post.media?.type === "image" && <StaticMedia imageSrc={post.media.image} />}
                </div>

                {/* Tytuł i opis */}
                <div className="mt-3.5">
                  <span className="inline-block rounded-full bg-clay-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-clay">
                    {post.tag}
                  </span>
                  <h4 className="mt-2 font-display text-sm font-bold leading-snug text-foreground group-hover:text-clay transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Dolna belka interakcji (lajki, komentarze i podania dalej) */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex items-center gap-1 text-rose-500 font-medium"
                    title="Polubienia"
                  >
                    <Heart className="h-3.5 w-3.5 fill-rose-500" />
                    {post.likes}
                  </span>
                  <span
                    className="flex items-center gap-1 text-muted-foreground"
                    title="Komentarze"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {post.comments ?? "0"}
                  </span>
                  <span
                    className="flex items-center gap-1 text-muted-foreground"
                    title="Podania dalej"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {post.shares ?? "0"}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-clay flex items-center gap-1 group-hover:underline">
                  Otwórz na IG <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
