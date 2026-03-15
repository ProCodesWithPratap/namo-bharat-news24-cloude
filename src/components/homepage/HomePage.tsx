import Link from "next/link";
import Image from "next/image";
import NewsCard from "@/components/ui/NewsCard";
import AdSlot from "@/components/ui/AdSlot";
import { getImageUrl, timeAgo } from "@/lib/api";
import { NAV_CATEGORIES } from "@/lib/utils";

interface HomePageProps {
  featuredArticles: any[];
  latestArticles: any[];
  categoryFeeds: Record<string, any[]>;
  videos: any[];
  webStories: any[];
  trendingArticles: any[];
}

export default function HomePage({
  featuredArticles,
  latestArticles,
  categoryFeeds,
  videos,
  webStories,
  trendingArticles,
}: HomePageProps) {
  const hero = featuredArticles[0];
  const topStories = featuredArticles.slice(1, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* ── Hero + Top Stories ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Hero story */}
        <div className="lg:col-span-2">
          {hero && <NewsCard article={hero} variant="hero" priority />}
        </div>

        {/* Top 4 stories sidebar */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-hindi text-base font-extrabold text-gray-800 border-l-4 border-primary pl-3" style={{ borderColor: "#C8102E" }}>
              प्रमुख खबरें
            </h2>
            <Link href="/national" className="text-xs text-primary hover:underline font-hindi">
              और देखें →
            </Link>
          </div>
          {topStories.map((a) => (
            <NewsCard key={a.id} article={a} variant="horizontal" />
          ))}
        </div>
      </section>

      {/* ── Ad Banner ── */}
      <div className="mb-8">
        <AdSlot label="Advertisement" width={970} height={90} className="hidden md:flex" />
        <AdSlot label="Advertisement" width={320} height={50} className="flex md:hidden" />
      </div>

      {/* ── Main grid: Latest + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Latest news */}
        <div className="lg:col-span-2">

          {/* Latest grid */}
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-hindi text-lg font-extrabold text-gray-800 border-l-4 pl-3"
              style={{ borderColor: "#C8102E" }}
            >
              ताजा खबरें
            </h2>
            <Link href="/national" className="text-xs text-primary hover:underline font-hindi">
              और देखें →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {latestArticles.slice(0, 6).map((a) => (
              <NewsCard key={a.id} article={a} variant="card" />
            ))}
          </div>

          {/* Category strips */}
          {NAV_CATEGORIES.slice(0, 4).map((cat) => {
            const feed = categoryFeeds[cat.slug] || [];
            if (!feed.length) return null;
            return (
              <div key={cat.slug} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="font-hindi text-lg font-extrabold text-gray-800 border-l-4 pl-3"
                    style={{ borderColor: "#C8102E" }}
                  >
                    {cat.name}
                  </h2>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-xs font-hindi hover:underline"
                    style={{ color: "#C8102E" }}
                  >
                    {cat.name} की सभी खबरें →
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {feed.slice(0, 3).map((a, i) => (
                    <NewsCard key={a.id} article={a} variant={i === 0 ? "card" : "compact"} />
                  ))}
                </div>
              </div>
            );
          })}

        </div>

        {/* Right: Sidebar */}
        <aside className="space-y-6">
          {/* Trending */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h3
              className="font-hindi text-base font-extrabold mb-4 border-l-4 pl-3"
              style={{ borderColor: "#C8102E", color: "#111" }}
            >
              🔥 ट्रेंडिंग
            </h3>
            <ol className="space-y-0 divide-y divide-gray-100">
              {trendingArticles.slice(0, 8).map((a, i) => (
                <li key={a.id} className="py-3 flex items-start gap-3">
                  <span
                    className="text-2xl font-extrabold leading-none mt-0.5 w-6 shrink-0"
                    style={{ color: i < 3 ? "#C8102E" : "#ddd" }}
                  >
                    {i + 1}
                  </span>
                  <Link
                    href={`/article/${a.slug}`}
                    className="font-hindi text-sm font-semibold text-gray-700 hover:text-primary leading-snug line-clamp-2"
                  >
                    {a.headlineHindi || a.headline}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {/* Sidebar ad */}
          <AdSlot label="Advertisement" width={300} height={250} className="flex" />

          {/* Most Recent */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h3
              className="font-hindi text-base font-extrabold mb-4 border-l-4 pl-3"
              style={{ borderColor: "#C8102E", color: "#111" }}
            >
              सबसे नई खबरें
            </h3>
            <div className="space-y-0">
              {latestArticles.slice(6, 16).map((a) => (
                <NewsCard key={a.id} article={a} variant="mini" />
              ))}
            </div>
          </div>

          {/* Another sidebar ad */}
          <AdSlot label="Advertisement" width={300} height={600} className="flex" />
        </aside>
      </div>

      {/* ── Videos Rail ── */}
      {videos.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-hindi text-lg font-extrabold text-gray-800 border-l-4 pl-3"
              style={{ borderColor: "#C8102E" }}
            >
              📺 वीडियो
            </h2>
            <Link href="/videos" className="text-xs text-primary hover:underline font-hindi">
              सभी वीडियो →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videos.slice(0, 4).map((v) => (
              <Link key={v.id} href={`/video/${v.slug}`} className="group block news-card rounded-lg overflow-hidden bg-white border border-gray-100">
                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                  {v.thumbnail && (
                    <Image
                      src={getImageUrl(v.thumbnail, "card")}
                      alt={v.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-1">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                  {v.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      {v.duration}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-hindi text-sm font-semibold text-gray-800 group-hover:text-primary line-clamp-2 transition-colors">
                    {v.titleHindi || v.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Web Stories ── */}
      {webStories.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-hindi text-lg font-extrabold text-gray-800 border-l-4 pl-3"
              style={{ borderColor: "#C8102E" }}
            >
              📸 वेब स्टोरी
            </h2>
            <Link href="/web-stories" className="text-xs text-primary hover:underline font-hindi">
              सभी स्टोरी →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {webStories.map((s) => (
              <Link
                key={s.id}
                href={`/web-stories/${s.slug}`}
                className="group shrink-0 w-28 md:w-36 block"
              >
                <div className="relative h-48 md:h-64 rounded-xl overflow-hidden bg-gray-200 shadow-md">
                  {s.coverImage && (
                    <Image
                      src={getImageUrl(s.coverImage, "thumbnail")}
                      alt={s.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-3 left-2 right-2 font-hindi text-xs text-white font-semibold leading-snug line-clamp-3">
                    {s.titleHindi || s.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── More category strips ── */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {NAV_CATEGORIES.slice(4, 8).map((cat) => {
          const feed = categoryFeeds[cat.slug] || [];
          if (!feed.length) return null;
          return (
            <div key={cat.slug}>
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-hindi text-base font-extrabold text-gray-800 border-l-4 pl-3"
                  style={{ borderColor: "#C8102E" }}
                >
                  {cat.name}
                </h2>
                <Link href={`/${cat.slug}`} className="text-xs text-primary hover:underline font-hindi">
                  और देखें →
                </Link>
              </div>
              {feed[0] && (
                <NewsCard article={feed[0]} variant="horizontal" />
              )}
              <div className="mt-3 space-y-0">
                {feed.slice(1, 4).map((a) => (
                  <NewsCard key={a.id} article={a} variant="mini" />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ad ── */}
      <div className="mt-10">
        <AdSlot label="Advertisement" width={970} height={90} className="hidden md:flex" />
      </div>
    </div>
  );
}
