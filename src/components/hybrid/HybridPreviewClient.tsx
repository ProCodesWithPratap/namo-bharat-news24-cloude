"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl, timeAgo } from "@/lib/api";

type NavCategory = { name: string; nameEn?: string; slug: string };
type SocialLinks = { facebook?: string; instagram?: string; youtube?: string; whatsapp?: string };

type HybridPreviewProps = {
  featuredArticles: any[];
  latestArticles: any[];
  trendingArticles: any[];
  videos: any[];
  webStories: any[];
  navigationCategories: NavCategory[];
  categoryFeeds: Record<string, any[]>;
  socialLinks: SocialLinks;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function articleSlug(article: any) {
  return typeof article?.slug === "string" && article.slug.trim()
    ? article.slug.trim()
    : typeof article?.id === "string"
      ? article.id.trim()
      : "";
}

function articleTitle(article: any) {
  return article?.headlineHindi || article?.headline || article?.titleHindi || article?.title || "ताज़ा अपडेट";
}

function articleExcerpt(article: any) {
  return article?.excerpt || article?.subheadline || "";
}

function articleCategory(article: any) {
  return article?.category?.nameHindi || article?.category?.name || "न्यूज़";
}

function articleImage(article: any, size: "hero" | "card" | "thumbnail" = "card") {
  if (article?.heroMedia) return getImageUrl(article.heroMedia, size);
  if (typeof article?.heroImage === "string") return article.heroImage;
  return null;
}

function itemImage(item: any, field: "thumbnail" | "coverImage") {
  if (item?.[field]) return getImageUrl(item[field], field === "thumbnail" ? "card" : "thumbnail");
  return null;
}

function articleTime(article: any) {
  const raw = article?.publishDate || article?.updatedAt || article?.createdAt;
  if (!raw) return "";
  try {
    return timeAgo(raw);
  } catch {
    return "";
  }
}

function StoryCard({
  article,
  priority = false,
  variant = "default",
  dark,
}: {
  article: any;
  priority?: boolean;
  variant?: "hero" | "side" | "default" | "compact";
  dark: boolean;
}) {
  const href = `/article/${articleSlug(article)}`;
  const title = articleTitle(article);
  const excerpt = articleExcerpt(article);
  const category = articleCategory(article);
  const image = articleImage(article, variant === "hero" ? "hero" : "card");
  const stamp = articleTime(article);

  if (!articleSlug(article)) return null;

  if (variant === "hero") {
    return (
      <Link href={href} className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-black text-white shadow-2xl">
        <div className="relative aspect-[16/11] overflow-hidden md:aspect-[16/9]">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              priority={priority}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] via-[#111111] to-[#FF6B00]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-white/95 uppercase backdrop-blur">
              {category}
            </span>
            {stamp ? <span className="text-xs text-white/70">{stamp}</span> : null}
          </div>
          <h2 className="max-w-3xl font-hindi text-2xl font-extrabold leading-tight text-white md:text-4xl md:leading-tight">
            {title}
          </h2>
          {excerpt ? (
            <p className="mt-3 max-w-2xl font-hindi text-sm leading-7 text-white/78 md:text-base">
              {excerpt}
            </p>
          ) : null}
        </div>
      </Link>
    );
  }

  if (variant === "side") {
    return (
      <Link
        href={href}
        className={cn(
          "group grid grid-cols-[104px_1fr] gap-3 rounded-[20px] border p-3 transition duration-200 hover:-translate-y-0.5",
          dark ? "border-zinc-800 bg-zinc-900/80 hover:border-zinc-700" : "border-zinc-200 bg-white hover:border-zinc-300"
        )}
      >
        <div className="relative h-[92px] overflow-hidden rounded-2xl bg-zinc-200">
          {image ? (
            <Image src={image} alt={title} fill sizes="104px" className="object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#FF6B00]" />
          )}
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#C8102E]">{category}</p>
          <h3 className={cn("font-hindi text-sm font-bold leading-6 line-clamp-2", dark ? "text-zinc-100" : "text-zinc-900")}>{title}</h3>
          {stamp ? <p className={cn("mt-2 text-xs", dark ? "text-zinc-400" : "text-zinc-500")}>{stamp}</p> : null}
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex items-start gap-3 py-3">
        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#C8102E]" />
        <div className="min-w-0">
          <p className={cn("font-hindi text-sm font-semibold leading-6 line-clamp-2 transition-colors", dark ? "text-zinc-200 group-hover:text-white" : "text-zinc-700 group-hover:text-zinc-900")}>{title}</p>
          {stamp ? <p className={cn("mt-1 text-xs", dark ? "text-zinc-500" : "text-zinc-500")}>{stamp}</p> : null}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-[24px] border transition duration-200 hover:-translate-y-1 hover:shadow-xl",
        dark ? "border-zinc-800 bg-zinc-900/85 hover:border-zinc-700" : "border-zinc-200 bg-white hover:border-zinc-300"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-200">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] via-[#111111] to-[#FF6B00]" />
        )}
      </div>
      <div className="p-4 md:p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#C8102E]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#C8102E]">
            {category}
          </span>
          {stamp ? <span className={cn("text-xs", dark ? "text-zinc-500" : "text-zinc-500")}>{stamp}</span> : null}
        </div>
        <h3 className={cn("font-hindi text-lg font-extrabold leading-7 line-clamp-2", dark ? "text-zinc-100" : "text-zinc-900")}>{title}</h3>
        {excerpt ? <p className={cn("mt-2 font-hindi text-sm leading-6 line-clamp-2", dark ? "text-zinc-400" : "text-zinc-600")}>{excerpt}</p> : null}
      </div>
    </Link>
  );
}

