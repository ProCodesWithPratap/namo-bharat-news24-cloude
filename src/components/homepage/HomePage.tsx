import Link from "next/link";
import Image from "next/image";
import NewsCard from "@/components/ui/NewsCard";
import AdSlot from "@/components/ui/AdSlot";
import SectionHeader from "@/components/common/SectionHeader";
import { getImageUrl } from "@/lib/api";
import { NAV_CATEGORIES } from "@/lib/utils";

interface HomePageProps {
  featuredArticles: any[];
  latestArticles: any[];
  categoryFeeds: Record<string, any[]>;
  videos: any[];
  webStories: any[];
  trendingArticles: any[];
}

export default function HomePage({ featuredArticles, latestArticles, categoryFeeds, videos, webStories, trendingArticles }: HomePageProps) {
  const hero = featuredArticles[0];
  const topStories = featuredArticles.slice(1, 5);
  const hasAnyNews = featuredArticles.length > 0 || latestArticles.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2">{hero && <NewsCard article={hero} variant="hero" priority />}</div>
        <div className="flex flex-col gap-3">
          <SectionHeader title="टॉप न्यूज़" href="/national" />
          {topStories.length > 0 ? topStories.map((a) => <NewsCard key={a.id} article={a} variant="horizontal" />) : (
            <p className="text-sm font-hindi text-gray-500">टॉप न्यूज़ जल्द अपडेट होगी।</p>
          )}
        </div>
      </section>

      {!hasAnyNews && (
        <div className="mb-8 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center font-hindi text-gray-600">
          न्यूज़रूम कंटेंट अपडेट हो रहा है। कृपया कुछ देर बाद दोबारा देखें।
        </div>
      )}

      <div className="mb-8">
        <AdSlot label="Advertisement" width={970} height={90} className="hidden md:flex" />
        <AdSlot label="Advertisement" width={320} height={50} className="flex md:hidden" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SectionHeader title="लेटेस्ट न्यूज़" href="/national" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {latestArticles.slice(0, 6).map((a) => <NewsCard key={a.id} article={a} variant="card" />)}
          </div>

          {["states", "national", "entertainment", "sports"].map((slug) => {
            const cat = NAV_CATEGORIES.find((item) => item.slug === slug);
            const feed = categoryFeeds[slug] || [];
            if (!cat || !feed.length) return null;
            return (
              <div key={slug} className="mb-10">
                <SectionHeader title={cat.name} href={`/${cat.slug}`} ctaLabel={`${cat.name} की सभी खबरें →`} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {feed.slice(0, 3).map((a, i) => <NewsCard key={a.id} article={a} variant={i === 0 ? "card" : "compact"} />)}
                </div>
              </div>
            );
          })}
        </div>

        <aside className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="font-hindi text-base font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E", color: "#111" }}>🔥 ट्रेंडिंग</h3>
            <ol className="space-y-0 divide-y divide-gray-100">
              {trendingArticles.slice(0, 8).map((a, i) => (
                <li key={a.id} className="py-3 flex items-start gap-3">
                  <span className="text-2xl font-extrabold leading-none mt-0.5 w-6 shrink-0" style={{ color: i < 3 ? "#C8102E" : "#ddd" }}>{i + 1}</span>
                  <Link href={`/article/${a.slug}`} className="font-hindi text-sm font-semibold text-gray-700 hover:text-primary leading-snug line-clamp-2">
                    {a.headlineHindi || a.headline}
                  </Link>
                </li>
              ))}
              {trendingArticles.length === 0 && <li className="py-2 text-sm font-hindi text-gray-500">ट्रेंडिंग अपडेट उपलब्ध नहीं हैं।</li>}
            </ol>
          </div>

          <AdSlot label="Advertisement" width={300} height={250} className="flex" />

          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="font-hindi text-base font-extrabold mb-4 border-l-4 pl-3" style={{ borderColor: "#C8102E", color: "#111" }}>सबसे नई खबरें</h3>
            <div className="space-y-0">{latestArticles.slice(6, 16).map((a) => <NewsCard key={a.id} article={a} variant="mini" />)}</div>
            {latestArticles.length === 0 && <p className="text-sm font-hindi text-gray-500">अभी कोई खबर प्रकाशित नहीं है।</p>}
          </div>
        </aside>
      </div>

      {videos.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="📺 वीडियो" href="/videos" ctaLabel="सभी वीडियो →" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videos.slice(0, 4).map((v) => (
              <Link key={v.id} href={`/video/${v.slug}`} className="group block news-card rounded-lg overflow-hidden bg-white border border-gray-100">
                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                  {v.thumbnail && <Image src={getImageUrl(v.thumbnail, "card")} alt={v.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                </div>
                <div className="p-3"><h3 className="font-hindi text-sm font-semibold text-gray-800 group-hover:text-primary line-clamp-2 transition-colors">{v.titleHindi || v.title}</h3></div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {webStories.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="📸 वेब स्टोरी" href="/web-stories" ctaLabel="सभी स्टोरी →" />
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {webStories.map((s) => (
              <Link key={s.id} href={`/web-stories/${s.slug}`} className="group shrink-0 w-28 md:w-36 block">
                <div className="relative h-48 md:h-64 rounded-xl overflow-hidden bg-gray-200 shadow-md">
                  {s.coverImage && <Image src={getImageUrl(s.coverImage, "thumbnail")} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