function MediaTile({ item, href, image, title, dark }: { item: any; href: string; image: string | null; title: string; dark: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-[22px] border transition duration-200 hover:-translate-y-1",
        dark ? "border-zinc-800 bg-zinc-900/85 hover:border-zinc-700" : "border-zinc-200 bg-white hover:border-zinc-300"
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-200">
        {image ? (
          <Image src={image} alt={title} fill sizes="(max-width: 768px) 40vw, 20vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#FF6B00]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="font-hindi text-sm font-bold leading-5 text-white line-clamp-2">{title}</p>
        </div>
      </div>
    </Link>
  );
}

export default function HybridPreviewClient({
  featuredArticles,
  latestArticles,
  trendingArticles,
  videos,
  webStories,
  navigationCategories,
  categoryFeeds,
  socialLinks,
}: HybridPreviewProps) {
  const [dark, setDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [indiaTime, setIndiaTime] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("hybrid-preview-theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("hybrid-preview-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("hi-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });

    const update = () => setIndiaTime(formatter.format(new Date()));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  const hero = featuredArticles[0] || latestArticles[0];
  const sideStories = (featuredArticles.length > 1 ? featuredArticles.slice(1, 4) : latestArticles.slice(1, 4)).filter(Boolean);
  const latestGrid = latestArticles.slice(0, 6);
  const quickUpdates = latestArticles.slice(0, 5);
  const trending = trendingArticles.slice(0, 6);
  const sectionCategories = navigationCategories.slice(0, 4);
  const primaryNav = navigationCategories.slice(0, 6);
  const storyRail = navigationCategories.slice(0, 8);

  return (
    <div className={cn("min-h-screen transition-colors duration-300", dark ? "bg-[#09090b] text-zinc-100" : "bg-[#f5f7fb] text-zinc-900")}>
      <div className={cn("border-b", dark ? "border-zinc-800 bg-black" : "border-zinc-200 bg-white")}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 text-xs md:px-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#C8102E] px-3 py-1 font-bold uppercase tracking-[0.18em] text-white">Hybrid Preview</span>
            <span className={cn("hidden md:inline", dark ? "text-zinc-400" : "text-zinc-500")}>{indiaTime || "भारत समय"}</span>
          </div>
          <div className="flex items-center gap-2">
            <a href={socialLinks.whatsapp || "#"} className={cn("rounded-full px-3 py-1.5 font-semibold", dark ? "bg-zinc-900 text-zinc-100" : "bg-zinc-100 text-zinc-800")}>WhatsApp</a>
            <button
              type="button"
              onClick={() => setDark((value) => !value)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-semibold",
                dark ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "border-zinc-200 bg-white text-zinc-800"
              )}
            >
              {dark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>

      <header className={cn("sticky top-0 z-40 border-b backdrop-blur-xl", dark ? "border-zinc-800/80 bg-black/80" : "border-zinc-200/80 bg-white/85")}>
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C8102E]">नमो भारत न्यूज़ 24</p>
              <h1 className="mt-1 font-hindi text-2xl font-extrabold md:text-4xl">Hindi newsroom UI refresh preview</h1>
              <p className={cn("mt-2 max-w-2xl font-hindi text-sm leading-6", dark ? "text-zinc-400" : "text-zinc-600")}>डार्क मोड मास्टर की visual polish और आपके existing newsroom UX को एक साथ मिलाकर बना हुआ नया front page preview.</p>
            </div>
            <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-[1fr_auto] lg:min-w-[420px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="खबर खोजें..."
                className={cn(
                  "w-full rounded-2xl border px-4 py-3 font-hindi text-sm outline-none transition",
                  dark ? "border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500" : "border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400"
                )}
              />
              <button type="submit" className="rounded-2xl bg-[#C8102E] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/20 transition hover:bg-[#a50d26]">
                Search
              </button>
            </form>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {primaryNav.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition",
                  dark ? "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:text-white" : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-900"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_380px]">
          <div>{hero ? <StoryCard article={hero} variant="hero" priority dark={dark} /> : null}</div>
          <div className="space-y-4">
            {sideStories.map((article) => (
              <StoryCard key={articleSlug(article)} article={article} variant="side" dark={dark} />
            ))}
          </div>
        </section>

        {quickUpdates.length > 0 && (
          <section className={cn("mt-6 rounded-[24px] border px-4 py-4", dark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white")}>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C8102E]" />
              <h2 className="font-hindi text-lg font-extrabold">Live updates rail</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {quickUpdates.map((article) => (
                <Link
                  key={articleSlug(article)}
                  href={`/article/${articleSlug(article)}`}
                  className={cn("rounded-2xl border p-3 transition hover:-translate-y-0.5", dark ? "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700" : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300")}
                >
                  <p className="font-hindi text-sm font-semibold leading-6 line-clamp-2">{articleTitle(article)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8102E]">Latest coverage</p>
                  <h2 className="font-hindi text-2xl font-extrabold">Cleaner latest news grid</h2>
                </div>
                <Link href="/national" className={cn("text-sm font-semibold", dark ? "text-zinc-300" : "text-zinc-700")}>View all →</Link>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {latestGrid.map((article, index) => (
                  <StoryCard key={articleSlug(article) || index} article={article} priority={index < 2} dark={dark} />
                ))}
              </div>
            </div>

            {sectionCategories.map((category) => {
              const items = (categoryFeeds[category.slug] || []).slice(0, 3);
              if (items.length === 0) return null;

              return (
                <section key={category.slug}>
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8102E]">Section block</p>
                      <h3 className="font-hindi text-xl font-extrabold">{category.name}</h3>
                    </div>
                    <Link href={`/${category.slug}`} className={cn("text-sm font-semibold", dark ? "text-zinc-300" : "text-zinc-700")}>All stories →</Link>
                  </div>
                  <div className="grid gap-5 md:grid-cols-3">
                    {items.map((article, index) => (
                      <StoryCard key={articleSlug(article) || index} article={article} variant={index === 0 ? "default" : "side"} dark={dark} />
                    ))}
                  </div>
                </section>
              );
            })}

            {(videos.length > 0 || webStories.length > 0) && (
              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8102E]">Media</p>
                    <h3 className="font-hindi text-xl font-extrabold">Video + web stories in one cleaner strip</h3>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-4">
                  {videos.slice(0, 2).map((item, index) => (
                    <MediaTile
                      key={item?.id || index}
                      item={item}
                      href={`/video/${item?.slug || item?.id || ""}`}
                      image={itemImage(item, "thumbnail")}
                      title={item?.titleHindi || item?.title || "वीडियो अपडेट"}
                      dark={dark}
                    />
                  ))}
                  {webStories.slice(0, 2).map((item, index) => (
                    <MediaTile
                      key={item?.id || index}
                      item={item}
                      href={`/web-stories/${item?.slug || item?.id || ""}`}
                      image={itemImage(item, "coverImage")}
                      title={item?.titleHindi || item?.title || "वेब स्टोरी"}
                      dark={dark}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5">
            <div className={cn("rounded-[24px] border p-5", dark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white")}>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8102E]">Engagement</p>
              <h3 className="mt-2 font-hindi text-2xl font-extrabold">Join the WhatsApp channel</h3>
              <p className={cn("mt-2 font-hindi text-sm leading-6", dark ? "text-zinc-400" : "text-zinc-600")}>ब्रेकिंग न्यूज़ और बड़ी अपडेट पहले पाने के लिए इस CTA को ऊपर रखा गया है, लेकिन visual noise कम रखा गया है.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={socialLinks.whatsapp || "#"} className="rounded-2xl bg-[#16a34a] px-4 py-2.5 text-sm font-bold text-white">Join WhatsApp</a>
                <a href={socialLinks.youtube || "#"} className={cn("rounded-2xl px-4 py-2.5 text-sm font-semibold", dark ? "bg-zinc-900 text-zinc-100" : "bg-zinc-100 text-zinc-800")}>YouTube</a>
              </div>
            </div>

            <div className={cn("rounded-[24px] border p-5", dark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white")}>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8102E]">Trending</p>
              <h3 className="mt-2 font-hindi text-xl font-extrabold">Compact sidebar, easier to scan</h3>
              <div className="mt-3 divide-y divide-zinc-200/10">
                {trending.map((article, index) => (
                  <div key={articleSlug(article) || index} className="flex items-start gap-3">
                    <span className="pt-3 text-2xl font-black text-[#C8102E]/70">{index + 1}</span>
                    <div className="flex-1 border-b border-transparent">
                      <StoryCard article={article} variant="compact" dark={dark} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={cn("rounded-[24px] border p-5", dark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white")}>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8102E]">Quick sections</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {storyRail.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/${category.slug}`}
                    className={cn(
                      "rounded-2xl border px-3 py-3 text-center font-hindi text-sm font-semibold transition",
                      dark ? "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:text-white" : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:text-zinc-900"
                    )}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className={cn("mt-10 overflow-hidden rounded-[30px] border p-6 md:p-8", dark ? "border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" : "border-zinc-200 bg-gradient-to-br from-white via-[#fff7f7] to-[#fff3ea]")}>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C8102E]">Hybrid direction</p>
              <h3 className="mt-2 max-w-2xl font-hindi text-2xl font-extrabold md:text-3xl">Keep the strong newsroom UX. Upgrade the visual hierarchy, cards, spacing, and mood.</h3>
              <p className={cn("mt-3 max-w-2xl font-hindi text-sm leading-7", dark ? "text-zinc-400" : "text-zinc-600")}>This preview keeps the Hindi-first information architecture, fast scanning, and category-driven browsing, but makes the page calmer and more premium.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="rounded-2xl bg-[#C8102E] px-5 py-3 text-sm font-bold text-white">Back to current site</Link>
              <a href={socialLinks.facebook || "#"} className={cn("rounded-2xl px-5 py-3 text-sm font-semibold", dark ? "bg-zinc-900 text-zinc-100" : "bg-white text-zinc-800")}>Facebook</a>
            </div>
          </div>
        </section>
      </main>

      <div className={cn("fixed inset-x-0 bottom-0 z-40 border-t md:hidden", dark ? "border-zinc-800 bg-black/95" : "border-zinc-200 bg-white/95")}>
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {[
            { href: "/", label: "होम" },
            { href: "/national", label: "राष्ट्रीय" },
            { href: "/videos", label: "वीडियो" },
            { href: "/live", label: "लाइव" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={cn("rounded-xl px-3 py-2 text-xs font-bold", dark ? "text-zinc-200" : "text-zinc-700")}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
